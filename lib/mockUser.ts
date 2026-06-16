import type { StageKey } from "@/components/dashboard/stageThemes";
import {
  stageIcons,
  stageNames,
} from "@/components/dashboard/stageThemes";

/** Test için currentStage değiştir: bronze | silver | gold | platinum | diamond | master */
export const MOCK_CURRENT_STAGE: StageKey = "bronze";
/** Son aşamada (master) null yap */
export const MOCK_NEXT_STAGE: StageKey | null = "silver";

export function buildMockUser() {
  const currentStage = MOCK_CURRENT_STAGE;
  const nextStage = MOCK_NEXT_STAGE;

  return {
    name: "Osman",
    currentStage,
    nextStage,
    currentStageName: stageNames[currentStage],
    nextStageName: nextStage ? stageNames[nextStage] : null,
    currentStageIcon: stageIcons[currentStage],
    nextStageIcon: nextStage ? stageIcons[nextStage] : null,
    currentXp: currentStage === "master" ? 1200 : 0,
    requiredXp: currentStage === "master" ? 1200 : 200,
    progressPercent: currentStage === "master" ? 100 : 0,
    streakDays: 0,
  };
}

export const mockUser = buildMockUser();
