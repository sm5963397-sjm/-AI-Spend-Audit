import { z } from "zod";

const emptyToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

export const auditInputSchema = z.object({
  tool: z.enum([
    "Cursor",
    "GitHub Copilot",
    "Claude",
    "ChatGPT",
    "Anthropic API",
    "OpenAI API",
    "Gemini",
    "v0"
  ]),
  plan: z.string().trim().min(1).max(80),
  monthlySpend: z.coerce.number().finite().nonnegative(),
  seats: z.coerce.number().int().nonnegative(),
  teamSize: z.coerce.number().int().positive(),
  primaryUseCase: z.enum(["coding", "writing", "data", "research", "mixed"])
});

export const auditRequestSchema = z.object({
  email: z.preprocess(
    emptyToUndefined,
    z.string().trim().email().max(254).optional()
  ),
  company: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(120).optional()
  ),
  role: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(120).optional()
  ),
  teamSize: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().positive().optional()
  ),
  website: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(200).optional()
  ),
  inputs: z.array(auditInputSchema).min(1).max(20)
});
