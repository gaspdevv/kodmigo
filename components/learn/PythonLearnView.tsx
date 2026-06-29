"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import BottomNav from "@/components/dashboard/BottomNav";
import { getDashboardTheme } from "@/components/dashboard/getDashboardTheme";
import LearningPathHeader from "@/components/learn/LearningPathHeader";
import MigoPathTip from "@/components/learn/MigoPathTip";
import UnitSection from "@/components/learn/UnitSection";
import {
  getChainedPathSections,
  getPythonChainDisplayMeta,
  type ChainedPathSection,
} from "@/data/pythonPath";
import { getActivePathLevel } from "@/lib/onboarding-data";
import { useRequireAuth } from "@/lib/auth/useRequireAuth";
import { getLearningProgress } from "@/lib/progress";

export default function PythonLearnView() {
  const theme = getDashboardTheme();
  const { loading: authLoading, isAuthenticated } = useRequireAuth();
  const searchParams = useSearchParams();
  const startLevel = getActivePathLevel();
  const pathDisplay = useMemo(
    () => getPythonChainDisplayMeta(startLevel),
    [startLevel],
  );

  const [sections, setSections] = useState<ChainedPathSection[]>([]);
  const [focusedLessonSlug, setFocusedLessonSlug] = useState<string | null>(
    null,
  );
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const saved = getLearningProgress().python;
    setSections(
      getChainedPathSections(startLevel, saved.completedLessonIds),
    );
    setIsReady(true);
  }, [startLevel]);

  const focusParam = searchParams.get("focus");

  useEffect(() => {
    if (!isReady || !focusParam) return;

    let clearHighlightTimer: number | undefined;

    const scrollTimer = window.setTimeout(() => {
      const element = document.getElementById(`lesson-${focusParam}`);
      if (!element) return;

      element.scrollIntoView({ behavior: "smooth", block: "center" });
      setFocusedLessonSlug(focusParam);

      clearHighlightTimer = window.setTimeout(() => {
        setFocusedLessonSlug(null);
      }, 2500);
    }, 150);

    return () => {
      window.clearTimeout(scrollTimer);
      if (clearHighlightTimer !== undefined) {
        window.clearTimeout(clearHighlightTimer);
      }
    };
  }, [isReady, focusParam]);

  let unitIndex = 0;

  if (authLoading || !isAuthenticated || !isReady) {
    return (
      <main
        className={`min-h-screen overflow-x-hidden pb-24 ${theme.pageBackground}`}
        aria-busy="true"
      >
        <div className="mx-auto max-w-lg px-4 pb-6 pt-6 sm:px-6">
          <div className="mb-4 h-8 w-48 animate-pulse rounded-lg bg-slate-200/60" />
          <div className="mb-4 h-32 animate-pulse rounded-3xl bg-slate-200/60" />
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen overflow-x-hidden pb-24 ${theme.pageBackground}`}>
      <div className="mx-auto max-w-lg px-4 pb-6 pt-6 sm:px-6">
        <LearningPathHeader pathDisplay={pathDisplay} />
        <MigoPathTip migoTip={pathDisplay.migoTip} />
        {sections.map((section) => (
          <div key={section.level} className="mb-8">
            <div className="mb-4">
              <span
                className={`mb-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${theme.softBadge}`}
              >
                {section.meta.levelLabel}
              </span>
              <h2 className={`text-lg font-bold ${theme.primaryText}`}>
                {section.meta.title}
              </h2>
              <p className={`mt-1 text-sm ${theme.mutedText}`}>
                {section.meta.description}
              </p>
            </div>
            {section.units.map((unit) => {
              const index = unitIndex;
              unitIndex += 1;
              return (
                <UnitSection
                  key={unit.id}
                  unit={unit}
                  index={index}
                  focusedLessonSlug={focusedLessonSlug}
                />
              );
            })}
          </div>
        ))}
      </div>
      <BottomNav activeTab="Yol" />
    </main>
  );
}
