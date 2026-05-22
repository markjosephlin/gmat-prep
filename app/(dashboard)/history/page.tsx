"use client";

import { useEffect, useState } from "react";
import { getDrillHistory } from "@/lib/db";
import { getUserId } from "@/lib/userId";
import Link from "next/link";

const sectionColor: Record<string, string> = {
  Quantitative: "bg-blue-100 text-blue-700",
  Verbal: "bg-yellow-100 text-yellow-700",
  "Data Insights": "bg-purple-100 text-purple-700",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserId().then((id) => getDrillHistory(id)).then((data) => {
      setHistory(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-black text-navy">History</h1>
        <p className="text-slate-500 text-sm mt-0.5">All your drill attempts, most recent first.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-7 h-7 border-2 border-slate-200 border-t-brand-600 rounded-full animate-spin" />
        </div>
      ) : history.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-3xl mb-3">📝</p>
          <p className="font-bold text-navy mb-1">No history yet</p>
          <p className="text-slate-500 text-sm mb-4">Complete a drill session and it&apos;ll show up here.</p>
          <Link href="/practice" className="btn-primary">Start drilling →</Link>
        </div>
      ) : (
        <div className="card divide-y divide-slate-100">
          {history.map((item) => (
            <div key={item.id} className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-4">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${item.is_correct ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>
                  {item.is_correct ? "✓" : "✗"}
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy">{item.concept}</p>
                  <p className="text-xs text-slate-400">{item.question?.type ?? "Drill"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${sectionColor[item.section] ?? "bg-slate-100 text-slate-600"}`}>
                  {item.section}
                </span>
                <span className="text-xs text-slate-400">{timeAgo(item.created_at)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
