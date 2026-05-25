import { describe, expect, it } from "vitest";
import { auditRequestSchema } from "@/lib/audit/schema";

describe("audit request schema", () => {
  it("rejects invalid lead emails before saving an audit", () => {
    const parsed = auditRequestSchema.safeParse({
      email: "not-an-email",
      inputs: [
        {
          tool: "Cursor",
          plan: "Pro",
          monthlySpend: 20,
          seats: 1,
          teamSize: 6,
          primaryUseCase: "coding"
        }
      ]
    });

    expect(parsed.success).toBe(false);
  });
});
