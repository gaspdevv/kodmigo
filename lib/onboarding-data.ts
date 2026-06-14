export type CodingLevel = "none" | "some" | "basic";
export type LearningGoal =
  | "start"
  | "school"
  | "career"
  | "ai"
  | "projects";
export type DailyTime = "5" | "10" | "15" | "30";

export type OnboardingSelections = {
  level: CodingLevel | null;
  goal: LearningGoal | null;
  dailyTime: DailyTime | null;
};

export const ONBOARDING_STORAGE_KEY = "kodmigo-onboarding";

export const levelOptions: {
  value: CodingLevel;
  label: string;
  description: string;
}[] = [
  {
    value: "none",
    label: "Hiç bilmiyorum",
    description: "Kodlamaya tamamen sıfırdan başlamak istiyorum.",
  },
  {
    value: "some",
    label: "Biraz biliyorum",
    description: "Temel kavramları duydum ama pratik yapmam gerekiyor.",
  },
  {
    value: "basic",
    label: "Temel biliyorum",
    description: "Basit kodlar yazdım, daha düzenli ilerlemek istiyorum.",
  },
];

export const goalOptions: { value: LearningGoal; label: string }[] = [
  { value: "start", label: "Yazılıma başlamak" },
  { value: "school", label: "Okul veya dersler" },
  { value: "career", label: "Kariyer değiştirmek" },
  { value: "ai", label: "AI ve otomasyon" },
  { value: "projects", label: "Kendi projelerimi yapmak" },
];

export const dailyTimeOptions: { value: DailyTime; label: string }[] = [
  { value: "5", label: "5 dakika" },
  { value: "10", label: "10 dakika" },
  { value: "15", label: "15 dakika" },
  { value: "30", label: "30 dakika" },
];

export function getLevelLabel(level: CodingLevel): string {
  return levelOptions.find((o) => o.value === level)?.label ?? level;
}

export function getGoalLabel(goal: LearningGoal): string {
  return goalOptions.find((o) => o.value === goal)?.label ?? goal;
}

export function getDailyTimeLabel(time: DailyTime): string {
  return dailyTimeOptions.find((o) => o.value === time)?.label ?? time;
}
