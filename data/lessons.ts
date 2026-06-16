export type LessonStepType =
  | "info"
  | "multiple-choice"
  | "fill-blank"
  | "output-quiz"
  | "complete";

export type LessonStepFeedback = {
  correct: string;
  incorrect: string;
};

export type LessonStep = {
  id: string;
  type: LessonStepType;
  title: string;
  content?: string;
  code?: string;
  fillBlankCode?: string;
  options?: string[];
  correctAnswer?: string;
  migoMessage?: string;
  feedback?: LessonStepFeedback;
  buttonLabel?: string;
  completeRewards?: {
    xp: string;
    streak: string;
    nextLesson: string;
  };
};

export type LessonContent = {
  id: string;
  title: string;
  description: string;
  duration: string;
  steps: LessonStep[];
};

export const lessons: Record<string, LessonContent> = {
  "python-print": {
    id: "python-print",
    title: "print() komutu",
    description: "Python'da ekrana yazı yazdırmayı öğren.",
    duration: "5 dk",
    steps: [
      {
        id: "step-1",
        type: "info",
        title: "print() ne işe yarar?",
        content:
          "Python'da ekrana bir şey yazdırmak için print() komutunu kullanırız.",
        code: 'print("Merhaba Kodmigo")',
        migoMessage:
          "print() komutunu, Python'un ekrana konuşması gibi düşünebilirsin.",
        buttonLabel: "Devam et",
      },
      {
        id: "step-2",
        type: "multiple-choice",
        title: "Aşağıdaki kod ne yapar?",
        code: 'print("Merhaba Kodmigo")',
        options: [
          "Ekrana Merhaba Kodmigo yazar",
          "Yeni bir dosya oluşturur",
          "Python'u kapatır",
          "Hata verir",
        ],
        correctAnswer: "Ekrana Merhaba Kodmigo yazar",
        feedback: {
          correct:
            "Harika! print() komutu ekrana çıktı vermek için kullanılır.",
          incorrect:
            "Tam değil. print() genellikle ekrana çıktı vermek için kullanılır. Bir daha dene.",
        },
      },
      {
        id: "step-3",
        type: "fill-blank",
        title: "Ekrana Selam yazdır",
        content: "Boşluğu tamamlayarak ekrana Selam yazdır.",
        fillBlankCode: '____("Selam")',
        options: ["print", "show", "write", "display"],
        correctAnswer: "print",
        feedback: {
          correct: "Harika! print() ile ekrana Selam yazdırdın. ✨",
          incorrect:
            "Tam değil. Ekrana yazdırmak için print() kullanılır. Bir daha dene.",
        },
      },
      {
        id: "step-4",
        type: "output-quiz",
        title: "Bu kodun çıktısı ne olur?",
        code: 'print("Python öğreniyorum")',
        options: ["Python öğreniyorum", "print", "Hata", "Kodmigo"],
        correctAnswer: "Python öğreniyorum",
        feedback: {
          correct:
            "Harika! print() parantez içindeki metni olduğu gibi ekrana yazar.",
          incorrect:
            "Tam değil. print() içindeki metin ekrana yazılır. Bir daha dene.",
        },
      },
      {
        id: "step-5",
        type: "complete",
        title: "Dersi tamamladın!",
        content:
          "print() komutuyla Python'da ekrana çıktı vermeyi öğrendin.",
        completeRewards: {
          xp: "+10 XP",
          streak: "Serine katkı sağlandı",
          nextLesson: "Sıradaki ders: İlk çıktını al",
        },
      },
    ],
  },
};

export function getLessonById(lessonId: string): LessonContent | undefined {
  return lessons[lessonId];
}
