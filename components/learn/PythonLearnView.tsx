"use client";

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
  const [units, setUnits] = useState<Unit[]>(pythonPathUnits);

  useEffect(() => {
    const saved = getLearningProgress().python;
    setUnits(applyPythonLessonStatuses(pythonPathUnits, saved.completedLessonIds));
  }, []);

  const visibleUnits = useMemo(() => units, [units]);

  return (
    <main className={`min-h-screen pb-24 ${theme.pageBackground}`}>
      <div className="mx-auto max-w-lg px-4 pb-6 pt-6 sm:px-6">
        <LearningPathHeader />
        <MigoPathTip />
        {visibleUnits.map((unit, index) => (
          <UnitSection key={unit.id} unit={unit} index={index} />
        ))}
      </div>
      <BottomNav activeTab="Yol" />
    </main>
  );
}
