import type { PathLevel } from "@/lib/onboarding-data";
import {
  getActivePathLevel,
  normalizeCodingLevel,
} from "@/lib/onboarding-data";

/** Onboarding başlangıç seviyesinden itibaren tamamlanması gereken seviye zinciri. */
export function getPythonLevelChain(startLevel: PathLevel): PathLevel[] {
  switch (startLevel) {
    case "beginner":
      return ["beginner", "basic", "intermediate"];
    case "basic":
      return ["basic", "intermediate"];
    case "intermediate":
      return ["intermediate"];
    default:
      return ["beginner", "basic", "intermediate"];
  }
}

export function getActivePythonLevelChain(): PathLevel[] {
  return getPythonLevelChain(getActivePathLevel());
}

export function normalizeStartLevel(value: unknown): PathLevel {
  return normalizeCodingLevel(value);
}
