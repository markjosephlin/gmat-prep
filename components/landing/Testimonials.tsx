const testimonials = [
  {
    quote:
      "This completely changed how I study. Instead of re-reading explanations, I actually practice until I master the concept.",
    name: "Sarah K.",
    score: "760 GMAT",
  },
  {
    quote:
      "The spaced repetition is genius. Data Sufficiency used to destroy me — now it's my strongest section.",
    name: "Michael T.",
    score: "740 GMAT",
  },
  {
    quote:
      "Finally an error log that actually works. It takes ten seconds to add a mistake and the drills are way better than re-reading.",
    name: "Priya R.",
    score: "755 GMAT",
  },
];

export default function Testimonials() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <div className="text-center mb-14">
        <p className="section-label mb-3">What students say</p>
        <h2 className="text-4xl font-black text-navy">
          Built for the test. Trusted by the people who beat it.
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div key={t.name} className="card p-6 flex flex-col gap-4">
            <span className="text-3xl font-serif text-slate-200 leading-none">&ldquo;&rdquo;</span>
            <p className="text-sm text-slate-600 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
            <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-50">
              <span className="font-bold text-navy text-sm">{t.name}</span>
              <span className="text-brand-600 font-semibold text-sm">{t.score}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
