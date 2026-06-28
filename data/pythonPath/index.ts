import type { PathLevel } from "@/lib/onboarding-data";
import { resolveLessonXpReward } from "@/lib/xp-rewards";
import { beginnerPathMeta, beginnerPathUnits } from "./beginner";
import { basicPathMeta, basicPathUnits } from "./basic";
import { intermediatePathMeta, intermediatePathUnits } from "./intermediate";
import type { Lesson, PathMeta, Unit } from "./types";

export type { Lesson, LessonStatus, LessonType, PathMeta, Unit } from "./types";
export { beginnerPathMeta, beginnerPathUnits } from "./beginner";
export { basicPathMeta, basicPathUnits } from "./basic";
export { intermediatePathMeta, intermediatePathUnits } from "./intermediate";

const pathRegistry: Record<
  PathLevel,
  { meta: PathMeta; units: Unit[] }
> = {
  beginner: { meta: beginnerPathMeta, units: beginnerPathUnits },
  basic: { meta: basicPathMeta, units: basicPathUnits },
  intermediate: { meta: intermediatePathMeta, units: intermediatePathUnits },
};

const allPaths = Object.values(pathRegistry);

const allLessons = allPaths.flatMap((path) =>
  path.units.flatMap((unit) => unit.lessons),
);

const internalIdToSlug = new Map(
  allLessons.map((lesson) => [lesson.id, lesson.slug]),
);

const slugToLesson = new Map(allLessons.map((lesson) => [lesson.slug, lesson]));

export function getPythonPathMeta(level: PathLevel): PathMeta {
  return pathRegistry[level].meta;
}

export function getPythonPathUnits(level: PathLevel): Unit[] {
  return pathRegistry[level].units;
}

export function getPythonLessonsInOrder(level: PathLevel): Lesson[] {
  return getPythonPathUnits(level).flatMap((unit) => unit.lessons);
}

export function getPythonTotalLessons(level: PathLevel): number {
  return getPythonLessonsInOrder(level).length;
}

export function normalizeLessonId(lessonId: string): string {
  return internalIdToSlug.get(lessonId) ?? lessonId;
}

function isLessonCompletedInList(
  lesson: Lesson,
  completedLessonIds: string[],
): boolean {
  const completed = new Set(completedLessonIds.map(normalizeLessonId));
  return completed.has(lesson.slug) || completed.has(lesson.id);
}

export function getNextPythonLesson(
  completedLessonIds: string[],
  level: PathLevel,
): Lesson | null {
  const lessons = getPythonLessonsInOrder(level);
  return (
    lessons.find(
      (lesson) => !isLessonCompletedInList(lesson, completedLessonIds),
    ) ?? null
  );
}

export function getLessonUnit(
  lessonSlug: string,
  level?: PathLevel,
): Unit | undefined {
  const paths = level ? [pathRegistry[level]] : allPaths;

  for (const path of paths) {
    const unit = path.units.find((item) =>
      item.lessons.some((lesson) => lesson.slug === lessonSlug),
    );
    if (unit) return unit;
  }

  return undefined;
}

export function getLessonMetaBySlug(lessonSlug: string): Lesson | undefined {
  return slugToLesson.get(lessonSlug);
}

export function getLessonXpReward(lessonSlug: string): number {
  const meta = slugToLesson.get(lessonSlug);
  return resolveLessonXpReward(meta?.xpReward);
}

export function filterCompletedForPath(
  completedLessonIds: string[],
  level: PathLevel,
): string[] {
  const pathSlugs = new Set(
    getPythonLessonsInOrder(level).map((lesson) => lesson.slug),
  );

  return [
    ...new Set(
      completedLessonIds
        .map(normalizeLessonId)
        .filter((id) => pathSlugs.has(id)),
    ),
  ];
}

export function buildLearnPythonHref(lessonSlug: string | null): string {
  if (!lessonSlug) return "/learn/python";
  return `/learn/python?focus=${encodeURIComponent(lessonSlug)}`;
}

/** @deprecated Use getNextPythonLesson with level instead */
export function getNextIncompleteLesson(
  completedLessonIds: string[],
): Lesson | null {
  return getNextPythonLesson(completedLessonIds, "beginner");
}

// Backward-compatible exports for static references
export const pythonPathMeta = beginnerPathMeta;
export const pythonPathUnits = beginnerPathUnits;

export const pythonPathProgress = {
  completedLessons: 0,
  totalLessons: getPythonTotalLessons("beginner"),
  progressPercent: 0,
};
