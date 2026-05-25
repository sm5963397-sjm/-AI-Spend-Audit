"use client";

import { ArrowRight, CalendarClock, CheckCircle2, DollarSign } from "lucide-react";
import type { FormEvent, ReactNode } from "react";
import { useState } from "react";
import type { AuditInput } from "@/lib/audit/types";
import type { AuditResult } from "@/lib/audit/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuditResultsProps = {
  audit: AuditResult;
  inputs: AuditInput[];
};

const ctaLabelByState: Record<AuditResult["ctaState"], string> = {
  credex_consultation: "Book Credex consultation",
  benchmark_report: "Email my benchmark report",
  optimization_gate: "Notify me when savings appear"
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
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle>Audit result</CardTitle>
            <Badge>{audit.ctaState.replace("_", " ")}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <Metric
              icon={<DollarSign className="h-4 w-4" />}
              label="Monthly savings"
              value={`$${audit.totalMonthlySavings.toLocaleString()}`}
            />
            <Metric
              icon={<CalendarClock className="h-4 w-4" />}
              label="Annualized"
              value={`$${audit.annualizedSavings.toLocaleString()}`}
            />
          </div>
          <p className="text-sm leading-6 text-slate-600">{audit.thresholdMessage}</p>
          <Button className="w-full" type="button">
            {ctaLabelByState[audit.ctaState]}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Capture the report</CardTitle>
        </CardHeader>
        <CardContent>
          {savedUrl ? (
            <div className="space-y-3 text-sm leading-6">
              <p className="font-medium text-slate-950">Your shareable audit is ready.</p>
              <a className="break-all text-teal-700 underline" href={savedUrl}>
                {savedUrl}
              </a>
              {summary ? <p className="text-slate-600">{summary}</p> : null}
            </div>
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
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              <Button className="w-full" disabled={saving} type="submit">
                {saving ? "Saving report..." : "Email my shareable report"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Findings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {audit.findings.map((finding) => (
            <div key={finding.id} className="rounded-lg border p-3">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-teal-700" />
                <div>
                  <p className="font-medium text-slate-950">{finding.recommendation}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{finding.reason}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
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
    <div className="rounded-lg border bg-white p-4">
      <div className="flex items-center gap-2 text-slate-500">
        {icon}
        <span className="text-xs font-medium uppercase tracking-[0.12em]">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}
