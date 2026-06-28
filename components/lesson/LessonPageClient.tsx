"use client";

import LessonNotFound from "@/components/lesson/LessonNotFound";
import LessonShell from "@/components/lesson/LessonShell";
import type { LessonContent } from "@/data/lessons";
import { useStageTheme } from "@/lib/useStageTheme";

type LessonPageClientProps = {
  lesson: LessonContent | null;
};

export default function LessonPageClient({ lesson }: LessonPageClientProps) {
  const theme = useStageTheme();

  if (!lesson) {
    return (
      <main className={`min-h-screen ${theme.pageBackground}`}>
        <LessonNotFound theme={theme} />
      </main>
    );
  }

  return (
    <main className={`min-h-screen ${theme.pageBackground}`}>
      <LessonShell lesson={lesson} theme={theme} />
    </main>
  );
}
