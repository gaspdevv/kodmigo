import { dashboardMock } from "@/lib/dashboard-mock";
import { getStageTheme } from "@/components/dashboard/stageThemes";

export function getDashboardTheme() {
  return getStageTheme(dashboardMock.user.currentStage);
}
