"use client";

import { useCallback, useEffect, useState } from "react";
import { getDashboardTheme } from "@/components/dashboard/getDashboardTheme";
import {
  stageIcons,
  stageNames,
} from "@/components/dashboard/stageThemes";
import { clearPendingXpReward, getPendingXpReward } from "@/lib/rewards";
import {
  applyXpReward,
  getDefaultUserProgress,
  getUserProgress,
  saveUserProgress,
  type UserProgress,
} from "@/lib/progress";
import {
  hasActiveStreak,
  isStreakDimmed,
  getStreakProgress,
  type StreakProgress,
} from "@/lib/streak";
import { playCorrectSound } from "@/lib/sounds";
import { useAppStateRefresh } from "@/lib/useAppStateRefresh";

const ANIMATION_DURATION_MS = 900;
const REWARD_NOTICE_DURATION_MS = 2800;

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export default function StageProgressCard() {
  const theme = getDashboardTheme();
  const defaultProgress = getDefaultUserProgress();

  const [userProgress, setUserProgress] =
    useState<UserProgress>(defaultProgress);
  const [displayXp, setDisplayXp] = useState(defaultProgress.currentXp);
  const [displayPercent, setDisplayPercent] = useState(
    defaultProgress.progressPercent,
  );
  const [showRewardNotice, setShowRewardNotice] = useState(false);
  const [rewardXp, setRewardXp] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [streakProgress, setStreakProgress] = useState<StreakProgress | null>(
    null,
  );

  const isMaxStage = userProgress.nextStage === null;
  const currentStageName = stageNames[userProgress.currentStage];
  const nextStageName = userProgress.nextStage
    ? stageNames[userProgress.nextStage]
    : null;
  const currentStageIcon = stageIcons[userProgress.currentStage];
  const nextStageIcon = userProgress.nextStage
    ? stageIcons[userProgress.nextStage]
    : null;

  useEffect(() => {
    setStreakProgress(getStreakProgress());

    const saved = getUserProgress();
    const reward = getPendingXpReward();

    if (!reward) {
      setUserProgress(saved);
      setDisplayXp(saved.currentXp);
      setDisplayPercent(saved.progressPercent);
      setIsReady(true);
      return;
    }

    const startXp = saved.currentXp;
    const startPercent = saved.progressPercent;
    const updated = applyXpReward(saved, reward.xp);

    setRewardXp(reward.xp);
    setShowRewardNotice(true);
    setDisplayXp(startXp);
    setDisplayPercent(startPercent);
    setIsReady(true);
    playCorrectSound();

    const completeReward = () => {
      saveUserProgress(updated);
      clearPendingXpReward();
      setUserProgress(updated);
      setDisplayXp(updated.currentXp);
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
      completeReward();
      return;
    }

    const startTime = performance.now();
    let frameId = 0;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / ANIMATION_DURATION_MS, 1);
      const eased = easeOutCubic(progress);

      setDisplayXp(Math.round(startXp + reward.xp * eased));
      setDisplayPercent(
        startPercent +
          (updated.progressPercent - startPercent) * eased,
      );

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        completeReward();
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

  const refreshProgress = useCallback(() => {
    setStreakProgress(getStreakProgress());
    const saved = getUserProgress();
    setUserProgress(saved);
    setDisplayXp(saved.currentXp);
    setDisplayPercent(saved.progressPercent);
    setIsReady(true);
  }, []);

  useAppStateRefresh(refreshProgress);

  if (!isReady) {
    return (
      <section
        className={`mb-4 rounded-2xl border p-4 shadow-lg ${theme.stageCardBackground} ${theme.cardBorder} ${theme.cardShadow}`}
        aria-hidden
      >
        <div className={`mb-3 h-5 w-40 rounded-lg ${theme.progressTrack}`} />
        <div className={`mb-3 h-2.5 rounded-full ${theme.progressTrack}`} />
        <div className={`h-3 w-24 rounded ${theme.progressTrack}`} />
      </section>
    );
  }

  return (
    <section
      className={`mb-4 rounded-2xl border p-4 shadow-lg ${theme.stageCardBackground} ${theme.cardBorder} ${theme.cardShadow}`}
    >
      {showRewardNotice && (
        <div
          className={`xp-reward-in mb-3 rounded-xl border px-3 py-2 text-center text-sm font-semibold ${theme.cardBorder} bg-emerald-50/90 text-emerald-800`}
          role="status"
        >
          🎉 Ders ödülün eklendi: +{rewardXp} XP
        </div>
      )}

      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className={`text-base font-bold ${theme.primaryText}`}>
          Aşama ilerlemen
        </h2>
        {streakProgress && hasActiveStreak(streakProgress) && (
          <span
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold shadow-sm sm:text-base ${theme.streakBg}`}
          >
            <span
              className={`text-xl leading-none sm:text-2xl ${
                isStreakDimmed(streakProgress)
                  ? "flame-emoji-dim"
                  : "flame-emoji"
              }`}
              aria-hidden="true"
            >
              🔥
            </span>
            {streakProgress.currentStreak} gün seri
          </span>
        )}
      </div>

      <p className={`mb-3 text-sm font-semibold ${theme.primaryText}`}>
        {isMaxStage ? (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ${theme.currentBadge}`}
          >
            {currentStageIcon} {currentStageName} aşaması
          </span>
        ) : (
          <>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${theme.currentBadge}`}
            >
              {currentStageIcon} {currentStageName}
            </span>
            <span className="mx-2 text-slate-400">→</span>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${theme.nextBadge}`}
            >
              {nextStageIcon} {nextStageName}
            </span>
          </>
        )}
      </p>

      <div
        className={`mb-1.5 h-2.5 overflow-hidden rounded-full ${theme.progressTrack}`}
      >
        <div
          className={`h-full rounded-full ${theme.progressBar}`}
          style={{ width: `${displayPercent}%` }}
        />
      </div>

      <p className={`text-xs font-medium ${theme.mutedText}`}>
        {displayXp} / {userProgress.requiredXp} XP
      </p>
    </section>
  );
}
