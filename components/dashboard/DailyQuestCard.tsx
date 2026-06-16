"use client";

import Link from "next/link";
import { getDashboardTheme } from "@/components/dashboard/getDashboardTheme";
import { dashboardMock } from "@/lib/dashboard-mock";
import { playClickSound } from "@/lib/sounds";

export default function DailyQuestCard() {
  const { title, description, completed, total } = dashboardMock.dailyQuest;
  const theme = getDashboardTheme();

  return (
    <section
      className={`mb-4 rounded-3xl border p-5 ${theme.cardBackground} ${theme.cardBorder} ${theme.cardShadow}`}
    >
      <h2 className={`mb-3 text-lg font-bold ${theme.primaryText}`}>
        {title}
      </h2>

      <p className={`mb-3 text-sm ${theme.mutedText}`}>{description}</p>

      <p className={`mb-4 text-xs font-medium ${theme.mutedText}`}>
        {completed}/{total} tamamlandı
      </p>

      <Link
        href="/learn/python"
        onClick={playClickSound}
        className={`block w-full cursor-pointer rounded-2xl py-3 text-center text-sm font-semibold transition ${theme.primaryButton} ${theme.primaryButtonHover}`}
      >
        Göreve başla
      </Link>
    </section>
  );
}
