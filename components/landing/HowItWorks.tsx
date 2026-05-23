const steps = [
  {
    icon: "🎯",
    color: "bg-green-50",
    title: "Drill on what actually matters",
    description:
      "Jump straight into fresh GMAT-style questions across Quant, Verbal, and Data Insights — no setup needed.",
  },
  {
    icon: "🔍",
    color: "bg-purple-50",
    title: "Log a mistake and we find the gap",
    description:
      "Got a question wrong? Paste it or upload a screenshot. Claude pinpoints the exact concept behind the miss so you know what to fix.",
  },
  {
    icon: "📈",
    color: "bg-blue-50",
    title: "Your drills adapt as you improve",
    description:
      "Every session gets smarter. The more you practice, the more your drills zero in on your weakest concepts — spaced out so the fix sticks.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-24">
      <div className="text-center mb-16">
        <p className="section-label mb-3">How it works</p>
        <h2 className="text-4xl font-black text-navy">
          Built for every stage of your prep.
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step) => (
          <div key={step.title} className="flex flex-col items-center text-center">
            <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center text-2xl mb-5`}>
              {step.icon}
            </div>
            <h3 className="text-lg font-bold text-navy mb-3">{step.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
