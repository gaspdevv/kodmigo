"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import EarnedBadgesSection from "@/components/profile/EarnedBadgesSection";
import ProfileCard from "@/components/profile/ProfileCard";
import BottomNav from "@/components/dashboard/BottomNav";
import { getStageTheme } from "@/components/dashboard/stageThemes";
import { useAppStateSync } from "@/components/providers/AppStateSyncProvider";
import {
  getAchievements,
} from "@/lib/achievements";
import { useRequireAuth } from "@/lib/auth/useRequireAuth";
import {
  getDefaultLearningProgress,
  getDefaultUserProgress,
  getLearningProgress,
  getUserProgress,
  type PythonLearningProgress,
  type UserProgress,
} from "@/lib/progress";
import {
  getDefaultProfile,
  getProfile,
  updateProfileAvatar,
  type ProfileData,
} from "@/lib/profile";
import { playClickSound } from "@/lib/sounds";
import {
  getDefaultStreakProgress,
  getStreakProgress,
  hasActiveStreak,
  hasCompletedToday,
  isStreakDimmed,
  type StreakProgress,
} from "@/lib/streak";
import { resolveDisplayUsername } from "@/lib/username";
import { useAppStateRefresh } from "@/lib/useAppStateRefresh";

export default function ProfilePageClient() {
  const {
    user,
    username: authUsername,
    loading: authLoading,
    isAuthenticated,
  } = useRequireAuth();
  const { syncing } = useAppStateSync();
  const defaultUserProgress = getDefaultUserProgress();
  const defaultLearningProgress = getDefaultLearningProgress().python;
  const defaultStreakProgress = getDefaultStreakProgress();
  const defaultProfile = getDefaultProfile();

  const [userProgress, setUserProgress] =
    useState<UserProgress>(defaultUserProgress);
  const [learningProgress, setLearningProgress] =
    useState<PythonLearningProgress>(defaultLearningProgress);
  const [streakProgress, setStreakProgress] =
    useState<StreakProgress>(defaultStreakProgress);
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  const refreshProfileData = useCallback(() => {
    setUserProgress(getUserProgress());
    setLearningProgress(getLearningProgress().python);
    setStreakProgress(getStreakProgress());
    setProfile(getProfile());
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (syncing) {
      setIsReady(false);
      return;
    }
    refreshProfileData();
  }, [isAuthenticated, syncing, refreshProfileData]);

  useAppStateRefresh(refreshProfileData);

  const displayProfile = useMemo(
    () => ({
      ...profile,
      username: resolveDisplayUsername(authUsername, profile.username),
    }),
    [authUsername, profile],
  );

  const achievements = getAchievements(
    userProgress,
    learningProgress,
    streakProgress,
  );
  const earnedBadges = achievements.filter((a) => a.unlocked);
  const theme = getStageTheme(userProgress.currentStage);

  const handleAvatarChange = (avatarDataUrl: string) => {
    setAvatarError(null);
    const updated = updateProfileAvatar(avatarDataUrl);
    setProfile(updated);
  };

  const handleProfileChange = (updated: ProfileData) => {
    setProfile(updated);
  };

  if (!isReady || authLoading || !isAuthenticated || (user && syncing)) {
    return (
      <main
        className={`min-h-screen overflow-x-hidden pb-24 ${theme.pageBackground}`}
        aria-busy="true"
      >
        <div className="mx-auto max-w-lg px-4 pb-6 pt-6 sm:px-6">
          <div className="mb-6 flex justify-end">
            <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-200/60" />
          </div>
          <div className="mb-4 h-36 animate-pulse rounded-3xl bg-slate-200/60" />
          <div className="mb-4 h-24 animate-pulse rounded-3xl bg-slate-200/60" />
          <div className="h-48 animate-pulse rounded-3xl bg-slate-200/60" />
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen overflow-x-hidden pb-24 ${theme.pageBackground}`}>
      <div className="mx-auto max-w-lg px-4 pb-6 pt-6 sm:px-6">
        <div className="mb-4 flex items-center justify-end">
          <Link
            href="/settings"
            onClick={playClickSound}
            aria-label="Ayarlar"
            className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-lg transition hover:scale-105 active:scale-95 ${theme.softBadge}`}
          >
            ⚙️
          </Link>
        </div>

        <ProfileCard
          profile={displayProfile}
          userProgress={userProgress}
          earnedBadges={earnedBadges}
          theme={theme}
          isAuthenticated={Boolean(user)}
          onProfileChange={handleProfileChange}
          onAvatarChange={handleAvatarChange}
          onAvatarError={setAvatarError}
        />

        {avatarError && (
          <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {avatarError}
          </p>
        )}

        <section
          className={`mb-4 rounded-3xl border p-5 ${theme.cardBackground} ${theme.cardBorder} ${theme.cardShadow}`}
        >
          <h2 className={`mb-3 text-lg font-bold ${theme.primaryText}`}>
            Günlük seri
          </h2>

          {hasActiveStreak(streakProgress) ? (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <span
                className={`inline-flex w-fit items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold shadow-sm ${theme.streakBg}`}
              >
                <span
                  className={`text-xl leading-none ${
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
              {!hasCompletedToday(streakProgress) && (
                <p className={`text-xs ${theme.mutedText}`}>
                  Bugün bir ders tamamla, serini koru.
                </p>
              )}
            </div>
          ) : (
            <p className={`text-sm ${theme.mutedText}`}>
              Henüz aktif seri yok
            </p>
          )}

          {streakProgress.longestStreak > 0 && (
            <p className={`mt-3 text-xs font-medium ${theme.mutedText}`}>
              En uzun seri: {streakProgress.longestStreak} gün
            </p>
          )}
        </section>

        <EarnedBadgesSection achievements={achievements} theme={theme} />
      </div>

      <BottomNav activeTab="Profil" />
    </main>
  );
}
