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
  nextLesson: {
    title: "Python'da değişkenler",
    description: "Verileri isimlerle saklamayı öğren.",
    tags: ["5 dk", "Başlangıç", "Mini görev"],
  },
  migoTip:
    "Kod öğrenirken her şeyi ezberlemeye çalışma. Önce mantığı anlamaya odaklan.",
};
