import { getStageTheme } from "@/components/dashboard/stageThemes";
import { mockUser } from "@/lib/mockUser";

export function getDashboardTheme() {
  return getStageTheme(mockUser.currentStage);
}
