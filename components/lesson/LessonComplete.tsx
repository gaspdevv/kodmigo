"use client";

import Link from "next/link";
import type { StageTheme } from "@/components/dashboard/stageThemes";
import type { LessonStep } from "@/data/lessons";
import { playClickSound } from "@/lib/sounds";

type LessonCompleteProps = {
  step: LessonStep;
  theme: StageTheme;
};

export default function LessonComplete({ step, theme }: LessonCompleteProps) {
  const rewards = step.completeRewards;

  return (
    <div className="py-2 text-center">
      <div className="mb-3 text-4xl" aria-hidden>
        🎉✨🎊
      </div>
      <div
        className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-3xl ring-4 ring-emerald-200/60 ${theme.iconBadge}`}
      >
        🏆
      </div>
      <h2 className={`mb-2 text-2xl font-bold ${theme.primaryText}`}>
        🎉 {step.title}
      </h2>
      {step.content && (
        <p className={`mb-6 text-sm leading-relaxed ${theme.mutedText}`}>
          {step.content}
        </p>
      )}
      {rewards && (
        <div
          className={`mb-6 overflow-hidden rounded-2xl border-2 text-left ${theme.cardBorder} ${theme.cardShadow}`}
        >
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3">
            <p className="text-lg font-bold text-white">{rewards.xp}</p>
            <p className="text-xs font-medium text-emerald-50">
              Deneyim puanı kazandın
            </p>
          </div>
          <div className={`space-y-2 px-4 py-3 ${theme.cardBackground}`}>
            <p className={`text-sm font-medium ${theme.primaryText}`}>
              🔥 {rewards.streak}
            </p>
            <p className={`text-sm ${theme.mutedText}`}>{rewards.nextLesson}</p>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-3">
        <Link
          href="/learn/python"
          onClick={playClickSound}
          className={`inline-flex w-full cursor-pointer items-center justify-center rounded-xl py-3 text-sm font-semibold transition ${theme.primaryButton} ${theme.primaryButtonHover}`}
        >
          Python yoluna dön
        </Link>
        <Link
          href="/dashboard"
          onClick={playClickSound}
          className={`inline-flex w-full cursor-pointer items-center justify-center rounded-xl py-3 text-sm font-semibold transition ${theme.secondaryButton} ${theme.secondaryButtonHover}`}
        >
          Dashboard&apos;a git
        </Link>
      </div>
    </div>
  );
}
