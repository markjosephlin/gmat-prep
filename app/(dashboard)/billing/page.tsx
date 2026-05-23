"use client";

import { useEffect, useState, Suspense } from "react";
import { createClient } from "@/lib/supabase";
import { useSearchParams } from "next/navigation";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Try the loop on your first mistakes.",
    highlight: false,
    features: [
      { label: "Mistakes per month", value: "15" },
      { label: "Tailored drills", value: "~60" },
      { label: "AI explanations", value: true },
      { label: "Spaced repetition", value: true },
      { label: "Analytics", value: false },
      { label: "Drill history", value: false },
      { label: "Screenshot upload", value: false },
      { label: "Priority support", value: false },
    ],
    cta: null,
  },
  {
    id: "monthly",
    name: "Monthly",
    price: "$19.99",
    period: "/ month",
    description: "For a full-time study sprint.",
    highlight: true,
    badge: "Most popular",
    features: [
      { label: "Mistakes per month", value: "Unlimited" },
      { label: "Tailored drills", value: "Unlimited" },
      { label: "AI explanations", value: true },
      { label: "Spaced repetition", value: true },
      { label: "Analytics", value: true },
      { label: "Drill history", value: true },
      { label: "Screenshot upload", value: true },
      { label: "Priority support", value: false },
    ],
    cta: "monthly",
  },
  {
    id: "yearly",
    name: "Yearly",
    price: "$99.99",
    period: "/ year",
    description: "For the full prep cycle and retakes.",
    highlight: false,
    features: [
      { label: "Mistakes per month", value: "Unlimited" },
      { label: "Tailored drills", value: "Unlimited" },
      { label: "AI explanations", value: true },
      { label: "Spaced repetition", value: true },
      { label: "Analytics", value: true },
      { label: "Drill history", value: true },
      { label: "Screenshot upload", value: true },
      { label: "vs. monthly billing", value: "Save ~$140" },
    ],
    cta: "yearly",
  },
];

function FeatureRow({ label, value }: { label: string; value: string | boolean }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      {typeof value === "boolean" ? (
        value ? (
          <svg className="w-4 h-4 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      ) : (
        <span className="text-sm font-semibold text-navy">{value}</span>
      )}
    </div>
  );
}

function BillingContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<string>("free");
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("subscriptions")
        .select("status")
        .eq("user_id", user.id)
        .single()
        .then(({ data }) => {
          if (data) setStatus(data.status);
        });
    });
  }, []);

  async function handleSubscribe(planId: string) {
    setLoading(planId);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: planId }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else setLoading(null);
  }

  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-black text-navy">Billing</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          {status === "active" ? "You're on a paid plan." : "Upgrade to unlock everything."}
        </p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 text-sm font-medium">
          ✓ You&apos;re now subscribed! Welcome to the full experience.
        </div>
      )}
      {canceled && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-600 text-sm">
          Checkout canceled — you haven&apos;t been charged.
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-5">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`card p-6 flex flex-col ${
              plan.highlight ? "border-brand-600 border-2 shadow-card-hover" : ""
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-1">
              <h3 className="text-lg font-bold text-navy">{plan.name}</h3>
              {plan.badge && (
                <span className="bg-brand-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shrink-0">
                  {plan.badge}
                </span>
              )}
              {status === "active" && plan.cta && (
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0">
                  Active
                </span>
              )}
            </div>
            <p className="text-slate-400 text-xs mb-4">{plan.description}</p>

            {/* Price */}
            <div className="mb-5">
              <span className="text-4xl font-black text-navy">{plan.price}</span>
              <span className="text-slate-400 text-sm ml-1">{plan.period}</span>
            </div>

            {/* Feature comparison */}
            <div className="flex-1 mb-6">
              {plan.features.map((f) => (
                <FeatureRow key={f.label} label={f.label} value={f.value} />
              ))}
            </div>

            {/* CTA */}
            {plan.cta ? (
              status === "active" ? (
                <div className="py-3 text-center text-sm text-slate-400 font-medium border border-slate-100 rounded-full">
                  Current plan
                </div>
              ) : (
                <button
                  onClick={() => handleSubscribe(plan.cta!)}
                  disabled={loading === plan.cta}
                  className={`w-full py-3 rounded-full text-sm font-semibold transition-colors disabled:opacity-50 ${
                    plan.highlight
                      ? "bg-brand-600 text-white hover:bg-brand-700"
                      : "border border-slate-200 text-navy hover:bg-slate-50"
                  }`}
                >
                  {loading === plan.cta ? "Loading…" : `Get ${plan.name}`}
                </button>
              )
            ) : (
              <div className="py-3 text-center text-sm text-slate-400 font-medium border border-slate-100 rounded-full">
                {status === "free" ? "Current plan" : "Free tier"}
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-400 text-center">
        All plans include access to your drills and history forever. Cancel anytime.
      </p>
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="w-7 h-7 border-2 border-slate-200 border-t-brand-600 rounded-full animate-spin" /></div>}>
      <BillingContent />
    </Suspense>
  );
}
