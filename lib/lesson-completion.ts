import { buildLearnPythonHref, getNextPythonLesson } from "@/data/pythonPath";
import { getActivePathLevel } from "@/lib/onboarding-data";
import {
  applyLessonCompletion,
  applyXpReward,
  getEffectiveCompletedLessonIds,
  getLearningProgress,
  getUserProgress,
  isLessonCompleted,
  saveLearningProgress,
  saveUserProgress,
} from "@/lib/progress";
import { addPendingXpReward } from "@/lib/rewards";
import { notifyAppStateLocalChanged } from "@/lib/appStateNotify";
import { updateStreakOnLessonComplete } from "@/lib/streak";

export function finalizeLessonCompletion(lessonId: string, xp: number): boolean {
  if (typeof window === "undefined") return false;

  if (isLessonCompleted("python", lessonId)) return false;

  const userProgress = getUserProgress();
  saveUserProgress(applyXpReward(userProgress, xp));
  addPendingXpReward(lessonId, xp);

  const store = getLearningProgress();
  const { progress, applied } = applyLessonCompletion(store.python, lessonId);
  if (applied) {
    saveLearningProgress({ python: progress });
  }

  updateStreakOnLessonComplete();
  notifyAppStateLocalChanged(true);
  return true;
}

export function getLearnPathHrefAfterLesson(lessonId: string): string {
  const pathLevel = getActivePathLevel();
  const completedIds = getEffectiveCompletedLessonIds();
  const next = getNextPythonLesson(completedIds, pathLevel);
  return buildLearnPythonHref(next?.slug ?? null);
}
