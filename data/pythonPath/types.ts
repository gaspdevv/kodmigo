import type { PathLevel } from "@/lib/onboarding-data";

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
      ? 40
      : type === "Mini görev" || type === "Mini Proje"
        ? 25
        : type === "Pratik" || type === "Uygulama"
          ? 15
          : 10;

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
