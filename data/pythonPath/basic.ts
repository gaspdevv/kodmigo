import { makeLesson, type PathMeta, type Unit } from "./types";

export const basicPathMeta: PathMeta = {
  pathLevel: "basic",
  levelLabel: "Temel",
  title: "Python Temel Yolu",
  description:
    "Kısa tekrarlarla başlayıp koşullar, koleksiyonlar, döngüler ve fonksiyonlarda hızlı ilerle.",
  migoTip:
    "Bu yolda temel kavramları hızlı geçiyoruz. Takıldığın yerde pratik görevlere odaklan.",
};

export const basicPathUnits: Unit[] = [
  {
    id: "bas-unit-1",
    title: "Hızlı Python Tazeleme",
    description: "print, input ve değişkenleri kısa tekrarla pekiştir.",
    lessons: [
      makeLesson("bas-u1-l1", "bas-quick-print", "print ve değişken tekrarı", "5 dk", "Kısa ders"),
      makeLesson("bas-u1-l2", "bas-quick-types", "Veri türleri hızlı tekrar", "5 dk", "Kısa ders"),
      makeLesson("bas-u1-l3", "beg-migo-intro-card", "Migo'nun Tanışma Kartı", "6 dk", "Mini Proje"),
      makeLesson("bas-u1-l4", "bas-output-prediction", "Çıktı tahmini pratiği", "5 dk", "Pratik"),
      makeLesson("bas-u1-l5", "bas-debug-intro", "Debug görevi: Hatalı kodu bul", "6 dk", "Uygulama"),
    ],
  },
  {
    id: "bas-unit-2",
    title: "Kontrol Akışı",
    description: "if/elif/else ve mantıksal operatörlerle karar mekanizmaları kur.",
    lessons: [
      makeLesson("bas-u2-l1", "bas-if-elif-else", "if/elif/else tekrarı", "5 dk", "Kısa ders"),
      makeLesson("bas-u2-l2", "bas-comparisons", "Karşılaştırmalar", "5 dk", "Kısa ders"),
      makeLesson("bas-u2-l3", "bas-logical-ops", "and / or operatörleri", "6 dk", "Pratik"),
      makeLesson("bas-u2-l4", "bas-grade-system", "Mini proje: Not değerlendirme", "8 dk", "Mini görev"),
    ],
  },
  {
    id: "bas-unit-3",
    title: "Koleksiyonlar",
    description: "Liste ve sözlük farkını anlayarak veri saklamayı öğren.",
    lessons: [
      makeLesson("bas-u3-l1", "bas-list-review", "Liste tekrarı", "5 dk", "Kısa ders"),
      makeLesson("bas-u3-l2", "bas-dict-intro", "Sözlük (dict) mantığı", "6 dk", "Kısa ders"),
      makeLesson("bas-u3-l3", "bas-list-dict-diff", "Liste ve dict farkı", "5 dk", "Pratik"),
      makeLesson("bas-u3-l4", "bas-contact-book", "Mini proje: Kişi rehberi", "8 dk", "Mini görev"),
    ],
  },
  {
    id: "bas-unit-4",
    title: "Döngülerle Veri İşleme",
    description: "for döngüsüyle listeler üzerinde toplam ve ortalama hesapla.",
    lessons: [
      makeLesson("bas-u4-l1", "bas-for-review", "for ve range tekrarı", "5 dk", "Kısa ders"),
      makeLesson("bas-u4-l2", "bas-list-processing", "Liste üzerinde işlem", "6 dk", "Pratik"),
      makeLesson("bas-u4-l3", "bas-sum-average", "Toplam ve ortalama bulma", "6 dk", "Uygulama"),
      makeLesson("bas-u4-l4", "bas-expense-tracker", "Mini proje: Harcama özeti", "8 dk", "Mini görev"),
    ],
  },
  {
    id: "bas-unit-5",
    title: "Fonksiyonlar",
    description: "Yardımcı fonksiyonlar tasarlayarak kodunu düzenle.",
    lessons: [
      makeLesson("bas-u5-l1", "bas-function-design", "Fonksiyon tasarlama", "5 dk", "Kısa ders"),
      makeLesson("bas-u5-l2", "bas-params-return", "Parametre ve return", "5 dk", "Kısa ders"),
      makeLesson("bas-u5-l3", "bas-helper-functions", "Yardımcı fonksiyonlar", "6 dk", "Pratik"),
      makeLesson("bas-u5-l4", "bas-calculator", "Mini proje: Basit hesap makinesi", "8 dk", "Mini görev"),
    ],
  },
  {
    id: "bas-unit-6",
    title: "Debug ve Kod Okuma",
    description: "Hatalı kodları okuyup düzeltmeyi öğren.",
    lessons: [
      makeLesson("bas-u6-l1", "bas-syntax-errors", "Syntax error mantığı", "5 dk", "Kısa ders"),
      makeLesson("bas-u6-l2", "bas-variable-bugs", "Yanlış değişken adı hataları", "5 dk", "Uygulama"),
      makeLesson("bas-u6-l3", "bas-type-conversion-bugs", "Tür dönüşümü hataları", "6 dk", "Uygulama"),
    ],
  },
  {
    id: "bas-unit-7",
    title: "Uygulama Projesi",
    description: "Günlük alışkanlık takipçisi ile öğrendiklerini birleştir.",
    lessons: [
      makeLesson("bas-u7-l1", "bas-habit-project-1", "Proje: Alışkanlık takipçisi — Adım 1", "8 dk", "Proje"),
      makeLesson("bas-u7-l2", "bas-habit-project-2", "Proje: Alışkanlık takipçisi — Adım 2", "8 dk", "Proje"),
      makeLesson("bas-u7-l3", "bas-habit-project-3", "Proje: Alışkanlık takipçisi — Adım 3", "8 dk", "Proje"),
    ],
  },
];
