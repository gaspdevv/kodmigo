import { getDashboardTheme } from "@/components/dashboard/getDashboardTheme";
import LessonCard from "@/components/learn/LessonCard";
import type { Unit } from "@/data/pythonPath";

type UnitSectionProps = {
  unit: Unit;
  index: number;
  focusedLessonSlug?: string | null;
};

export default function UnitSection({
  unit,
  index,
  focusedLessonSlug,
}: UnitSectionProps) {
  const theme = getDashboardTheme();
  const hasCurrentLesson = unit.lessons.some((l) => l.status === "current");
  const allLocked = unit.lessons.every((l) => l.status === "locked");
  const allCompleted = unit.lessons.every(
    (l) => l.status === "completed" || l.status === "current",
  );

  return (
    <section className="mb-8">
      <div className="mb-4 flex items-start gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
            hasCurrentLesson
              ? `${theme.currentBadge} shadow-md`
              : allLocked
                ? theme.lessonLockedIcon
                : allCompleted
                  ? theme.lessonCompletedIcon
                  : theme.softBadge
          }`}
        >
          {index + 1}
        </span>
        <div>
          <h2
            className={`text-lg font-bold ${
              allLocked ? theme.lessonLockedText : theme.primaryText
            }`}
          >
            {unit.title}
          </h2>
          <p
            className={`mt-0.5 text-sm ${
              allLocked ? theme.lessonLockedMutedText : theme.mutedText
            }`}
          >
            {unit.description}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 pl-0 sm:pl-12">
        {unit.lessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            isFocused={lesson.slug === focusedLessonSlug}
          />
        ))}
      </div>
    </section>
  );
}
