import Link from "next/link";

const plans = [
  {
    name: "Free",
    tagline: "Try the loop on your next 15 mistakes.",
    price: "$0",
    period: "forever",
    features: ["15 mistakes", "~60 tailored drills", "Spaced-repetition scheduling", "Keep your drills after the period ends"],
    cta: "Get started free",
    ctaHref: "/practice",
    highlight: false,
  },
  {
    name: "Monthly",
    tagline: "For the month of a full-time study sprint.",
    price: "$19",
    period: "/ month",
    badge: "Most popular",
    features: ["200 mistakes / month", "~800 tailored drills", "Full analytics on weaknesses", "Cancel anytime"],
    cta: "Start monthly",
    ctaHref: "/practice",
    highlight: true,
  },
  {
    name: "Yearly",
    tagline: "For the full prep cycle and retakes.",
    price: "$99",
    period: "/ year",
    features: ["2,000 mistakes / year", "~8,000 tailored drills", "Full analytics on weaknesses", "Lowest effective price per drill"],
    cta: "Start yearly",
    ctaHref: "/practice",
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="max-w-6xl mx-auto px-6 py-24">
      <div className="text-center mb-14">
        <p className="section-label mb-3">Pricing</p>
        <h2 className="text-4xl font-black text-navy">Start free. Upgrade when the loop clicks.</h2>
        <p className="text-slate-500 mt-3 max-w-lg mx-auto">
          Every plan generates ~4 drills per mistake. Access to your drills and analytics never expires.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`card p-7 flex flex-col ${
              plan.highlight ? "border-brand-600 border-2 shadow-card-hover" : ""
            }`}
          >
            <div className="flex items-start justify-between mb-1">
              <h3 className="text-xl font-bold text-navy">{plan.name}</h3>
              {plan.badge && (
                <span className="bg-brand-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  {plan.badge}
                </span>
              )}
            </div>
            <p className="text-slate-500 text-sm mb-6">{plan.tagline}</p>

            <div className="mb-7">
              <span className="text-4xl font-black text-navy">{plan.price}</span>
              <span className="text-slate-500 text-sm ml-1">{plan.period}</span>
            </div>

            <ul className="flex flex-col gap-2.5 mb-8 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                  <svg className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href={plan.ctaHref}
              className={plan.highlight ? "btn-primary justify-center py-3" : "btn-secondary justify-center py-3"}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
