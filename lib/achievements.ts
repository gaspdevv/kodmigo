import type { PythonLearningProgress, UserProgress } from "@/lib/progress";
import type { StreakProgress } from "@/lib/streak";

export type Achievement = {
  id: string;
  title: string;
  icon: string;
  description: string;
  priority: number;
  unlocked: boolean;
};

export const ACHIEVEMENT_DEFINITIONS = [
  {
    id: "first_spark",
    title: "İlk Kıvılcım",
    icon: "✨",
    description: "İlk dersini tamamladın.",
    priority: 1,
  },
  {
    id: "streak_started",
    title: "Seri Başladı",
    icon: "🔥",
    description: "3 gün üst üste öğrenmeye devam ettin.",
    priority: 2,
  },
  {
    id: "python_traveler",
    title: "Python Yolcusu",
    icon: "🐍",
    description: "Python yolunda 5 dersi tamamladın.",
    priority: 3,
  },
  {
    id: "dedicated_student",
    title: "Kararlı Öğrenci",
    icon: "💪",
    description: "7 günlük öğrenme serisine ulaştın.",
    priority: 4,
  },
  {
    id: "code_explorer",
    title: "Kod Kaşifi",
    icon: "🧭",
    description: "10 dersi tamamlayarak yolculuğunu güçlendirdin.",
    priority: 5,
  },
  {
    id: "xp_collector",
    title: "XP Toplayıcı",
    icon: "⭐",
    description: "250 XP'ye ulaştın.",
    priority: 6,
  },
  {
    id: "flame_keeper",
    title: "Alev Koruyucu",
    icon: "🛡️",
    description: "Serini kurtarmayı başardın.",
    priority: 7,
  },
  {
    id: "bronze_master",
    title: "Bronz Usta",
    icon: "🥉",
    description: "Bronz aşamada ustalaştın.",
    priority: 8,
  },
] as const;

export type AchievementId = (typeof ACHIEVEMENT_DEFINITIONS)[number]["id"];

function isBronzeMaster(userProgress: UserProgress): boolean {
  return userProgress.currentStage !== "bronze";
}

function checkAchievementUnlocked(
  id: AchievementId,
  userProgress: UserProgress,
  learningProgress: PythonLearningProgress,
  streakProgress: StreakProgress,
): boolean {
  const completedCount = learningProgress.completedCount;
  const { currentXp } = userProgress;
  const { currentStreak, longestStreak, hasUsedStreakRestore } = streakProgress;

  switch (id) {
    case "first_spark":
      return completedCount >= 1;
    case "streak_started":
      return currentStreak >= 3 || longestStreak >= 3;
    case "python_traveler":
      return completedCount >= 5;
    case "dedicated_student":
      return longestStreak >= 7;
    case "code_explorer":
      return completedCount >= 10;
    case "xp_collector":
      return currentXp >= 250;
    case "flame_keeper":
      return hasUsedStreakRestore;
    case "bronze_master":
      return isBronzeMaster(userProgress);
    default:
      return false;
  }
}

export function getAchievements(
  userProgress: UserProgress,
  learningProgress: PythonLearningProgress,
  streakProgress: StreakProgress,
): Achievement[] {
  return ACHIEVEMENT_DEFINITIONS.map((definition) => ({
    ...definition,
    unlocked: checkAchievementUnlocked(
      definition.id,
      userProgress,
      learningProgress,
      streakProgress,
    ),
  }));
}

export function getShowcasedAchievement(
  achievements: Achievement[],
  preferredBadgeId: string | null,
): Achievement | null {
  const unlocked = achievements.filter((a) => a.unlocked);

  if (unlocked.length === 0) return null;

  if (preferredBadgeId) {
    const preferred = unlocked.find((a) => a.id === preferredBadgeId);
    if (preferred) return preferred;
  }

  return unlocked.reduce((best, current) =>
    current.priority > best.priority ? current : best,
  );
}
