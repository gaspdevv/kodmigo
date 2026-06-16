"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BottomNav from "@/components/dashboard/BottomNav";
import DailyQuestCard from "@/components/dashboard/DailyQuestCard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { getDashboardTheme } from "@/components/dashboard/getDashboardTheme";
import LearningPathCard from "@/components/dashboard/LearningPathCard";
import MigoTipCard from "@/components/dashboard/MigoTipCard";
import NextLessonCard from "@/components/dashboard/NextLessonCard";
import StageProgressCard from "@/components/dashboard/StageProgressCard";
import {
  getMissedDaysCount,
  getRemainingRestores,
  getStreakProgress,
  resetStreakWithoutRestore,
  shouldRedirectToRescue,
} from "@/lib/streak";

export default function DashboardPageClient() {
  const theme = getDashboardTheme();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const progress = getStreakProgress();

    if (shouldRedirectToRescue(progress)) {
      router.replace("/streak-rescue");
      return;
    }

    const missedDays = getMissedDaysCount(progress);
    const remaining = getRemainingRestores(progress);

    if (missedDays > 0 && remaining === 0) {
      resetStreakWithoutRestore();
    }

    setIsReady(true);
  }, [router]);

  if (!isReady) {
    return (
      <main
        className={`min-h-screen pb-24 ${theme.pageBackground}`}
        aria-busy="true"
      >
        <div className="mx-auto max-w-lg px-4 pb-6 pt-6 sm:px-6">
          <div className="mb-4 h-8 w-48 animate-pulse rounded-lg bg-slate-200/60" />
          <div className="mb-4 h-40 animate-pulse rounded-2xl bg-slate-200/60" />
          <div className="mb-4 h-32 animate-pulse rounded-3xl bg-slate-200/60" />
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen pb-24 ${theme.pageBackground}`}>
      <div className="mx-auto max-w-lg px-4 pb-6 pt-6 sm:px-6">
        <DashboardHeader />
        <StageProgressCard />
        <DailyQuestCard />
        <LearningPathCard />
        <NextLessonCard />
        <MigoTipCard />
      </div>
      <BottomNav />
    </main>
  );
}
