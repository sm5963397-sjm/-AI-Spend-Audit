"use client";

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Brain,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  TrendingDown
} from "lucide-react";
import dynamic from "next/dynamic";
import type { FormEvent, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import type { AuditInput, AuditResult } from "@/lib/audit/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AuditCharts = dynamic(
  () => import("./audit-charts").then((module) => module.AuditCharts),
  {
    ssr: false,
    loading: () => (
      <div className="grid gap-3 md:grid-cols-2">
        <div className="h-64 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />
        <div className="h-64 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />
      </div>
    )
  }
);

type AuditResultsProps = {
  audit: AuditResult;
  inputs: AuditInput[];
};

const ctaLabelByState: Record<AuditResult["ctaState"], string> = {
  credex_consultation: "Book a Credex Consultation",
  benchmark_report: "Email my benchmark report",
  optimization_gate: "Notify me about future optimizations"
};

export function AuditResults({ audit, inputs }: AuditResultsProps) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [website, setWebsite] = useState("");
  const [savedUrl, setSavedUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(audit.findings[0]?.id ?? null);

  const spendDistribution = useMemo(
    () =>
      inputs.map((input) => ({
        name: input.tool,
        value: input.monthlySpend
      })),
    [inputs]
  );

  const savingsData = useMemo(
    () => [
      { name: "Monthly", savings: audit.totalMonthlySavings },
      { name: "Yearly", savings: audit.annualizedSavings }
    ],
    [audit.annualizedSavings, audit.totalMonthlySavings]
  );

  async function saveReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const response = await fetch("/api/audits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          company,
          role,
          teamSize: teamSize ? Number(teamSize) : undefined,
          website,
          inputs
        })
      });

      const payload = (await response.json()) as {
        error?: string;
        publicUrl?: string;
        summary?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error ?? "Could not save this audit.");
      }

      setSavedUrl(payload.publicUrl ?? "");
      setSummary(payload.summary ?? "");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Could not save this audit.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div id="audit-results" className="space-y-5">
      <Card className="overflow-hidden rounded-2xl">
        <div className="relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(16,185,129,0.22),transparent_22rem)]" />
          <CardHeader className="relative border-b border-white/10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
                  Live result
                </p>
                <CardTitle className="mt-2 text-2xl">Optimization report</CardTitle>
              </div>
              <Badge>{audit.ctaState.replace("_", " ")}</Badge>
            </div>
          </CardHeader>
          <CardContent className="relative space-y-6 p-5">
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5">
              <p className="text-sm font-semibold text-emerald-200">Potential monthly savings</p>
              <div className="mt-2 flex items-end gap-3">
                <p className="text-5xl font-bold tracking-tight text-white">
                  $<AnimatedNumber value={audit.totalMonthlySavings} />
                </p>
                <p className="pb-2 text-sm text-emerald-200">/ month</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">{audit.thresholdMessage}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Metric
                icon={<CalendarClock className="h-4 w-4" />}
                label="Annualized"
                value={`$${audit.annualizedSavings.toLocaleString()}`}
              />
              <Metric
                icon={<TrendingDown className="h-4 w-4" />}
                label="Optimized spend"
                value={`$${audit.totalRecommendedSpend.toLocaleString()}`}
              />
            </div>

            <AuditCharts spendDistribution={spendDistribution} savingsData={savingsData} />

            <CtaBlock audit={audit} />
          </CardContent>
        </div>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>AI insight</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-2xl border border-violet-400/20 bg-violet-400/10 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/15 text-violet-200">
                <Brain className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-white">Generated using Claude/OpenAI</p>
                <p className="text-sm text-slate-400">Summary is created after deterministic math finishes.</p>
              </div>
            </div>
            <p className="mt-5 min-h-16 text-sm leading-7 text-slate-200">
              {summary ? (
                <TypewriterText key={summary} text={summary} />
              ) : (
                "Save the report to generate a concise AI-written executive summary for this audit."
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Capture the report</CardTitle>
        </CardHeader>
        <CardContent>
          {savedUrl ? (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 text-sm leading-6">
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                <p className="font-bold text-white">Your shareable audit is ready.</p>
                <a className="mt-2 inline-flex items-center gap-2 break-all text-emerald-200 underline" href={savedUrl}>
                  {savedUrl}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          ) : (
            <form className="space-y-3" onSubmit={saveReport}>
              <div className="space-y-2">
                <Label htmlFor="lead-email">Email</Label>
                <Input
                  id="lead-email"
                  required
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="founder@company.com"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="lead-company">Company name</Label>
                  <Input
                    id="lead-company"
                    value={company}
                    onChange={(event) => setCompany(event.target.value)}
                    placeholder="RivetOps"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lead-role">Role</Label>
                  <Input
                    id="lead-role"
                    value={role}
                    onChange={(event) => setRole(event.target.value)}
                    placeholder="Engineering Manager"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lead-team-size">Team size</Label>
                <Input
                  id="lead-team-size"
                  min={1}
                  type="number"
                  value={teamSize}
                  onChange={(event) => setTeamSize(event.target.value)}
                  placeholder="25"
                />
              </div>
              <div className="hidden" aria-hidden="true">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  tabIndex={-1}
                  value={website}
                  onChange={(event) => setWebsite(event.target.value)}
                />
              </div>
              {error ? <p className="text-sm text-red-300">{error}</p> : null}
              <Button className="w-full" disabled={saving} type="submit">
                {saving ? "Saving report..." : ctaLabelByState[audit.ctaState]}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {audit.findings.map((finding) => {
            const expanded = expandedId === finding.id;
            const confidence = confidenceFor(finding.monthlySavings);

            return (
              <div
                key={finding.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-emerald-400/30 hover:shadow-[0_0_40px_rgba(16,185,129,0.1)]"
              >
                <button
                  className="flex w-full items-start justify-between gap-4 text-left"
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : finding.id)}
                >
                  <div className="flex gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-blue-200">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-white">{finding.tool}</p>
                      <p className="mt-1 text-sm text-slate-400">
                        {finding.currentPlan} → optimized recommendation
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-300">${finding.monthlySavings.toLocaleString()}/mo</p>
                    <p className="mt-1 text-xs text-slate-500">{confidence}% confidence</p>
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {expanded ? (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 grid gap-3 border-t border-white/10 pt-4 sm:grid-cols-3">
                        <Stat label="Current spend" value={`$${finding.currentMonthlySpend.toLocaleString()}`} />
                        <Stat label="Optimized spend" value={`$${finding.recommendedMonthlySpend.toLocaleString()}`} />
                        <Stat label="Savings" value={`$${finding.monthlySavings.toLocaleString()}`} tone="green" />
                      </div>
                      <p className="mt-4 text-sm leading-6 text-slate-300">{finding.reason}</p>
                      <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {finding.recommendation}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
                <ChevronDown className={`ml-auto mt-3 h-4 w-4 text-slate-500 transition ${expanded ? "rotate-180" : ""}`} />
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

function CtaBlock({ audit }: { audit: AuditResult }) {
  if (audit.ctaState === "credex_consultation") {
    return (
      <div className="rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-emerald-400/18 via-blue-500/12 to-violet-500/16 p-5">
        <p className="text-xl font-bold tracking-tight text-white">You&apos;re Leaving Serious Money on the Table.</p>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          This audit crossed the Credex threshold. Review discounts, credits, and consolidation before the next billing cycle.
        </p>
        <Button className="mt-4" type="button">
          Book a Credex Consultation
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  if (audit.ctaState === "optimization_gate") {
    return (
      <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5">
        <p className="text-xl font-bold tracking-tight text-white">Your AI spending is already well optimized.</p>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Keep the current setup and get notified when pricing or usage changes create a new savings opportunity.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-blue-400/20 bg-blue-400/10 p-5">
      <p className="text-xl font-bold tracking-tight text-white">Savings are real, but not urgent yet.</p>
      <p className="mt-2 text-sm leading-6 text-slate-300">
        Capture the benchmark report first, then revisit procurement when usage grows.
      </p>
    </div>
  );
}

function Metric({
  icon,
  label,
  value
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center gap-2 text-blue-200">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

function Stat({
  label,
  value,
  tone = "slate"
}: {
  label: string;
  value: string;
  tone?: "slate" | "green";
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`mt-1 font-bold ${tone === "green" ? "text-emerald-300" : "text-white"}`}>{value}</p>
    </div>
  );
}

function AnimatedNumber({ value }: { value: number }) {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { damping: 28, stiffness: 120 });
  const display = useTransform(spring, (latest) => Math.round(latest).toLocaleString());

  useEffect(() => {
    motionValue.set(value);
  }, [motionValue, value]);

  return <motion.span>{display}</motion.span>;
}

function confidenceFor(savings: number) {
  if (savings >= 500) {
    return 94;
  }

  if (savings >= 100) {
    return 88;
  }

  if (savings > 0) {
    return 82;
  }

  return 76;
}

function TypewriterText({ text }: { text: string }) {
  const [visibleText, setVisibleText] = useState("");

  useEffect(() => {
    let index = 0;
    const timer = window.setInterval(() => {
      index += 3;
      setVisibleText(text.slice(0, index));

      if (index >= text.length) {
        window.clearInterval(timer);
      }
    }, 18);

    return () => window.clearInterval(timer);
  }, [text]);

  return (
    <>
      {visibleText}
      <span className="ml-1 inline-block h-4 w-1 animate-pulse bg-violet-200 align-middle" />
    </>
  );
}
