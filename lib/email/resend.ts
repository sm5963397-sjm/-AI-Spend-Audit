import { Resend } from "resend";

type SendAuditEmailInput = {
  to: string;
  publicUrl: string;
  totalMonthlySavings: number;
  summary: string;
};

export async function sendAuditEmail({
  to,
  publicUrl,
  totalMonthlySavings,
  summary
}: SendAuditEmailInput) {
  if (!process.env.RESEND_API_KEY) {
    return { skipped: true };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  return resend.emails.send({
    from: process.env.AUDIT_FROM_EMAIL ?? "Credex AI Spend Audit <audits@example.com>",
    to,
    subject:
      totalMonthlySavings > 500
        ? "Your AI spend audit found a Credex opportunity"
        : "Your AI spend audit is ready",
    html: `
      <h1>AI spend audit</h1>
      <p>${escapeHtml(summary)}</p>
      <p><a href="${publicUrl}">Open your shareable audit</a></p>
    `
  });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
