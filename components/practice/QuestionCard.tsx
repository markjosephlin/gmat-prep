"use client";

import { useState } from "react";
import type { Question } from "@/types";
import AnswerChoice from "./AnswerChoice";
import ExplanationPanel from "./ExplanationPanel";

interface Props {
  question: Question;
  questionNumber: number;
  totalInSession: number;
  onNext: (wasCorrect: boolean, question: Question, userAnswer: string) => void;
}

export default function QuestionCard({ question, questionNumber, totalInSession, onNext }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [explanation, setExplanation] = useState<{
    why_correct: string;
    why_wrong: string;
    strategy: string;
    mistake_category: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const isCorrect = checked && selected === question.correct;

  async function handleCheck() {
    if (!selected || checked) return;
    setChecked(true);

    if (selected !== question.correct) {
      setLoading(true);
      try {
        const res = await fetch("/api/explain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            questionText: question.text,
            choices: question.choices,
            userAnswer: selected,
            correctAnswer: question.correct,
            concept: question.concept,
          }),
        });
        const data = await res.json();
        setExplanation(data.explanation);
      } catch {
        // show basic explanation from question data
      } finally {
        setLoading(false);
      }
    }
  }

  function handleNext() {
    onNext(isCorrect, question, selected ?? "");
    setSelected(null);
    setChecked(false);
    setExplanation(null);
  }

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {question.section} · {question.type}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-slate-500">Session in progress</span>
          </div>
          <span className="text-xs text-slate-400">
            {questionNumber} of {totalInSession}
          </span>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="mb-2">
          <span className="inline-block bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-full">
            {question.concept}
          </span>
        </div>
        <p className="text-navy font-medium leading-relaxed mb-6 text-[15px]">{question.text}</p>

        <div className="flex flex-col gap-2">
          {question.choices.map((choice) => (
            <AnswerChoice
              key={choice.letter}
              letter={choice.letter}
              text={choice.text}
              selected={selected === choice.letter}
              correct={checked ? choice.letter === question.correct : undefined}
              wrong={checked && selected === choice.letter && choice.letter !== question.correct}
              disabled={checked}
              onClick={() => !checked && setSelected(choice.letter)}
            />
          ))}
        </div>
      </div>

      {checked && (
        <ExplanationPanel
          isCorrect={isCorrect}
          correctAnswer={question.correct}
          baseExplanation={question.explanation}
          aiExplanation={explanation}
          loading={loading}
        />
      )}

      <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-400">Pick an answer, then check it.</span>
        <div className="flex gap-2">
          {!checked ? (
            <button
              onClick={handleCheck}
              disabled={!selected}
              className="bg-navy text-white text-sm font-semibold px-5 py-2 rounded-lg disabled:opacity-40 hover:bg-slate-800 transition-colors"
            >
              Check answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="bg-navy text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Next question →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
