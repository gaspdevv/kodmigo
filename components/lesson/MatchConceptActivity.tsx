"use client";

import type { StageTheme } from "@/components/dashboard/stageThemes";
import type { LessonStep } from "@/data/lessons";

type MatchConceptActivityProps = {
  step: LessonStep;
  theme: StageTheme;
  selectedAnswer: string | null;
  selections: Record<string, string>;
  feedbackState: "none" | "correct" | "incorrect";
  onSelectSingle: (answer: string) => void;
  onSelectPair: (concept: string, answer: string) => void;
};

export default function MatchConceptActivity({
  step,
  theme,
  selectedAnswer,
  selections,
  feedbackState,
  onSelectSingle,
  onSelectPair,
}: MatchConceptActivityProps) {
  const pairs = step.matchPairs ?? [];
  const options = step.options ?? [];

  if (pairs.length > 0) {
    return (
      <div className="mb-4 space-y-3">
        <div className="grid grid-cols-1 gap-2 text-xs font-semibold uppercase tracking-wide sm:grid-cols-2">
          <span className={theme.mutedText}>Kavram</span>
          <span className={`hidden sm:block ${theme.mutedText}`}>Açıklama</span>
        </div>
        {pairs.map((pair) => (
          <div
            key={pair.concept}
            className={`grid grid-cols-1 gap-3 rounded-2xl border p-3 sm:grid-cols-2 ${theme.cardBorder} ${theme.cardBackground}`}
          >
            <div>
              <p className={`mb-1 text-xs font-semibold uppercase tracking-wide sm:hidden ${theme.mutedText}`}>
                Kavram
              </p>
              <div
                className={`flex min-w-0 items-center rounded-xl border px-3 py-2 text-sm font-semibold break-words ${theme.cardBorder} ${theme.lessonAccentSoft} ${theme.primaryText}`}
              >
                {pair.concept}
              </div>
            </div>
            <div className="min-w-0">
              <p className={`mb-1 text-xs font-semibold uppercase tracking-wide sm:hidden ${theme.mutedText}`}>
                Açıklama
              </p>
              <select
                value={selections[pair.concept] ?? ""}
                disabled={feedbackState === "correct"}
                onChange={(event) => onSelectPair(pair.concept, event.target.value)}
                className={`w-full min-w-0 rounded-xl border px-3 py-2 text-sm outline-none transition ${theme.lessonFocusRing} ${theme.cardBorder} ${theme.cardBackground} ${theme.primaryText}`}
              >
              <option value="">Seç...</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mb-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div
          className={`rounded-2xl border-2 border-dashed p-4 ${theme.cardBorder} ${theme.lessonAccentSoft}`}
        >
          <p className={`mb-2 text-xs font-bold uppercase tracking-wide ${theme.migoAccent}`}>
            Kavram
          </p>
          <p className={`text-sm font-semibold leading-relaxed break-words ${theme.primaryText}`}>
            {step.content ?? step.title}
          </p>
        </div>
        <div className="space-y-2">
          <p className={`text-xs font-bold uppercase tracking-wide ${theme.mutedText}`}>
            Doğru açıklamayı seç
          </p>
          {options.map((option) => {
            const selected = selectedAnswer === option;
            const feedback =
              selected && feedbackState !== "none" ? feedbackState : "none";

            return (
              <button
                key={option}
                type="button"
                disabled={feedbackState === "correct"}
                onClick={() => onSelectSingle(option)}
                className={`w-full break-words rounded-xl border px-3 py-2.5 text-left text-sm transition ${
                  selected
                    ? `${theme.lessonAccentSelected} font-semibold ${theme.primaryText}`
                    : `${theme.cardBorder} ${theme.cardBackground} ${theme.mutedText} ${theme.lessonAccentHover}`
                } ${
                  feedback === "correct"
                    ? "border-emerald-400 bg-emerald-50"
                    : feedback === "incorrect"
                      ? "border-rose-400 bg-rose-50"
                      : ""
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
