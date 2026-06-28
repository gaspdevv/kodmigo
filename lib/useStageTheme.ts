"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getStageTheme,
  type StageKey,
  type StageTheme,
} from "@/components/dashboard/stageThemes";
import { getUserProgress } from "@/lib/progress";
import { useAppStateRefresh } from "@/lib/useAppStateRefresh";

function resolveStageTheme(): StageTheme {
  return getStageTheme(getUserProgress().currentStage);
}

/** Client-side stage theme from the user's current XP / stage. Falls back to Bronz. */
export function useStageTheme(fallback: StageKey = "bronze"): StageTheme {
  const [theme, setTheme] = useState(() => getStageTheme(fallback));

  const refreshTheme = useCallback(() => {
    setTheme(resolveStageTheme());
  }, []);

  useEffect(() => {
    refreshTheme();
  }, [refreshTheme]);

  useAppStateRefresh(refreshTheme);

  return theme;
}

export function getClientStageTheme(): StageTheme {
  if (typeof window === "undefined") {
    return getStageTheme("bronze");
  }
  return resolveStageTheme();
}
