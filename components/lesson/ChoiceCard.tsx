import type { StageTheme } from "@/components/dashboard/stageThemes";

type ChoiceCardProps = {
  label: string;
  selected: boolean;
  disabled: boolean;
  feedbackResult: "none" | "correct" | "incorrect";
  onSelect: () => void;
  theme: StageTheme;
};

export default function ChoiceCard({
  label,
  selected,
  disabled,
  feedbackResult,
  onSelect,
  theme,
}: ChoiceCardProps) {
  let stateClasses = theme.lessonChoiceDefault;

  if (selected && feedbackResult === "correct") {
    stateClasses =
      "border-2 border-emerald-500 bg-emerald-50 text-emerald-900 shadow-md shadow-emerald-200/50 scale-[1.02]";
  } else if (selected && feedbackResult === "incorrect") {
    stateClasses =
      "border-2 border-rose-400 bg-rose-50 text-rose-900 shadow-md shadow-rose-200/50";
  } else if (selected) {
    stateClasses = theme.lessonChoiceSelected;
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={`w-full break-words rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all duration-200 ${stateClasses} ${
        disabled && !selected
          ? "cursor-not-allowed opacity-60"
          : "cursor-pointer"
      }`}
    >
      {label}
    </button>
  );
}
