import { getStageTheme, type StageKey } from "@/components/dashboard/stageThemes";
import { getUserProgress } from "@/lib/progress";
import { mockUser } from "@/lib/mockUser";

export function getDashboardTheme(stageKey?: StageKey) {
  if (stageKey) {
    return getStageTheme(stageKey);
  }

  if (typeof window !== "undefined") {
    return getStageTheme(getUserProgress().currentStage);
  }

  return getStageTheme(mockUser.currentStage);
}
