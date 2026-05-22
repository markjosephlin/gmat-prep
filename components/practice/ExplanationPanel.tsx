import type { ReactNode } from "react";

interface Props {
  isCorrect: boolean;
  correctAnswer: string;
  baseExplanation: string;
  aiExplanation: {
    why_correct: string;
    why_wrong: string;
    strategy: string;
    mistake_category: string;
  } | null;
  loading: boolean;
}

function renderMarkdown(text: string): ReactNode[] {
  return text.split("\n").map((line, lineIdx) => {
    const parts: ReactNode[] = [];
    const regex = /\*\*(.+?)\*\*|\*(.+?)\*/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(line.slice(lastIndex, match.index));
      }
      if (match[1] !== undefined) {
        parts.push(<strong key={match.index}>{match[1]}</strong>);
      } else if (match[2] !== undefined) {
        parts.push(<em key={match.index}>{match[2]}</em>);
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < line.length) {
      parts.push(line.slice(lastIndex));
    }

    const isListItem = line.trimStart().startsWith("- ");
    const content = isListItem ? parts.slice(1) : parts;

    return isListItem ? (
      <li key={lineIdx} className="ml-4 list-disc">{content}</li>
    ) : (
      <span key={lineIdx} className="block">{parts}</span>
    );
  });
}

export default function ExplanationPanel({
  isCorrect,
  correctAnswer,
  baseExplanation,
  aiExplanation,
  loading,
}: Props) {
  if (isCorrect) {
    return (
      <div className="mx-6 mb-4 bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-green-600 font-bold text-sm">✓ Correct!</span>
        </div>
        <div className="text-sm text-slate-600 leading-relaxed">{renderMarkdown(baseExplanation)}</div>
      </div>
    );
  }

  return (
    <div className="mx-6 mb-4 bg-red-50 border border-red-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-red-600 font-bold text-sm">✗ Incorrect — correct answer: {correctAnswer}</span>
        {aiExplanation && (
          <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-2.5 py-1 rounded-full">
            {aiExplanation.mistake_category}
          </span>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <div className="w-3 h-3 border-2 border-slate-300 border-t-brand-600 rounded-full animate-spin" />
          Analyzing your mistake…
        </div>
      )}

      {aiExplanation && !loading && (
        <div className="flex flex-col gap-3 text-sm">
          <div>
            <p className="font-semibold text-slate-700 mb-0.5">Why {correctAnswer} is correct</p>
            <div className="text-slate-600 leading-relaxed">{renderMarkdown(aiExplanation.why_correct)}</div>
          </div>
          <div>
            <p className="font-semibold text-slate-700 mb-0.5">Why your answer was wrong</p>
            <div className="text-slate-600 leading-relaxed">{renderMarkdown(aiExplanation.why_wrong)}</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-red-100">
            <p className="font-semibold text-slate-700 mb-0.5">Strategy to remember</p>
            <div className="text-slate-600 leading-relaxed">{renderMarkdown(aiExplanation.strategy)}</div>
          </div>
        </div>
      )}

      {!aiExplanation && !loading && (
        <div className="text-sm text-slate-600 leading-relaxed">{renderMarkdown(baseExplanation)}</div>
      )}
    </div>
  );
}
