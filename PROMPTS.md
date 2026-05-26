# Prompts

The audit engine never asks an AI model to calculate pricing, savings, thresholds, or recommendations. Anthropic receives only a post-calculation result object and writes a short personalized explanation.

## System Prompt

```text
You are the summary writer for SpendPilot AI, a B2B tool that helps startup teams find wasted AI software spend and routes high-savings opportunities to Credex.

You must write exactly one concise summary paragraph for a founder, engineering manager, or finance lead.

Rules:
1. Do not calculate, recalculate, infer, estimate, round, or modify any financial number.
2. Use only the numbers and recommendations provided in the user payload.
3. Do not mention plans, tools, or savings that are not present in the payload.
4. Keep the output between 85 and 110 words.
5. Use plain business language. No hype, no emojis, no markdown table, no bullet list.
6. If totalMonthlySavings is greater than 500, frame the result as worth a Credex consultation.
7. If totalMonthlySavings is less than 100, be honest that the team appears to be spending well and suggest monitoring instead of a sales call.
8. If the findings include API direct spend, mention budget caps, caching, or routing cheaper workloads before buying more seats.
9. End with one clear next action matching ctaState.
10. Never promise guaranteed savings. Use "likely", "appears", or "should review" when appropriate.
```

## User Payload Shape

```json
{
  "company": "RivetOps",
  "totalMonthlySavings": 685,
  "annualizedSavings": 8220,
  "ctaState": "credex_consultation",
  "topFindings": [
    {
      "tool": "Claude",
      "recommendation": "Move 2 users from Team to Pro",
      "savings": 85
    },
    {
      "tool": "OpenAI API",
      "recommendation": "Add a hard OpenAI API monthly budget cap before expanding seats",
      "savings": 535
    }
  ],
  "alternatives": [
    {
      "tool": "GitHub Copilot",
      "plan": "Individual",
      "estimatedMonthlySpend": 10
    }
  ]
}
```

## Expected Output Example

```text
RivetOps appears to have a meaningful AI spend optimization opportunity: the audit found $685 in likely monthly savings, or $8,220 annualized, without changing the team's core workflow. The largest issues are plan mismatch and uncapped API usage, not whether the team should stop using AI tools. Start by moving the small Claude Team footprint back to Pro seats, then put a hard monthly cap on OpenAI API spend and route low-risk work to cheaper models. This is large enough to justify a Credex consultation before the next renewal.
```

## Failure Fallback

If `ANTHROPIC_API_KEY` is missing, the Anthropic request fails, or the returned text is empty, the app uses a deterministic fallback from `lib/ai/summary.ts`. The fallback follows the same rule: it describes already-computed savings but never changes the audit result.

## Why The Prompt Is Structured This Way

The prompt starts by defining the model as a summary writer, not an auditor, because the risky failure mode is the model inventing savings or second-guessing the deterministic engine. The rules explicitly prohibit recalculation and require the model to use only provided numbers. The length constraint keeps the summary close to the assignment's 100-word requirement and prevents a verbose sales pitch from overwhelming the result page.

The CTA rules are included because the product must behave differently for high-savings and low-savings audits. A user with less than $100/month in savings should not get a fake urgency message. That honesty is a product requirement and a trust signal.

## What I Tried That Did Not Work

The first prompt style was too broad: "write an executive summary for this audit." That produced plausible but dangerous language like "guaranteed savings" and occasionally added vendor advice that was not in the audit object. The current prompt narrows the model to a controlled summarization task and keeps all math outside the LLM.
