import { makeLesson, type PathMeta, type Unit } from "./types";

export const beginnerPathMeta: PathMeta = {
  pathLevel: "beginner",
  levelLabel: "Başlangıç",
  title: "Python Başlangıç Yolu",
  description:
    "Sıfırdan başlayarak print, değişkenler, koşullar, listeler, döngüler ve mini projelerle Python temellerini öğren.",
  migoTip:
    "Her ders kısa ama yoğun. Anlamadığın bir adım olursa tekrar etmekten çekinme — Migo yanında.",
};

export const beginnerPathUnits: Unit[] = [
  {
    id: "beg-unit-1",
    title: "Python'a Isınma",
    description: "Python'un ne olduğunu ve ilk çıktını nasıl alacağını öğren.",
    lessons: [
      makeLesson("beg-u1-l1", "python-what-is-python", "Python ile ne yapılır?", "5 dk", "Kısa ders"),
      makeLesson("beg-u1-l2", "python-print", "print() ile çıktı üretme", "5 dk", "Kısa ders"),
      makeLesson("beg-u1-l3", "beg-output-prediction", "Kodun çıktısını tahmin et", "5 dk", "Pratik"),
      makeLesson("beg-u1-l4", "python-intro-task", "Mini görev: Kendini tanıtan çıktı", "7 dk", "Mini görev"),
    ],
  },
  {
    id: "beg-unit-2",
    title: "Değişkenler ve Veri Türleri",
    description: "Verileri isimlerle saklamayı ve farklı türleri tanımayı öğren.",
    lessons: [
      makeLesson("beg-u2-l1", "beg-variables-intro", "Değişken mantığı", "5 dk", "Kısa ders"),
      makeLesson("beg-u2-l2", "beg-naming-rules", "İsimlendirme kuralları", "5 dk", "Kısa ders"),
      makeLesson("beg-u2-l3", "beg-strings-numbers", "Metinler ve sayılar", "5 dk", "Kısa ders"),
      makeLesson("beg-u2-l4", "beg-migo-intro-card", "Migo'nun Tanışma Kartı", "6 dk", "Mini Proje"),
      makeLesson("beg-u2-l5", "beg-boolean-fstring", "Boolean ve f-string", "6 dk", "Kısa ders"),
      makeLesson("beg-u2-l6", "beg-profile-card-project", "Mini proje: Profil kartı", "7 dk", "Mini görev"),
    ],
  },
  {
    id: "beg-unit-3",
    title: "Kullanıcıdan Bilgi Alma",
    description: "input() ile kullanıcıdan veri almayı ve dönüştürmeyi öğren.",
    lessons: [
      makeLesson("beg-u3-l1", "beg-input-basics", "input() mantığı", "5 dk", "Kısa ders"),
      makeLesson("beg-u3-l2", "beg-input-conversion", "Metin döndürür ve dönüşümler", "6 dk", "Kısa ders"),
      makeLesson("beg-u3-l3", "beg-calc-tasks", "Küçük hesaplama görevleri", "6 dk", "Pratik"),
      makeLesson("beg-u3-l4", "beg-age-calculator", "Mini proje: Yaş hesaplayıcı", "7 dk", "Mini görev"),
    ],
  },
  {
    id: "beg-unit-4",
    title: "Koşullar",
    description: "Kodunun karar vermesini sağlayan if/elif/else yapılarını öğren.",
    lessons: [
      makeLesson("beg-u4-l1", "beg-if-basics", "if mantığı", "5 dk", "Kısa ders"),
      makeLesson("beg-u4-l2", "beg-comparisons", "Karşılaştırmalar", "5 dk", "Kısa ders"),
      makeLesson("beg-u4-l3", "beg-else", "else kullanımı", "5 dk", "Kısa ders"),
      makeLesson("beg-u4-l4", "beg-elif", "elif ile birden fazla durum", "6 dk", "Pratik"),
      makeLesson("beg-u4-l5", "beg-ticket-price", "Mini proje: Bilet fiyatı", "7 dk", "Mini görev"),
    ],
  },
  {
    id: "beg-unit-5",
    title: "Listeler",
    description: "Birden fazla değeri tek yerde tutmayı öğren.",
    lessons: [
      makeLesson("beg-u5-l1", "beg-list-intro", "Liste nedir?", "5 dk", "Kısa ders"),
      makeLesson("beg-u5-l2", "beg-list-access", "Elemanlara erişme ve ekleme", "5 dk", "Kısa ders"),
      makeLesson("beg-u5-l3", "beg-list-length", "Liste uzunluğu", "5 dk", "Pratik"),
      makeLesson("beg-u5-l4", "beg-shopping-list", "Mini proje: Alışveriş listesi", "7 dk", "Mini görev"),
    ],
  },
  {
    id: "beg-unit-6",
    title: "Döngüler",
    description: "Tekrarlayan işlemleri for döngüsüyle kolaylaştır.",
    lessons: [
      makeLesson("beg-u6-l1", "beg-for-loop", "for döngüsü", "5 dk", "Kısa ders"),
      makeLesson("beg-u6-l2", "beg-range", "range() kullanımı", "5 dk", "Kısa ders"),
      makeLesson("beg-u6-l3", "beg-loop-list", "Liste üzerinde dönme", "6 dk", "Pratik"),
      makeLesson("beg-u6-l4", "beg-daily-tasks", "Mini proje: Günlük görev yazdırıcı", "7 dk", "Mini görev"),
    ],
  },
  {
    id: "beg-unit-7",
    title: "Fonksiyonlara Giriş",
    description: "Tekrar eden kodları fonksiyonlara dönüştürmeyi öğren.",
    lessons: [
      makeLesson("beg-u7-l1", "beg-why-functions", "Fonksiyon neden kullanılır?", "5 dk", "Kısa ders"),
      makeLesson("beg-u7-l2", "beg-def-function", "def ile fonksiyon yazma", "6 dk", "Kısa ders"),
      makeLesson("beg-u7-l3", "beg-params-return", "Parametre ve return", "6 dk", "Pratik"),
      makeLesson("beg-u7-l4", "beg-greeting-functions", "Mini proje: Selamlama fonksiyonları", "7 dk", "Mini görev"),
    ],
  },
  {
    id: "beg-unit-8",
    title: "İlk Büyük Mini Proje",
    description: "Öğrendiklerini bir araya getirerek mini quiz uygulaması yap.",
    lessons: [
      makeLesson("beg-u8-l1", "beg-quiz-project-1", "Proje: Quiz uygulaması — Bölüm 1", "10 dk", "Proje"),
      makeLesson("beg-u8-l2", "beg-quiz-project-2", "Proje: Quiz uygulaması — Bölüm 2", "10 dk", "Proje"),
    ],
  },
];
