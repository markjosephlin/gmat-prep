"use client";

import { useState, useEffect, useRef } from "react";
import QuestionCard from "@/components/practice/QuestionCard";
import type { Question, GmatSection, QuestionType } from "@/types";
import { getWeakConcepts, getMistakeConcepts, saveDrillAttempt } from "@/lib/db";
import { getUserId } from "@/lib/userId";

const SECTION_TYPES: Record<GmatSection, QuestionType[]> = {
  Quantitative: ["Problem Solving", "Data Sufficiency"],
  Verbal: ["Critical Reasoning", "Reading Comprehension"],
  "Data Insights": ["Data Sufficiency", "Two-Part Analysis", "Table Analysis", "Graphics Interpretation"],
};

const SECTION_CONCEPTS: Record<GmatSection, string[]> = {
  Quantitative: ["Algebra", "Arithmetic", "Number Properties", "Word Problems", "Geometry", "Ratios & Proportions", "Percentages"],
  Verbal: ["Main Idea", "Inference", "Strengthen/Weaken", "Assumption", "Flaw", "Parallelism"],
  "Data Insights": ["Data Sufficiency", "Table Interpretation", "Graph Reading", "Two-Part Algebra", "Percentage Change"],
};

const QUESTION_COUNTS = [5, 10, 15, 20];
const TIME_LIMITS: { label: string; value: number | null }[] = [
  { label: "No limit", value: null },
  { label: "5 min", value: 5 },
  { label: "10 min", value: 10 },
  { label: "15 min", value: 15 },
  { label: "20 min", value: 20 },
  { label: "30 min", value: 30 },
];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function PracticePage() {
  const [sessionStarted, setSessionStarted] = useState(false);
  const [section, setSection] = useState<GmatSection>("Quantitative");
  const [numQuestions, setNumQuestions] = useState(5);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);
  const [targetedConcepts, setTargetedConcepts] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resultsRef = useRef<boolean[]>([]);

  // Clear topics when section changes
  useEffect(() => {
    setSelectedTopics([]);
  }, [section]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      setTimedOut(true);
      setSessionDone(true);
      return;
    }
    timerRef.current = setTimeout(() => {
      setTimeLeft((t) => (t !== null ? t - 1 : null));
    }, 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft]);

  function toggleTopic(topic: string) {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  }

  async function startSession() {
    setLoading(true);
    const userId = await getUserId();

    const [weakConcepts, mistakeConcepts] = await Promise.all([
      getWeakConcepts(userId),
      getMistakeConcepts(userId),
    ]);

    const sectionWeak = weakConcepts.filter((c) => c.section === section).map((c) => c.concept);
    const sectionMistakes = mistakeConcepts.filter((c) => c.section === section).map((c) => c.concept);

    const base = selectedTopics.length > 0 ? selectedTopics : SECTION_CONCEPTS[section];
    const merged = [...new Set([...sectionWeak, ...sectionMistakes, ...base])];
    const conceptsToUse = merged.slice(0, numQuestions);
    setTargetedConcepts(sectionWeak.length > 0 && selectedTopics.length === 0 ? conceptsToUse : []);

    const types = SECTION_TYPES[section];
    const requests = Array.from({ length: numQuestions }, (_, i) => {
      const type = types[i % types.length];
      const concept = conceptsToUse[i % conceptsToUse.length];
      return fetch("/api/generate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, type, concept, difficulty: "medium" }),
      })
        .then((res) => res.json())
        .then((data) => ({ ...data.question, id: `q-${i}-${Date.now()}` } as Question))
        .catch(() => null);
    });

    const resolved = await Promise.all(requests);
    const fetched = resolved.filter(
      (q): q is Question => !!q && Array.isArray(q.choices) && q.choices.length > 0
    );

    if (fetched.length === 0) {
      alert("Could not generate questions. Please try again.");
      setLoading(false);
      return;
    }

    resultsRef.current = [];
    setQuestions(fetched);
    setCurrentIndex(0);
    setResults([]);
    setSessionStarted(true);
    setSessionDone(false);
    setTimedOut(false);

    if (timeLimitMinutes !== null) {
      setTimeLeft(timeLimitMinutes * 60);
    } else {
      setTimeLeft(null);
    }

    setLoading(false);
  }

  async function handleNext(wasCorrect: boolean, question: Question, userAnswer: string) {
    await saveDrillAttempt({
      userId: await getUserId(),
      question,
      userAnswer,
      correctAnswer: question.correct,
      isCorrect: wasCorrect,
      section: question.section,
      concept: question.concept,
    });

    const newResults = [...results, wasCorrect];
    resultsRef.current = newResults;
    setResults(newResults);

    if (currentIndex + 1 >= questions.length) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setTimeLeft(null);
      setSessionDone(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }

  function resetSession() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setTimeLeft(null);
    setSessionStarted(false);
    setSessionDone(false);
    setTimedOut(false);
  }

  // ── Setup screen ──────────────────────────────────────────────────
  if (!sessionStarted && !loading) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-navy mb-1">Start a drill session</h1>
          <p className="text-slate-500 text-sm">
            Customize your session. We&apos;ll target your weak spots automatically unless you pick specific topics.
          </p>
        </div>

        <div className="card p-6 flex flex-col gap-6">
          {/* Section */}
          <div>
            <label className="text-sm font-semibold text-navy mb-3 block">Section</label>
            <div className="grid grid-cols-3 gap-2">
              {(["Quantitative", "Verbal", "Data Insights"] as GmatSection[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSection(s)}
                  className={`py-2.5 px-3 rounded-xl text-sm font-medium border transition-all ${
                    section === s
                      ? "border-brand-600 bg-brand-50 text-brand-700"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Number of questions */}
          <div>
            <label className="text-sm font-semibold text-navy mb-3 block">Number of questions</label>
            <div className="grid grid-cols-4 gap-2">
              {QUESTION_COUNTS.map((n) => (
                <button
                  key={n}
                  onClick={() => setNumQuestions(n)}
                  className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${
                    numQuestions === n
                      ? "border-brand-600 bg-brand-50 text-brand-700"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Topics */}
          <div>
            <label className="text-sm font-semibold text-navy mb-1 block">Topics</label>
            <p className="text-xs text-slate-400 mb-3">Leave blank to auto-target your weak spots</p>
            <div className="flex flex-wrap gap-2">
              {SECTION_CONCEPTS[section].map((topic) => (
                <button
                  key={topic}
                  onClick={() => toggleTopic(topic)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    selectedTopics.includes(topic)
                      ? "border-brand-600 bg-brand-50 text-brand-700"
                      : "border-slate-200 text-slate-500 hover:border-slate-300"
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Time limit */}
          <div>
            <label className="text-sm font-semibold text-navy mb-3 block">Time limit</label>
            <div className="grid grid-cols-3 gap-2">
              {TIME_LIMITS.map(({ label, value }) => (
                <button
                  key={label}
                  onClick={() => setTimeLimitMinutes(value)}
                  className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${
                    timeLimitMinutes === value
                      ? "border-brand-600 bg-brand-50 text-brand-700"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <button onClick={startSession} className="btn-primary justify-center py-3">
            Start session →
          </button>
        </div>
      </div>
    );
  }

  // ── Loading screen ────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-brand-600 rounded-full animate-spin" />
        <p className="text-slate-500 text-sm">Generating your {numQuestions} {section} questions…</p>
        <p className="text-xs text-slate-400">This takes about {numQuestions * 2} seconds</p>
      </div>
    );
  }

  // ── Results screen ────────────────────────────────────────────────
  if (sessionDone) {
    const correct = results.filter(Boolean).length;
    const total = results.length;
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    const missedQuestions = questions.filter((_, i) => results[i] === false);

    return (
      <div className="max-w-xl mx-auto flex flex-col gap-5">
        <div className="card p-8 text-center">
          <div className="text-5xl mb-4">
            {timedOut ? "⏱️" : pct >= 80 ? "🎉" : pct >= 60 ? "💪" : "📚"}
          </div>
          <h2 className="text-2xl font-black text-navy mb-2">
            {timedOut ? "Time's up!" : "Session complete"}
          </h2>
          <p className="text-slate-500 mb-6">
            {timedOut
              ? `Time ran out — ${correct} of ${total} answered correctly (${pct}%)`
              : `You got ${correct} out of ${total} correct (${pct}%)`}
          </p>
          {total > 0 && (
            <div className="flex gap-2">
              {results.map((r, i) => (
                <div key={i} className={`flex-1 h-2 rounded-full ${r ? "bg-green-400" : "bg-red-300"}`} />
              ))}
            </div>
          )}
        </div>

        {missedQuestions.length > 0 && (
          <div className="flex flex-col gap-3">
            <p className="section-label">Questions you missed</p>
            {missedQuestions.map((q) => (
              <div key={q.id} className="card p-4 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    {q.section} · {q.concept}
                  </p>
                  <p className="text-sm text-navy line-clamp-2">{q.text}</p>
                </div>
                <a
                  href={`/mistakes?q=${encodeURIComponent(q.text)}`}
                  className="btn-primary shrink-0 text-xs py-2 px-3"
                >
                  Add to log →
                </a>
              </div>
            ))}
          </div>
        )}

        <button onClick={resetSession} className="btn-secondary justify-center py-2.5">
          New session
        </button>
      </div>
    );
  }

  // ── Active session ────────────────────────────────────────────────
  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return null;

  const timerWarning = timeLeft !== null && timeLeft <= 60;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-sm font-semibold text-slate-500">{section} · Session</h1>
          {targetedConcepts.length > 0 && (
            <p className="text-xs text-brand-600 font-medium mt-0.5">Targeting your weak spots</p>
          )}
        </div>
        <div className="flex items-center gap-4">
          {timeLeft !== null && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold transition-colors ${
              timerWarning ? "bg-red-100 text-red-600 animate-pulse" : "bg-slate-100 text-slate-600"
            }`}>
              ⏱ {formatTime(timeLeft)}
            </div>
          )}
          <div className="flex gap-1">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`w-6 h-1.5 rounded-full ${
                  i < results.length
                    ? results[i] ? "bg-green-400" : "bg-red-300"
                    : i === currentIndex ? "bg-brand-600" : "bg-slate-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <QuestionCard
        question={currentQuestion}
        questionNumber={currentIndex + 1}
        totalInSession={questions.length}
        onNext={handleNext}
      />
    </div>
  );
}
