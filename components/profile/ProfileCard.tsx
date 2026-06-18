"use client";

import { useEffect, useRef, useState } from "react";
import type { StageTheme } from "@/components/dashboard/stageThemes";
import {
  stageIcons,
  stageNames,
} from "@/components/dashboard/stageThemes";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import ShowcasedBadgeIcon from "@/components/profile/ShowcasedBadgeIcon";
import type { Achievement } from "@/lib/achievements";
import {
  MAX_USERNAME_LENGTH,
  updateProfileUsername,
  type ProfileData,
} from "@/lib/profile";
import type { UserProgress } from "@/lib/progress";
import { playClickSound } from "@/lib/sounds";

type ProfileCardProps = {
  profile: ProfileData;
  userProgress: UserProgress;
  showcasedBadge: Achievement | null;
  theme: StageTheme;
  onProfileChange: (profile: ProfileData) => void;
  onAvatarChange: (dataUrl: string) => void;
};

export default function ProfileCard({
  profile,
  userProgress,
  showcasedBadge,
  theme,
  onProfileChange,
  onAvatarChange,
}: ProfileCardProps) {
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [draftUsername, setDraftUsername] = useState(profile.username);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentStageIcon = stageIcons[userProgress.currentStage];
  const currentStageName = stageNames[userProgress.currentStage];

  useEffect(() => {
    if (!isEditingUsername) {
      setDraftUsername(profile.username);
    }
  }, [profile.username, isEditingUsername]);

  useEffect(() => {
    if (!isEditingUsername) return;

    inputRef.current?.focus();
    inputRef.current?.select();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDraftUsername(profile.username);
        setIsEditingUsername(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isEditingUsername, profile.username]);

  const startEditing = () => {
    playClickSound();
    setDraftUsername(profile.username);
    setIsEditingUsername(true);
  };

  const cancelEditing = () => {
    setDraftUsername(profile.username);
    setIsEditingUsername(false);
  };

  const saveUsername = () => {
    const updated = updateProfileUsername(draftUsername);
    if (!updated) return;

    playClickSound();
    onProfileChange(updated);
    setIsEditingUsername(false);
  };

  return (
    <section
      className={`mb-4 overflow-visible rounded-3xl border p-5 ${theme.stageCardBackground} ${theme.cardBorder} ${theme.cardShadow}`}
    >
      <div className="flex items-start gap-4">
        <ProfileAvatar
          avatarDataUrl={profile.avatarDataUrl}
          theme={theme}
          onAvatarChange={onAvatarChange}
        />

        <div className="min-w-0 flex-1">
          {isEditingUsername ? (
            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={draftUsername}
                maxLength={MAX_USERNAME_LENGTH}
                onChange={(event) => setDraftUsername(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") saveUsername();
                }}
                className={`min-w-0 flex-1 rounded-xl border px-3 py-1.5 text-base font-bold outline-none focus:ring-2 focus:ring-orange-300 ${theme.cardBorder} ${theme.primaryText}`}
                aria-label="Kullanıcı adı"
              />
              <button
                type="button"
                onClick={saveUsername}
                disabled={!draftUsername.trim()}
                className={`cursor-pointer rounded-lg px-2.5 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${theme.primaryButton}`}
              >
                Kaydet
              </button>
              <button
                type="button"
                onClick={cancelEditing}
                className={`cursor-pointer rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${theme.secondaryButton}`}
              >
                İptal
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
              <h1
                className={`max-w-[10rem] truncate text-xl font-bold sm:max-w-[12rem] ${theme.primaryText}`}
              >
                {profile.username}
              </h1>
              <button
                type="button"
                onClick={startEditing}
                aria-label="Kullanıcı adını düzenle"
                className={`flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-sm transition hover:scale-105 active:scale-95 ${theme.softBadge}`}
              >
                ✏️
              </button>
              <span
                className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${theme.currentBadge}`}
              >
                {currentStageIcon} {currentStageName}
              </span>
            </div>
          )}

          {showcasedBadge && (
            <ShowcasedBadgeIcon achievement={showcasedBadge} theme={theme} />
          )}
        </div>
      </div>
    </section>
  );
}
