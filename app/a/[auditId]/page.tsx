import type { Metadata } from "next";
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
    : "AI spend audit snapshot";
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
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-4 py-10 sm:px-6">
        <header className="space-y-3">
          <Badge>Public audit snapshot</Badge>
          <h1 className="text-3xl font-semibold text-slate-950">Audit not available</h1>
          <p className="text-slate-600">
            Audit ID <span className="font-mono text-slate-900">{auditId}</span>
          </p>
        </header>
        <Card>
          <CardHeader>
            <CardTitle>No public report found</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-6 text-slate-600">
            This share URL only renders reports saved with <span className="font-mono">publicShare: true</span>. In local development, add Firebase Admin credentials to save and retrieve report snapshots.
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-4 py-10 sm:px-6">
      <header className="space-y-3">
        <Badge>Public audit snapshot</Badge>
        <h1 className="text-3xl font-semibold text-slate-950">
          {formatCurrency(record.audit.totalMonthlySavings)} monthly savings found
        </h1>
        <p className="text-lg text-slate-600">
          {formatCurrency(record.audit.annualizedSavings)} annualized savings across {record.inputs.length} AI tool rows.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Personalized summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-6 text-slate-600">
          <p>{record.summary}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Tool-level findings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {record.audit.findings.map((finding) => (
            <div key={finding.id} className="rounded-lg border p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-950">
                    {finding.tool} / {finding.currentPlan}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">{finding.recommendation}</p>
                </div>
                <p className="text-lg font-semibold text-teal-700">
                  {formatCurrency(finding.monthlySavings)}/mo
                </p>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{finding.reason}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}
