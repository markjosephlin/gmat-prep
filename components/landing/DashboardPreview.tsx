export default function DashboardPreview() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-navy">See exactly where you&apos;re losing points.</h2>
        <p className="text-slate-500 mt-3 text-lg">
          Analytics that show patterns across all three GMAT sections.
        </p>
      </div>

      <div className="card p-8 max-w-3xl mx-auto">
        <p className="section-label mb-6">Study habits</p>
        <div className="grid grid-cols-3 gap-6 mb-8">
          {[
            { value: "7 days", label: "Current daily streak" },
            { value: "12", label: "Average drills per day" },
            { value: "4h 20m", label: "Time spent this week" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-black text-navy">{stat.value}</div>
              <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="mb-1 flex justify-between text-xs text-slate-500">
          <span>Weekly drills goal</span>
          <span className="font-semibold text-navy">67 / 100</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full w-[67%] bg-brand-600 rounded-full" />
        </div>

        <div className="mt-8 border-t border-slate-100 pt-6">
          <p className="text-sm font-semibold text-navy mb-4">Top weak concepts</p>
          <div className="flex flex-col gap-3">
            {[
              { name: "Data Sufficiency", section: "Data Insights", pct: 92, color: "bg-purple-100 text-purple-700" },
              { name: "Assumption questions", section: "Verbal", pct: 71, color: "bg-yellow-100 text-yellow-700" },
              { name: "Work & Rate problems", section: "Quantitative", pct: 58, color: "bg-blue-100 text-blue-700" },
              { name: "Inference questions", section: "Verbal", pct: 40, color: "bg-yellow-100 text-yellow-700" },
            ].map((concept) => (
              <div key={concept.name} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-navy font-medium">{concept.name}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${concept.color}`}>
                      {concept.section}
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-navy rounded-full"
                      style={{ width: `${concept.pct}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 bg-green-50 rounded-xl p-4 border border-green-100">
          <p className="section-label mb-1">This week&apos;s biggest pattern</p>
          <p className="text-sm text-slate-700">
            Gaps in <strong>Data Sufficiency</strong> are driving most of your misses.
            We&apos;ve queued 6 drills to target it.
          </p>
        </div>
      </div>
    </section>
  );
}
