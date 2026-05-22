"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getWeakConcepts, getDrillStats } from "@/lib/db";
import { getUserId } from "@/lib/userId";
import type { WeakConcept } from "@/types";

const sectionColor: Record<string, string> = {
  Quantitative: "bg-blue-100 text-blue-700",
  Verbal: "bg-yellow-100 text-yellow-700",
  "Data Insights": "bg-purple-100 text-purple-700",
};

export default function DashboardPage() {
  const [weakConcepts, setWeakConcepts] = useState<WeakConcept[]>([]);
  const [stats, setStats] = useState({ total: 0, correct: 0, todayCount: 0, weekCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = await getUserId();
    Promise.all([getWeakConcepts(userId), getDrillStats(userId)]).then(
      ([concepts, drillStats]) => {
        setWeakConcepts(concepts.slice(0, 5));
        setStats(drillStats);
        setLoading(false);
      }
    );
  }, []);

  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
  const weeklyGoal = 50;
  const weekPct = Math.min(Math.round((stats.weekCount / weeklyGoal) * 100), 100);
  const topWeakConcept = weakConcepts[0];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-black text-navy">Analytics</h1>
        <p className="text-slate-500 text-sm mt-0.5">See exactly where you&apos;re losing points.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-7 h-7 border-2 border-slate-200 border-t-brand-600 rounded-full animate-spin" />
        </div>
      ) : stats.total === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-3xl mb-3">📊</p>
          <p className="font-bold text-navy mb-1">No data yet</p>
          <p className="text-slate-500 text-sm mb-4">Complete a drill session to start seeing your analytics.</p>
          <Link href="/practice" className="btn-primary">Start drilling →</Link>
        </div>
      ) : (
        <>
          {/* Stats row */}
          <div className="card p-6">
            <p className="section-label mb-5">Study habits</p>
            <div className="grid grid-cols-3 gap-6 mb-6">
              {[
                { value: `${stats.todayCount}`, label: "Drills today" },
                { value: `${stats.weekCount}`, label: "Drills this week" },
                { value: `${accuracy}%`, label: "Overall accuracy" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl font-black text-navy">{stat.value}</div>
                  <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
              <span>Weekly drills goal</span>
              <span className="font-semibold text-navy">{stats.weekCount} / {weeklyGoal}</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand-600 rounded-full transition-all" style={{ width: `${weekPct}%` }} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Weak concepts */}
            <div className="card p-6">
              <p className="text-sm font-bold text-navy mb-4">Top weak concepts</p>
              {weakConcepts.length === 0 ? (
                <p className="text-sm text-slate-400">No concept data yet — keep drilling!</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {weakConcepts.map((concept) => (
                    <div key={concept.concept}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-navy font-medium">{concept.concept}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${sectionColor[concept.section] ?? "bg-slate-100 text-slate-600"}`}>
                          {concept.section}
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-navy rounded-full" style={{ width: `${concept.accuracy}%` }} />
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">{concept.accuracy}% accuracy · {concept.attempts} attempts</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="card p-6 flex flex-col gap-4">
              <p className="text-sm font-bold text-navy">Overall progress</p>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Total drills completed</span>
                  <span className="font-bold text-navy">{stats.total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Correct answers</span>
                  <span className="font-bold text-green-600">{stats.correct}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Incorrect answers</span>
                  <span className="font-bold text-red-500">{stats.total - stats.correct}</span>
                </div>
              </div>
            </div>
          </div>

          {topWeakConcept && (
            <div className="card p-5 bg-brand-50 border-brand-100">
              <p className="section-label mb-1">This week&apos;s biggest pattern</p>
              <p className="text-sm text-slate-700">
                Gaps in <strong>{topWeakConcept.concept}</strong> are driving most of your misses at{" "}
                {topWeakConcept.accuracy}% accuracy.{" "}
                <Link href="/practice" className="text-brand-600 font-semibold hover:underline">
                  Start drilling →
                </Link>
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
