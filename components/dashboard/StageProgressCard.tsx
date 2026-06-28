"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getStageTheme,
  stageIcons,
  stageNames,
  type StageKey,
} from "@/components/dashboard/stageThemes";
import {
  clearPendingXpRewards,
  getPendingXpRewards,
} from "@/lib/rewards";
import {
  getDefaultUserProgress,
  getStageProgressDisplay,
  getUserProgress,
  type UserProgress,
} from "@/lib/progress";
import {
  hasActiveStreak,
  isStreakDimmed,
  getStreakProgress,
  type StreakProgress,
} from "@/lib/streak";
import { consumeStageCelebration } from "@/lib/stage-celebration";
import {
  compareStages,
  getStageFromXp,
  normalizeUserProgressFromXp,
} from "@/lib/stage-progress";
import { playCorrectSound } from "@/lib/sounds";
import { APP_STATE_CHANGED_EVENT } from "@/lib/appStateEvents";
import { useAppStateRefresh } from "@/lib/useAppStateRefresh";

const ANIMATION_DURATION_MS = 900;
const REWARD_NOTICE_DURATION_MS = 2800;
const STAGE_CELEBRATION_DURATION_MS = 3000;

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function maybeCelebrateStage(
  stage: StageKey,
  onCelebrate: (celebratedStage: StageKey) => void,
): void {
  const celebrated = consumeStageCelebration(stage);
  if (celebrated) {
    onCelebrate(celebrated);
  }
}

export default function StageProgressCard() {
  const defaultProgress = getDefaultUserProgress();

  const [userProgress, setUserProgress] =
    useState<UserProgress>(defaultProgress);
  const [displayXp, setDisplayXp] = useState(0);
  const [displayPercent, setDisplayPercent] = useState(
    defaultProgress.progressPercent,
  );
  const [showRewardNotice, setShowRewardNotice] = useState(false);
  const [rewardXp, setRewardXp] = useState(0);
  const [celebratedStage, setCelebratedStage] = useState<StageKey | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [streakProgress, setStreakProgress] = useState<StreakProgress | null>(
    null,
  );

  const theme = getStageTheme(userProgress.currentStage);
  const isMaxStage = userProgress.nextStage === null;
  const currentStageName = stageNames[userProgress.currentStage];
  const nextStageName = userProgress.nextStage
    ? stageNames[userProgress.nextStage]
    : null;
  const currentStageIcon = stageIcons[userProgress.currentStage];
  const nextStageIcon = userProgress.nextStage
    ? stageIcons[userProgress.nextStage]
    : null;

  const applyProgressFrame = useCallback((progress: UserProgress) => {
    const display = getStageProgressDisplay(progress);
    setUserProgress(progress);
    setDisplayXp(display.stageXp);
    setDisplayPercent(progress.progressPercent);
  }, []);

  const triggerStageCelebration = useCallback((stage: StageKey) => {
    setCelebratedStage(stage);
    window.setTimeout(() => setCelebratedStage(null), STAGE_CELEBRATION_DURATION_MS);
  }, []);

  const checkStageUpgrade = useCallback(
    (previousTotalXp: number, nextProgress: UserProgress) => {
      const previousStage = getStageFromXp(previousTotalXp);
      if (compareStages(nextProgress.currentStage, previousStage) > 0) {
        maybeCelebrateStage(nextProgress.currentStage, triggerStageCelebration);
      }
    },
    [triggerStageCelebration],
  );

  useEffect(() => {
    setStreakProgress(getStreakProgress());

    const saved = getUserProgress();
    const pendingRewards = getPendingXpRewards();
    const initialDisplay = getStageProgressDisplay(saved);

    if (pendingRewards.length === 0) {
      applyProgressFrame(saved);
      maybeCelebrateStage(saved.currentStage, triggerStageCelebration);
      setIsReady(true);
      return;
    }

    const totalPendingXp = pendingRewards.reduce(
      (sum, reward) => sum + reward.xp,
      0,
    );
    const startTotalXp = Math.max(0, saved.currentXp - totalPendingXp);
    const startProgress = normalizeUserProgressFromXp(
      startTotalXp,
      saved.streakDays,
    );
    const startDisplay = getStageProgressDisplay(startProgress);

    setRewardXp(totalPendingXp);
    setShowRewardNotice(true);
    setUserProgress(startProgress);
    setDisplayXp(startDisplay.stageXp);
    setDisplayPercent(startProgress.progressPercent);
    setIsReady(true);
    playCorrectSound();

    const completeReward = () => {
      clearPendingXpRewards();
      applyProgressFrame(saved);
      checkStageUpgrade(startTotalXp, saved);
      window.dispatchEvent(new Event(APP_STATE_CHANGED_EVENT));
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
      const frameTotalXp = Math.round(startTotalXp + totalPendingXp * eased);
      const frameProgress = normalizeUserProgressFromXp(
        frameTotalXp,
        saved.streakDays,
      );
      const frameDisplay = getStageProgressDisplay(frameProgress);

      setUserProgress(frameProgress);
      setDisplayXp(frameDisplay.stageXp);
      setDisplayPercent(frameProgress.progressPercent);

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
  }, [
    applyProgressFrame,
    checkStageUpgrade,
    triggerStageCelebration,
  ]);

  const refreshProgress = useCallback(() => {
    setStreakProgress(getStreakProgress());
    const saved = getUserProgress();
    applyProgressFrame(saved);
    setIsReady(true);
  }, [applyProgressFrame]);

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
      className={`mb-4 rounded-2xl border p-4 shadow-lg transition-shadow duration-500 ${theme.stageCardBackground} ${theme.cardBorder} ${theme.cardShadow} ${
        celebratedStage ? "stage-upgrade-glow" : ""
      }`}
    >
      {showRewardNotice && (
        <div
          className={`xp-reward-in mb-3 rounded-xl border px-3 py-2 text-center text-sm font-semibold ${theme.cardBorder} bg-emerald-50/90 text-emerald-800`}
          role="status"
        >
          🎉 Ders ödülün eklendi: +{rewardXp} XP
        </div>
      )}

      {celebratedStage && (
        <div
          className={`stage-upgrade-in mb-3 rounded-xl border px-3 py-2 text-center text-sm font-semibold ${theme.cardBorder} bg-amber-50/95 text-amber-900`}
          role="status"
        >
          <span className="stage-badge-bounce mr-1 inline-block">
            {stageIcons[celebratedStage]}
          </span>
          Yeni aşama: {stageNames[celebratedStage]}
        </div>
      )}

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className={`min-w-0 flex-1 text-base font-bold ${theme.primaryText}`}>
          Aşama ilerlemen
        </h2>
        {streakProgress && hasActiveStreak(streakProgress) && (
          <span
            className={`inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm sm:gap-1.5 sm:px-4 sm:py-2 sm:text-sm ${theme.streakBg}`}
          >
            <span
              className={`text-lg leading-none sm:text-xl ${
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

      <p className={`mb-3 flex flex-wrap items-center gap-y-1 text-sm font-semibold ${theme.primaryText}`}>
        {isMaxStage ? (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ${theme.currentBadge} ${
              celebratedStage === userProgress.currentStage
                ? "stage-badge-bounce"
                : ""
            }`}
          >
            {currentStageIcon} {currentStageName} aşaması
          </span>
        ) : (
          <>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${theme.currentBadge} ${
                celebratedStage === userProgress.currentStage
                  ? "stage-badge-bounce"
                  : ""
              }`}
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
          className={`h-full rounded-full transition-all duration-300 ${theme.progressBar}`}
          style={{ width: `${displayPercent}%` }}
        />
      </div>

      <p className={`text-xs font-medium ${theme.mutedText}`}>
        {isMaxStage
          ? `Usta aşamasındasın · ${userProgress.currentXp} XP`
          : `${displayXp} / ${userProgress.requiredXp} XP`}
      </p>
    </section>
  );
}
