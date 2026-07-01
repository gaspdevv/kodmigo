"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import BottomNav from "@/components/dashboard/BottomNav";
import DailyQuestCard from "@/components/dashboard/DailyQuestCard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { getStageTheme, type StageKey } from "@/components/dashboard/stageThemes";
import LearningPathCard from "@/components/dashboard/LearningPathCard";
import MigoTipCard from "@/components/dashboard/MigoTipCard";
import NextLessonCard from "@/components/dashboard/NextLessonCard";
import PythonPathCelebrationController from "@/components/dashboard/PythonPathCelebrationController";
import StageProgressCard from "@/components/dashboard/StageProgressCard";
import { useAppStateSync } from "@/components/providers/AppStateSyncProvider";
import { useRequireAuth } from "@/lib/auth/useRequireAuth";
import { getUserProgress } from "@/lib/progress";
import {
  getMissedDaysCount,
  getRemainingRestores,
  getStreakProgress,
  resetStreakWithoutRestore,
  shouldRedirectToRescue,
} from "@/lib/streak";
import { useAppStateRefresh } from "@/lib/useAppStateRefresh";

export default function DashboardPageClient() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useRequireAuth();
  const { syncing } = useAppStateSync();
  const [isReady, setIsReady] = useState(false);
  const [pageStage, setPageStage] = useState<StageKey>("bronze");

  const refreshPageStage = useCallback(() => {
    setPageStage(getUserProgress().currentStage);
  }, []);

  useAppStateRefresh(refreshPageStage);

  const theme = getStageTheme(pageStage);

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
    refreshPageStage();
  }, [router, refreshPageStage]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (syncing) return;

    initializeDashboard();
  }, [isAuthenticated, syncing, initializeDashboard]);

  const waitingForSync = Boolean(user && syncing);

  if (!isReady || authLoading || !isAuthenticated || waitingForSync) {
    return (
      <main
        className={`min-h-screen overflow-x-hidden pb-24 ${theme.pageBackground}`}
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
    <main className={`min-h-screen overflow-x-hidden pb-24 ${theme.pageBackground}`}>
      <div className="mx-auto max-w-lg px-4 pb-6 pt-6 sm:px-6">
        <DashboardHeader />
        <StageProgressCard />
        <DailyQuestCard />
        <LearningPathCard />
        <NextLessonCard />
        <MigoTipCard />
      </div>
      <BottomNav activeTab="Ana Sayfa" />
      <PythonPathCelebrationController />
    </main>
  );
}
