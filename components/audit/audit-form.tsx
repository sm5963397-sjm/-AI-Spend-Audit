"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bot, Code2, Database, FileText, Gauge, Plus, Search, Sparkles, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { runAudit } from "@/lib/audit/engine";
import { TOOL_PLANS, TOOL_NAMES, USE_CASES } from "@/lib/audit/pricing-data";
import type { AuditInput, ToolName, UseCase } from "@/lib/audit/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { AuditResults } from "./audit-results";

const emptyRow: AuditInput = {
  tool: "Cursor",
  plan: "Pro",
  monthlySpend: 20,
  seats: 1,
  teamSize: 8,
  primaryUseCase: "coding"
};

const defaultRows: AuditInput[] = [
  emptyRow,
  {
    tool: "Claude",
    plan: "Team",
    monthlySpend: 125,
    seats: 2,
    teamSize: 8,
    primaryUseCase: "coding"
  }
];

const storageKey = "credex-ai-spend-audit-inputs";
const steps = ["Stack", "Usage", "Review"] as const;

const useCaseIcons: Record<UseCase, ReactNode> = {
  coding: <Code2 className="h-4 w-4" />,
  writing: <FileText className="h-4 w-4" />,
  data: <Database className="h-4 w-4" />,
  research: <Search className="h-4 w-4" />,
  mixed: <Sparkles className="h-4 w-4" />
};

export function AuditForm() {
  const [rows, setRows] = useState<AuditInput[]>(defaultRows);
  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState(0);

  const audit = useMemo(() => runAudit(rows), [rows]);
  const totalSpend = rows.reduce((total, row) => total + row.monthlySpend, 0);
  const savingsRate = totalSpend > 0 ? Math.min(100, Math.round((audit.totalMonthlySavings / totalSpend) * 100)) : 0;

  useEffect(() => {
    try {
      const savedRows = window.localStorage.getItem(storageKey);

      if (savedRows) {
        const parsedRows = JSON.parse(savedRows) as AuditInput[];

        if (Array.isArray(parsedRows) && parsedRows.length > 0) {
          setRows(parsedRows);
        }
      }
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(storageKey, JSON.stringify(rows));
    }
  }, [hydrated, rows]);

  function updateRow(index: number, patch: Partial<AuditInput>) {
    setRows((current) =>
      current.map((row, rowIndex) =>
        rowIndex === index
          ? {
              ...row,
              ...patch,
              plan:
                patch.tool && patch.tool !== row.tool
                  ? TOOL_PLANS[patch.tool as ToolName][0] ?? row.plan
                  : patch.plan ?? row.plan
            }
          : row
      )
    );
  }

  function removeRow(index: number) {
    setRows((current) => current.filter((_, rowIndex) => rowIndex !== index));
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
      <Card className="overflow-hidden rounded-2xl" id="audit-builder">
        <CardHeader className="border-b border-white/10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                Audit builder
              </p>
              <CardTitle className="mt-2 text-2xl">Map your AI stack</CardTitle>
            </div>
            <div className="grid grid-cols-3 gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-1">
              {steps.map((label, index) => (
                <button
                  key={label}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    step === index
                      ? "bg-blue-500 text-white shadow-[0_0_24px_rgba(59,130,246,0.28)]"
                      : "text-slate-400 hover:text-white"
                  }`}
                  type="button"
                  onClick={() => setStep(index)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-5 h-2 rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-5 p-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <PreviewMetric label="Current monthly spend" value={`$${totalSpend.toLocaleString()}`} />
            <PreviewMetric label="Potential monthly savings" value={`$${audit.totalMonthlySavings.toLocaleString()}`} tone="green" />
            <PreviewMetric label="Optimization impact" value={`${savingsRate}%`} tone="purple" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22 }}
              className="space-y-4"
            >
              {step === 0 ? (
                <StackStep rows={rows} updateRow={updateRow} removeRow={removeRow} />
              ) : null}
              {step === 1 ? (
                <UsageStep rows={rows} updateRow={updateRow} />
              ) : null}
              {step === 2 ? (
                <ReviewStep rows={rows} auditSavings={audit.totalMonthlySavings} />
              ) : null}
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setRows((current) => [...current, { ...emptyRow }])}
            >
              <Plus className="h-4 w-4" />
              Add tool
            </Button>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={step === 0}
                onClick={() => setStep((current) => Math.max(0, current - 1))}
              >
                Back
              </Button>
              <Button
                type="button"
                disabled={step === steps.length - 1}
                onClick={() => setStep((current) => Math.min(steps.length - 1, current + 1))}
              >
                Continue
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <AuditResults audit={audit} inputs={rows} />
    </section>
  );
}

function StackStep({
  rows,
  updateRow,
  removeRow
}: {
  rows: AuditInput[];
  updateRow: (index: number, patch: Partial<AuditInput>) => void;
  removeRow: (index: number) => void;
}) {
  return (
    <>
      {rows.map((row, index) => (
        <ToolCard key={`${row.tool}-${index}`} row={row} index={index} removeRow={removeRow}>
          <div className="grid gap-3 md:grid-cols-3">
            <Field label="Tool" id={`tool-${index}`}>
              <Select
                id={`tool-${index}`}
                value={row.tool}
                onChange={(event) => updateRow(index, { tool: event.target.value as ToolName })}
              >
                {TOOL_NAMES.map((tool) => (
                  <option key={tool} value={tool}>
                    {tool}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Plan" id={`plan-${index}`}>
              <Select
                id={`plan-${index}`}
                value={row.plan}
                onChange={(event) => updateRow(index, { plan: event.target.value })}
              >
                {TOOL_PLANS[row.tool].map((plan) => (
                  <option key={plan} value={plan}>
                    {plan}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Primary use case" id={`use-case-${index}`}>
              <Select
                id={`use-case-${index}`}
                value={row.primaryUseCase}
                onChange={(event) =>
                  updateRow(index, {
                    primaryUseCase: event.target.value as AuditInput["primaryUseCase"]
                  })
                }
              >
                {USE_CASES.map((useCase) => (
                  <option key={useCase} value={useCase}>
                    {useCase}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {USE_CASES.map((useCase) => (
              <button
                key={useCase}
                type="button"
                onClick={() => updateRow(index, { primaryUseCase: useCase })}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold capitalize transition ${
                  row.primaryUseCase === useCase
                    ? "border-emerald-400/30 bg-emerald-400/12 text-emerald-200"
                    : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-white"
                }`}
              >
                {useCaseIcons[useCase]}
                {useCase}
              </button>
            ))}
          </div>
        </ToolCard>
      ))}
    </>
  );
}

function UsageStep({
  rows,
  updateRow
}: {
  rows: AuditInput[];
  updateRow: (index: number, patch: Partial<AuditInput>) => void;
}) {
  return (
    <>
      {rows.map((row, index) => (
        <ToolCard key={`${row.tool}-usage-${index}`} row={row} index={index}>
          <div className="grid gap-4">
            <SliderField
              label="Monthly spend"
              value={row.monthlySpend}
              max={2000}
              prefix="$"
              onChange={(value) => updateRow(index, { monthlySpend: value })}
            />
            <div className="grid gap-3 md:grid-cols-2">
              <SliderField
                label="Seats"
                value={row.seats}
                max={100}
                onChange={(value) => updateRow(index, { seats: value })}
              />
              <SliderField
                label="Team size"
                value={row.teamSize}
                min={1}
                max={250}
                onChange={(value) => updateRow(index, { teamSize: value })}
              />
            </div>
          </div>
        </ToolCard>
      ))}
    </>
  );
}

function ReviewStep({
  rows,
  auditSavings
}: {
  rows: AuditInput[];
  auditSavings: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/12 text-emerald-200">
          <Gauge className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold text-white">Audit ready</h3>
          <p className="text-sm text-slate-400">
            {rows.length} tools analyzed with ${auditSavings.toLocaleString()} in monthly savings potential.
          </p>
        </div>
      </div>
      <div className="mt-5 grid gap-3">
        {rows.map((row) => (
          <div key={`${row.tool}-${row.plan}`} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <div>
              <p className="font-semibold text-white">{row.tool}</p>
              <p className="text-sm text-slate-400">{row.plan} / {row.seats} seats</p>
            </div>
            <p className="font-bold text-slate-100">${row.monthlySpend.toLocaleString()}/mo</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ToolCard({
  row,
  index,
  children,
  removeRow
}: {
  row: AuditInput;
  index: number;
  children: ReactNode;
  removeRow?: (index: number) => void;
}) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition hover:border-blue-400/35 hover:bg-white/[0.055] hover:shadow-[0_0_40px_rgba(59,130,246,0.12)]">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-blue-200">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold text-white">{row.tool}</p>
            <p className="text-sm text-slate-400">{row.plan}</p>
          </div>
        </div>
        {removeRow ? (
          <Button
            aria-label={`Remove ${row.tool}`}
            disabled={index === 0}
            onClick={() => removeRow(index)}
            size="sm"
            type="button"
            variant="ghost"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function Field({
  id,
  label,
  children
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}

function SliderField({
  label,
  value,
  onChange,
  prefix = "",
  min = 0,
  max
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  min?: number;
  max: number;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between gap-3">
        <Label>{label}</Label>
        <Input
          className="h-9 w-28 text-right"
          min={min}
          max={max}
          type="number"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
      </div>
      <input
        aria-label={label}
        className="mt-4 h-2 w-full cursor-pointer accent-blue-500"
        min={min}
        max={max}
        type="range"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <p className="mt-2 text-sm text-slate-400">
        Current: <span className="font-semibold text-white">{prefix}{value.toLocaleString()}</span>
      </p>
    </div>
  );
}

function PreviewMetric({
  label,
  value,
  tone = "blue"
}: {
  label: string;
  value: string;
  tone?: "blue" | "green" | "purple";
}) {
  const tones = {
    blue: "text-blue-200",
    green: "text-emerald-200",
    purple: "text-violet-200"
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className={`mt-2 text-xl font-bold ${tones[tone]}`}>{value}</p>
    </div>
  );
}
