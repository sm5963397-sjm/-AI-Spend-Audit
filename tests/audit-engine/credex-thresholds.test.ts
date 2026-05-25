import { describe, expect, it } from "vitest";
import { runAudit } from "@/lib/audit/engine";

describe("Credex CTA thresholding", () => {
  it("triggers a consultation CTA above $500 monthly savings", () => {
    const audit = runAudit([
      {
        tool: "OpenAI API",
        plan: "API direct",
        monthlySpend: 950,
        seats: 3,
        teamSize: 10,
        primaryUseCase: "mixed"
      }
    ]);

    expect(audit.totalMonthlySavings).toBeGreaterThan(500);
    expect(audit.ctaState).toBe("credex_consultation");
  });
});
