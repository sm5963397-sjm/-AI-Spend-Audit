import type { ToolName, UseCase } from "./types";
import { useCases } from "./types";

export type PlanPrice = {
  plan: string;
  monthlyUsd: number | "custom" | "usage";
  perSeat: boolean;
  minimumSeats?: number;
  sourceUrl: string;
};

export const TOOL_NAMES: ToolName[] = [
  "Cursor",
  "GitHub Copilot",
  "Claude",
  "ChatGPT",
  "Anthropic API",
  "OpenAI API",
  "Gemini",
  "v0"
];

export const USE_CASES: UseCase[] = [...useCases];

export const RETAIL_PRICING: Record<ToolName, PlanPrice[]> = {
  Cursor: [
    { plan: "Hobby", monthlyUsd: 0, perSeat: false, sourceUrl: "https://cursor.com/pricing" },
    { plan: "Pro", monthlyUsd: 20, perSeat: true, sourceUrl: "https://cursor.com/pricing" },
    { plan: "Business", monthlyUsd: 40, perSeat: true, sourceUrl: "https://cursor.com/pricing" },
    { plan: "Enterprise", monthlyUsd: "custom", perSeat: true, sourceUrl: "https://cursor.com/pricing" }
  ],
  "GitHub Copilot": [
    { plan: "Individual", monthlyUsd: 10, perSeat: true, sourceUrl: "https://docs.github.com/en/copilot/get-started/plans" },
    { plan: "Business", monthlyUsd: 19, perSeat: true, sourceUrl: "https://docs.github.com/en/copilot/get-started/plans" },
    { plan: "Enterprise", monthlyUsd: 39, perSeat: true, sourceUrl: "https://docs.github.com/en/copilot/get-started/plans" }
  ],
  Claude: [
    { plan: "Free", monthlyUsd: 0, perSeat: false, sourceUrl: "https://support.claude.com/en/articles/11049762-choose-a-claude-plan" },
    { plan: "Pro", monthlyUsd: 20, perSeat: true, sourceUrl: "https://support.claude.com/en/articles/11049762-choose-a-claude-plan" },
    { plan: "Max 5x", monthlyUsd: 100, perSeat: true, sourceUrl: "https://support.claude.com/en/articles/11049762-choose-a-claude-plan" },
    { plan: "Max 20x", monthlyUsd: 200, perSeat: true, sourceUrl: "https://support.claude.com/en/articles/11049762-choose-a-claude-plan" },
    { plan: "Team", monthlyUsd: 25, perSeat: true, minimumSeats: 5, sourceUrl: "https://support.claude.com/en/articles/9266767-what-is-the-team-plan" },
    { plan: "Enterprise", monthlyUsd: "custom", perSeat: true, sourceUrl: "https://www.claude.com/pricing/enterprise" },
    { plan: "API direct", monthlyUsd: "usage", perSeat: false, sourceUrl: "https://docs.anthropic.com/en/docs/about-claude/pricing" }
  ],
  ChatGPT: [
    { plan: "Plus", monthlyUsd: 20, perSeat: true, sourceUrl: "https://chatgpt.com/pricing" },
    { plan: "Business", monthlyUsd: 25, perSeat: true, minimumSeats: 2, sourceUrl: "https://help.openai.com/en/articles/8792828" },
    { plan: "Team", monthlyUsd: 25, perSeat: true, minimumSeats: 2, sourceUrl: "https://help.openai.com/en/articles/8792828" },
    { plan: "Enterprise", monthlyUsd: "custom", perSeat: true, sourceUrl: "https://chatgpt.com/enterprise" },
    { plan: "API direct", monthlyUsd: "usage", perSeat: false, sourceUrl: "https://openai.com/api/pricing/" }
  ],
  "Anthropic API": [
    { plan: "API direct", monthlyUsd: "usage", perSeat: false, sourceUrl: "https://docs.anthropic.com/en/docs/about-claude/pricing" }
  ],
  "OpenAI API": [
    { plan: "API direct", monthlyUsd: "usage", perSeat: false, sourceUrl: "https://openai.com/api/pricing/" }
  ],
  Gemini: [
    { plan: "Pro", monthlyUsd: 19.99, perSeat: true, sourceUrl: "https://one.google.com/about/google-ai-plans/" },
    { plan: "Ultra", monthlyUsd: 199.99, perSeat: true, sourceUrl: "https://one.google.com/about/google-ai-plans/" },
    { plan: "API", monthlyUsd: "usage", perSeat: false, sourceUrl: "https://ai.google.dev/gemini-api/docs/pricing" }
  ],
  v0: [
    { plan: "Free", monthlyUsd: 0, perSeat: false, sourceUrl: "https://v0.app/docs/pricing" },
    { plan: "Premium", monthlyUsd: 20, perSeat: true, sourceUrl: "https://v0.app/docs/pricing" },
    { plan: "Team", monthlyUsd: 30, perSeat: true, sourceUrl: "https://v0.app/docs/pricing" },
    { plan: "Business", monthlyUsd: 100, perSeat: true, sourceUrl: "https://v0.app/docs/pricing" },
    { plan: "Enterprise", monthlyUsd: "custom", perSeat: true, sourceUrl: "https://v0.app/docs/pricing" }
  ]
};

export const TOOL_PLANS = Object.fromEntries(
  Object.entries(RETAIL_PRICING).map(([tool, plans]) => [
    tool,
    plans.map((plan) => plan.plan)
  ])
) as Record<ToolName, string[]>;

export const CHEAPER_ALTERNATIVES: Record<UseCase, Array<{ tool: string; plan: string; monthlyUsd: number; reason: string }>> = {
  coding: [
    { tool: "GitHub Copilot", plan: "Individual", monthlyUsd: 10, reason: "Lowest fixed-cost coding assistant for IDE autocomplete and chat." },
    { tool: "Cursor", plan: "Pro", monthlyUsd: 20, reason: "Best fit when the team wants agentic coding in the editor." },
    { tool: "v0", plan: "Premium", monthlyUsd: 20, reason: "Useful for React UI prototyping without buying team seats early." }
  ],
  writing: [
    { tool: "ChatGPT", plan: "Plus", monthlyUsd: 20, reason: "Strong general writing assistant at a predictable individual price." },
    { tool: "Claude", plan: "Pro", monthlyUsd: 20, reason: "Long-form drafting and editing without team minimums." }
  ],
  data: [
    { tool: "OpenAI API", plan: "GPT-5.4 mini", monthlyUsd: 75, reason: "Replace high fixed seats with metered analysis workloads." },
    { tool: "Gemini", plan: "API", monthlyUsd: 60, reason: "Competitive long-context analysis for structured data tasks." }
  ],
  research: [
    { tool: "Claude", plan: "Pro", monthlyUsd: 20, reason: "Good deep-reading value before buying Team seats." },
    { tool: "Gemini", plan: "Pro", monthlyUsd: 19.99, reason: "Research-oriented plan bundled with Google AI features." }
  ],
  mixed: [
    { tool: "ChatGPT", plan: "Plus", monthlyUsd: 20, reason: "Default individual workspace for mixed writing, analysis, and ideation." },
    { tool: "Claude", plan: "Pro", monthlyUsd: 20, reason: "Comparable mixed-use option with strong document handling." }
  ]
};
