const steps = [
  {
    icon: "✏️",
    color: "bg-blue-50",
    title: "Add the question you got wrong",
    description:
      "Paste the question text or describe it, then tell us why you think you missed it. A guess is fine.",
  },
  {
    icon: "🔍",
    color: "bg-purple-50",
    title: "We tell you where the gap is",
    description:
      "Claude pinpoints the specific micro-skill behind the mistake — not just the broad topic — so you know exactly what to fix.",
  },
  {
    icon: "🎯",
    color: "bg-green-50",
    title: "Practice variants that target the gap",
    description:
      "Fresh GMAT-style drills built around that exact concept, spaced out over time so the fix sticks.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-24">
      <div className="text-center mb-16">
        <p className="section-label mb-3">The mistake loop</p>
        <h2 className="text-4xl font-black text-navy">
          Don&apos;t just review. Target the concept instead.
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
