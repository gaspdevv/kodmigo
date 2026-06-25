"use client";

import ProfileBadgeIcon from "@/components/profile/ProfileBadgeIcon";
import type { StageTheme } from "@/components/dashboard/stageThemes";
import type { Achievement } from "@/lib/achievements";

type ProfileEarnedBadgeIconsProps = {
  earnedBadges: Achievement[];
  theme: StageTheme;
};

export default function ProfileEarnedBadgeIcons({
  earnedBadges,
  theme,
}: ProfileEarnedBadgeIconsProps) {
  if (earnedBadges.length === 0) {
    return (
      <p className={`mt-2 text-xs ${theme.mutedText}`}>Henüz rozet yok</p>
    );
  }

  return (
    <div
      className="mt-2 flex max-w-full flex-wrap gap-1.5"
      aria-label={`Kazanılan rozetler: ${earnedBadges.length}`}
    >
      {earnedBadges.map((achievement) => (
        <ProfileBadgeIcon
          key={achievement.id}
          achievement={achievement}
          theme={theme}
        />
      ))}
    </div>
  );
}
