import Anthropic from "@anthropic-ai/sdk";
import type { AuditResult } from "@/lib/audit/types";

type SummaryInput = {
  company: string;
  audit: AuditResult;
};

export async function generatePersonalizedSummary({ company, audit }: SummaryInput) {
  const fallback = buildFallbackSummary(company, audit);

  if (!process.env.ANTHROPIC_API_KEY) {
    return fallback;
  }

  try {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 180,
      temperature: 0.2,
      system:
        "Write one concise B2B SaaS audit summary. Do not do math. Use only provided numbers. Stay under 110 words. No markdown table.",
      messages: [
        {
          role: "user",
          content: JSON.stringify({
            company,
            totalMonthlySavings: audit.totalMonthlySavings,
            annualizedSavings: audit.annualizedSavings,
            ctaState: audit.ctaState,
            topFindings: audit.findings.slice(0, 3).map((finding) => ({
              tool: finding.tool,
              recommendation: finding.recommendation,
              savings: finding.monthlySavings
            }))
          })
        }
      ]
    });

    const text = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join(" ")
      .trim();

    return text || fallback;
  } catch {
    return fallback;
  }
}

function buildFallbackSummary(company: string, audit: AuditResult) {
  if (audit.totalMonthlySavings < 100) {
    return `${company} is already running a disciplined AI stack. The audit found less than $100 in obvious monthly savings, so the best move is to keep the current setup and re-check when headcount, seats, or API usage changes.`;
  }

  return `${company} can likely save $${audit.totalMonthlySavings.toLocaleString()} per month, or $${audit.annualizedSavings.toLocaleString()} per year, by correcting plan and usage mismatches. The first priority is the highest-savings finding, then contract consolidation and renewal timing.`;
}
