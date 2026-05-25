import { NextResponse } from "next/server";
import { generatePersonalizedSummary } from "@/lib/ai/summary";
import { runAudit } from "@/lib/audit/engine";
import { auditRequestSchema } from "@/lib/audit/schema";
import { sendAuditEmail } from "@/lib/email/resend";
import { saveAuditLead } from "@/lib/firebase/server";

const rateLimitWindowMs = 10 * 60 * 1000;
const maxRequestsPerWindow = 10;
const requestCounts = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: Request) {
  const parsedBody = auditRequestSchema.safeParse(await request.json());

  if (!parsedBody.success) {
    return NextResponse.json(
      { error: "Audit payload is invalid. Check tool rows and lead fields." },
      { status: 400 }
    );
  }

  const body = parsedBody.data;
  const clientId = getClientId(request);

  if (isRateLimited(clientId)) {
    return NextResponse.json(
      { error: "Too many audit saves. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  if (body.website) {
    return NextResponse.json(
      { error: "Could not save this audit." },
      { status: 400 }
    );
  }

  const audit = runAudit(body.inputs);
  const summary = await generatePersonalizedSummary({
    company: body.company ?? "your team",
    audit
  });
  const auditId = crypto.randomUUID();
  const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/a/${auditId}`;

  await saveAuditLead({
    auditId,
    email: body.email,
    company: body.company,
    role: body.role,
    teamSize: body.teamSize,
    publicUrl,
    inputs: body.inputs,
    audit,
    summary
  });

  if (body.email) {
    await sendAuditEmail({
      to: body.email,
      publicUrl,
      totalMonthlySavings: audit.totalMonthlySavings,
      summary
    });
  }

  return NextResponse.json({
    auditId,
    publicUrl,
    summary,
    audit
  });
}

function getClientId(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
}

function isRateLimited(clientId: string) {
  const now = Date.now();
  const current = requestCounts.get(clientId);

  if (!current || current.resetAt < now) {
    requestCounts.set(clientId, {
      count: 1,
      resetAt: now + rateLimitWindowMs
    });
    return false;
  }

  current.count += 1;
  requestCounts.set(clientId, current);
  return current.count > maxRequestsPerWindow;
}
