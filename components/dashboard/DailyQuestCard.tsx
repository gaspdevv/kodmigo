"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getDashboardTheme } from "@/components/dashboard/getDashboardTheme";
import {
  buildLearnPythonHref,
  getNextPythonLesson,
} from "@/data/pythonPath";
import { getEffectiveCompletedLessonIds } from "@/lib/progress";
import { playClickSound } from "@/lib/sounds";
import { getStreakProgress, hasCompletedToday } from "@/lib/streak";

const QUEST_TOTAL = 1;

export default function DailyQuestCard() {
  const theme = getDashboardTheme();
  const [isReady, setIsReady] = useState(false);
  const [isCompletedToday, setIsCompletedToday] = useState(false);
  const [nextLessonSlug, setNextLessonSlug] = useState<string | null>(null);

  useEffect(() => {
    const streak = getStreakProgress();
    const nextLesson = getNextPythonLesson(getEffectiveCompletedLessonIds());

    setIsCompletedToday(hasCompletedToday(streak));
    setNextLessonSlug(nextLesson?.slug ?? null);
    setIsReady(true);
  }, []);

  if (!isReady) {
    return (
      <section
        className={`mb-4 rounded-3xl border p-5 ${theme.cardBackground} ${theme.cardBorder} ${theme.cardShadow}`}
        aria-hidden
      >
        <div className={`mb-3 h-6 w-40 rounded-lg ${theme.progressTrack}`} />
        <div className={`mb-4 h-4 w-full rounded ${theme.progressTrack}`} />
        <div className={`h-11 rounded-2xl ${theme.progressTrack}`} />
      </section>
    );
  }

  const completedCount = isCompletedToday ? 1 : 0;
  const href = buildLearnPythonHref(nextLessonSlug);

  return (
    <section
      className={`mb-4 rounded-3xl border p-5 transition ${
        isCompletedToday
          ? "border-emerald-200/70 bg-emerald-50/40"
          : `${theme.cardBackground} ${theme.cardBorder}`
      } ${theme.cardShadow}`}
    >
      <div className="mb-3 flex items-center gap-2">
        <h2 className={`text-lg font-bold ${theme.primaryText}`}>
          Bugünün Görevi
        </h2>
        {isCompletedToday && (
          <span
            className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-sm text-emerald-700"
            aria-label="Tamamlandı"
          >
            ✅
          </span>
        )}
      </div>

      <p className={`mb-3 text-sm ${theme.mutedText}`}>
        {isCompletedToday
          ? "Bugünkü görevini tamamladın."
          : "1 kısa ders tamamla ve serini koru."}
      </p>

      <p
        className={`mb-4 text-xs font-medium ${
          isCompletedToday ? "text-emerald-700" : theme.mutedText
        }`}
      >
        {completedCount}/{QUEST_TOTAL} tamamlandı
      </p>

      <Link
        href={href}
        onClick={playClickSound}
        className={`block w-full cursor-pointer rounded-2xl py-3 text-center text-sm font-semibold transition ${
          isCompletedToday
            ? `${theme.secondaryButton} ${theme.secondaryButtonHover}`
            : `${theme.primaryButton} ${theme.primaryButtonHover}`
        }`}
      >
        {isCompletedToday ? "Yola devam et" : "Göreve başla"}
      </Link>
    </section>
  );
}
