import Link from "next/link";
import type { StageTheme } from "@/components/dashboard/stageThemes";

type LessonNotFoundProps = {
  theme: StageTheme;
};

export default function LessonNotFound({ theme }: LessonNotFoundProps) {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 py-8 sm:px-6">
      <div
        className={`w-full rounded-3xl border p-8 text-center ${theme.cardBackground} ${theme.cardBorder} ${theme.cardShadow}`}
      >
        <div className="mb-4 text-4xl" aria-hidden>
          🔍
        </div>
        <h1 className={`mb-2 text-xl font-bold ${theme.primaryText}`}>
          Ders bulunamadı
        </h1>
        <p className={`mb-6 text-sm leading-relaxed ${theme.mutedText}`}>
          Aradığın ders mevcut değil veya henüz hazır değil.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/learn/python"
            className={`inline-flex w-full cursor-pointer items-center justify-center rounded-xl py-3 text-sm font-semibold transition ${theme.primaryButton} ${theme.primaryButtonHover}`}
          >
            Python yoluna dön
          </Link>
          <Link
            href="/dashboard"
            className={`inline-flex w-full cursor-pointer items-center justify-center rounded-xl py-3 text-sm font-semibold transition ${theme.secondaryButton} ${theme.secondaryButtonHover}`}
          >
            Ana Sayfa&apos;ya git
          </Link>
        </div>
      </div>
    </div>
  );
}
