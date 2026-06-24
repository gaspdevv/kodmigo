"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import BottomNav from "@/components/dashboard/BottomNav";
import DailyQuestCard from "@/components/dashboard/DailyQuestCard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { getDashboardTheme } from "@/components/dashboard/getDashboardTheme";
import LearningPathCard from "@/components/dashboard/LearningPathCard";
import MigoTipCard from "@/components/dashboard/MigoTipCard";
import NextLessonCard from "@/components/dashboard/NextLessonCard";
import StageProgressCard from "@/components/dashboard/StageProgressCard";
import { useAppStateSync } from "@/components/providers/AppStateSyncProvider";
import { useAuthUser } from "@/lib/auth/useAuthUser";
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
  const { user, loading: authLoading } = useAuthUser();
  const { syncing } = useAppStateSync();
  const [isReady, setIsReady] = useState(false);

  const initializeDashboard = useCallback(() => {
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

  useEffect(() => {
    if (authLoading) return;
    if (user && syncing) return;

    initializeDashboard();
  }, [authLoading, user, syncing, initializeDashboard]);

  const waitingForSync = Boolean(user && syncing);

  if (!isReady || authLoading || waitingForSync) {
    return (
      <main
        className={`min-h-screen pb-24 ${theme.pageBackground}`}
        aria-busy="true"
      >
        <div className="mx-auto max-w-lg px-4 pb-6 pt-6 sm:px-6">
          {waitingForSync && (
            <p className={`mb-4 text-sm ${theme.mutedText}`}>
              Verilerin hazırlanıyor...
            </p>
          )}
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
      <BottomNav activeTab="Ana Sayfa" />
    </main>
  );
}
