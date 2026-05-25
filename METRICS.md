# Metrics

The North Star Metric is **Qualified Monthly Savings Routed to Credex**, defined as the sum of verified monthly savings from completed audits where the user submits a business email and the result triggers either `credex_consultation` or `benchmark_report`. This is better than raw signups because the product exists to create financially meaningful Credex opportunities, not generic traffic.

Three input metrics drive the North Star:

| Input metric | Definition | Target |
| --- | --- | ---: |
| Audit completion rate | Completed audits divided by visitors who start entering a tool row. | 60%+ |
| Qualified lead rate | Completed audits with business email and at least $500 monthly savings. | 25%+ |
| Consultation intent rate | Qualified leads that click or reply to book a Credex consultation. | 35%+ |

Instrumentation should be event-based and privacy-aware. Track `audit_started`, `tool_row_added`, `audit_completed`, `lead_submitted`, `share_url_created`, `email_sent`, `cta_clicked`, and `consultation_booked`. Each event should include anonymous session ID, tool count, total monthly spend bucket, total monthly savings bucket, CTA state, and primary use case. Do not store raw invoice files, secrets, prompt text, or private code. Firestore should store audit snapshots and lead records; product analytics should store aggregated funnel events.

The key diagnostic dashboard is a funnel by acquisition source: visitor -> audit start -> audit complete -> qualified lead -> consultation. Segment by use case and team size because a solo developer with $40/month spend and a Series A engineering team with $4,000/month spend are different products.

Pivot threshold: if, after 500 completed audits, fewer than 8% produce qualified savings above $500/month or fewer than 20% of qualified leads request the report/consultation, the product should pivot away from a Credex consultation wedge. The likely pivot would be a monitoring product for renewal alerts, invoice drift, and API budget caps because low consultation intent would mean the calculator is useful but the buying moment is not urgent.
