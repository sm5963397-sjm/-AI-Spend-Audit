export const useCases = ["coding", "writing", "data", "research", "mixed"] as const;

export type UseCase = (typeof useCases)[number];

export type ToolName =
  | "Cursor"
  | "GitHub Copilot"
  | "Claude"
  | "ChatGPT"
  | "Anthropic API"
  | "OpenAI API"
  | "Gemini"
  | "v0";

export type AuditInput = {
  tool: ToolName;
  plan: string;
  monthlySpend: number;
  seats: number;
  teamSize: number;
  primaryUseCase: UseCase;
};

export type AuditFinding = {
  id: string;
  tool: ToolName;
  currentPlan: string;
  recommendation: string;
  reason: string;
  currentMonthlySpend: number;
  recommendedMonthlySpend: number;
  monthlySavings: number;
  severity: "low" | "medium" | "high";
};

export type Alternative = {
  tool: string;
  plan: string;
  estimatedMonthlySpend: number;
  reason: string;
};

export type AuditResult = {
  totalMonthlySpend: number;
  totalRecommendedSpend: number;
  totalMonthlySavings: number;
  annualizedSavings: number;
  ctaState: "credex_consultation" | "benchmark_report" | "optimization_gate";
  thresholdMessage: string;
  findings: AuditFinding[];
  alternatives: Alternative[];
};
