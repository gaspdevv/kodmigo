import Link from "next/link";
import { getDashboardTheme } from "@/components/dashboard/getDashboardTheme";
import type { StageTheme } from "@/components/dashboard/stageThemes";
import type { Lesson } from "@/data/pythonPath";

type LessonCardProps = {
  lesson: Lesson;
};

function StatusIcon({
  status,
  theme,
}: {
  status: Lesson["status"];
  theme: StageTheme;
}) {
  if (status === "completed") {
    return (
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${theme.lessonCompletedIcon}`}
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
    );
  }

  if (status === "current") {
    return (
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold shadow-md ${theme.currentBadge}`}
      >
        ▶
      </span>
    );
  }

  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${theme.lessonLockedIcon}`}
    >
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
    </span>
  );
}

function LessonAction({
  lesson,
  theme,
}: {
  lesson: Lesson;
  theme: StageTheme;
}) {
  if (lesson.status === "current") {
    return (
      <Link
        href={`/lesson/${lesson.slug}`}
        className={`mt-3 inline-flex w-full cursor-pointer items-center justify-center rounded-xl py-2.5 text-sm font-semibold transition ${theme.primaryButton} ${theme.primaryButtonHover}`}
      >
        Derse başla
      </Link>
    );
  }

  if (lesson.status === "completed") {
    return (
      <Link
        href={`/lesson/${lesson.slug}`}
        className={`mt-3 inline-flex w-full cursor-pointer items-center justify-center rounded-xl py-2.5 text-sm font-semibold transition ${theme.lessonCompletedButton}`}
      >
        Tekrar et
      </Link>
    );
  }

  return (
    <span
      className={`mt-3 inline-flex w-full cursor-not-allowed items-center justify-center rounded-xl py-2.5 text-sm font-semibold ${theme.lessonLockedButton}`}
    >
      Kilitli
    </span>
  );
}

export default function LessonCard({ lesson }: LessonCardProps) {
  const theme = getDashboardTheme();
  const isCurrent = lesson.status === "current";
  const isLocked = lesson.status === "locked";
  const isCompleted = lesson.status === "completed";

  const cardClasses = isCurrent
    ? `border-2 ${theme.lessonCurrentBorder} ${theme.lessonCurrentCard} ${theme.cardShadow}`
    : isLocked
      ? `border ${theme.lessonLockedBorder} ${theme.lessonLockedCard}`
      : `border ${theme.lessonCompletedBorder} ${theme.lessonCompletedCard}`;

  const titleClass = isLocked
    ? theme.lessonLockedText
    : isCompleted
      ? theme.primaryText
      : theme.primaryText;

  const metaClass = isLocked ? theme.lessonLockedMutedText : theme.mutedText;

  return (
    <article className={`rounded-2xl p-4 transition ${cardClasses}`}>
      <div className="flex items-start gap-3">
        <StatusIcon status={lesson.status} theme={theme} />
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            {isCurrent && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${theme.currentBadge}`}
              >
                Sıradaki
              </span>
            )}
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                isLocked ? theme.lessonLockedBadge : theme.softBadge
              }`}
            >
              {lesson.type}
            </span>
            <span className={`text-xs ${metaClass}`}>{lesson.duration}</span>
          </div>
          <h3 className={`font-semibold leading-snug ${titleClass}`}>
            {lesson.title}
          </h3>
        </div>
      </div>
      <LessonAction lesson={lesson} theme={theme} />
    </article>
  );
}
