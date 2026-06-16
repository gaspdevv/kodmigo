"use client";

import { useEffect, useState } from "react";
import { getDashboardTheme } from "@/components/dashboard/getDashboardTheme";
import {
  getDefaultLearningProgress,
  getLearningProgress,
  type PythonLearningProgress,
} from "@/lib/progress";
import { pythonPathMeta } from "@/data/pythonPath";

export default function LearningPathHeader() {
  const theme = getDashboardTheme();
  const defaultProgress = getDefaultLearningProgress().python;
  const [progress, setProgress] =
    useState<PythonLearningProgress>(defaultProgress);

  useEffect(() => {
    setProgress(getLearningProgress().python);
  }, []);

  const roundedPercent = Math.round(progress.progressPercent);

  return (
    <header className="mb-6">
      <h1
        className={`text-2xl font-bold tracking-tight sm:text-3xl ${theme.primaryText}`}
      >
        {pythonPathMeta.title}
      </h1>
      <p
        className={`mt-2 text-sm leading-relaxed sm:text-base ${theme.mutedText}`}
      >
        {pythonPathMeta.description}
      </p>

      <div className="mt-5">
        <p className={`mb-2 text-sm font-medium ${theme.mutedText}`}>
          {progress.completedCount} / {progress.totalLessons} ders tamamlandı
        </p>
        <div
          className={`h-2.5 overflow-hidden rounded-full ${theme.progressTrack}`}
        >
          <div
            className={`h-full rounded-full ${theme.progressBar}`}
            style={{ width: `${progress.progressPercent}%` }}
          />
        </div>
        <p className={`mt-2 text-xs ${theme.mutedText}`}>
          %{roundedPercent} tamamlandı
        </p>
      </div>
    </header>
  );
}
