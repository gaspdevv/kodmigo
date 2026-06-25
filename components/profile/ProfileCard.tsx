"use client";

import { useEffect, useRef, useState } from "react";
import type { StageTheme } from "@/components/dashboard/stageThemes";
import {
  stageIcons,
  stageNames,
} from "@/components/dashboard/stageThemes";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import ProfileEarnedBadgeIcons from "@/components/profile/ProfileEarnedBadgeIcons";
import { updateAuthUsername } from "@/lib/auth/actions";
import type { Achievement } from "@/lib/achievements";
import {
  MAX_USERNAME_LENGTH,
  updateProfileUsername,
  type ProfileData,
} from "@/lib/profile";
import type { UserProgress } from "@/lib/progress";
import { playClickSound } from "@/lib/sounds";
import { validateUsername } from "@/lib/username";

type ProfileCardProps = {
  profile: ProfileData;
  userProgress: UserProgress;
  earnedBadges: Achievement[];
  theme: StageTheme;
  isAuthenticated: boolean;
  onProfileChange: (profile: ProfileData) => void;
  onAvatarChange: (dataUrl: string) => void;
  onAvatarError?: (message: string) => void;
};

export default function ProfileCard({
  profile,
  userProgress,
  earnedBadges,
  theme,
  isAuthenticated,
  onProfileChange,
  onAvatarChange,
  onAvatarError,
}: ProfileCardProps) {
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [draftUsername, setDraftUsername] = useState(profile.username);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
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
        setUsernameError(null);
        setIsEditingUsername(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isEditingUsername, profile.username]);

  const startEditing = () => {
    playClickSound();
    setDraftUsername(profile.username);
    setUsernameError(null);
    setIsEditingUsername(true);
  };

  const cancelEditing = () => {
    setDraftUsername(profile.username);
    setUsernameError(null);
    setIsEditingUsername(false);
  };

  const saveUsername = async () => {
    const validationError = validateUsername(draftUsername);
    if (validationError) {
      setUsernameError(validationError);
      return;
    }

    setIsSaving(true);
    setUsernameError(null);

    if (isAuthenticated) {
      const authError = await updateAuthUsername(draftUsername.trim());
      if (authError) {
        setUsernameError(authError);
        setIsSaving(false);
        return;
      }
    }

    const updated = updateProfileUsername(draftUsername);
    setIsSaving(false);

    if (!updated) {
      setUsernameError("Kullanıcı adı kaydedilemedi.");
      return;
    }

    playClickSound();
    onProfileChange(updated);
    setIsEditingUsername(false);
  };

  return (
    <section
      className={`mb-4 overflow-hidden rounded-3xl border p-5 ${theme.stageCardBackground} ${theme.cardBorder} ${theme.cardShadow}`}
    >
      <div className="flex items-start gap-4">
        <ProfileAvatar
          avatarDataUrl={profile.avatarDataUrl}
          theme={theme}
          onAvatarChange={onAvatarChange}
          onAvatarError={onAvatarError}
        />

        <div className="min-w-0 flex-1">
          {isEditingUsername ? (
            <div className="space-y-2">
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
                  disabled={!draftUsername.trim() || isSaving}
                  className={`cursor-pointer rounded-lg px-2.5 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${theme.primaryButton}`}
                >
                  {isSaving ? "Kaydediliyor..." : "Kaydet"}
                </button>
                <button
                  type="button"
                  onClick={cancelEditing}
                  disabled={isSaving}
                  className={`cursor-pointer rounded-lg px-2.5 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${theme.secondaryButton}`}
                >
                  İptal
                </button>
              </div>
              {usernameError && (
                <p className="text-xs text-red-600">{usernameError}</p>
              )}
            </div>
          ) : (
            <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5">
              <h1
                className={`min-w-0 max-w-full break-words text-xl font-bold sm:max-w-[12rem] sm:truncate ${theme.primaryText}`}
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

          {!isEditingUsername && (
            <ProfileEarnedBadgeIcons
              earnedBadges={earnedBadges}
              theme={theme}
            />
          )}
        </div>
      </div>
    </section>
  );
}
