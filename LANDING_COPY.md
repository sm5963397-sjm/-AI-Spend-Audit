# Landing Copy

## Hero

Headline: Stop renewing wasteful AI seats.

Subheadline: Audit AI plans, API spend, and seat overlap before another renewal hits your runway.

Primary CTA: Run the 2-minute audit

Secondary CTA: View pricing sources

Trust note: Deterministic savings math. AI summary only after the numbers are calculated.

## Social Proof Layout

Status: mocked copy for launch-page layout, to be replaced with real quotes after user interviews or early audits.

| Slot | Copy | Visual treatment |
| --- | --- | --- |
| Quote 1 | "We found a Claude Team minimum-seat mismatch before finance saw the renewal." | Engineering Manager, Series A DevTools company |
| Quote 2 | "The useful part was not another dashboard. It told us which AI spend was actually fine." | Founder, 18-person vertical SaaS startup |
| Quote 3 | "The API cap recommendation paid for the audit in one billing cycle." | Platform Lead, seed-stage data company |
| Metric strip | $500+ monthly savings triggers Credex review | Numeric badge |
| Metric strip | Under $100 gets a spend-well notification gate | Numeric badge |
| Metric strip | 0 AI-generated savings calculations | Numeric badge |

## Page Sections

1. Input your stack: tool, plan, monthly spend, seats, team size, and primary use case.
2. See deterministic findings: downgrade traps, invoice drift, API budget caps, and cheaper alternatives.
3. Save a shareable report: Firestore-backed URL, Resend confirmation, and Anthropic summary.
4. Route the lead honestly: Credex consultation only when savings justify it.

## Technical FAQ

### Does the AI model calculate savings?

No. Savings are calculated in `lib/audit/engine.ts` using hardcoded plan prices, billable seat rules, invoice drift checks, and threshold logic. Anthropic receives the finished result and writes a short summary only.

### How are API direct costs handled?

API direct rows use the invoice amount as the source of truth. The audit flags high API spend for small teams, recommends hard monthly caps, and suggests caching or model routing before buying more seats.

### Why does ChatGPT Team appear as Business?

OpenAI renamed ChatGPT Team to ChatGPT Business on August 29, 2025. The app accepts the Team label for assignment compatibility, then maps it to Business pricing internally.

### What happens if Firebase, Resend, or Anthropic keys are missing?

The local audit still works. Firestore saves and Resend sends are skipped without exposing secrets, and the summary falls back to deterministic copy. Production should configure all keys through environment variables.

### How do you prevent fake precision in vendor pricing?

The pricing file stores source URLs, custom-plan notes, and API unit prices separately from seat prices. Enterprise plans remain custom, and the app uses user-entered invoice spend as current spend rather than pretending all contracts match list price.
