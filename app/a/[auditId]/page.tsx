import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight, Bot, Brain, CalendarClock, CheckCircle2, DollarSign, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPublicAudit } from "@/lib/firebase/server";

type SharePageProps = {
  params: Promise<{
    auditId: string;
  }>;
};

export async function generateMetadata({ params }: SharePageProps): Promise<Metadata> {
  const { auditId } = await params;
  const record = await getPublicAudit(auditId);
  const savings = record?.audit.totalMonthlySavings ?? 0;
  const title = savings > 0
    ? `$${savings.toLocaleString()} monthly AI savings found`
    : "SpendPilot AI audit snapshot";
  const description = record?.summary ??
    "A public AI spend audit showing tool-level recommendations and savings.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: record?.publicUrl
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    }
  };
}

export default async function SharePage({ params }: SharePageProps) {
  const { auditId } = await params;
  const record = await getPublicAudit(auditId);

  if (!record) {
    return (
      <main className="premium-shell flex min-h-screen items-center justify-center px-4 py-10 text-slate-100">
        <Card className="max-w-2xl rounded-2xl">
          <CardHeader>
            <Badge>SpendPilot AI</Badge>
            <CardTitle className="mt-3 text-3xl">Audit not available</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-6 text-slate-400">
            Audit ID <span className="font-mono text-slate-200">{auditId}</span> is not available as a public report.
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="premium-shell min-h-screen text-slate-100">
      <section className="relative overflow-hidden">
        <div className="premium-grid pointer-events-none absolute inset-0" />
        <div className="aurora-field pointer-events-none absolute inset-x-0 top-0 h-[32rem]" />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <header className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <Badge>Public SpendPilot AI report</Badge>
              <h1 className="mt-5 max-w-4xl text-5xl font-bold tracking-tight text-white md:text-6xl">
                {formatCurrency(record.audit.totalMonthlySavings)} monthly savings found
              </h1>
              <p className="mt-4 text-lg leading-8 text-slate-300">
                {formatCurrency(record.audit.annualizedSavings)} annualized savings across {record.inputs.length} AI tool rows.
              </p>
            </div>
            <div className="flex gap-3">
              <a
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 text-sm font-semibold text-slate-100 transition hover:border-blue-400/50 hover:bg-white/10"
                href={`mailto:?subject=SpendPilot AI audit&body=${encodeURIComponent(record.publicUrl)}`}
              >
                <Share2 className="h-4 w-4" />
                Share
              </a>
              <Link
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-blue-500 px-4 text-sm font-semibold text-white transition hover:bg-blue-400"
                href="/"
              >
                Run audit
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </header>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <ReportMetric icon={<DollarSign className="h-4 w-4" />} label="Monthly savings" value={formatCurrency(record.audit.totalMonthlySavings)} />
            <ReportMetric icon={<CalendarClock className="h-4 w-4" />} label="Annualized" value={formatCurrency(record.audit.annualizedSavings)} />
            <ReportMetric icon={<CheckCircle2 className="h-4 w-4" />} label="CTA state" value={record.audit.ctaState.replace("_", " ")} />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <Card className="rounded-2xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/15 text-violet-200">
                    <Brain className="h-5 w-5" />
                  </div>
                  <CardTitle>AI summary</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm leading-7 text-slate-300">
                {record.summary}
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Tool-level findings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {record.audit.findings.map((finding) => (
                  <div key={finding.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-blue-200">
                          <Bot className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-white">
                            {finding.tool} / {finding.currentPlan}
                          </p>
                          <p className="mt-1 text-sm text-slate-400">{finding.recommendation}</p>
                        </div>
                      </div>
                      <p className="text-lg font-bold text-emerald-300">
                        {formatCurrency(finding.monthlySavings)}/mo
                      </p>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-300">{finding.reason}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}

function ReportMetric({
  icon,
  label,
  value
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="glass-panel rounded-2xl p-5">
      <div className="flex items-center gap-2 text-blue-200">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</span>
      </div>
      <p className="mt-3 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}
