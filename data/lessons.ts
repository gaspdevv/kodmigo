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
  "python-what-is-python": {
    id: "python-what-is-python",
    title: "Python nedir?",
    description: "Python'un ne olduğunu sade şekilde öğren.",
    duration: "5 dk",
    steps: [
      {
        id: "step-1",
        type: "info",
        title: "Python nedir?",
        content:
          "Python, bilgisayara ne yapmasını istediğini söylemeni sağlayan bir programlama dilidir. Okunması kolaydır ve yeni başlayanlar için harika bir seçimdir.",
        migoMessage:
          "Python'u, bilgisayarla konuşmanın sade bir yolu gibi düşünebilirsin. Endişelenme, adım adım öğreneceğiz.",
        buttonLabel: "Devam et",
      },
      {
        id: "step-2",
        type: "multiple-choice",
        title: "Python hangi tür bir dildir?",
        options: [
          "Programlama dili",
          "Resim düzenleme programı",
          "Oyun konsolu",
          "İşletim sistemi",
        ],
        correctAnswer: "Programlama dili",
        migoMessage:
          "Programlama dili, bilgisayara talimat vermek için kullanılır. Python tam olarak budur.",
        feedback: {
          correct: "Aynen! Python bir programlama dilidir.",
          incorrect:
            "Tam değil. Python bir programlama dilidir — bilgisayara ne yapacağını söylersin. Bir daha dene.",
        },
      },
      {
        id: "step-3",
        type: "multiple-choice",
        title: "Python ile neler yapılabilir?",
        options: [
          "Web siteleri, uygulamalar ve otomasyon",
          "Sadece resim çizmek",
          "Sadece müzik dinlemek",
          "Sadece dosya silmek",
        ],
        correctAnswer: "Web siteleri, uygulamalar ve otomasyon",
        migoMessage:
          "Python çok yönlüdür. Küçük scriptlerden büyük projelere kadar birçok alanda kullanılır.",
        feedback: {
          correct: "Harika! Python gerçekten çok yönlü bir dildir.",
          incorrect:
            "Tam değil. Python web, uygulama ve otomasyon gibi birçok alanda kullanılır. Bir daha dene.",
        },
      },
      {
        id: "step-4",
        type: "fill-blank",
        title: "Boşluğu tamamla",
        content: "Python bir ____ dilidir.",
        fillBlankCode: "Python bir ____ dilidir.",
        options: ["programlama", "oyun", "müzik", "resim"],
        correctAnswer: "programlama",
        migoMessage:
          "Doğru kelimeyi seç. Python bilgisayara talimat vermek içindir.",
        feedback: {
          correct: "Süper! Python bir programlama dilidir.",
          incorrect:
            "Tam değil. Python bir programlama dilidir. Bir daha dene.",
        },
      },
      {
        id: "step-5",
        type: "complete",
        title: "Dersi tamamladın!",
        content:
          "Python'un ne olduğunu ve neden öğrenmeye değer olduğunu öğrendin.",
        completeRewards: {
          xp: "+10 XP",
          streak: "Serine katkı sağlandı",
          nextLesson: "Sıradaki ders: print() komutu",
        },
      },
    ],
  },
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
        migoMessage:
          "Kodun ne yaptığını düşün: print() ekrana bir şey yazdırır.",
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
        migoMessage: "Ekrana yazdırmak için hangi komutu kullanıyorduk?",
        feedback: {
          correct: "Harika! print() ile ekrana Selam yazdırdın.",
          incorrect:
            "Tam değil. Ekrana yazdırmak için print() kullanılır. Bir daha dene.",
        },
      },
      {
        id: "step-4",
        type: "output-quiz",
        title: "Bu kodun çıktısı ne olur?",
        code: 'print("Python öğreniyorum")',
        options: [
          "Python öğreniyorum",
          "print",
          "Hata",
          "Kodmigo",
        ],
        correctAnswer: "Python öğreniyorum",
        migoMessage:
          "print() parantez içindeki metni ekrana yazar. Çıktıyı tahmin et.",
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
  "python-first-output": {
    id: "python-first-output",
    title: "İlk çıktını al",
    description: "Çıktı kavramını anlayarak ilk sonucunu gör.",
    duration: "5 dk",
    steps: [
      {
        id: "step-1",
        type: "info",
        title: "Çıktı nedir?",
        content:
          "print() çalıştığında ekranda gördüğün sonuç bir çıktıdır. Python'un sana verdiği cevap budur.",
        code: 'print("Merhaba")',
        migoMessage:
          "Çıktı, kodunun ekranda bıraktığı iz gibidir. Basit ama çok önemli!",
        buttonLabel: "Devam et",
      },
      {
        id: "step-2",
        type: "multiple-choice",
        title: "print(\"Merhaba\") çalıştığında ne olur?",
        options: [
          "Ekranda Merhaba yazar",
          "Bilgisayar kapanır",
          "Hiçbir şey olmaz",
          "Dosya silinir",
        ],
        correctAnswer: "Ekranda Merhaba yazar",
        migoMessage: "print() bir metin yazdırdığında ekranda ne görürsün?",
        feedback: {
          correct: "Doğru! Ekranda Merhaba yazar — işte bu bir çıktıdır.",
          incorrect:
            "Tam değil. print() metni ekrana yazar. Bir daha dene.",
        },
      },
      {
        id: "step-3",
        type: "output-quiz",
        title: "Bu kodun çıktısı ne olur?",
        code: 'print("42")',
        options: ["42", "print", "Hata", "Kodmigo"],
        correctAnswer: "42",
        migoMessage:
          "Sayılar da tırnak içindeyse metin gibi ekrana yazılır.",
        feedback: {
          correct: "Harika! Ekranda 42 yazar — bu kodun çıktısıdır.",
          incorrect:
            "Tam değil. print() içindeki değer ekrana yazılır. Bir daha dene.",
        },
      },
      {
        id: "step-4",
        type: "fill-blank",
        title: "Ekrana Kodmigo yazdır",
        content: "Boşluğu tamamlayarak ekrana Kodmigo yazdır.",
        fillBlankCode: '____("Kodmigo")',
        options: ["print", "output", "show", "run"],
        correctAnswer: "print",
        migoMessage: "Çıktı almak için hangi komutu kullanıyorduk?",
        feedback: {
          correct: "Süper! print(\"Kodmigo\") ekrana Kodmigo yazar.",
          incorrect:
            "Tam değil. Çıktı almak için print() kullanılır. Bir daha dene.",
        },
      },
      {
        id: "step-5",
        type: "complete",
        title: "Dersi tamamladın!",
        content:
          "Çıktının ne olduğunu anladın ve print() ile ekrana sonuç yazdırmayı pekiştirdin.",
        completeRewards: {
          xp: "+10 XP",
          streak: "Serine katkı sağlandı",
          nextLesson: "Sıradaki ders: Mini görev: Kendini tanıt",
        },
      },
    ],
  },
  "python-intro-task": {
    id: "python-intro-task",
    title: "Mini görev: Kendini tanıt",
    description: "Öğrendiklerini küçük bir görevde uygula.",
    duration: "7 dk",
    steps: [
      {
        id: "step-1",
        type: "info",
        title: "Mini görev zamanı!",
        content:
          "print() ile kendini tanıtabilirsin. Parantez içine yazdığın metin ekranda görünür.",
        code: 'print("Merhaba, ben Ali!")',
        migoMessage:
          "Kendi adını veya kısa bir selamlamayı print() ile yazabilirsin. Hadi dene!",
        buttonLabel: "Devam et",
      },
      {
        id: "step-2",
        type: "multiple-choice",
        title: "Kendini tanıtmak için hangi komut kullanılır?",
        options: ["print()", "delete()", "close()", "save()"],
        correctAnswer: "print()",
        migoMessage:
          "Ekrana bir mesaj yazdırmak için daha önce hangi komutu öğrenmiştin?",
        feedback: {
          correct: "Aynen! print() ile ekrana mesaj yazdırırsın.",
          incorrect:
            "Tam değil. Ekrana yazdırmak için print() kullanılır. Bir daha dene.",
        },
      },
      {
        id: "step-3",
        type: "fill-blank",
        title: "Kendini tanıt",
        content: "Boşluğu tamamlayarak ekrana bir selamlama yazdır.",
        fillBlankCode: '____("Merhaba, ben Migo!")',
        options: ["print", "write", "show", "type"],
        correctAnswer: "print",
        migoMessage: "Selamlamayı ekrana yazdırmak için doğru komutu seç.",
        feedback: {
          correct: "Harika! print() ile güzel bir selamlama yazdın.",
          incorrect:
            "Tam değil. Ekrana yazdırmak için print() kullanılır. Bir daha dene.",
        },
      },
      {
        id: "step-4",
        type: "output-quiz",
        title: "Bu kodun çıktısı ne olur?",
        code: 'print("Ben Python öğreniyorum!")',
        options: [
          "Ben Python öğreniyorum!",
          "print",
          "Hata",
          "Python",
        ],
        correctAnswer: "Ben Python öğreniyorum!",
        migoMessage:
          "Parantez içindeki metin olduğu gibi ekrana yazılır. Çıktıyı tahmin et.",
        feedback: {
          correct:
            "Mükemmel! Tam cümle ekrana yazılır — görevi başarıyla tamamladın.",
          incorrect:
            "Tam değil. print() içindeki metin ekrana yazılır. Bir daha dene.",
        },
      },
      {
        id: "step-5",
        type: "complete",
        title: "Dersi tamamladın!",
        content:
          "print() ile kendini tanıtmayı öğrendin. Ünite 1'de harika bir iş çıkardın!",
        completeRewards: {
          xp: "+10 XP",
          streak: "Serine katkı sağlandı",
          nextLesson: "Sıradaki ders: Değişken nedir?",
        },
      },
    ],
  },
};

export function getLessonById(lessonId: string): LessonContent | undefined {
  return lessons[lessonId];
}
