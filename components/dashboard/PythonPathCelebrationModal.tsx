"use client";

import { useCallback, useEffect, useRef } from "react";
import { stageNames, type StageKey } from "@/components/dashboard/stageThemes";
import ConfettiBurst from "@/components/dashboard/ConfettiBurst";
import { getDashboardTheme } from "@/components/dashboard/getDashboardTheme";
import type { PythonPathCompletionStatus } from "@/lib/python-path-completion";
import { markPythonPathCompletionCelebrated } from "@/lib/progress";
import { playCelebrationSound } from "@/lib/sounds";

type PythonPathCelebrationModalProps = {
  open: boolean;
  completion: PythonPathCompletionStatus;
  userXp: number;
  currentStage: StageKey;
  onClose: () => void;
};

export default function PythonPathCelebrationModal({
  open,
  completion,
  userXp,
  currentStage,
  onClose,
}: PythonPathCelebrationModalProps) {
  const theme = getDashboardTheme();
  const dialogRef = useRef<HTMLDivElement>(null);
  const hasPlayedSoundRef = useRef(false);

  const handleDismiss = useCallback(() => {
    markPythonPathCompletionCelebrated();
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) {
      hasPlayedSoundRef.current = false;
      return;
    }

    if (!hasPlayedSoundRef.current) {
      hasPlayedSoundRef.current = true;
      playCelebrationSound();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleDismiss();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    dialogRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, handleDismiss]);

  if (!open) return null;

  return (
    <>
      <ConfettiBurst active={open} />
      <div className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center">
        <button
          type="button"
          className="absolute inset-0 bg-kodmigo-navy/45 backdrop-blur-[2px]"
          aria-label="Kutlamayı kapat"
          onClick={handleDismiss}
        />

        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="python-path-celebration-title"
          tabIndex={-1}
          className={`relative z-[61] w-full max-w-md rounded-3xl border p-6 shadow-2xl outline-none ${theme.cardBackground} ${theme.cardBorder}`}
        >
          <div className="mb-4 flex items-start gap-3">
            <span
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl ${theme.iconBadge}`}
              aria-hidden
            >
              🎉
            </span>
            <div className="min-w-0">
              <h2
                id="python-path-celebration-title"
                className={`text-xl font-bold leading-tight ${theme.primaryText}`}
              >
                Python yolunu tamamladın! 🎉
              </h2>
              <p className={`mt-2 text-sm leading-relaxed ${theme.mutedText}`}>
                Harika iş! Başlangıçtan buraya kadar tüm dersleri tamamladın.
                Migo seninle gurur duyuyor.
              </p>
            </div>
          </div>

          <dl
            className={`mb-6 grid gap-2 rounded-2xl p-4 text-sm ${theme.softBadge}`}
          >
            <div className="flex items-center justify-between gap-3">
              <dt className={theme.mutedText}>Tamamlanan ders</dt>
              <dd className={`font-semibold ${theme.primaryText}`}>
                {completion.completedCount}/{completion.totalCount}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className={theme.mutedText}>Toplam XP</dt>
              <dd className={`font-semibold ${theme.primaryText}`}>{userXp}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className={theme.mutedText}>Aşama</dt>
              <dd className={`font-semibold ${theme.primaryText}`}>
                {stageNames[currentStage]}
              </dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={handleDismiss}
            className={`w-full rounded-2xl py-3.5 text-sm font-semibold transition ${theme.primaryButton} ${theme.primaryButtonHover}`}
          >
            Harika!
          </button>
        </div>
      </div>
    </>
  );
}
