import type { PathLevel } from "@/lib/onboarding-data";
import { getPathLevelLabel } from "@/lib/onboarding-data";
import { getPythonLevelChain } from "@/lib/python-level-chain";
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

export function getPythonChainDisplayMeta(startLevel: PathLevel): {
  title: string;
  description: string;
  levelLabel: string;
  migoTip: string;
} {
  const chain = getPythonLevelChain(startLevel);

  if (chain.length === 1) {
    const meta = getPythonPathMeta(chain[0]);
    return {
      title: meta.title,
      description: meta.description,
      levelLabel: meta.levelLabel,
      migoTip: meta.migoTip,
    };
  }

  const startMeta = getPythonPathMeta(chain[0]);
  const levelNames = chain.map((level) => getPathLevelLabel(level)).join(" → ");

  return {
    title: "Python Öğrenme Yolu",
    description: `${levelNames} — seçtiğin seviyeden başlayarak sırayla ilerle.`,
    levelLabel: getPathLevelLabel(startLevel),
    migoTip: startMeta.migoTip,
  };
}

export function getPythonPathUnits(level: PathLevel): Unit[] {
  return pathRegistry[level].units;
}

export function getPythonLessonsInOrder(level: PathLevel): Lesson[] {
  return getPythonPathUnits(level).flatMap((unit) => unit.lessons);
}

/** Onboarding başlangıç seviyesine göre zincirdeki tüm dersleri sırayla döner. */
export function getPythonLessonsInChain(startLevel: PathLevel): Lesson[] {
  return getPythonLevelChain(startLevel).flatMap((level) =>
    getPythonLessonsInOrder(level),
  );
}

export function getPythonTotalLessons(startLevel: PathLevel): number {
  return getPythonLessonsInChain(startLevel).length;
}

export function getChainLessonSlugs(startLevel: PathLevel): Set<string> {
  return new Set(
    getPythonLessonsInChain(startLevel).flatMap((lesson) => [
      lesson.slug,
      lesson.id,
    ]),
  );
}

export function isLessonInChain(
  lessonId: string,
  startLevel: PathLevel,
): boolean {
  const normalized = normalizeLessonId(lessonId);
  return getChainLessonSlugs(startLevel).has(normalized);
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
  startLevel: PathLevel,
): Lesson | null {
  const lessons = getPythonLessonsInChain(startLevel);
  return (
    lessons.find(
      (lesson) => !isLessonCompletedInList(lesson, completedLessonIds),
    ) ?? null
  );
}

export function getLessonUnit(
  lessonSlug: string,
  startLevel?: PathLevel,
): Unit | undefined {
  const paths = startLevel
    ? getPythonLevelChain(startLevel).map((level) => pathRegistry[level])
    : allPaths;

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
  startLevel: PathLevel,
): string[] {
  const pathSlugs = getChainLessonSlugs(startLevel);

  return [
    ...new Set(
      completedLessonIds
        .map(normalizeLessonId)
        .filter((id) => pathSlugs.has(id)),
    ),
  ];
}

export type ChainedPathSection = {
  level: PathLevel;
  meta: PathMeta;
  units: Unit[];
};

export function getChainedPathSections(
  startLevel: PathLevel,
  completedLessonIds: string[],
): ChainedPathSection[] {
  const chain = getPythonLevelChain(startLevel);
  const allUnits = chain.flatMap((level) => getPythonPathUnits(level));
  const unitsWithStatus = applyPythonLessonStatuses(
    allUnits,
    completedLessonIds,
  );

  let offset = 0;
  return chain.map((level) => {
    const levelUnits = getPythonPathUnits(level);
    const units = unitsWithStatus.slice(offset, offset + levelUnits.length);
    offset += levelUnits.length;
    return { level, meta: getPythonPathMeta(level), units };
  });
}

export function applyPythonLessonStatuses(
  units: Unit[],
  completedLessonIds: string[],
): Unit[] {
  const completedSet = new Set(completedLessonIds.map(normalizeLessonId));
  let foundCurrent = false;

  return units.map((unit) => ({
    ...unit,
    lessons: unit.lessons.map((lesson) => {
      if (completedSet.has(lesson.slug) || completedSet.has(lesson.id)) {
        return { ...lesson, status: "completed" as const };
      }

      if (!foundCurrent) {
        foundCurrent = true;
        return { ...lesson, status: "current" as const };
      }

      return { ...lesson, status: "locked" as const };
    }),
  }));
}

export type ActivePythonLevelProgress = {
  levelKey: PathLevel | null;
  levelLabel: string | null;
  completedCount: number;
  totalCount: number;
  percent: number;
  isAllCompleted: boolean;
  subtitle: string;
  countLabel: string;
};

function countCompletedInLevel(
  level: PathLevel,
  completedLessonIds: string[],
): number {
  const completedSet = new Set(completedLessonIds.map(normalizeLessonId));
  return getPythonLessonsInOrder(level).filter(
    (lesson) =>
      completedSet.has(lesson.slug) || completedSet.has(lesson.id),
  ).length;
}

/** Dashboard kartı için zincirdeki aktif seviye ilerlemesini hesaplar. */
export function getActivePythonLevelProgress(
  completedLessonIds: string[],
  startLevel: PathLevel,
): ActivePythonLevelProgress {
  const chain = getPythonLevelChain(startLevel);
  let totalChainCompleted = 0;
  let totalChainLessons = 0;

  for (const level of chain) {
    const total = getPythonLessonsInOrder(level).length;
    const completed = countCompletedInLevel(level, completedLessonIds);

    totalChainCompleted += completed;
    totalChainLessons += total;

    if (completed < total) {
      const levelLabel = getPythonPathMeta(level).levelLabel;
      const percent =
        total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;

      return {
        levelKey: level,
        levelLabel,
        completedCount: completed,
        totalCount: total,
        percent,
        isAllCompleted: false,
        subtitle: `Şu an ${levelLabel} derslerindesin.`,
        countLabel: `${completed} / ${total} ders tamamlandı`,
      };
    }
  }

  return {
    levelKey: null,
    levelLabel: null,
    completedCount: totalChainCompleted,
    totalCount: totalChainLessons,
    percent: 100,
    isAllCompleted: true,
    subtitle: "Python öğrenme yolunu tamamladın! 🎉",
    countLabel: `${totalChainCompleted} / ${totalChainLessons} ders tamamlandı`,
  };
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
