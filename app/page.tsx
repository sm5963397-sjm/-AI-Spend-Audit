import { AuditForm } from "@/components/audit/audit-form";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="grid gap-4 border-b pb-8 md:grid-cols-[1.1fr_0.9fr] md:items-end">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
            Credex AI Spend Audit
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-normal text-slate-950 sm:text-5xl">
            Stop renewing wasteful AI seats.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            Paste your team&apos;s AI tools, plans, seats, and spend. The audit uses fixed retail math first, then adds a short AI-written explanation after the savings are already calculated.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="rounded-lg border bg-white p-4">
            <p className="text-2xl font-semibold text-slate-950">$500+</p>
            <p className="mt-1 text-slate-600">Credex consult trigger</p>
          </div>
          <div className="rounded-lg border bg-white p-4">
            <p className="text-2xl font-semibold text-slate-950">&lt;$100</p>
            <p className="mt-1 text-slate-600">Honest spend-well gate</p>
          </div>
          <div className="rounded-lg border bg-white p-4">
            <p className="text-2xl font-semibold text-slate-950">0</p>
            <p className="mt-1 text-slate-600">AI math decisions</p>
          </div>
        </div>
      </header>
      <AuditForm />
    </main>
  );
}
