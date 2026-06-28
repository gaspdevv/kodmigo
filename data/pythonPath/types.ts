import type { PathLevel } from "@/lib/onboarding-data";
import {
  MINI_TASK_XP,
  NORMAL_LESSON_XP,
  PROJECT_LESSON_XP,
} from "@/lib/xp-rewards";

export type LessonStatus = "completed" | "current" | "locked";
export type LessonType =
  | "Kısa ders"
  | "Mini görev"
  | "Mini Proje"
  | "Pratik"
  | "Uygulama"
  | "Proje";

export type Lesson = {
  id: string;
  title: string;
  duration: string;
  type: LessonType;
  status: LessonStatus;
  slug: string;
  xpReward: number;
};

export type Unit = {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
};

export type PathMeta = {
  title: string;
  description: string;
  migoTip: string;
  levelLabel: string;
  pathLevel: PathLevel;
};

export function makeLesson(
  id: string,
  slug: string,
  title: string,
  duration: string,
  type: LessonType,
): Lesson {
  const xpReward =
    type === "Proje"
      ? PROJECT_LESSON_XP
      : type === "Mini görev" || type === "Mini Proje"
        ? MINI_TASK_XP
        : NORMAL_LESSON_XP;

  return {
    id,
    slug,
    title,
    duration,
    type,
    status: "locked",
    xpReward,
  };
}
