import { describe, expect, it } from "vitest";
import { runAudit } from "@/lib/audit/engine";

describe("plan optimization traps", () => {
  it("downgrades a two-seat Claude Team purchase to Pro seats", () => {
    const audit = runAudit([
      {
        tool: "Claude",
        plan: "Team",
        monthlySpend: 125,
        seats: 2,
        teamSize: 2,
        primaryUseCase: "coding"
      }
    ]);

    expect(audit.totalMonthlySavings).toBe(85);
    expect(audit.findings[0]?.recommendation).toContain("Pro");
  });
});
