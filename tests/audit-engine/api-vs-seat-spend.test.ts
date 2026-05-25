import { describe, expect, it } from "vitest";
import { runAudit } from "@/lib/audit/engine";

describe("API direct spend", () => {
  it("recommends a hard cap for high API spend on a small team", () => {
    const audit = runAudit([
      {
        tool: "Anthropic API",
        plan: "API direct",
        monthlySpend: 700,
        seats: 2,
        teamSize: 4,
        primaryUseCase: "research"
      }
    ]);

    expect(audit.findings[0]?.recommendation).toContain("budget cap");
    expect(audit.findings[0]?.monthlySavings).toBe(550);
  });
});
