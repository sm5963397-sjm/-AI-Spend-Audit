import { describe, expect, it } from "vitest";
import { runAudit } from "@/lib/audit/engine";

describe("cheaper alternatives", () => {
  it("maps coding workloads to coding-specific alternatives", () => {
    const audit = runAudit([
      {
        tool: "Claude",
        plan: "Max 20x",
        monthlySpend: 200,
        seats: 1,
        teamSize: 8,
        primaryUseCase: "coding"
      }
    ]);

    expect(audit.alternatives.map((alternative) => alternative.tool)).toContain(
      "GitHub Copilot"
    );
    expect(audit.alternatives.map((alternative) => alternative.tool)).toContain("Cursor");
  });
});
