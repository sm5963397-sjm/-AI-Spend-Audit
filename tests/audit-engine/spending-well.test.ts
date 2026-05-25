import { describe, expect, it } from "vitest";
import { runAudit } from "@/lib/audit/engine";

describe("spending well gate", () => {
  it("does not force a consultation when savings are below $100", () => {
    const audit = runAudit([
      {
        tool: "Cursor",
        plan: "Pro",
        monthlySpend: 20,
        seats: 1,
        teamSize: 6,
        primaryUseCase: "coding"
      }
    ]);

    expect(audit.totalMonthlySavings).toBe(0);
    expect(audit.ctaState).toBe("optimization_gate");
    expect(audit.thresholdMessage).toContain("spending well");
  });
});
