"use client";

import { useState } from "react";
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

const SESSION_SIZE = 3;

export default function PracticePage() {
  const [sessionStarted, setSessionStarted] = useState(false);
  const [section, setSection] = useState<GmatSection>("Quantitative");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);
  const [targetedConcepts, setTargetedConcepts] = useState<string[]>([]);

  async function startSession() {
    setLoading(true);
    const userId = await getUserId();

    // Pull weak concepts from mistakes + drill history
    const [weakConcepts, mistakeConcepts] = await Promise.all([
      getWeakConcepts(userId),
      getMistakeConcepts(userId),
    ]);

    // Build a prioritised concept list for this section
    const sectionWeak = weakConcepts
      .filter((c) => c.section === section)
      .map((c) => c.concept);

    const sectionMistakes = mistakeConcepts
      .filter((c) => c.section === section)
      .map((c) => c.concept);

    // Merge: weak drill concepts first, then mistake concepts, then fallback to defaults
    const fallback = SECTION_CONCEPTS[section];
    const merged = [...new Set([...sectionWeak, ...sectionMistakes, ...fallback])];
    const conceptsToUse = merged.slice(0, SESSION_SIZE);
    setTargetedConcepts(sectionWeak.length > 0 ? conceptsToUse : []);

    const types = SECTION_TYPES[section];
    const requests = Array.from({ length: SESSION_SIZE }, (_, i) => {
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
      alert("Could not generate questions. Please check that your ANTHROPIC_API_KEY is set in .env.local and restart the server.");
      setLoading(false);
      return;
    }

    setQuestions(fetched);
    setCurrentIndex(0);
    setResults([]);
    setSessionStarted(true);
    setSessionDone(false);
    setLoading(false);
  }

  async function handleNext(wasCorrect: boolean, question: Question, userAnswer: string) {
    // Save the attempt to Supabase
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
    setResults(newResults);

    if (currentIndex + 1 >= questions.length) {
      setSessionDone(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }

  if (!sessionStarted && !loading) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-navy mb-1">Start a drill session</h1>
          <p className="text-slate-500 text-sm">
            Pick a section. If you have mistakes logged, we&apos;ll target your weak spots automatically.
          </p>
        </div>

        <div className="card p-6 flex flex-col gap-6">
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

          <button onClick={startSession} className="btn-primary justify-center py-3">
            Start session →
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-brand-600 rounded-full animate-spin" />
        <p className="text-slate-500 text-sm">Generating your {section} questions…</p>
      </div>
    );
  }

  if (sessionDone) {
    const correct = results.filter(Boolean).length;
    const total = questions.length;
    const pct = Math.round((correct / total) * 100);
    const missedQuestions = questions.filter((_, i) => results[i] === false);

    return (
      <div className="max-w-xl mx-auto flex flex-col gap-5">
        <div className="card p-8 text-center">
          <div className="text-5xl mb-4">{pct >= 80 ? "🎉" : pct >= 60 ? "💪" : "📚"}</div>
          <h2 className="text-2xl font-black text-navy mb-2">Session complete</h2>
          <p className="text-slate-500 mb-6">
            You got {correct} out of {total} correct ({pct}%)
          </p>
          <div className="flex gap-2">
            {results.map((r, i) => (
              <div key={i} className={`flex-1 h-2 rounded-full ${r ? "bg-green-400" : "bg-red-300"}`} />
            ))}
          </div>
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

        <button
          onClick={() => { setSessionStarted(false); setSessionDone(false); }}
          className="btn-secondary justify-center py-2.5"
        >
          New session
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-sm font-semibold text-slate-500">{section} · Session</h1>
          {targetedConcepts.length > 0 && (
            <p className="text-xs text-brand-600 font-medium mt-0.5">
              Targeting your weak spots
            </p>
          )}
        </div>
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

      <QuestionCard
        question={currentQuestion}
        questionNumber={currentIndex + 1}
        totalInSession={questions.length}
        onNext={handleNext}
      />
    </div>
  );
}
