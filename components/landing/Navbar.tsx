"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">G</span>
          </div>
          <span className="font-bold text-navy text-sm">GMAT Prep</span>
        </Link>

        <div className="hidden md:flex items-center gap-7">
          <Link href="#how-it-works" className="text-slate-600 text-sm hover:text-navy transition-colors">
            How it works
          </Link>
          <Link href="#pricing" className="text-slate-600 text-sm hover:text-navy transition-colors">
            Pricing
          </Link>
          <Link href="#faq" className="text-slate-600 text-sm hover:text-navy transition-colors">
            FAQ
          </Link>
          <Link href="/practice" className="btn-primary text-sm">
            Try now
          </Link>
        </div>

        <button
          className="md:hidden p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-5 h-0.5 bg-slate-700 mb-1" />
          <div className="w-5 h-0.5 bg-slate-700 mb-1" />
          <div className="w-5 h-0.5 bg-slate-700" />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-6 py-4 flex flex-col gap-4">
          <Link href="#how-it-works" className="text-slate-600 text-sm">How it works</Link>
          <Link href="#pricing" className="text-slate-600 text-sm">Pricing</Link>
          <Link href="#faq" className="text-slate-600 text-sm">FAQ</Link>
          <Link href="/practice" className="btn-primary w-fit">Try now</Link>
        </div>
      )}
    </nav>
  );
}
