# Pricing Data

Retail pricing source date: May 25, 2026. All prices are USD before tax, unless noted. Enterprise prices are custom because vendors require sales contact or contracted terms. API prices are usage-based and should be modeled separately from seat subscriptions.

## Source Notes

| Vendor | Official pricing URL | Verification note |
| --- | --- | --- |
| Cursor | https://cursor.com/pricing | Public page lists Hobby, Individual Pro, Teams, and Enterprise. The assignment label "Business" maps to Cursor Teams at $40/user/month. |
| GitHub Copilot | https://docs.github.com/en/copilot/get-started/plans | GitHub Docs table lists Individual/Pro, Business, and Enterprise monthly prices and premium request allowances. |
| Claude | https://support.claude.com/en/articles/11049762-choose-a-claude-plan | Claude Help Center lists Free, Pro, Max 5x, and Max 20x. |
| Claude Team | https://support.claude.com/en/articles/9266767-what-is-the-team-plan | Claude Team page lists Standard and Premium seat pricing, minimum team size, and usage multipliers. |
| Anthropic API | https://docs.anthropic.com/en/docs/about-claude/pricing | Anthropic API docs list model input, output, cache write, and cache hit prices per million tokens. |
| ChatGPT | https://chatgpt.com/pricing | Current ChatGPT pricing page for Free, Plus, Pro, Business, and Enterprise plan packaging. |
| ChatGPT Business | https://help.openai.com/en/articles/8792828 | OpenAI Help confirms Team was renamed Business on August 29, 2025 and lists current standard seat pricing. |
| OpenAI API | https://openai.com/api/pricing/ | OpenAI API pricing page lists model input, cached input, and output prices. |
| Google AI Plans | https://one.google.com/about/google-ai-plans/ | Google One AI plans page lists Google AI Pro and Ultra packaging, storage, and Gemini access. |
| Gemini API | https://ai.google.dev/gemini-api/docs/pricing | Google AI for Developers lists Gemini API free, paid, batch, flex, and priority pricing. |
| v0 | https://v0.app/docs/pricing | v0 Docs list Free, Premium, Team, Business, and Enterprise pricing. |

## Cursor

Source: https://cursor.com/pricing — verified 2026-05-25.

| Tool | Plan in app | Current vendor label | Retail price | Billing basis | Audit interpretation |
| --- | --- | --- | ---: | --- | --- |
| Cursor | Hobby | Hobby | $0 | Individual | Useful baseline. Do not count as savings unless the user enters paid spend. |
| Cursor | Pro | Individual Pro | $20/month | Per user | Default recommendation for 1-2 coding users before collaboration controls matter. |
| Cursor | Business | Teams | $40/user/month | Per user | Treat as team overhead. For 1-2 users, compare against Pro seats. |
| Cursor | Enterprise | Enterprise | Custom | Contract | Flag for review when team size is below 50 or no SSO/compliance need is stated. |

## GitHub Copilot

Source: https://docs.github.com/en/copilot/get-started/plans — verified 2026-05-25.

| Tool | Plan | Retail price | Billing basis | Audit interpretation |
| --- | --- | ---: | --- | --- |
| GitHub Copilot | Individual | $10/month | Per user | Lowest fixed-cost coding assistant benchmark. |
| GitHub Copilot | Business | $19/user/month | Per granted seat | Good fit when policy controls, organization management, and IP indemnity matter. |
| GitHub Copilot | Enterprise | $39/user/month | Per granted seat | Compare against Business unless GitHub.com chat, enterprise customization, or governance is required. |

## Claude

Sources: https://support.claude.com/en/articles/11049762-choose-a-claude-plan and https://support.claude.com/en/articles/9266767-what-is-the-team-plan — verified 2026-05-25.

| Tool | Plan | Retail price | Billing basis | Audit interpretation |
| --- | --- | ---: | --- | --- |
| Claude | Free | $0 | Individual | Useful for occasional use; not suitable for business-critical workflows. |
| Claude | Pro | $20/month or $200/year | Individual | Default recommendation for single-user research, writing, and coding exploration. |
| Claude | Max 5x | $100/month | Individual | Power-user plan. Compare against actual usage and API overflow. |
| Claude | Max 20x | $200/month | Individual | Heavy-use plan. Flag if bought for casual users. |
| Claude | Team Standard | $25/member/month or $20/member/month annual | Minimum 5 members | Current Team standard seat. For 1-2 active users, compare against Pro. |
| Claude | Team Premium | $125/member/month or $100/member/month annual | Minimum 5 members | Use only for power users with sustained Claude Code or high-volume work. |
| Claude | Enterprise | Custom | Contract | Requires sales-led security, compliance, or large deployment rationale. |
| Claude | API direct | Usage | Per token | API is separate from Claude subscriptions and should be capped with budget alerts. |

## Anthropic API Direct

Source: https://docs.anthropic.com/en/docs/about-claude/pricing — verified 2026-05-25.

| Model family | Input | 5m cache write | 1h cache write | Cache hit | Output | Billing basis |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Claude Opus 4.7 | $5/MTok | $6.25/MTok | $10/MTok | $0.50/MTok | $25/MTok | Usage |
| Claude Sonnet 4.6 | $3/MTok | $3.75/MTok | $6/MTok | $0.30/MTok | $15/MTok | Usage |
| Claude Haiku 4.5 | $1/MTok | $1.25/MTok | $2/MTok | $0.10/MTok | $5/MTok | Usage |

Audit rule: do not use AI to calculate token bills. Use invoice exports, token totals, cache hit rate, and model mix. Anthropic API direct spend above $500/month for a team with five or fewer users triggers a budget-cap finding before any seat expansion recommendation.

## ChatGPT and OpenAI

Sources: https://chatgpt.com/pricing, https://help.openai.com/en/articles/8792828, and https://openai.com/api/pricing/ — verified 2026-05-25.

| Tool | Plan | Retail price | Billing basis | Audit interpretation |
| --- | --- | ---: | --- | --- |
| ChatGPT | Plus | $20/month | Individual | Default mixed-use recommendation for 1-2 users. |
| ChatGPT | Team | Renamed Business | See Business | Per user | Preserve label for assignment input compatibility. |
| ChatGPT | Business | $25/user/month monthly or $20/user/month annual | Minimum 2 standard seats | Use when shared workspace, admin controls, no-training policy, and Codex workspace access matter. |
| ChatGPT | Enterprise | Custom | Contract | Requires sales-led controls, invoicing, compliance, or large-scale governance. |
| ChatGPT | API direct | Usage | Per token | API access is billed separately from ChatGPT plans. |

| OpenAI API model | Input | Cached input | Output | Billing basis |
| --- | ---: | ---: | ---: | --- |
| GPT-5.5 | $5/MTok | $0.50/MTok | $30/MTok | Usage |
| GPT-5.4 | $2.50/MTok | $0.25/MTok | $15/MTok | Usage |
| GPT-5.4 mini | $0.75/MTok | $0.075/MTok | $4.50/MTok | Usage |

## Gemini

Sources: https://one.google.com/about/google-ai-plans/ and https://ai.google.dev/gemini-api/docs/pricing — verified 2026-05-25.

| Tool | Plan | Retail price | Billing basis | Audit interpretation |
| --- | --- | ---: | --- | --- |
| Gemini | Google AI Pro | $19.99/month | Individual | Comparable to ChatGPT Plus and Claude Pro for mixed research and writing. |
| Gemini | Google AI Ultra 5x | $99.99/month | Individual | Treat as a power-user plan; verify that high limits are used. |
| Gemini | Google AI Ultra 20x | $199.99/month | Individual | Flag if assigned broadly instead of only to heavy users. |
| Gemini | API | Usage | Per token | Analyze separately from Google AI subscription seats. |

| Gemini API model | Standard input | Standard output | Batch input | Batch output | Notes |
| --- | ---: | ---: | ---: | ---: | --- |
| Gemini 3.5 Flash | $1.50/MTok | $9/MTok | $0.75/MTok | $4.50/MTok | Fast, search-grounded model option. |
| Gemini 3.1 Pro Preview | $2/MTok <=200k, $4/MTok >200k | $12/MTok <=200k, $18/MTok >200k | $1/MTok <=200k, $2/MTok >200k | $6/MTok <=200k, $9/MTok >200k | Best for complex reasoning and coding. |
| Gemini 3.1 Flash-Lite | $0.25/MTok text/image/video | $1.50/MTok | $0.125/MTok text/image/video | $0.75/MTok | Cost-efficient high-volume work. |

## v0

Source: https://v0.app/docs/pricing — verified 2026-05-25.

| Tool | Plan | Retail price | Billing basis | Audit interpretation |
| --- | --- | ---: | --- | --- |
| v0 | Free | $0/month | Individual | Good trial option. Includes limited monthly credits. |
| v0 | Premium | $20/month | Individual | Best benchmark for a single UI prototyping user. |
| v0 | Team | $30/user/month | Per user | Use when shared projects and team credit pools matter. |
| v0 | Business | $100/user/month | Per user | High-compliance or privacy-conscious teams only. |
| v0 | Enterprise | Custom | Contract | Requires larger company security and procurement needs. |

## Hardcoded Math Inputs

The audit engine should store these fields for every row:

| Field | Type | Example | Notes |
| --- | --- | --- | --- |
| Tool | Enum | Cursor | Must be one of the supported tools above. |
| Plan | Enum/string | Business | Kept as user-facing plan label, normalized internally. |
| Monthly Spend | Number | 125 | User-entered invoice amount. This is the source of truth for current spend. |
| Seats | Number | 2 | Active paid seats, not company headcount. |
| Team Size | Number | 8 | Used to flag premature team or enterprise plans. |
| Primary Use Case | Enum | coding | One of coding, writing, data, research, mixed. |

Core formulas:

| Formula | Definition |
| --- | --- |
| `currentMonthlySpend` | User-entered monthly spend for the row. |
| `expectedRetailSpend` | Retail price multiplied by billable seats, including minimum-seat rules. |
| `recommendedMonthlySpend` | Lowest appropriate plan cost after deterministic rules. |
| `monthlySavings` | `max(0, currentMonthlySpend - recommendedMonthlySpend)`. |
| `annualizedSavings` | `monthlySavings * 12`. |
| `ctaState` | `credex_consultation` if total savings > $500; `optimization_gate` if total savings < $100; otherwise `benchmark_report`. |
