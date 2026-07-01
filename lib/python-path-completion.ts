import type { Lesson } from "@/data/pythonPath";
import { getPythonLessonsInOrder, normalizeLessonId } from "@/data/pythonPath";
import type { PathLevel } from "@/lib/onboarding-data";
import { getPythonLevelChain } from "@/lib/python-level-chain";

export type PythonPathCompletionStatus = {
  isCompleted: boolean;
  completedCount: number;
  totalCount: number;
};

type GetPythonPathCompletionStatusParams = {
  levelChain: PathLevel[];
  lessonsByLevel: (level: PathLevel) => Lesson[];
  completedLessonIds: string[];
};

export function getPythonPathCompletionStatus({
  levelChain,
  lessonsByLevel,
  completedLessonIds,
}: GetPythonPathCompletionStatusParams): PythonPathCompletionStatus {
  const completedSet = new Set(completedLessonIds.map(normalizeLessonId));

  let totalCount = 0;
  let completedCount = 0;

  for (const level of levelChain) {
    const lessons = lessonsByLevel(level);
    totalCount += lessons.length;
    completedCount += lessons.filter(
      (lesson) =>
        completedSet.has(lesson.slug) || completedSet.has(lesson.id),
    ).length;
  }

  return {
    isCompleted: totalCount > 0 && completedCount >= totalCount,
    completedCount,
    totalCount,
  };
}

export function getPythonPathCompletionStatusForStartLevel(
  startLevel: PathLevel,
  completedLessonIds: string[],
): PythonPathCompletionStatus {
  return getPythonPathCompletionStatus({
    levelChain: getPythonLevelChain(startLevel),
    lessonsByLevel: getPythonLessonsInOrder,
    completedLessonIds,
  });
}
