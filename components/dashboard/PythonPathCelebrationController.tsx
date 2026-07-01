"use client";

import { useCallback, useEffect, useState } from "react";
import PythonPathCelebrationModal from "@/components/dashboard/PythonPathCelebrationModal";
import { type StageKey } from "@/components/dashboard/stageThemes";
import { getActivePathLevel } from "@/lib/onboarding-data";
import { getPythonPathCompletionStatusForStartLevel } from "@/lib/python-path-completion";
import type { PythonPathCompletionStatus } from "@/lib/python-path-completion";
import {
  getEffectiveCompletedLessonIds,
  getUserProgress,
  isPythonPathCompletionCelebrated,
} from "@/lib/progress";
import { useAppStateRefresh } from "@/lib/useAppStateRefresh";

type CelebrationState = {
  open: boolean;
  completion: PythonPathCompletionStatus;
  userXp: number;
  currentStage: StageKey;
};

const CLOSED_STATE: CelebrationState = {
  open: false,
  completion: { isCompleted: false, completedCount: 0, totalCount: 0 },
  userXp: 0,
  currentStage: "bronze",
};

export default function PythonPathCelebrationController() {
  const [celebration, setCelebration] = useState<CelebrationState>(CLOSED_STATE);

  const evaluateCelebration = useCallback(() => {
    const startLevel = getActivePathLevel();
    const completedLessonIds = getEffectiveCompletedLessonIds();
    const completion = getPythonPathCompletionStatusForStartLevel(
      startLevel,
      completedLessonIds,
    );

    if (!completion.isCompleted || isPythonPathCompletionCelebrated()) {
      setCelebration((prev) => (prev.open ? { ...prev, open: false } : prev));
      return;
    }

    const progress = getUserProgress();
    setCelebration({
      open: true,
      completion,
      userXp: progress.currentXp,
      currentStage: progress.currentStage,
    });
  }, []);

  useEffect(() => {
    evaluateCelebration();
  }, [evaluateCelebration]);

  useAppStateRefresh(evaluateCelebration);

  const handleClose = useCallback(() => {
    setCelebration((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <PythonPathCelebrationModal
      open={celebration.open}
      completion={celebration.completion}
      userXp={celebration.userXp}
      currentStage={celebration.currentStage}
      onClose={handleClose}
    />
  );
}
