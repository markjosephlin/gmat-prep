"use client";

import { useState } from "react";

const faqs = [
  {
    q: "How is this different from Magoosh or Manhattan Prep?",
    a: "Those tools give you a fixed question bank. This tool learns from your specific mistakes and generates fresh drills targeting exactly what you got wrong — not just the general topic, but the micro-skill.",
  },
  {
    q: "How many drills do I get per mistake?",
    a: "Around 4 per mistake. They're spaced out over time using spaced repetition, so they come back right when you're about to forget.",
  },
  {
    q: "Do I need to upload screenshots?",
    a: "No — just paste the question text and tell us why you think you missed it. A rough guess is fine.",
  },
  {
    q: "Does my access expire if I stop paying?",
    a: "No. All drills and analytics you've generated stay available forever, even on the free plan.",
  },
  {
    q: "Is there a free trial?",
    a: "The free plan gives you 15 mistakes and ~60 drills at no cost, no credit card required.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="max-w-6xl mx-auto px-6 py-24">
      <div className="text-center mb-14">
        <p className="section-label mb-3">FAQ</p>
        <h2 className="text-4xl font-black text-navy">Questions people ask before they sign up.</h2>
      </div>

      <div className="max-w-2xl mx-auto card divide-y divide-slate-100">
        {faqs.map((faq, i) => (
          <div key={i}>
            <button
              className="w-full flex items-center justify-between px-6 py-5 text-left"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span className="font-semibold text-navy text-sm pr-4">{faq.q}</span>
              <svg
                className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {open === i && (
              <div className="px-6 pb-5 text-sm text-slate-500 leading-relaxed">{faq.a}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
