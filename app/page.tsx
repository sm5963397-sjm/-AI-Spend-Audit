import { AuditForm } from "@/components/audit/audit-form";
import { Navbar } from "@/components/site/navbar";
import { ArrowRight, BarChart3, CheckCircle2, ShieldCheck, Sparkles, TrendingDown } from "lucide-react";
import type { ReactNode } from "react";

export default function Home() {
  return (
    <div id="top" className="premium-shell min-h-screen overflow-hidden text-slate-100">
      <Navbar />
      <main>
        <section className="relative">
          <div className="premium-grid pointer-events-none absolute inset-0" />
          <div className="aurora-field pointer-events-none absolute inset-x-0 top-0 h-[42rem] opacity-80" />
          <div className="mx-auto grid w-full max-w-7xl min-w-0 gap-10 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
            <div className="relative z-10 flex min-w-0 flex-col justify-center">
              <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300 backdrop-blur-xl">
                <Sparkles className="h-4 w-4 text-blue-300" />
                Stop Overpaying for AI Tools.
              </div>
              <h1 className="max-w-4xl break-words text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-7xl">
                Your AI Stack Is Probably <span className="text-gradient">Overpriced.</span>
              </h1>
              <p className="mt-6 max-w-2xl break-words text-lg leading-8 text-slate-300 md:text-xl">
                Analyze ChatGPT, Claude, Cursor, Copilot, Gemini and more in seconds.
              </p>
              <p className="mt-3 max-w-2xl break-words text-base leading-7 text-slate-400">
                Instantly audit your AI stack and uncover hidden savings with deterministic pricing math and a clean shareable report.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-blue-500 px-6 text-base font-semibold text-white shadow-[0_0_30px_rgba(59,130,246,0.28)] transition hover:bg-blue-400 hover:shadow-[0_0_44px_rgba(59,130,246,0.4)]"
                  href="#audit"
                >
                  Start Free Audit
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  className="inline-flex h-12 items-center justify-center rounded-md border border-white/10 bg-white/5 px-6 text-base font-semibold text-slate-100 transition hover:border-blue-400/50 hover:bg-white/10"
                  href="#audit-results"
                >
                  View Demo Report
                </a>
              </div>
              <div className="mt-10">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Trusted by AI-first teams
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-400 sm:grid-cols-4">
                  {["DevTools", "Fintech", "B2B SaaS", "AI Ops"].map((label) => (
                    <div key={label} className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-center">
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="relative z-10 flex min-w-0 items-center overflow-hidden">
              <div className="glass-panel w-full min-w-0 max-w-full rounded-2xl p-4 sm:p-5">
                <div className="flex min-w-0 flex-col items-start gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm text-slate-400">Live audit preview</p>
                    <p className="mt-1 break-words text-2xl font-bold text-white">$18,240 saved/year</p>
                  </div>
                  <div className="shrink-0 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200 sm:text-sm">
                    +31% efficiency
                  </div>
                </div>
                <div className="mt-5 grid gap-3">
                  {[
                    ["Claude Team", "Downgrade 2 seats", "$85/mo"],
                    ["OpenAI API", "Add budget cap", "$800/mo"],
                    ["Cursor Business", "Move small team to Pro", "$40/mo"]
                  ].map(([tool, action, savings]) => (
                    <div key={tool} className="min-w-0 rounded-xl border border-white/10 bg-white/[0.04] p-4">
                      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                        <div className="min-w-0">
                          <p className="font-semibold text-white">{tool}</p>
                          <p className="mt-1 text-sm text-slate-400">{action}</p>
                        </div>
                        <p className="shrink-0 text-base font-bold text-emerald-300 sm:text-lg">{savings}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
                  <HeroStat icon={<TrendingDown className="h-4 w-4" />} label="Retail traps" value="12" />
                  <HeroStat icon={<BarChart3 className="h-4 w-4" />} label="Tools covered" value="8+" />
                  <HeroStat icon={<ShieldCheck className="h-4 w-4" />} label="AI math" value="0" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="audit" className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <AuditForm />
        </section>

        <section id="features" className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
          {[
            ["Plan-fit intelligence", "Find team-plan traps, invoice drift, and wrong-size enterprise spend before renewal."],
            ["Finance-grade logic", "Savings are calculated by deterministic rules, not an AI model guessing at invoices."],
            ["Shareable reports", "Create public audit snapshots with social previews and private lead details stripped."]
          ].map(([title, copy]) => (
            <div key={title} className="glass-panel rounded-2xl p-6">
              <CheckCircle2 className="h-5 w-5 text-emerald-300" />
              <h2 className="mt-5 text-xl font-bold tracking-tight text-white">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">{copy}</p>
            </div>
          ))}
        </section>

        <section id="how-it-works" className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-4">
            {["Enter stack", "Audit math", "Review savings", "Share report"].map((step, index) => (
              <div key={step} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-sm font-bold text-blue-300">0{index + 1}</p>
                <h2 className="mt-3 text-lg font-bold text-white">{step}</h2>
              </div>
            ))}
          </div>
        </section>

        <section id="pricing-logic" className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="glass-panel rounded-2xl p-6 md:p-8">
            <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-300">Pricing logic</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">Hardcoded math. Clear reasons.</h2>
              </div>
              <p className="text-sm leading-7 text-slate-400">
                SpendPilot AI checks same-vendor downgrades, cheaper alternatives by use case, API caps, and Credex consultation thresholds. The AI summary is generated after the calculations are complete.
              </p>
            </div>
          </div>
        </section>

        <section id="faq" className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Does AI calculate the savings?", "No. The audit engine calculates savings with fixed rules. AI only writes the short explanation."],
              ["When does Credex appear?", "When total monthly savings exceed $500, the CTA changes to a consultation-focused block."],
              ["What happens if spend is already optimized?", "The app shows a positive low-savings state and offers future optimization notifications."],
              ["Is the report public?", "The share URL excludes email, company, and role details. It shows tools, savings, and findings only."]
            ].map(([question, answer]) => (
              <div key={question} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <h2 className="font-bold text-white">{question}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">{answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function HeroStat({
  icon,
  label,
  value
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-white/10 bg-white/[0.04] p-3">
      <div className="flex min-w-0 flex-col gap-1 text-blue-200 sm:flex-row sm:items-center sm:gap-2">
        {icon}
        <span className="break-words text-xs leading-4 text-slate-400">{label}</span>
      </div>
      <p className="mt-2 text-xl font-bold text-white">{value}</p>
    </div>
  );
}
