import { makeLesson, type PathMeta, type Unit } from "./types";

export const intermediatePathMeta: PathMeta = {
  pathLevel: "intermediate",
  levelLabel: "İleri Seviye",
  title: "Python İleri Seviye Yolu",
  description:
    "Fonksiyonlar, koleksiyonlar, string işlemleri ve proje tasarımıyla uygulamalı ilerle.",
  migoTip:
    "Bu yolda adım adım öğrenip problem çözme ve proje odaklı ilerleyeceksin. Kodu parçalara ayırmayı alışkanlık et.",
};

export const intermediatePathUnits: Unit[] = [
  {
    id: "int-unit-1",
    title: "Sağlam Fonksiyonlar",
    description: "Fonksiyonları parçalayarak daha okunabilir kod yaz.",
    lessons: [
      makeLesson("int-u1-l1", "int-return-power", "return mantığını güçlendirmek", "6 dk", "Kısa ders"),
      makeLesson("int-u1-l2", "int-function-split", "Fonksiyonları parçalamak", "6 dk", "Kısa ders"),
      makeLesson("int-u1-l3", "int-conditional-functions", "Fonksiyon içinde koşul", "6 dk", "Pratik"),
      makeLesson("int-u1-l4", "int-score-function", "Mini görev: Puan hesaplama fonksiyonu", "8 dk", "Mini görev"),
    ],
  },
  {
    id: "int-unit-2",
    title: "Listeler ve Sözlüklerle Çalışmak",
    description: "Arama, filtreleme ve basit veri modelleri oluştur.",
    lessons: [
      makeLesson("int-u2-l1", "int-list-dict-practice", "Liste ve dict pratikleri", "6 dk", "Pratik"),
      makeLesson("int-u2-l2", "int-data-model", "Basit veri modeli", "6 dk", "Kısa ders"),
      makeLesson("int-u2-l3", "int-search-filter", "Arama ve filtreleme", "6 dk", "Uygulama"),
      makeLesson("int-u2-l4", "int-student-grades", "Mini proje: Öğrenci not listesi", "8 dk", "Mini görev"),
    ],
  },
  {
    id: "int-unit-3",
    title: "Döngü + Koşul Kombinasyonları",
    description: "Listelerde koşullu işlem ve sayaç mantığını uygula.",
    lessons: [
      makeLesson("int-u3-l1", "int-counter-logic", "Sayaç mantığı", "5 dk", "Kısa ders"),
      makeLesson("int-u3-l2", "int-conditional-loop", "Listede koşullu işlem", "6 dk", "Pratik"),
      makeLesson("int-u3-l3", "int-min-max", "En büyük / en küçük bulma", "6 dk", "Uygulama"),
      makeLesson("int-u3-l4", "int-expense-analysis", "Mini proje: Harcama analizi", "8 dk", "Mini görev"),
    ],
  },
  {
    id: "int-unit-4",
    title: "String İşlemleri",
    description: "Metinleri işleyerek gerçek uygulamalara hazırlan.",
    lessons: [
      makeLesson("int-u4-l1", "int-string-case", "lower / upper kullanımı", "5 dk", "Kısa ders"),
      makeLesson("int-u4-l2", "int-string-split", "split ile parçalama", "6 dk", "Kısa ders"),
      makeLesson("int-u4-l3", "int-string-in", "in kontrolü ve temizleme", "6 dk", "Pratik"),
      makeLesson("int-u4-l4", "int-word-counter", "Mini proje: Kelime sayacı", "8 dk", "Mini görev"),
    ],
  },
  {
    id: "int-unit-5",
    title: "Hata Ayıklama ve Refactor",
    description: "Hatalı kodu oku, tekrar eden kodu fonksiyona çevir.",
    lessons: [
      makeLesson("int-u5-l1", "int-read-buggy-code", "Hatalı kodu okuma", "6 dk", "Uygulama"),
      makeLesson("int-u5-l2", "int-extract-function", "Tekrar eden kodu fonksiyona çevir", "6 dk", "Uygulama"),
      makeLesson("int-u5-l3", "int-readable-code", "Daha okunabilir kod yazma", "6 dk", "Pratik"),
    ],
  },
  {
    id: "int-unit-6",
    title: "Proje Tasarlama",
    description: "Problemi küçük adımlara bölerek mini görev takip uygulaması tasarla.",
    lessons: [
      makeLesson("int-u6-l1", "int-project-planning", "Problemi adımlara ayırma", "6 dk", "Kısa ders"),
      makeLesson("int-u6-l2", "int-task-tracker-1", "Proje: Görev takipçisi — Adım 1", "8 dk", "Proje"),
      makeLesson("int-u6-l3", "int-task-tracker-2", "Proje: Görev takipçisi — Adım 2", "8 dk", "Proje"),
    ],
  },
];
