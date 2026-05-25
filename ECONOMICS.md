# Economics

This product is a B2B lead-generation wedge for Credex, not a standalone SaaS subscription at launch. The unit economics should therefore be judged by qualified audit completions, booked consultations, and downstream credit conversions.

Spreadsheet-style assumptions:

| Variable | Value | Rationale |
| --- | ---: | --- |
| Target ARR | $1,000,000 | Assignment growth target. |
| Time horizon | 18 months | Requires compounding distribution, not one launch spike. |
| Credex annual revenue per converted company | $12,000 | Assumes a credit, financing, or procurement conversion worth $1,000/month in net ARR. |
| Required converted companies | 84 | `ceil(1,000,000 / 12,000)`. |
| Required conversions per month | 4.7 | `84 / 18`. |
| Audit to qualified lead rate | 35% | Qualified means business email plus savings above $500 or clear renewal need. |
| Qualified lead to booked consult | 40% | High-intent because the audit creates a concrete savings narrative. |
| Booked consult to credit conversion | 15% | Conservative for a new funnel with financial-service friction. |
| Audit to conversion rate | 2.1% | `0.35 * 0.40 * 0.15`. |
| Required audits per month | 224 | `4.7 / 0.021`. |

Exact ARR formula:

```text
ARR = monthly_audits * qualified_rate * consult_rate * credit_conversion_rate * annual_revenue_per_conversion
```

To reach $1M ARR:

```text
1,000,000 = monthly_audits * 18 * 0.35 * 0.40 * 0.15 * 12,000
monthly_audits = 1,000,000 / (18 * 0.35 * 0.40 * 0.15 * 12,000)
monthly_audits = 221
```

Lead value:

| Funnel stage | Formula | Expected value |
| --- | --- | ---: |
| Raw audit | `0.35 * 0.40 * 0.15 * 12,000` | $252 ARR EV |
| Qualified lead | `0.40 * 0.15 * 12,000` | $720 ARR EV |
| Booked consult | `0.15 * 12,000` | $1,800 ARR EV |

CAC should include founder time even with a $0 cash budget. Assume founder time is valued at $75/hour.

| Channel | Weekly time | Expected weekly audits | CAC per audit | Expected CAC per qualified lead |
| --- | ---: | ---: | ---: | ---: |
| Reddit/Discord teardown posts | 6 hours | 60 | $7.50 | $21.43 |
| Founder outbound teardown notes | 5 hours | 25 | $15.00 | $42.86 |
| Weekly AI Spend Waste Index | 8 hours | 100 | $6.00 | $17.14 |
| Partner posts from fractional CFOs | 4 hours | 50 | $6.00 | $17.14 |

The funnel can support very high founder-time CAC because qualified lead EV is about $720 ARR and booked consult EV is about $1,800 ARR. The danger is not paid acquisition cost; it is low trust. If users suspect the audit exaggerates waste to force sales calls, conversion quality collapses. That is why the `<$100` "you are spending well" gate is economically important: it sacrifices weak leads to preserve credibility with the high-value ones.

The break-even threshold for a channel is:

```text
CAC_per_qualified_lead < qualified_lead_to_consult_rate * consult_to_conversion_rate * annual_revenue_per_conversion
CAC_per_qualified_lead < 0.40 * 0.15 * 12,000
CAC_per_qualified_lead < $720
```
