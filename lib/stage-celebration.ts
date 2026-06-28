import type { StageKey } from "@/components/dashboard/stageThemes";
import { compareStages } from "@/lib/stage-progress";

const STORAGE_KEY = "kodmigo_last_celebrated_stage";

function isValidStageKey(value: unknown): value is StageKey {
  return (
    typeof value === "string" &&
    ["bronze", "silver", "gold", "platinum", "diamond", "master"].includes(
      value,
    )
  );
}

export function getLastCelebratedStage(): StageKey {
  if (typeof window === "undefined") return "bronze";

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw || !isValidStageKey(raw)) return "bronze";
    return raw;
  } catch {
    return "bronze";
  }
}

export function markStageCelebrated(stage: StageKey): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, stage);
  } catch {
    // localStorage kullanılamıyorsa sessizce geç
  }
}

/** Returns the stage key if it should be celebrated now, otherwise null. */
export function consumeStageCelebration(currentStage: StageKey): StageKey | null {
  const lastCelebrated = getLastCelebratedStage();
  if (compareStages(currentStage, lastCelebrated) <= 0) return null;

  markStageCelebrated(currentStage);
  return currentStage;
}
