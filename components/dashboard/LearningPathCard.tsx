"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getDashboardTheme } from "@/components/dashboard/getDashboardTheme";
import { dashboardMock } from "@/lib/dashboard-mock";
import {
  applyLessonCompletion,
  getDefaultLearningProgress,
  getLearningProgress,
  saveLearningProgress,
  type PythonLearningProgress,
} from "@/lib/progress";
import {
  clearPendingLessonCompletion,
  clearPendingXpReward,
  getPendingLessonCompletion,
} from "@/lib/rewards";

const ANIMATION_DURATION_MS = 900;
const REWARD_NOTICE_DURATION_MS = 2800;

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export default function LearningPathCard() {
  const { title, description } = dashboardMock.learningPath;
  const theme = getDashboardTheme();
  const defaultProgress = getDefaultLearningProgress().python;

  const [learningProgress, setLearningProgress] =
    useState<PythonLearningProgress>(defaultProgress);
  const [displayCount, setDisplayCount] = useState(defaultProgress.completedCount);
  const [displayPercent, setDisplayPercent] = useState(
    defaultProgress.progressPercent,
  );
  const [showRewardNotice, setShowRewardNotice] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const saved = getLearningProgress().python;
    const pending = getPendingLessonCompletion();

    if (!pending || pending.courseId !== "python") {
      setLearningProgress(saved);
      setDisplayCount(saved.completedCount);
      setDisplayPercent(saved.progressPercent);
      setIsReady(true);
      return;
    }

    const { progress: updated, applied } = applyLessonCompletion(
      saved,
      pending.lessonId,
    );

    if (!applied) {
      clearPendingLessonCompletion();
      clearPendingXpReward();
      setLearningProgress(saved);
      setDisplayCount(saved.completedCount);
      setDisplayPercent(saved.progressPercent);
      setIsReady(true);
      return;
    }

    const startCount = saved.completedCount;
    const startPercent = saved.progressPercent;

    setLearningProgress(saved);
    setDisplayCount(startCount);
    setDisplayPercent(startPercent);
    setShowRewardNotice(true);
    setIsReady(true);

    const completeProgress = () => {
      saveLearningProgress({ python: updated });
      clearPendingLessonCompletion();
      setLearningProgress(updated);
      setDisplayCount(updated.completedCount);
      setDisplayPercent(updated.progressPercent);
      window.setTimeout(
        () => setShowRewardNotice(false),
        REWARD_NOTICE_DURATION_MS,
      );
    };

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      completeProgress();
      return;
    }

    const startTime = performance.now();
    let frameId = 0;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / ANIMATION_DURATION_MS, 1);
      const eased = easeOutCubic(progress);

      setDisplayCount(
        Math.round(
          startCount + (updated.completedCount - startCount) * eased,
        ),
      );
      setDisplayPercent(
        startPercent + (updated.progressPercent - startPercent) * eased,
      );

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        completeProgress();
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

  const roundedPercent = Math.round(displayPercent);

  if (!isReady) {
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

  return (
    <Link href="/learn/python" className="mb-4 block">
      <section
        className={`rounded-3xl border p-5 transition hover:border-kodmigo-orange/40 ${theme.cardBackground} ${theme.cardBorder} ${theme.cardShadow}`}
      >
        {showRewardNotice && (
          <div
            className={`xp-reward-in mb-3 rounded-xl border px-3 py-2 text-center text-sm font-semibold ${theme.cardBorder} bg-sky-50/90 text-sky-800`}
            role="status"
          >
            🎯 Python yolunda 1 ders ilerledin
          </div>
        )}

        <h2 className={`mb-2 text-lg font-bold ${theme.primaryText}`}>
          {title}
        </h2>
        <p className={`mb-4 text-sm ${theme.mutedText}`}>{description}</p>

        <div
          className={`mb-2 h-2.5 overflow-hidden rounded-full ${theme.progressTrack}`}
        >
          <div
            className={`h-full rounded-full ${theme.progressBar}`}
            style={{ width: `${displayPercent}%` }}
          />
        </div>

        <div
          className={`flex items-center justify-between text-xs ${theme.mutedText}`}
        >
          <span>%{roundedPercent} tamamlandı</span>
          <span>
            {displayCount} / {learningProgress.totalLessons} ders tamamlandı
          </span>
        </div>
      </section>
    </Link>
  );
}
