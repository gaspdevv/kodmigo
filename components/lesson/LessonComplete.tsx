"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { StageTheme } from "@/components/dashboard/stageThemes";
import type { LessonStep } from "@/data/lessons";
import {
  finalizeLessonCompletion,
  getLearnPathHrefAfterLesson,
} from "@/lib/lesson-completion";
import { parseXpAmount } from "@/lib/rewards";
import { isLessonCompleted } from "@/lib/progress";
import { playClickSound } from "@/lib/sounds";

type LessonCompleteProps = {
  lessonId: string;
  step: LessonStep;
  theme: StageTheme;
  xpReward?: number;
};

export default function LessonComplete({
  lessonId,
  step,
  theme,
  xpReward: xpRewardProp,
}: LessonCompleteProps) {
  const rewards = step.completeRewards;
  const xpAmount =
    xpRewardProp ?? (rewards?.xp ? parseXpAmount(rewards.xp) : 10);
  const [isRepeatCompletion] = useState(() =>
    isLessonCompleted("python", lessonId),
  );
  const [learnPathHref, setLearnPathHref] = useState("/learn/python");

  useEffect(() => {
    finalizeLessonCompletion(lessonId, xpAmount);
    setLearnPathHref(getLearnPathHrefAfterLesson(lessonId));
  }, [lessonId, xpAmount]);

  const handleNavigate = () => {
    playClickSound();
  };

  return (
    <div className="py-2 text-center">
      <div className="mb-3 text-4xl" aria-hidden>
        {isRepeatCompletion ? "🔄✨" : "🎉✨🎊"}
      </div>
      <div
        className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-3xl ring-4 ${
          isRepeatCompletion
            ? "ring-sky-200/60"
            : "ring-emerald-200/60"
        } ${theme.iconBadge}`}
      >
        {isRepeatCompletion ? "🔁" : "🏆"}
      </div>
      <h2 className={`mb-2 break-words text-2xl font-bold ${theme.primaryText}`}>
        {isRepeatCompletion ? "Dersi tekrar ettin" : `🎉 ${step.title}`}
      </h2>
      {step.content && (
        <p className={`mb-6 text-sm leading-relaxed ${theme.mutedText}`}>
          {step.content}
        </p>
      )}
      {isRepeatCompletion ? (
        <div
          className={`mb-6 rounded-2xl border-2 p-4 text-left ${theme.cardBorder} ${theme.cardBackground} ${theme.cardShadow}`}
        >
          <p className={`mb-2 text-sm font-semibold ${theme.primaryText}`}>
            Bu dersi daha önce tamamladığın için tekrar XP kazanmadın.
          </p>
          <p className={`text-sm leading-relaxed ${theme.mutedText}`}>
            Tekrar etmek öğrenmenin en iyi yollarından biri. Pratik yapmaya
            devam et!
          </p>
        </div>
      ) : (
        rewards && (
          <div
            className={`mb-6 overflow-hidden rounded-2xl border-2 text-left ${theme.cardBorder} ${theme.cardShadow}`}
          >
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3">
              <p className="text-lg font-bold text-white">+{xpAmount} XP</p>
              <p className="text-xs font-medium text-emerald-50">
                Deneyim puanı kazandın
              </p>
            </div>
            <div className={`space-y-2 px-4 py-3 ${theme.cardBackground}`}>
              <p className={`text-sm font-medium ${theme.primaryText}`}>
                🔥 {rewards.streak}
              </p>
              <p className={`text-sm ${theme.mutedText}`}>
                🎯 Python yolunda ilerledin
              </p>
              <p className={`text-sm ${theme.mutedText}`}>
                {rewards.nextLesson}
              </p>
            </div>
          </div>
        )
      )}
      <div className="flex flex-col gap-3">
        <Link
          href={learnPathHref}
          onClick={handleNavigate}
          className={`inline-flex w-full cursor-pointer items-center justify-center rounded-xl py-3 text-sm font-semibold transition ${theme.primaryButton} ${theme.primaryButtonHover}`}
        >
          Python yoluna dön
        </Link>
        <Link
          href="/dashboard"
          onClick={handleNavigate}
          className={`inline-flex w-full cursor-pointer items-center justify-center rounded-xl py-3 text-sm font-semibold transition ${theme.secondaryButton} ${theme.secondaryButtonHover}`}
        >
          Ana Sayfa&apos;ya dön
        </Link>
      </div>
    </div>
  );
}
