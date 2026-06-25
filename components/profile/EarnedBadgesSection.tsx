"use client";

import AchievementBadgeCard from "@/components/profile/AchievementBadgeCard";
import type { StageTheme } from "@/components/dashboard/stageThemes";
import type { Achievement } from "@/lib/achievements";

type EarnedBadgesSectionProps = {
  achievements: Achievement[];
  theme: StageTheme;
};

export default function EarnedBadgesSection({
  achievements,
  theme,
}: EarnedBadgesSectionProps) {
  const earned = achievements.filter((a) => a.unlocked);
  const locked = achievements.filter((a) => !a.unlocked);

  return (
    <section
      className={`rounded-3xl border p-5 ${theme.cardBackground} ${theme.cardBorder} ${theme.cardShadow}`}
    >
      <div className="mb-4">
        <div className="mb-1 flex items-center justify-between gap-2">
          <h2 className={`text-lg font-bold ${theme.primaryText}`}>
            Kazanılan Rozetler
          </h2>
          <span className={`shrink-0 text-xs font-medium ${theme.mutedText}`}>
            {earned.length} / {achievements.length}
          </span>
        </div>
        <p className={`text-sm ${theme.mutedText}`}>
          Kod yolculuğunda açtığın başarılar.
        </p>
      </div>

      {earned.length > 0 ? (
        <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
          {earned.map((achievement) => (
            <AchievementBadgeCard
              key={achievement.id}
              achievement={achievement}
              theme={theme}
            />
          ))}
        </div>
      ) : (
        <p
          className={`mb-5 rounded-2xl border border-dashed px-4 py-6 text-center text-sm ${theme.cardBorder} ${theme.mutedText}`}
        >
          Henüz rozet kazanmadın. İlk dersini tamamlayarak başla!
        </p>
      )}

      {locked.length > 0 && (
        <div>
          <h3 className={`mb-3 text-sm font-semibold ${theme.mutedText}`}>
            Kilitli rozetler
          </h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
            {locked.map((achievement) => (
              <AchievementBadgeCard
                key={achievement.id}
                achievement={achievement}
                theme={theme}
                compact
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
