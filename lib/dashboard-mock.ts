import { mockUser } from "@/lib/mockUser";

export const dashboardMock = {
  user: mockUser,
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
  migoTip:
    "Kod öğrenirken her şeyi ezberlemeye çalışma. Önce mantığı anlamaya odaklan.",
};
