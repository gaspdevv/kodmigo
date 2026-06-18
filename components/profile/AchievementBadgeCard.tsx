"use client";

import type { StageTheme } from "@/components/dashboard/stageThemes";
import type { Achievement } from "@/lib/achievements";

type AchievementBadgeCardProps = {
  achievement: Achievement;
  theme: StageTheme;
};

export default function AchievementBadgeCard({
  achievement,
  theme,
}: AchievementBadgeCardProps) {
  const { unlocked, icon, title, description } = achievement;

  return (
    <div
      className={`group relative rounded-2xl border p-3 text-center transition ${
        unlocked
          ? `border-orange-200/80 bg-gradient-to-br from-white via-orange-50/40 to-amber-50/60 shadow-md shadow-orange-100/50 ${theme.cardBorder}`
          : "border-slate-200/60 bg-slate-50/60 opacity-55"
      }`}
      aria-label={`${title}: ${description}`}
    >
      <div
        className={`mb-1.5 text-2xl ${unlocked ? "" : "grayscale"}`}
        aria-hidden="true"
      >
        {unlocked ? icon : "🔒"}
      </div>
      <p
        className={`text-xs font-semibold ${
          unlocked ? theme.primaryText : "text-slate-400"
        }`}
      >
        {title}
      </p>

      <p className="mt-1 text-[10px] leading-tight text-slate-400 md:hidden">
        {description}
      </p>

      <div
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden w-44 -translate-x-1/2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-[11px] leading-snug text-slate-600 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 md:block"
        role="tooltip"
      >
        {description}
      </div>
    </div>
  );
}
