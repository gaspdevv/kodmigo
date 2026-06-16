export type LessonStatus = "completed" | "current" | "locked";
export type LessonType = "Kısa ders" | "Mini görev" | "Pratik";

export type Lesson = {
  id: string;
  title: string;
  duration: string;
  type: LessonType;
  status: LessonStatus;
  slug: string;
};

export type Unit = {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
};

export const pythonPathMeta = {
  title: "Python Başlangıç Yolu",
  description:
    "Sıfırdan başlayarak Python'un temel kavramlarını kısa görevlerle öğren.",
  migoTip:
    "Bugün değişkenleri öğrenerek Python'da verileri nasıl saklayacağını keşfedeceksin.",
};

export const pythonPathUnits: Unit[] = [
  {
    id: "unit-1",
    title: "Başlangıç",
    description: "Python'a ilk adımını at.",
    lessons: [
      {
        id: "u1-l1",
        title: "Python nedir?",
        duration: "5 dk",
        type: "Kısa ders",
        status: "completed",
        slug: "python-what-is-python",
      },
      {
        id: "u1-l2",
        title: "print() komutu",
        duration: "5 dk",
        type: "Kısa ders",
        status: "completed",
        slug: "python-print",
      },
      {
        id: "u1-l3",
        title: "İlk çıktını al",
        duration: "5 dk",
        type: "Pratik",
        status: "current",
        slug: "python-first-output",
      },
      {
        id: "u1-l4",
        title: "Mini görev: Kendini tanıt",
        duration: "7 dk",
        type: "Mini görev",
        status: "locked",
        slug: "python-intro-task",
      },
    ],
  },
  {
    id: "unit-2",
    title: "Değişkenler",
    description: "Verileri isimlerle saklamayı öğren.",
    lessons: [
      {
        id: "u2-l1",
        title: "Değişken nedir?",
        duration: "5 dk",
        type: "Kısa ders",
        status: "locked",
        slug: "python-variables",
      },
      {
        id: "u2-l2",
        title: "Metin ve sayı değerleri",
        duration: "5 dk",
        type: "Kısa ders",
        status: "locked",
        slug: "python-text-numbers",
      },
      {
        id: "u2-l3",
        title: "Değişkenleri ekrana yazdır",
        duration: "5 dk",
        type: "Pratik",
        status: "locked",
        slug: "python-print-variables",
      },
      {
        id: "u2-l4",
        title: "Mini görev: Profil kartı oluştur",
        duration: "5 dk",
        type: "Mini görev",
        status: "locked",
        slug: "python-profile-card",
      },
    ],
  },
  {
    id: "unit-3",
    title: "Koşullar",
    description: "Kodunun karar vermesini sağla.",
    lessons: [
      {
        id: "u3-l1",
        title: "Karşılaştırmalar",
        duration: "5 dk",
        type: "Kısa ders",
        status: "locked",
        slug: "python-comparisons",
      },
      {
        id: "u3-l2",
        title: "if yapısı",
        duration: "5 dk",
        type: "Kısa ders",
        status: "locked",
        slug: "python-if",
      },
      {
        id: "u3-l3",
        title: "else ve elif",
        duration: "5 dk",
        type: "Pratik",
        status: "locked",
        slug: "python-else-elif",
      },
      {
        id: "u3-l4",
        title: "Mini görev: Not hesaplayıcı",
        duration: "5 dk",
        type: "Mini görev",
        status: "locked",
        slug: "python-grade-calculator",
      },
    ],
  },
  {
    id: "unit-4",
    title: "Döngüler",
    description: "Tekrarlayan işlemleri kolaylaştır.",
    lessons: [
      {
        id: "u4-l1",
        title: "Döngü mantığı",
        duration: "5 dk",
        type: "Kısa ders",
        status: "locked",
        slug: "python-loop-basics",
      },
      {
        id: "u4-l2",
        title: "for döngüsü",
        duration: "5 dk",
        type: "Kısa ders",
        status: "locked",
        slug: "python-for-loop",
      },
      {
        id: "u4-l3",
        title: "while döngüsü",
        duration: "5 dk",
        type: "Pratik",
        status: "locked",
        slug: "python-while-loop",
      },
      {
        id: "u4-l4",
        title: "Mini görev: Alışveriş listesi",
        duration: "5 dk",
        type: "Mini görev",
        status: "locked",
        slug: "python-shopping-list",
      },
    ],
  },
];

const allLessons = pythonPathUnits.flatMap((unit) => unit.lessons);

export const pythonPathProgress = {
  completedLessons: allLessons.filter((l) => l.status === "completed").length,
  totalLessons: allLessons.length,
  progressPercent: Math.round(
    (allLessons.filter((l) => l.status === "completed").length /
      allLessons.length) *
      100,
  ),
};
