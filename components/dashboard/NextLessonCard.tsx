"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getDashboardTheme } from "@/components/dashboard/getDashboardTheme";
import {
  buildLearnPythonHref,
  getLessonUnit,
  getNextPythonLesson,
  getPythonLessonsInOrder,
  type Lesson,
} from "@/data/pythonPath";
import { getEffectiveCompletedLessonIds } from "@/lib/progress";
import { playClickSound } from "@/lib/sounds";

export default function NextLessonCard() {
  const theme = getDashboardTheme();
  const [isReady, setIsReady] = useState(false);
  const [nextLesson, setNextLesson] = useState<Lesson | null>(null);
  const [allCompleted, setAllCompleted] = useState(false);

  useEffect(() => {
    const completedLessonIds = getEffectiveCompletedLessonIds();
    const next = getNextPythonLesson(completedLessonIds);
    const totalLessons = getPythonLessonsInOrder().length;

    setNextLesson(next);
    setAllCompleted(next === null && totalLessons > 0);
    setIsReady(true);
  }, []);

  if (!isReady) {
    return (
      <section
        className={`mb-4 rounded-3xl border-2 p-5 ${theme.cardBackground} ${theme.cardBorder} ${theme.cardShadow}`}
        aria-hidden
      >
        <div className={`mb-2 h-4 w-24 rounded ${theme.progressTrack}`} />
        <div className={`mb-4 h-6 w-48 rounded-lg ${theme.progressTrack}`} />
        <div className={`h-11 rounded-2xl ${theme.progressTrack}`} />
      </section>
    );
  }

  if (allCompleted) {
    return (
      <section
        className={`mb-4 rounded-3xl border-2 p-5 ${theme.cardBackground} ${theme.cardBorder} ${theme.cardShadow}`}
      >
        <p
          className={`mb-1 text-xs font-semibold uppercase tracking-wide ${theme.sectionAccent}`}
        >
          Sıradaki ders
        </p>
        <h2 className={`mb-2 text-xl font-bold ${theme.primaryText}`}>
          Python Başlangıç Yolu tamamlandı
        </h2>
        <p className={`mb-4 text-sm ${theme.mutedText}`}>
          Harika iş! Yeni egzersizler yakında eklenecek.
        </p>

        <Link
          href="/learn/python"
          onClick={playClickSound}
          className={`block w-full cursor-pointer rounded-2xl py-3 text-center text-sm font-semibold transition ${theme.primaryButton} ${theme.primaryButtonHover}`}
        >
          Yolu görüntüle
        </Link>
      </section>
    );
  }

  if (!nextLesson) return null;

  const unit = getLessonUnit(nextLesson.slug);
  const tags = [nextLesson.duration, nextLesson.type];
  const href = buildLearnPythonHref(nextLesson.slug);

  return (
    <section
      className={`mb-4 rounded-3xl border-2 p-5 ${theme.cardBackground} ${theme.cardBorder} ${theme.cardShadow}`}
    >
      <p
        className={`mb-1 text-xs font-semibold uppercase tracking-wide ${theme.sectionAccent}`}
      >
        Sıradaki ders
      </p>
      <h2 className={`mb-2 text-xl font-bold ${theme.primaryText}`}>
        {nextLesson.title}
      </h2>
      <p className={`mb-4 text-sm ${theme.mutedText}`}>
        {unit?.description ?? "Python yolunda bir sonraki adıma geç."}
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className={`rounded-full px-3 py-1 text-xs font-medium ${theme.softBadge}`}
          >
            {tag}
          </span>
        ))}
      </div>

      <Link
        href={href}
        onClick={playClickSound}
        className={`block w-full cursor-pointer rounded-2xl py-3 text-center text-sm font-semibold transition ${theme.primaryButton} ${theme.primaryButtonHover}`}
      >
        Derse başla
      </Link>
    </section>
  );
}
