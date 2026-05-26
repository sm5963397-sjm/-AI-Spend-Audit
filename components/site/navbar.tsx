"use client";

import { Menu, Plane, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const links = [
  ["Features", "#features"],
  ["How it Works", "#how-it-works"],
  ["Pricing Logic", "#pricing-logic"],
  ["Demo Report", "#audit-results"],
  ["FAQ", "#faq"]
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B1020]/72 backdrop-blur-2xl">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a className="flex items-center gap-3" href="#top" aria-label="SpendPilot AI home">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-400/30 bg-blue-500/15 text-blue-200 shadow-[0_0_30px_rgba(59,130,246,0.24)]">
            <Plane className="h-4 w-4" />
          </span>
          <span className="text-sm font-bold tracking-tight text-white">SpendPilot AI</span>
        </a>
        <div className="hidden items-center gap-1 md:flex">
          {links.map(([label, href]) => (
            <a
              key={href}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
              href={href}
            >
              {label}
            </a>
          ))}
        </div>
        <div className="hidden md:block">
          <a
            className="inline-flex h-9 items-center justify-center rounded-md bg-blue-500 px-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(59,130,246,0.24)] transition hover:bg-blue-400"
            href="#audit"
          >
            Start Free Audit
          </a>
        </div>
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/5 text-white md:hidden"
          type="button"
          aria-label="Toggle navigation menu"
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="border-t border-white/10 bg-[#0B1020]/95 px-4 py-4 backdrop-blur-2xl md:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-2">
              {links.map(([label, href]) => (
                <a
                  key={href}
                  className="rounded-md px-3 py-3 text-sm font-medium text-slate-200 hover:bg-white/10"
                  href={href}
                  onClick={() => setOpen(false)}
                >
                  {label}
                </a>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
