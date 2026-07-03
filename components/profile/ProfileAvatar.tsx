"use client";

import { useRef, useState } from "react";
import type { StageTheme } from "@/components/dashboard/stageThemes";
import { isSafeAvatarDataUrl, processAvatarFile } from "@/lib/avatar";
import { playClickSound } from "@/lib/sounds";

type ProfileAvatarProps = {
  avatarDataUrl: string | null;
  theme: StageTheme;
  onAvatarChange: (dataUrl: string) => void;
  onAvatarError?: (message: string) => void;
};

export default function ProfileAvatar({
  avatarDataUrl,
  theme,
  onAvatarChange,
  onAvatarError,
}: ProfileAvatarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [processing, setProcessing] = useState(false);

  const handleSelect = () => {
    if (processing) return;
    playClickSound();
    inputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setProcessing(true);

    const result = await processAvatarFile(file);
    setProcessing(false);

    if ("error" in result) {
      onAvatarError?.(result.error);
      event.target.value = "";
      return;
    }

    onAvatarChange(result.dataUrl);
    event.target.value = "";
  };

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={handleSelect}
        disabled={processing}
        aria-label="Profil fotoğrafını değiştir"
        className={`relative flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-2xl shadow-sm ring-2 transition hover:scale-[1.02] active:scale-[0.98] disabled:cursor-wait disabled:opacity-70 ${theme.iconBadge}`}
      >
        {avatarDataUrl && isSafeAvatarDataUrl(avatarDataUrl) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarDataUrl}
            alt="Profil fotoğrafı"
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-4xl" aria-hidden="true">
            🦊
          </span>
        )}
        <span
          className="absolute inset-x-0 bottom-0 bg-black/45 py-0.5 text-[10px] font-medium text-white"
          aria-hidden="true"
        >
          {processing ? "..." : "Değiştir"}
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
