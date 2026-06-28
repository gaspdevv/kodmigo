"use client";

import { useMemo } from "react";
import type { StageTheme } from "@/components/dashboard/stageThemes";

type CodeOrderActivityProps = {
  lessonId: string;
  stepId: string;
  lines: string[];
  orderedLines: string[];
  feedbackState: "none" | "correct" | "incorrect";
  theme: StageTheme;
  onReorder: (lines: string[]) => void;
};

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) || 1;
}

function shuffleLines(seed: string, lines: string[]): string[] {
  const result = [...lines];
  let state = hashSeed(seed);

  const nextRandom = () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0xffffffff;
  };

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(nextRandom() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

export function getInitialCodeOrderLines(
  lessonId: string,
  stepId: string,
  lines: string[],
): string[] {
  const shuffled = shuffleLines(`${lessonId}:${stepId}`, lines);
  if (shuffled.join("\n") === lines.join("\n") && lines.length > 1) {
    return [...lines].reverse();
  }
  return shuffled;
}

export default function CodeOrderActivity({
  lessonId,
  stepId,
  lines,
  orderedLines,
  feedbackState,
  theme,
  onReorder,
}: CodeOrderActivityProps) {
  const displayLines = useMemo(() => {
    if (orderedLines.length > 0) return orderedLines;
    return getInitialCodeOrderLines(lessonId, stepId, lines);
  }, [lessonId, stepId, lines, orderedLines]);

  const moveLine = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= displayLines.length) return;

    const next = [...displayLines];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    onReorder(next);
  };

  return (
    <div className="mb-4 space-y-2">
      <p className={`text-xs font-semibold uppercase tracking-wide ${theme.mutedText}`}>
        Satırları doğru sıraya getir
      </p>
      {displayLines.map((line, index) => (
        <div
          key={`${line}-${index}`}
          className={`flex items-start gap-2 rounded-xl border px-3 py-2.5 font-mono text-sm ${theme.cardBorder} ${
            feedbackState === "correct"
              ? "border-emerald-400 bg-emerald-50/70"
              : feedbackState === "incorrect"
                ? "border-rose-300 bg-rose-50/50"
                : theme.cardBackground
          }`}
        >
          <span
            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${theme.migoAccent} ${theme.lessonAccentBadge}`}
          >
            {index + 1}
          </span>
          <code className={`min-w-0 flex-1 break-all ${theme.primaryText}`}>{line}</code>
          <div className="flex shrink-0 flex-col gap-1">
            <button
              type="button"
              disabled={index === 0 || feedbackState === "correct"}
              onClick={() => moveLine(index, -1)}
              className={`rounded-md border px-2 py-0.5 text-xs ${theme.cardBorder} disabled:opacity-40`}
              aria-label="Yukarı taşı"
            >
              ↑
            </button>
            <button
              type="button"
              disabled={
                index === displayLines.length - 1 || feedbackState === "correct"
              }
              onClick={() => moveLine(index, 1)}
              className={`rounded-md border px-2 py-0.5 text-xs ${theme.cardBorder} disabled:opacity-40`}
              aria-label="Aşağı taşı"
            >
              ↓
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
