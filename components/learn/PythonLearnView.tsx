"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import BottomNav from "@/components/dashboard/BottomNav";
import { getDashboardTheme } from "@/components/dashboard/getDashboardTheme";
import LearningPathHeader from "@/components/learn/LearningPathHeader";
import MigoPathTip from "@/components/learn/MigoPathTip";
import UnitSection from "@/components/learn/UnitSection";
import { pythonPathUnits, type Unit } from "@/data/pythonPath";
import {
  applyPythonLessonStatuses,
  getLearningProgress,
} from "@/lib/progress";

export default function PythonLearnView() {
  const theme = getDashboardTheme();
  const searchParams = useSearchParams();
  const [units, setUnits] = useState<Unit[]>(pythonPathUnits);
  const [focusedLessonSlug, setFocusedLessonSlug] = useState<string | null>(
    null,
  );
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const saved = getLearningProgress().python;
    setUnits(applyPythonLessonStatuses(pythonPathUnits, saved.completedLessonIds));
    setIsReady(true);
  }, []);

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

  const visibleUnits = useMemo(() => units, [units]);

  return (
    <main className={`min-h-screen pb-24 ${theme.pageBackground}`}>
      <div className="mx-auto max-w-lg px-4 pb-6 pt-6 sm:px-6">
        <LearningPathHeader />
        <MigoPathTip />
        {visibleUnits.map((unit, index) => (
          <UnitSection
            key={unit.id}
            unit={unit}
            index={index}
            focusedLessonSlug={focusedLessonSlug}
          />
        ))}
      </div>
      <BottomNav activeTab="Yol" />
    </main>
  );
}
