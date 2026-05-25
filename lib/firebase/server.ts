import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import type { AuditInput, AuditResult } from "@/lib/audit/types";

type SaveAuditLeadInput = {
  auditId: string;
  email?: string;
  company?: string;
  role?: string;
  teamSize?: number;
  publicUrl: string;
  inputs: AuditInput[];
  audit: AuditResult;
  summary: string;
};

export type PublicAuditRecord = {
  auditId: string;
  publicUrl: string;
  inputs: AuditInput[];
  audit: AuditResult;
  summary: string;
  totalMonthlySavings: number;
};

const localAuditDir = path.join(process.cwd(), ".local-audits");

export async function saveAuditLead(payload: SaveAuditLeadInput) {
  const db = getAdminDb();

  if (!db) {
    await saveLocalAudit({
      auditId: payload.auditId,
      publicUrl: payload.publicUrl,
      inputs: payload.inputs,
      audit: payload.audit,
      summary: payload.summary,
      totalMonthlySavings: payload.audit.totalMonthlySavings
    });

    return { skipped: true };
  }

  const createdAt = new Date();

  await db.collection("audits").doc(payload.auditId).set({
    createdAt,
    publicShare: true,
    publicUrl: payload.publicUrl,
    inputs: payload.inputs,
    summary: payload.summary,
    totalMonthlySavings: payload.audit.totalMonthlySavings,
    audit: payload.audit
  });

  if (payload.email) {
    await db.collection("leads").add({
      createdAt,
      email: payload.email,
      company: payload.company ?? null,
      role: payload.role ?? null,
      teamSize: payload.teamSize ?? null,
      auditId: payload.auditId,
      publicUrl: payload.publicUrl,
      totalMonthlySavings: payload.audit.totalMonthlySavings,
      ctaState: payload.audit.ctaState
    });
  }

  return { skipped: false };
}

export async function getPublicAudit(auditId: string): Promise<PublicAuditRecord | null> {
  const db = getAdminDb();

  if (!db) {
    return getLocalAudit(auditId);
  }

  const snapshot = await db.collection("audits").doc(auditId).get();

  if (!snapshot.exists) {
    return null;
  }

  const data = snapshot.data();

  if (!data || data.publicShare !== true) {
    return null;
  }

  return {
    auditId,
    publicUrl: String(data.publicUrl ?? ""),
    inputs: Array.isArray(data.inputs) ? (data.inputs as AuditInput[]) : [],
    audit: data.audit as AuditResult,
    summary: String(data.summary ?? ""),
    totalMonthlySavings: Number(data.totalMonthlySavings ?? 0)
  };
}

function getAdminDb() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey
      })
    });
  }

  return getFirestore();
}

async function saveLocalAudit(record: PublicAuditRecord) {
  await mkdir(localAuditDir, { recursive: true });
  await writeFile(
    path.join(localAuditDir, `${record.auditId}.json`),
    JSON.stringify(record, null, 2),
    "utf8"
  );
}

async function getLocalAudit(auditId: string) {
  try {
    const data = await readFile(path.join(localAuditDir, `${auditId}.json`), "utf8");
    return JSON.parse(data) as PublicAuditRecord;
  } catch {
    return null;
  }
}
