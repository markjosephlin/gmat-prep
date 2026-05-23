"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { saveMistake } from "@/lib/db";
import { getUserId } from "@/lib/userId";

type Step = "input" | "analyzing" | "result";
type InputMode = "text" | "screenshot";

interface Analysis {
  section: string;
  type: string;
  concept: string;
  mistake_category: string;
  analysis: string;
  drill_focus: string;
}

function MistakesContent() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>("input");
  const [inputMode, setInputMode] = useState<InputMode>("text");
  const [questionText, setQuestionText] = useState(searchParams.get("q") ?? "");
  const [userReason, setUserReason] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMediaType, setImageMediaType] = useState<string>("image/png");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [drillsQueued, setDrillsQueued] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setQuestionText(q);
      setInputMode("text");
    }
  }, [searchParams]);

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageMediaType(file.type as string);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setImagePreview(result);
      // Strip the data:image/...;base64, prefix
      setImageBase64(result.split(",")[1]);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit() {
    const hasText = questionText.trim().length > 0;
    const hasImage = !!imageBase64;
    if (!hasText && !hasImage) return;
    setStep("analyzing");

    try {
      const res = await fetch("/api/analyze-mistake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionText: hasText ? questionText : "",
          userReason,
          imageBase64: hasImage ? imageBase64 : undefined,
          imageMediaType,
        }),
      });
      const data = await res.json();
      setAnalysis(data.analysis);
      setStep("result");
    } catch {
      setStep("input");
    }
  }

  function reset() {
    setStep("input");
    setQuestionText("");
    setUserReason("");
    setImagePreview(null);
    setImageBase64(null);
    setAnalysis(null);
    setDrillsQueued(false);
  }

  if (step === "analyzing") {
    return (
      <div className="max-w-xl mx-auto flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-brand-600 rounded-full animate-spin" />
        <p className="text-slate-500 text-sm">Analyzing your mistake…</p>
        <p className="text-xs text-slate-400">Pinpointing the exact concept gap</p>
      </div>
    );
  }

  if (step === "result" && analysis) {
    const categoryColors: Record<string, string> = {
      "Knowledge Gap": "bg-red-100 text-red-700",
      Misread: "bg-orange-100 text-orange-700",
      "Reasoning Error": "bg-yellow-100 text-yellow-700",
      Computation: "bg-blue-100 text-blue-700",
      "Time Pressure": "bg-purple-100 text-purple-700",
    };

    return (
      <div className="max-w-xl mx-auto flex flex-col gap-5">
        <div>
          <h1 className="text-2xl font-black text-navy">Mistake analyzed</h1>
          <p className="text-slate-500 text-sm mt-0.5">Here&apos;s what we found and what&apos;s next.</p>
        </div>

        <div className="card p-6 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">
                {analysis.section} · {analysis.type}
              </p>
              <p className="text-lg font-bold text-navy">{analysis.concept}</p>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${categoryColors[analysis.mistake_category] ?? "bg-slate-100 text-slate-600"}`}>
              {analysis.mistake_category}
            </span>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <p className="text-sm font-semibold text-navy mb-1.5">What&apos;s going on</p>
            <p className="text-sm text-slate-600 leading-relaxed">{analysis.analysis}</p>
          </div>

          <div className="bg-brand-50 border border-brand-100 rounded-xl p-4">
            <p className="section-label mb-1">Drills queued</p>
            <p className="text-sm text-slate-700">{analysis.drill_focus}</p>
          </div>
        </div>

        {!drillsQueued ? (
          <button
            onClick={async () => {
              await saveMistake({
                userId: await getUserId(),
                questionText: questionText || "Screenshot upload",
                section: analysis.section,
                type: analysis.type,
                concept: analysis.concept,
                mistakeCategory: analysis.mistake_category,
                claudeAnalysis: analysis.analysis,
                drillFocus: analysis.drill_focus,
              });
              setDrillsQueued(true);
            }}
            className="btn-primary justify-center py-3"
          >
            Queue 4 targeted drills →
          </button>
        ) : (
          <div className="card p-5 text-center">
            <p className="text-green-600 font-semibold text-sm mb-1">✓ 4 drills added to your queue</p>
            <p className="text-xs text-slate-500">They&apos;ll appear in your Drills tab, spaced out for retention.</p>
          </div>
        )}

        <button onClick={reset} className="btn-secondary justify-center py-2.5">
          Add another mistake
        </button>
      </div>
    );
  }

  const canSubmit = inputMode === "text" ? questionText.trim().length > 0 : !!imageBase64;

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-black text-navy">Add a mistake</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Add a question you got wrong and we&apos;ll generate drills targeting the exact concept.
        </p>
      </div>

      <div className="card p-6 flex flex-col gap-5">
        {/* Toggle */}
        <div className="flex rounded-xl border border-slate-200 p-1 gap-1">
          <button
            onClick={() => setInputMode("text")}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              inputMode === "text" ? "bg-navy text-white" : "text-slate-500 hover:text-navy"
            }`}
          >
            Paste text
          </button>
          <button
            onClick={() => setInputMode("screenshot")}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              inputMode === "screenshot" ? "bg-navy text-white" : "text-slate-500 hover:text-navy"
            }`}
          >
            Upload screenshot
          </button>
        </div>

        {inputMode === "text" ? (
          <div>
            <label className="text-sm font-semibold text-navy mb-2 block">
              Question you got wrong
            </label>
            <textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Paste the question text here…"
              rows={5}
              className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
            />
          </div>
        ) : (
          <div>
            <label className="text-sm font-semibold text-navy mb-2 block">Screenshot of the question</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            {imagePreview ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-200">
                <Image src={imagePreview} alt="Uploaded question" width={600} height={400} className="w-full h-auto object-contain" />
                <button
                  onClick={() => { setImagePreview(null); setImageBase64(null); }}
                  className="absolute top-2 right-2 bg-white rounded-full w-7 h-7 flex items-center justify-center shadow text-slate-500 hover:text-red-500 text-sm font-bold"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center gap-2 hover:border-brand-400 hover:bg-brand-50 transition-all"
              >
                <span className="text-2xl">📸</span>
                <span className="text-sm font-semibold text-slate-600">Click to upload a screenshot</span>
                <span className="text-xs text-slate-400">PNG, JPG supported</span>
              </button>
            )}
          </div>
        )}

        <div>
          <label className="text-sm font-semibold text-navy mb-2 block">
            Why do you think you missed it?{" "}
            <span className="text-slate-400 font-normal">(optional — a guess is fine)</span>
          </label>
          <textarea
            value={userReason}
            onChange={(e) => setUserReason(e.target.value)}
            placeholder="e.g. I didn't know the formula, I misread the question, I ran out of time…"
            rows={3}
            className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="btn-primary justify-center py-3 disabled:opacity-40"
        >
          Analyze mistake →
        </button>
      </div>
    </div>
  );
}

export default function MistakesPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="w-7 h-7 border-2 border-slate-200 border-t-brand-600 rounded-full animate-spin" /></div>}>
      <MistakesContent />
    </Suspense>
  );
}
