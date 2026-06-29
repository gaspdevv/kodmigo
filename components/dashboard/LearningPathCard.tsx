"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { getDashboardTheme } from "@/components/dashboard/getDashboardTheme";
import {
  getActivePythonLevelProgress,
  type ActivePythonLevelProgress,
} from "@/data/pythonPath";
import { getActivePathLevel } from "@/lib/onboarding-data";
import { getEffectiveCompletedLessonIds } from "@/lib/progress";
import { useAppStateRefresh } from "@/lib/useAppStateRefresh";

const CARD_TITLE = "Python Öğrenme Yolu";

export default function LearningPathCard() {
  const theme = getDashboardTheme();
  const [activeProgress, setActiveProgress] =
    useState<ActivePythonLevelProgress | null>(null);
  const [isReady, setIsReady] = useState(false);

  const refreshProgress = useCallback(() => {
    const startLevel = getActivePathLevel();
    const completedLessonIds = getEffectiveCompletedLessonIds();
    setActiveProgress(
      getActivePythonLevelProgress(completedLessonIds, startLevel),
    );
    setIsReady(true);
  }, []);

  useEffect(() => {
    refreshProgress();
  }, [refreshProgress]);

  useAppStateRefresh(refreshProgress);

  if (!isReady || !activeProgress) {
    return (
      <div className="mb-4 block" aria-hidden>
        <section
          className={`rounded-3xl border p-5 ${theme.cardBackground} ${theme.cardBorder} ${theme.cardShadow}`}
        >
          <div className={`mb-4 h-5 w-48 rounded-lg ${theme.progressTrack}`} />
          <div className={`mb-2 h-2.5 rounded-full ${theme.progressTrack}`} />
          <div className={`h-3 w-full rounded ${theme.progressTrack}`} />
        </section>
      </div>
    );
  }

  const roundedPercent = Math.round(activeProgress.percent);

  return (
    <Link href="/learn/python" className="mb-4 block">
      <section
        className={`rounded-3xl border p-5 transition hover:border-kodmigo-orange/40 ${theme.cardBackground} ${theme.cardBorder} ${theme.cardShadow}`}
      >
        <h2 className={`mb-2 text-lg font-bold ${theme.primaryText}`}>
          {CARD_TITLE}
        </h2>
        <p className={`mb-4 text-sm ${theme.mutedText}`}>
          {activeProgress.subtitle}
        </p>

        <div
          className={`mb-2 h-2.5 overflow-hidden rounded-full ${theme.progressTrack}`}
        >
          <div
            className={`h-full rounded-full ${theme.progressBar}`}
            style={{ width: `${activeProgress.percent}%` }}
          />
        </div>

        <div
          className={`flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-xs ${theme.mutedText}`}
        >
          <span className="shrink-0">%{roundedPercent} tamamlandı</span>
          <span className="min-w-0 text-right break-words">
            {activeProgress.countLabel}
          </span>
        </div>
      </section>
    </Link>
  );
}
