interface Props {
  letter: string;
  text: string;
  selected: boolean;
  correct?: boolean;
  wrong?: boolean;
  disabled: boolean;
  onClick: () => void;
}

export default function AnswerChoice({ letter, text, selected, correct, wrong, disabled, onClick }: Props) {
  let containerClass =
    "flex items-start gap-3 px-4 py-3 rounded-xl border text-sm cursor-pointer transition-all duration-150 ";

  if (wrong) {
    containerClass += "border-red-300 bg-red-50 text-red-800";
  } else if (correct) {
    containerClass += "border-green-400 bg-green-50 text-green-800";
  } else if (selected) {
    containerClass += "border-brand-500 bg-brand-50 text-navy";
  } else {
    containerClass += "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50";
  }

  if (disabled && !correct && !wrong) {
    containerClass += " opacity-50";
  }

  return (
    <button className={containerClass} onClick={onClick} disabled={disabled && !selected}>
      <span
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5 ${
          wrong
            ? "border-red-400 bg-red-400 text-white"
            : correct
            ? "border-green-500 bg-green-500 text-white"
            : selected
            ? "border-brand-600 bg-brand-600 text-white"
            : "border-slate-300 text-slate-500"
        }`}
      >
        {letter}
      </span>
      <span className="leading-relaxed text-left">{text}</span>
    </button>
  );
}
