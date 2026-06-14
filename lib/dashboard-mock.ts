import type { StageKey } from "@/components/dashboard/stageThemes";
import {
  stageIcons,
  stageNames,
} from "@/components/dashboard/stageThemes";

/** Test için currentStage değiştir: bronze | silver | gold | platinum | diamond | master */
const CURRENT_STAGE: StageKey = "bronze";
/** Son aşamada (master) null yap */
const NEXT_STAGE: StageKey | null = "silver";

function buildUserMock() {
  return {
    name: "Osman",
    currentStage: CURRENT_STAGE,
    nextStage: NEXT_STAGE,
    currentStageName: stageNames[CURRENT_STAGE],
    nextStageName: NEXT_STAGE ? stageNames[NEXT_STAGE] : null,
    currentStageIcon: stageIcons[CURRENT_STAGE],
    nextStageIcon: NEXT_STAGE ? stageIcons[NEXT_STAGE] : null,
    currentXp: CURRENT_STAGE === "master" ? 1200 : 120,
    requiredXp: CURRENT_STAGE === "master" ? 1200 : 200,
    progressPercent: CURRENT_STAGE === "master" ? 100 : 60,
    streakDays: CURRENT_STAGE === "master" ? 12 : 3,
  };
}

export const dashboardMock = {
  user: buildUserMock(),
  dailyQuest: {
    title: "Bugünün görevi",
    description: "1 kısa ders tamamla ve serini koru.",
    completed: 0,
    total: 1,
  },
  learningPath: {
    title: "Python Başlangıç Yolu",
    description:
      "Değişkenler, koşullar, döngüler ve mini projelerle sıfırdan ilerle.",
    progress: 18,
    completedLessons: 3,
    totalLessons: 16,
  },
  nextLesson: {
    title: "Python'da değişkenler",
    description: "Verileri isimlerle saklamayı öğren.",
    tags: ["5 dk", "Başlangıç", "Mini görev"],
  },
  migoTip:
    "Kod öğrenirken her şeyi ezberlemeye çalışma. Önce mantığı anlamaya odaklan.",
};
