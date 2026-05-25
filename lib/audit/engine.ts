import {
  CHEAPER_ALTERNATIVES,
  RETAIL_PRICING,
  type PlanPrice
} from "./pricing-data";
import type { Alternative, AuditFinding, AuditInput, AuditResult, ToolName } from "./types";

const CONSULTATION_THRESHOLD = 500;
const SPEND_WELL_THRESHOLD = 100;

const individualDowngrades: Partial<Record<ToolName, { plan: string; monthlyUsd: number }>> = {
  Cursor: { plan: "Pro", monthlyUsd: 20 },
  "GitHub Copilot": { plan: "Individual", monthlyUsd: 10 },
  Claude: { plan: "Pro", monthlyUsd: 20 },
  ChatGPT: { plan: "Plus", monthlyUsd: 20 },
  Gemini: { plan: "Pro", monthlyUsd: 19.99 },
  v0: { plan: "Premium", monthlyUsd: 20 }
};

const teamLikePlans = new Set(["business", "team", "enterprise"]);
const heavyApiTools = new Set<ToolName>(["Anthropic API", "OpenAI API"]);

export function runAudit(inputs: AuditInput[]): AuditResult {
  const findings = inputs.flatMap((input, index) => evaluateInput(input, index));
  const alternatives = selectAlternatives(inputs);
  const totalMonthlySpend = roundMoney(
    inputs.reduce((total, input) => total + positiveNumber(input.monthlySpend), 0)
  );
  const totalMonthlySavings = roundMoney(
    findings.reduce((total, finding) => total + finding.monthlySavings, 0)
  );
  const totalRecommendedSpend = roundMoney(totalMonthlySpend - totalMonthlySavings);
  const ctaState = chooseCta(totalMonthlySavings);

  return {
    totalMonthlySpend,
    totalRecommendedSpend,
    totalMonthlySavings,
    annualizedSavings: roundMoney(totalMonthlySavings * 12),
    ctaState,
    thresholdMessage: buildThresholdMessage(ctaState, totalMonthlySavings),
    findings,
    alternatives
  };
}

function evaluateInput(input: AuditInput, index: number): AuditFinding[] {
  const currentSpend = positiveNumber(input.monthlySpend);
  const seats = Math.max(positiveNumber(input.seats), 1);
  const plan = findPlan(input.tool, input.plan);
  const retailSpend = estimateRetailSpend(plan, seats);
  const findings: AuditFinding[] = [];

  if (retailSpend > 0 && currentSpend > retailSpend * 1.15) {
    findings.push({
      id: `${index}-invoice-drift`,
      tool: input.tool,
      currentPlan: input.plan,
      recommendation: `Reconcile ${input.tool} invoice to retail ${input.plan} pricing`,
      reason: `The entered spend is more than 15% above the public retail expectation for ${seats} seat(s). This usually means unused add-ons, old contracts, tax-inclusive exports, or duplicate workspaces.`,
      currentMonthlySpend: currentSpend,
      recommendedMonthlySpend: retailSpend,
      monthlySavings: roundMoney(currentSpend - retailSpend),
      severity: severityFor(currentSpend - retailSpend)
    });
  }

  if (isTeamTrap(input)) {
    const downgrade = individualDowngrades[input.tool];

    if (downgrade) {
      const recommendedSpend = roundMoney(downgrade.monthlyUsd * seats);
      const monthlySavings = roundMoney(currentSpend - recommendedSpend);

      if (monthlySavings > 0) {
        findings.push({
          id: `${index}-team-trap`,
          tool: input.tool,
          currentPlan: input.plan,
          recommendation: `Move ${seats} user(s) from ${input.plan} to ${downgrade.plan}`,
          reason: `${input.tool} ${input.plan} is carrying collaboration, admin, or minimum-seat overhead before the team has enough users to benefit from it.`,
          currentMonthlySpend: currentSpend,
          recommendedMonthlySpend: recommendedSpend,
          monthlySavings,
          severity: severityFor(monthlySavings)
        });
      }
    }
  }

  if (heavyApiTools.has(input.tool) && currentSpend > 500 && seats <= 5) {
    const targetSpend = input.primaryUseCase === "coding" ? 200 : 150;
    findings.push({
      id: `${index}-api-budget-cap`,
      tool: input.tool,
      currentPlan: input.plan,
      recommendation: `Add a hard ${input.tool} monthly budget cap before expanding seats`,
      reason: `Direct API spend above $500 for a small team is usually workload or caching leakage, not a collaboration need. Cap usage, turn on prompt caching, and route low-risk work to cheaper models first.`,
      currentMonthlySpend: currentSpend,
      recommendedMonthlySpend: targetSpend,
      monthlySavings: roundMoney(currentSpend - targetSpend),
      severity: "high"
    });
  }

  if (findings.length === 0) {
    findings.push({
      id: `${index}-healthy`,
      tool: input.tool,
      currentPlan: input.plan,
      recommendation: `${input.tool} spend is within expected retail range`,
      reason: `No obvious downgrade is triggered by the current hardcoded pricing rules for ${input.primaryUseCase} work.`,
      currentMonthlySpend: currentSpend,
      recommendedMonthlySpend: currentSpend,
      monthlySavings: 0,
      severity: "low"
    });
  }

  return dedupeSavings(findings);
}

function isTeamTrap(input: AuditInput) {
  const normalizedPlan = input.plan.toLowerCase();

  if (!teamLikePlans.has(normalizedPlan)) {
    return false;
  }

  if (normalizedPlan === "enterprise") {
    return input.teamSize < 50;
  }

  return input.seats <= 2 || input.teamSize <= 3;
}

function findPlan(tool: ToolName, planName: string): PlanPrice | undefined {
  return RETAIL_PRICING[tool].find(
    (plan) => plan.plan.toLowerCase() === planName.toLowerCase()
  );
}

function estimateRetailSpend(plan: PlanPrice | undefined, seats: number) {
  if (!plan || typeof plan.monthlyUsd !== "number") {
    return 0;
  }

  const billableSeats = plan.minimumSeats ? Math.max(seats, plan.minimumSeats) : seats;
  return roundMoney(plan.perSeat ? plan.monthlyUsd * billableSeats : plan.monthlyUsd);
}

function selectAlternatives(inputs: AuditInput[]): Alternative[] {
  const seen = new Set<string>();
  const alternatives: Alternative[] = [];

  for (const input of inputs) {
    for (const alternative of CHEAPER_ALTERNATIVES[input.primaryUseCase]) {
      const key = `${input.primaryUseCase}-${alternative.tool}-${alternative.plan}`;

      if (!seen.has(key) && alternative.tool !== input.tool) {
        seen.add(key);
        alternatives.push({
          tool: alternative.tool,
          plan: alternative.plan,
          estimatedMonthlySpend: alternative.monthlyUsd,
          reason: alternative.reason
        });
      }
    }
  }

  return alternatives.slice(0, 5);
}

function chooseCta(totalMonthlySavings: number): AuditResult["ctaState"] {
  if (totalMonthlySavings > CONSULTATION_THRESHOLD) {
    return "credex_consultation";
  }

  if (totalMonthlySavings < SPEND_WELL_THRESHOLD) {
    return "optimization_gate";
  }

  return "benchmark_report";
}

function buildThresholdMessage(ctaState: AuditResult["ctaState"], savings: number) {
  if (ctaState === "credex_consultation") {
    return `This audit found $${savings.toLocaleString()} in monthly savings, enough to justify a Credex consultation focused on credits, contracts, and consolidation.`;
  }

  if (ctaState === "optimization_gate") {
    return "You are spending well. The right next step is a notification gate, not a forced sales call, so the team can re-check when usage or seats change.";
  }

  return `This audit found $${savings.toLocaleString()} in monthly savings. Send the benchmark first, then offer help if the buyer wants procurement support.`;
}

function dedupeSavings(findings: AuditFinding[]) {
  const savingsFindings = findings.filter((finding) => finding.monthlySavings > 0);
  return savingsFindings.length > 0 ? savingsFindings : findings;
}

function severityFor(savings: number): AuditFinding["severity"] {
  if (savings >= 500) {
    return "high";
  }

  if (savings >= 100) {
    return "medium";
  }

  return "low";
}

function positiveNumber(value: number) {
  return Number.isFinite(value) ? Math.max(value, 0) : 0;
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}
