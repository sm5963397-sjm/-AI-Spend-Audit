"use client";

import { Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { runAudit } from "@/lib/audit/engine";
import { TOOL_PLANS, TOOL_NAMES, USE_CASES } from "@/lib/audit/pricing-data";
import type { AuditInput, ToolName } from "@/lib/audit/types";
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

export function AuditForm() {
  const [rows, setRows] = useState<AuditInput[]>(defaultRows);
  const [hydrated, setHydrated] = useState(false);

  const audit = useMemo(() => runAudit(rows), [rows]);

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
    <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <Card>
        <CardHeader>
          <CardTitle>Audit inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {rows.map((row, index) => (
            <div key={`${row.tool}-${index}`} className="grid gap-3 rounded-lg border p-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`tool-${index}`}>Tool</Label>
                  <Select
                    id={`tool-${index}`}
                    value={row.tool}
                    onChange={(event) =>
                      updateRow(index, { tool: event.target.value as ToolName })
                    }
                  >
                    {TOOL_NAMES.map((tool) => (
                      <option key={tool} value={tool}>
                        {tool}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`plan-${index}`}>Plan</Label>
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
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor={`spend-${index}`}>Monthly spend</Label>
                  <Input
                    id={`spend-${index}`}
                    min={0}
                    type="number"
                    value={row.monthlySpend}
                    onChange={(event) =>
                      updateRow(index, { monthlySpend: Number(event.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`seats-${index}`}>Seats</Label>
                  <Input
                    id={`seats-${index}`}
                    min={0}
                    type="number"
                    value={row.seats}
                    onChange={(event) => updateRow(index, { seats: Number(event.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`team-${index}`}>Team size</Label>
                  <Input
                    id={`team-${index}`}
                    min={1}
                    type="number"
                    value={row.teamSize}
                    onChange={(event) =>
                      updateRow(index, { teamSize: Number(event.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`use-case-${index}`}>Primary use case</Label>
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
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  aria-label={`Remove ${row.tool}`}
                  disabled={rows.length === 1}
                  onClick={() => removeRow(index)}
                  size="sm"
                  type="button"
                  variant="ghost"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </Button>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => setRows((current) => [...current, { ...emptyRow }])}
          >
            <Plus className="h-4 w-4" />
            Add tool
          </Button>
        </CardContent>
      </Card>
      <AuditResults audit={audit} inputs={rows} />
    </section>
  );
}
