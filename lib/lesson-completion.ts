import { buildLearnPythonHref, getNextPythonLesson } from "@/data/pythonPath";
import { getActivePathLevel } from "@/lib/onboarding-data";
import {
  applyLessonCompletion,
  getEffectiveCompletedLessonIds,
  getLearningProgress,
  isLessonCompleted,
  saveLearningProgress,
} from "@/lib/progress";
import { saveLessonRewardsIfNew } from "@/lib/rewards";
import { notifyAppStateLocalChanged } from "@/lib/appStateNotify";
import { updateStreakOnLessonComplete } from "@/lib/streak";

export function finalizeLessonCompletion(lessonId: string, xp: number): boolean {
  if (typeof window === "undefined") return false;

  const wasAlreadyCompleted = isLessonCompleted("python", lessonId);
  if (wasAlreadyCompleted) return false;

  saveLessonRewardsIfNew("python", lessonId, xp);

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
