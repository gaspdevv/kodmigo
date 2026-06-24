import type { LessonContent } from "./types";
import {
  buildLesson,
  codeOrderLinesStep,
  codeOrderStep,
  codeWritingStep,
  completeStep,
  debugStep,
  fillStep,
  infoStep,
  matchPairsStep,
  matchStep,
  mcStep,
  miniTaskStep,
  outputStep,
  projectStep,
} from "./builders";

export const beginnerLessons: Record<string, LessonContent> = {
  "python-what-is-python": buildLesson(
    "python-what-is-python",
    "Python ile ne yapılır?",
    "Python'un ne olduğunu sade şekilde öğren.",
    "5 dk",
    10,
    [
      infoStep(
        "step-1",
        "Python nedir?",
        "Python, bilgisayara ne yapmasını istediğini söylemeni sağlayan bir programlama dilidir. Okunması kolaydır ve yeni başlayanlar için güçlü bir seçimdir.",
        {
          migo: "Python'u bilgisayarla konuşmanın sade bir yolu gibi düşün. Adım adım ilerleyeceğiz.",
        },
      ),
      mcStep(
        "step-2",
        "Python hangi tür bir dildir?",
        ["Programlama dili", "Resim düzenleme programı", "Oyun konsolu", "İşletim sistemi"],
        "Programlama dili",
        {
          migo: "Programlama dili, bilgisayara talimat vermek için kullanılır.",
        },
      ),
      matchStep(
        "step-3",
        "Kavram eşleştir",
        "Python ile yapılabilecek iş",
        [
          "Web sitesi ve otomasyon geliştirmek",
          "Sadece müzik dinlemek",
          "Monitörü kapatmak",
          "Fareyi değiştirmek",
        ],
        "Web sitesi ve otomasyon geliştirmek",
        { migo: "Python çok yönlü bir dildir." },
      ),
      outputStep(
        "step-4",
        "Bu kod ne yazar?",
        'print("Merhaba Kodmigo")',
        ["Merhaba Kodmigo", "print", "Hata", "Kodmigo Merhaba"],
        "Merhaba Kodmigo",
        { migo: "print() parantez içindeki metni ekrana yazar." },
      ),
      completeStep("step-5", 10, "print() ile çıktı üretme", {
        content: "Python'un ne olduğunu ve neden öğrenmeye değer olduğunu öğrendin.",
      }),
    ],
    "beginner",
  ),

  "python-print": buildLesson(
    "python-print",
    "print() ile çıktı üretme",
    "Python'da ekrana yazı yazdırmayı öğren.",
    "5 dk",
    10,
    [
      infoStep(
        "step-1",
        "print() ne işe yarar?",
        "Python'da ekrana bir şey yazdırmak için print() komutunu kullanırız.",
        {
          code: 'print("Merhaba Kodmigo")',
          migo: "print() komutunu Python'un ekrana konuşması gibi düşünebilirsin.",
        },
      ),
      mcStep(
        "step-2",
        "Aşağıdaki kod ne yapar?",
        [
          "Ekrana Merhaba Kodmigo yazar",
          "Yeni bir dosya oluşturur",
          "Python'u kapatır",
          "Hata verir",
        ],
        "Ekrana Merhaba Kodmigo yazar",
        {
          code: 'print("Merhaba Kodmigo")',
          migo: "print() ekrana çıktı vermek için kullanılır.",
        },
      ),
      fillStep(
        "step-3",
        "Ekrana Selam yazdır",
        '____("Selam")',
        ["show", "print", "write", "display"],
        "print",
        { content: "Boşluğu tamamlayarak ekrana Selam yazdır.", migo: "Ekrana yazdırmak için hangi komutu kullanıyorduk?" },
      ),
      codeOrderLinesStep(
        "step-4",
        "Değişken ve print sırası",
        ['name = "Migo"', "print(name)"],
        { content: "Önce değişkeni ata, sonra yazdır.", migo: "Atama her zaman print'ten önce gelir." },
      ),
      outputStep(
        "step-5",
        "Bu kodun çıktısı ne olur?",
        'print("Python öğreniyorum")',
        ["Hata", "Kodmigo", "print", "Python öğreniyorum"],
        "Python öğreniyorum",
        { migo: "print() parantez içindeki metni ekrana yazar." },
      ),
      codeWritingStep(
        "step-6",
        "Kendi cümleni yaz",
        "print() kullanarak ekrana kendi cümleni yazdır.",
        {
          validation: {
            mustIncludePrint: true,
            minLength: 10,
          },
          exampleSolution: 'print("Merhaba, ben Migo!")',
          migo: "Kendi adını veya kısa bir selamlamayı kullanabilirsin.",
        },
      ),
      completeStep("step-7", 10, "Kodun çıktısını tahmin et", {
        content: "print() komutuyla ekrana çıktı vermeyi öğrendin.",
      }),
    ],
    "beginner",
  ),

  "beg-output-prediction": buildLesson(
    "beg-output-prediction",
    "Kodun çıktısını tahmin et",
    "Kodu çalıştırmadan önce çıktıyı tahmin etmeyi pratik et.",
    "5 dk",
    15,
    [
      infoStep(
        "step-1",
        "Çıktı tahmini",
        "Kodu satır satır okuyarak ekranda ne görüneceğini düşün. Bu alışkanlık hata ayıklamayı kolaylaştırır.",
        {
          code: 'print("A")\nprint("B")',
          migo: "İki print() arka arkaya çalışırsa iki satır çıktı görürsün.",
        },
      ),
      outputStep(
        "step-2",
        "İlk tahmin",
        'print("Kodmigo")\nprint("Python")',
        ["Kodmigo\nPython", "Python\nKodmigo", "Kodmigo Python", "Hata"],
        "Kodmigo\nPython",
        { migo: "Her print() yeni bir satıra yazar." },
      ),
      debugStep(
        "step-3",
        "Hatayı bul",
        'print("Merhaba"\nprint("Dünya")',
        [
          "İlk satırda kapanmayan parantez",
          "İkinci print gereksiz",
          "Tırnak işareti fazla",
          "Kodda hata yok",
        ],
        "İlk satırda kapanmayan parantez",
        { migo: "Her açılan parantez kapanmalıdır." },
      ),
      matchPairsStep(
        "step-4",
        "Kod ve çıktı eşleştir",
        [
          { concept: 'print("A")', answer: "A" },
          { concept: 'print("B")', answer: "B" },
        ],
        ["AB", "Hata", "Boş satır"],
        { content: "Her kod satırının çıktısını doğru eşleştir.", migo: "print içindeki metin olduğu gibi yazılır." },
      ),
      codeWritingStep(
        "step-5",
        "Benzer çıktı üret",
        'İki print() ile önce "Merhaba" sonra "Dünya" yazdır.',
        {
          validation: {
            mustIncludePrint: true,
            requiredPatterns: ["Merhaba", "Dünya"],
            minLength: 20,
          },
          exampleSolution: 'print("Merhaba")\nprint("Dünya")',
        },
      ),
      completeStep("step-6", 15, "Mini görev: Kendini tanıtan çıktı", {
        content: "Kodu okuyup çıktıyı tahmin etme pratiği yaptın.",
      }),
    ],
    "beginner",
  ),

  "python-intro-task": buildLesson(
    "python-intro-task",
    "Mini görev: Kendini tanıtan çıktı",
    "print() ile kendini tanıtan bir çıktı oluştur.",
    "7 dk",
    25,
    [
      infoStep(
        "step-1",
        "Mini görev zamanı",
        "print() ile ekrana kendini tanıtan bir çıktı oluşturacaksın.",
        {
          targetOutput: "Merhaba, ben Ali!",
          taskNote:
            "Kendi adını ve cümlelerini kullanabilirsin. Önemli olan print ile anlamlı bir tanışma çıktısı üretmek.",
          migo: "Hedef çıktıya benzer bir sonuç için Python kodunu kendin yaz.",
        },
      ),
      codeWritingStep(
        "step-2",
        "Kendini tanıt",
        "print() kullanarak kendini tanıtan bir cümle yaz.",
        {
          validation: {
            mustIncludePrint: true,
            requiredIncludes: ["print"],
            requiredPatterns: ["print\\s*\\("],
            minLength: 10,
            rejectPatterns: ["^abc$", "^x\\s*="],
          },
          checklist: [
            "print() fonksiyonu kullanıldı",
            "Parantez içinde bir metin var",
            "Kendini tanıtan anlamlı bir cümle yazıldı",
          ],
          exampleSolution: 'print("Merhaba, ben Migo!")',
          migo: "Kendi adını ve cümleini kullan — örnek çözüm sadece fikir vermek için.",
        },
      ),
      codeWritingStep(
        "step-3",
        "Adını değişkende sakla",
        "Bir ad değişkeni oluştur ve print() ile yazdır.",
        {
          validation: {
            mustIncludeAssignment: true,
            mustIncludePrint: true,
            minLength: 15,
          },
          exampleSolution: 'ad = "Efe"\nprint(ad)',
          migo: "Değişkene atayıp print ile yazdırabilirsin.",
        },
      ),
      codeOrderLinesStep(
        "step-4",
        "Değişken ve print sırası",
        ['isim = "Migo"', "print(isim)"],
        { content: "Önce değişken atanmalı, sonra yazdırılmalı.", migo: "Atama print'ten önce gelir." },
      ),
      projectStep(
        "step-5",
        "Mini profil çıktısı",
        "En az 2 değişken ve 2 print() ile kısa bir profil çıktısı yaz.",
        {
          checklist: [
            "En az 2 değişken tanımlı",
            "En az 2 print satırı",
            "Çıktı profil bilgisi içeriyor",
          ],
          exampleSolution:
            'ad = "Efe"\nsehir = "İstanbul"\nprint(f"Ad: {ad}")\nprint(f"Şehir: {sehir}")',
          validation: {
            mustIncludeAssignment: true,
            mustIncludePrint: true,
            minLength: 30,
          },
          migo: "f-string kullanmak çıktıyı düzenli gösterir.",
        },
      ),
      completeStep("step-6", 25, "Değişken mantığı", {
        content: "print() ile kendini tanıtmayı öğrendin. Ünite 1'de harika iş çıkardın!",
      }),
    ],
    "beginner",
  ),

  "beg-variables-intro": buildLesson(
    "beg-variables-intro",
    "Değişken mantığı",
    "Verileri isimlerle saklamayı öğren.",
    "5 dk",
    10,
    [
      infoStep(
        "step-1",
        "Değişken nedir?",
        "Değişken, bir değeri isimle saklamanı sağlar. Böylece aynı değeri tekrar tekrar yazmak zorunda kalmazsın.",
        {
          code: 'isim = "Ayşe"\nprint(isim)',
          migo: "Değişken bir etiket gibidir — kutunun üstüne isim yazarsın.",
        },
      ),
      matchPairsStep(
        "step-2",
        "Kavramları eşleştir",
        [
          { concept: "Değişken", answer: "İsimle saklanan değer" },
          { concept: "Değer", answer: "Değişkende tutulan bilgi" },
          { concept: "Atama", answer: "= ile değer verme" },
        ],
        ["Bir fonksiyon türü", "Sadece metin yazdırma", "Hata mesajı"],
        { migo: "Her kavram için doğru açıklamayı seç." },
      ),
      debugStep(
        "step-3",
        "Yanlış değişken adı",
        "2isim = \"Ayşe\"\nprint(2isim)",
        [
          "Değişken adı rakamla başlayamaz",
          "print yanlış yazılmış",
          "Tırnak eksik",
          "Kodda hata yok",
        ],
        "Değişken adı rakamla başlayamaz",
        { migo: "Python'da değişken adları harf veya alt çizgi ile başlar." },
      ),
      outputStep(
        "step-4",
        "Çıktı tahmini",
        'puan = 90\nprint(puan)',
        ["Hata", "print", "puan", "90"],
        "90",
        { migo: "print() değişkenin içindeki değeri yazar, adını değil." },
      ),
      codeWritingStep(
        "step-5",
        "Kendi değişkenini yaz",
        "Bir şehir değişkeni oluştur ve print() ile yazdır.",
        {
          validation: {
            mustIncludeAssignment: true,
            mustIncludePrint: true,
            minLength: 15,
          },
          exampleSolution: 'sehir = "Ankara"\nprint(sehir)',
        },
      ),
      completeStep("step-6", 10, "İsimlendirme kuralları"),
    ],
    "beginner",
  ),

  "beg-naming-rules": buildLesson(
    "beg-naming-rules",
    "İsimlendirme kuralları",
    "Geçerli ve okunabilir değişken adları seç.",
    "5 dk",
    10,
    [
      infoStep(
        "step-1",
        "İyi isim seçmek",
        "Değişken adları harf, rakam ve alt çizgi içerebilir; rakamla başlayamaz. Anlamlı isimler kodu okunur kılar.",
        {
          code: "kullanici_adi = \"efe\"\nyas = 28",
          migo: "kullanici_adi gibi açıklayıcı isimler, x gibi belirsiz isimlerden iyidir.",
        },
      ),
      debugStep(
        "step-2",
        "Geçersiz ad",
        "urun-fiyati = 19.99\nprint(urun-fiyati)",
        [
          "Tire değişken adında kullanılamaz",
          "print yanlış",
          "Sayı ondalık olamaz",
          "Kodda hata yok",
        ],
        "Tire değişken adında kullanılamaz",
        { migo: "Boşluk ve tire yerine alt çizgi kullanılır." },
      ),
      matchStep(
        "step-3",
        "En okunabilir isim",
        "Ürün fiyatını saklamak için en uygun değişken adı",
        ["a", "x1", "urun_fiyati", "f"],
        "urun_fiyati",
        { migo: "İsim ne işe yaradığını anlatmalı." },
      ),
      codeOrderLinesStep(
        "step-4",
        "Atama sırası",
        ["urun_fiyati = 19.99", "print(urun_fiyati)"],
        { content: "Önce değişkeni tanımla, sonra yazdır.", migo: "Değişken kullanılmadan önce tanımlanmalı." },
      ),
      fillStep(
        "step-5",
        "Doğru adı yaz",
        "____ = 19.99",
        ["urun_fiyati", "urun-fiyati", "urun fiyati", "19.99"],
        "urun_fiyati",
        { content: "Fiyat bilgisini saklayacak geçerli bir değişken adı seç.", migo: "Boşluk ve tire kullanılamaz; alt çizgi kullanılır." },
      ),
      completeStep("step-6", 10, "Metinler ve sayılar"),
    ],
    "beginner",
  ),

  "beg-strings-numbers": buildLesson(
    "beg-strings-numbers",
    "Metinler ve sayılar",
    "String ve sayı türlerini ayırt et.",
    "5 dk",
    10,
    [
      infoStep(
        "step-1",
        "İki temel tür",
        "Tırnak içindeki değerler metin (str), tırnaksız sayılar ise sayı (int/float) türündedir.",
        {
          code: 'isim = "Migo"\nyas = 30',
          migo: "\"30\" metin, 30 sayıdır — karıştırmamaya dikkat et.",
        },
      ),
      matchPairsStep(
        "step-2",
        "Tür eşleştir",
        [
          { concept: '"100"', answer: "Metin (str)" },
          { concept: "100", answer: "Tam sayı (int)" },
          { concept: "3.14", answer: "Ondalık sayı (float)" },
        ],
        ["Boolean", "Liste", "Fonksiyon"],
        { migo: "Tırnak varsa metin, yoksa sayı olabilir." },
      ),
      outputStep(
        "step-3",
        "Çıktı ne olur?",
        'print("5" + "3")',
        ["53", "8", "Hata", "5 3"],
        "53",
        { migo: "Metinlerde + birleştirme yapar, toplama değil." },
      ),
      debugStep(
        "step-4",
        "Tür hatası",
        'yas = "25"\nprint(yas + 1)',
        [
          "Metin ile sayı toplanamaz",
          "print yanlış",
          "Değişken adı hatalı",
          "Kod doğru çalışır",
        ],
        "Metin ile sayı toplanamaz",
        { migo: "Sayısal işlem için int() ile dönüştürmen gerekir." },
      ),
      codeWritingStep(
        "step-5",
        "Sayı ata ve yazdır",
        "Bir fiyat değişkenine ondalıklı sayı ata ve print() ile yazdır.",
        {
          validation: {
            mustIncludeAssignment: true,
            mustIncludePrint: true,
            requiredPatterns: ["=\\s*\\d"],
            minLength: 15,
          },
          exampleSolution: "fiyat = 29.90\nprint(fiyat)",
        },
      ),
      completeStep("step-6", 10, "Migo'nun Tanışma Kartı"),
    ],
    "beginner",
  ),

  "beg-migo-intro-card": buildLesson(
    "beg-migo-intro-card",
    "Migo'nun Tanışma Kartı",
    "Print ve değişkenleri kullanarak Migo için küçük bir tanışma çıktısı hazırla.",
    "6 dk",
    25,
    [
      infoStep(
        "step-1",
        "Projeyi tanı",
        "Görevin, Python kodu yazarak buna benzer bir tanışma çıktısı oluşturmak.",
        {
          targetOutput:
            "Merhaba! Ben Migo.\nBen Kodmigo'nun tilki rehberiyim.\nBugün Python öğrenmeye başladım.\nEn sevdiğim şey: Her gün biraz kod!",
          taskNote:
            "Hedef çıktı birebir aynı olmak zorunda değil. Ama kodunda print kullanmalı, Migo'dan bahsetmeli ve birkaç satırlık bir tanışma mesajı oluşturmalısın.",
          migo: "Çözüm kodunu düşünerek yaz — hedef çıktıya benzer bir sonuç üretmen yeterli.",
        },
      ),
      codeWritingStep(
        "step-2",
        "İlk print satırı",
        "Migo'yu selamlayan bir print() satırı yaz.",
        {
          validation: {
            mustIncludePrint: true,
            requiredAnyIncludes: ["Migo", "Kodmigo"],
            minLength: 10,
            hints: {
              missingPrint:
                "Yaklaştın! Bu adımda Python'da ekrana yazdırmak için print(...) kullanmalısın. Mesajında Migo da geçsin.",
              missingAnyKeyword:
                "Güzel başlangıç! print kullandın — şimdi mesajında Migo veya Kodmigo kelimesi de geçsin.",
            },
          },
          exampleSolution: 'print("Merhaba! Ben Migo.")',
          migo: "Kısa ve sıcak bir selamlama yeterli.",
        },
      ),
      codeWritingStep(
        "step-3",
        "Değişken kullan",
        "Migo'nun adını bir değişkende sakla.",
        {
          validation: {
            mustIncludeAssignment: true,
            requiredAnyIncludes: ["Migo", "Kodmigo"],
            minLength: 8,
            hints: {
              missingAssignment:
                "Güzel deneme! Bu adımda Migo adını bir değişkende saklamanı istiyoruz. Değişken tanımlarken = işaretini kullanmayı düşün.",
            },
          },
          exampleSolution: 'isim = "Migo"\nprint(isim)',
          migo: "Önce değişkene ata, istersen print ile yazdır.",
        },
      ),
      projectStep(
        "step-4",
        "Birkaç satırlık çıktı oluştur",
        "En az birkaç print() satırıyla Migo'nun tanışma kartını tamamla.",
        {
          checklist: [
            "print() kullanıldı",
            "Migo veya Kodmigo kelimesi geçiyor",
            "Birkaç satırlık tanışma çıktısı var",
          ],
          exampleSolution:
            'print("Merhaba! Ben Migo.")\nprint("Ben Kodmigo\'nun tilki rehberiyim.")\nprint("Bugün Python öğrenmeye başladım.")\nprint("En sevdiğim şey: Her gün biraz kod!")',
          validation: {
            mustIncludePrint: true,
            requiredAnyIncludes: ["Migo", "Kodmigo"],
            minPrintCount: 2,
            minLength: 25,
            hints: {
              missingPrintCount:
                "Tanışma kartı biraz daha dolu olmalı. En az birkaç satır print kullanarak Migo'yu tanıtan bir çıktı oluşturmayı dene.",
            },
          },
          migo: "Her print() yeni bir satır oluşturur — kartını satır satır inşa et.",
        },
      ),
      completeStep("step-5", 25, "Boolean ve f-string", {
        title: "İlk mini projen hazır!",
        content:
          "Harika! Migo'nun ilk tanışma kartını Python ile oluşturdun. Bu küçük proje, print ve değişkenleri gerçek bir amaç için kullandığın ilk adım oldu.",
      }),
    ],
    "beginner",
  ),

  "beg-boolean-fstring": buildLesson(
    "beg-boolean-fstring",
    "Boolean ve f-string",
    "True/False değerleri ve f-string ile metin oluştur.",
    "6 dk",
    10,
    [
      infoStep(
        "step-1",
        "Boolean ve f-string",
        "True ve False mantıksal değerlerdir. f-string ile değişkenleri metin içine gömebilirsin.",
        {
          code: 'aktif = True\nprint(f"Durum: {aktif}")',
          migo: "f\"...\" içindeki süslü parantezler değişken değerini yazar.",
        },
      ),
      matchStep(
        "step-2",
        "Boolean değer",
        "Hangisi boolean türündedir?",
        ["False", '"False"', "0", '"True"'],
        "False",
        { migo: "Tırnaksız True/False boolean'dır." },
      ),
      codeOrderLinesStep(
        "step-3",
        "f-string sırası",
        ['isim = "Can"', 'print(f"Merhaba, {isim}")'],
        { migo: "Önce değişken, sonra f-string print." },
      ),
      outputStep(
        "step-4",
        "f-string çıktısı",
        'yas = 22\nprint(f"Yaşım: {yas}")',
        ["Yaşım: 22", "Yaşım: yas", "Hata", "22"],
        "Yaşım: 22",
        { migo: "f-string değişkenin değerini metne yerleştirir." },
      ),
      codeWritingStep(
        "step-5",
        "f-string ile tanıt",
        "Bir ad değişkeni ve f-string ile kendini tanıtan print() yaz.",
        {
          validation: {
            mustIncludeAssignment: true,
            mustIncludePrint: true,
            requiredPatterns: ["f[\"']"],
            minLength: 20,
          },
          exampleSolution: 'ad = "Efe"\nprint(f"Merhaba, ben {ad}")',
        },
      ),
      completeStep("step-6", 10, "Mini proje: Profil kartı"),
    ],
    "beginner",
  ),

  "beg-profile-card-project": buildLesson(
    "beg-profile-card-project",
    "Mini proje: Profil kartı",
    "Değişkenler ve f-string ile profil kartı oluştur.",
    "8 dk",
    25,
    [
      infoStep(
        "step-1",
        "Profil kartı",
        "Değişkenler ve f-string kullanarak düzenli bir profil kartı oluşturacaksın.",
        {
          expectedBehavior:
            "Ad, meslek ve şehir bilgilerini değişkenlerde tutup f-string ile okunabilir bir profil çıktısı yazdır.",
          migo: "Önce verileri değişkenlere koy, sonra print ile birleştir.",
        },
      ),
      codeWritingStep(
        "step-2",
        "Temel kart",
        "En az 2 değişken ve print() ile kısa profil çıktısı yaz.",
        {
          validation: {
            mustIncludeAssignment: true,
            mustIncludePrint: true,
            minLength: 25,
          },
          checklist: [
            "En az 2 değişken tanımlı",
            "print() kullanılmış",
            "Çıktı okunabilir bir profil kartı",
          ],
          exampleSolution:
            'ad = "Efe"\nsehir = "Ankara"\nprint(f"Ad: {ad}")\nprint(f"Şehir: {sehir}")',
          migo: "Başlık satırı eklemek kartı daha düzenli gösterir.",
        },
      ),
      codeOrderLinesStep(
        "step-3",
        "Profil satırları sırası",
        ['ad = "Selin"', 'meslek = "Tasarımcı"', 'print(f"{ad} — {meslek}")'],
        { content: "Değişkenler print'ten önce tanımlanmalı.", migo: "Önce veriler, sonra yazdırma." },
      ),
      projectStep(
        "step-4",
        "Genişletilmiş kart",
        "Profil kartına boolean ve en az 3 print() satırı ekle.",
        {
          checklist: [
            "Boolean değişken kullanılmış",
            "En az 3 print satırı",
            "f-string ile en az 1 satır",
          ],
          exampleSolution:
            'ad = "Efe"\nyas = 28\naktif = True\nprint(f"Ad: {ad}")\nprint(f"Yaş: {yas}")\nprint(f"Aktif: {aktif}")',
          validation: {
            mustIncludePrint: true,
            requiredPatterns: ["True|False", "f[\"']"],
            minPrintCount: 3,
            minLength: 40,
          },
          migo: "Boolean değeri doğrudan f-string içinde yazdırabilirsin.",
        },
      ),
      completeStep("step-5", 25, "input() mantığı", {
        content: "Değişkenler, f-string ve boolean ile profil kartı oluşturdun.",
      }),
    ],
    "beginner",
  ),

  "beg-input-basics": buildLesson(
    "beg-input-basics",
    "input() mantığı",
    "Kullanıcıdan veri almayı öğren.",
    "5 dk",
    10,
    [
      infoStep(
        "step-1",
        "input() nedir?",
        "input() kullanıcıdan klavye ile veri alır. Program durur, kullanıcı yazıp Enter'a basana kadar bekler.",
        {
          code: 'isim = input("Adın: ")\nprint(isim)',
          migo: "Parantez içindeki metin kullanıcıya gösterilen istektir (prompt).",
        },
      ),
      codeOrderLinesStep(
        "step-2",
        "input sırası",
        ['isim = input("Adın: ")', "print(isim)"],
        { content: "Önce input ile al, sonra yazdır.", migo: "input() kullanıcıdan veri alır." },
      ),
      debugStep(
        "step-3",
        "input hatası",
        'yas = input("Yaşın: ")\nprint(yas + 1)',
        [
          "input metin döndürür, sayıya çevrilmeli",
          "input yanlış yazılmış",
          "print gereksiz",
          "Kod doğru çalışır",
        ],
        "input metin döndürür, sayıya çevrilmeli",
        { migo: "Sayısal işlem için int() kullan." },
      ),
      codeWritingStep(
        "step-4",
        "Adını sor",
        'input() ile kullanıcıdan ad al ve print() ile yazdır.',
        {
          validation: {
            mustIncludePrint: true,
            requiredPatterns: ["input\\s*\\(", "="],
            minLength: 20,
          },
          exampleSolution: 'isim = input("Adın ne? ")\nprint(isim)',
        },
      ),
      miniTaskStep(
        "step-5",
        "Selamlama programı",
        "input() ile ad al, f-string ile selamlama yazdır.",
        {
          checklist: ["input kullanılmış", "f-string print var", "anlamlı prompt"],
          exampleSolution:
            'ad = input("Adın: ")\nprint(f"Merhaba, {ad}!")',
          validation: {
            mustIncludePrint: true,
            requiredPatterns: ["input\\s*\\(", "f[\"']"],
            minLength: 25,
          },
          migo: "Kullanıcıdan aldığın metni f-string ile birleştir.",
        },
      ),
      completeStep("step-6", 10, "Metin döndürür ve dönüşümler"),
    ],
    "beginner",
  ),

  "beg-input-conversion": buildLesson(
    "beg-input-conversion",
    "Metin döndürür ve dönüşümler",
    "input() sonucunu sayıya çevir.",
    "6 dk",
    10,
    [
      infoStep(
        "step-1",
        "Tür dönüşümü",
        "input() metin döndürür. Sayısal işlem için int() veya float() ile dönüştürmen gerekir.",
        {
          code: 'yas_metin = input("Yaşın: ")\nyas = int(yas_metin)\nprint(yas + 1)',
          migo: "Matematik yapmadan önce türü doğru hale getir.",
        },
      ),
      mcStep(
        "step-2",
        "Doğru dönüşüm",
        ['sayi = int("42")', 'sayi = int("kırk")', 'sayi = int(True)', 'sayi = int("42.5")'],
        'sayi = int("42")',
        { migo: "int() yalnızca tam sayı metinlerinde sorunsuz çalışır." },
      ),
      fillStep(
        "step-3",
        "float dönüşümü",
        'fiyat = float(____("Fiyat: "))',
        ["input", "print", "str", "int"],
        "input",
        { content: "Kullanıcıdan ondalıklı fiyat al ve float'a çevir.", migo: "Önce input(), sonra float()." },
      ),
      outputStep(
        "step-4",
        "Toplama",
        'a = int("10")\nb = int("5")\nprint(a + b)',
        ["15", "105", "Hata", "10 5"],
        "15",
        { migo: "int'e çevrilince + toplama yapar." },
      ),
      completeStep("step-5", 10, "Küçük hesaplama görevleri"),
    ],
    "beginner",
  ),

  "beg-calc-tasks": buildLesson(
    "beg-calc-tasks",
    "Küçük hesaplama görevleri",
    "input ve dönüşümle basit hesaplamalar yap.",
    "6 dk",
    15,
    [
      infoStep(
        "step-1",
        "Hesaplama akışı",
        "Veri al → dönüştür → işlem yap → sonucu yazdır. Bu kalıp birçok programda tekrar eder.",
        {
          code: 'a = int(input("Sayı 1: "))\nb = int(input("Sayı 2: "))\nprint(a + b)',
          migo: "Sırayı bozma: önce input, sonra int, en son işlem.",
        },
      ),
      outputStep(
        "step-2",
        "Çarpım",
        'x = int("6")\ny = int("7")\nprint(x * y)',
        ["42", "67", "13", "Hata"],
        "42",
        { migo: "int'e çevrilmiş değerlerle çarpma yapılır." },
      ),
      miniTaskStep(
        "step-3",
        "İki sayının toplamı",
        "Kullanıcıdan iki sayı al, topla ve sonucu yazdır.",
        {
          checklist: [
            "İki input() var",
            "int() dönüşümü kullanılmış",
            "Toplam print() ile yazdırılıyor",
          ],
          exampleSolution:
            'sayi1 = int(input("Birinci sayı: "))\nsayi2 = int(input("İkinci sayı: "))\nprint(sayi1 + sayi2)',
          migo: "Prompt metinlerini Türkçe ve anlaşılır yaz.",
        },
      ),
      fillStep(
        "step-4",
        "Ortalama",
        'not1 = int(input("Not 1: "))\nnot2 = int(input("Not 2: "))\nprint((not1 + not2) / ____)',
        ["2", "not1", "0", "1"],
        "2",
        { content: "İki notun ortalamasını hesapla.", migo: "Toplamı kaç nota böleceksin?" },
      ),
      completeStep("step-5", 15, "Mini proje: Yaş hesaplayıcı"),
    ],
    "beginner",
  ),

  "beg-age-calculator": buildLesson(
    "beg-age-calculator",
    "Mini proje: Yaş hesaplayıcı",
    "Doğum yılından yaş hesaplayan mini program yaz.",
    "8 dk",
    25,
    [
      infoStep(
        "step-1",
        "Yaş formülü",
        "Doğum yılından yaş hesaplayan bir program yazacaksın.",
        {
          expectedBehavior:
            "Kullanıcıdan doğum yılını al, int'e çevir, bulunulan yıldan çıkar ve yaşı ekrana yazdır.",
          taskNote: "Yaş ≈ bulunulan yıl − doğum yılı",
          migo: "Sabit yıl yerine güncel yılı kullanabilirsin.",
        },
      ),
      miniTaskStep(
        "step-2",
        "Temel hesap",
        "Doğum yılını al, yaşı hesapla ve yazdır.",
        {
          checklist: [
            "input() ve int() kullanılmış",
            "Çıkarma işlemi var",
            "Sonuç print() ile gösteriliyor",
          ],
          exampleSolution:
            'dogum_yili = int(input("Doğum yılın: "))\nyas = 2026 - dogum_yili\nprint("Yaşın:", yas)',
        },
      ),
      projectStep(
        "step-3",
        "Kişiselleştirilmiş çıktı",
        "Kullanıcı adını da al ve f-string ile \"Merhaba X, yaşın Y\" formatında yazdır.",
        {
          checklist: [
            "İsim ve doğum yılı alınıyor",
            "f-string kullanılmış",
            "Yaş doğru hesaplanıyor",
          ],
          exampleSolution:
            'isim = input("Adın: ")\ndogum = int(input("Doğum yılın: "))\nyas = 2026 - dogum\nprint(f"Merhaba {isim}, yaşın {yas}")',
          migo: "İsim metin olarak kalır, doğum yılı sayıya çevrilir.",
        },
      ),
      completeStep("step-4", 25, "if mantığı"),
    ],
    "beginner",
  ),

  "beg-if-basics": buildLesson(
    "beg-if-basics",
    "if mantığı",
    "Koşula göre kod çalıştırmayı öğren.",
    "5 dk",
    10,
    [
      infoStep(
        "step-1",
        "if nedir?",
        "if bir koşul doğruysa (True) içindeki kodu çalıştırır. Python'da girinti (indent) blok yapısını belirler.",
        {
          code: 'yas = 20\nif yas >= 18:\n    print("Reşitsin")',
          migo: "if satırından sonraki kod bir tab (4 boşluk) içeride olmalı.",
        },
      ),
      mcStep(
        "step-2",
        "Ne zaman çalışır?",
        ["yas >= 18 True ise", "Her zaman", "yas çift ise", "Hiçbir zaman"],
        "yas >= 18 True ise",
        { code: "yas = 20\nif yas >= 18:\n    print(\"Reşitsin\")", migo: "Koşul doğru olduğunda if bloğu çalışır. Girintiye dikkat et." },
      ),
      fillStep(
        "step-3",
        "Koşulu tamamla",
        'puan = 85\nif puan ____ 50:\n    print("Geçti")',
        [">=", "<", "==", "="],
        ">=",
        { migo: "50 ve üzeri geçer — hangi operatör uygun?" },
      ),
      outputStep(
        "step-4",
        "Çıktı tahmini",
        'sicaklik = 30\nif sicaklik > 25:\n    print("Sıcak")',
        ["Sıcak", "Hiçbir şey", "Hata", "30"],
        "Sıcak",
        { migo: "Karşılaştırma sonucunu düşün: koşul doğruysa hangi blok çalışır?" },
      ),
      completeStep("step-5", 10, "Karşılaştırmalar"),
    ],
    "beginner",
  ),

  "beg-comparisons": buildLesson(
    "beg-comparisons",
    "Karşılaştırmalar",
    "==, !=, <, >, <=, >= operatörlerini kullan.",
    "5 dk",
    10,
    [
      infoStep(
        "step-1",
        "Karşılaştırma operatörleri",
        "İki değeri karşılaştırıp True veya False üretirler. Eşitlik için == kullanılır (= atama içindir).",
        {
          code: "a = 10\nb = 5\nprint(a > b)\nprint(a == b)",
          migo: "= atama, == eşitlik kontrolüdür — sık karıştırılır.",
        },
      ),
      mcStep(
        "step-2",
        "Sonuç ne?",
        ["True", "False", "10", "Hata"],
        "False",
        { code: 'print("a" == "A")', migo: "Python'da büyük/küçük harf duyarlıdır." },
      ),
      fillStep(
        "step-3",
        "Eşit değil",
        'if sifre != ____:\n    print("Yanlış şifre")',
        ['"1234"', "1234", "sifre", "!="],
        '"1234"',
        { content: "Şifre 1234 değilse uyarı ver.", migo: "Metin karşılaştırması tırnaklı yazılır." },
      ),
      outputStep(
        "step-4",
        "Sayı karşılaştırma",
        "notu = 45\nprint(notu >= 50)",
        ["False", "True", "45", "Hata"],
        "False",
        { migo: "Karşılaştırma operatörünün True veya False döndürdüğünü hatırla." },
      ),
      completeStep("step-5", 10, "else kullanımı"),
    ],
    "beginner",
  ),

  "beg-else": buildLesson(
    "beg-else",
    "else kullanımı",
    "Koşul sağlanmazsa alternatif kod çalıştır.",
    "5 dk",
    10,
    [
      infoStep(
        "step-1",
        "else bloğu",
        "if koşulu False ise else altındaki kod çalışır. İki yollu kararlar için idealdir.",
        {
          code: 'yas = 16\nif yas >= 18:\n    print("Girebilirsin")\nelse:\n    print("Giremezsin")',
          migo: "else, if ile aynı girinti seviyesinde olmalı.",
        },
      ),
      outputStep(
        "step-2",
        "Hangi mesaj?",
        'puan = 40\nif puan >= 50:\n    print("Geçti")\nelse:\n    print("Kaldı")',
        ["Kaldı", "Geçti", "40", "Hata"],
        "Kaldı",
        { migo: "Koşul sağlanmazsa alternatif dal devreye girer. Hangi dalın çalışacağını düşün." },
      ),
      mcStep(
        "step-3",
        "Doğru yapı",
        [
          "if x > 0:\n    print('pozitif')\nelse:\n    print('değil')",
          "if x > 0:\nelse:\n    print('değil')",
          "if x > 0\n    print('pozitif')",
          "else if x > 0:",
        ],
        "if x > 0:\n    print('pozitif')\nelse:\n    print('değil')",
        { migo: "Her iki dalda da girinti şart." },
      ),
      fillStep(
        "step-4",
        "Tamamla",
        'if bakiye >= fiyat:\n    print("Alındı")\n____:\n    print("Yetersiz bakiye")',
        ["else", "elif", "then", "if"],
        "else",
        { migo: "Alternatif dal için else kullanılır." },
      ),
      completeStep("step-5", 10, "elif ile birden fazla durum"),
    ],
    "beginner",
  ),

  "beg-elif": buildLesson(
    "beg-elif",
    "elif ile birden fazla durum",
    "Üç veya daha fazla durumu elif ile yönet.",
    "6 dk",
    15,
    [
      infoStep(
        "step-1",
        "elif zinciri",
        "if'ten sonra birden fazla koşul için elif kullanılır. İlk doğru dal çalışır, diğerleri atlanır.",
        {
          code: 'notu = 75\nif notu >= 90:\n    print("A")\nelif notu >= 70:\n    print("B")\nelse:\n    print("C")',
          migo: "Koşulları en özel olandan genel olana sıralamak önemli olabilir.",
        },
      ),
      outputStep(
        "step-2",
        "Harf notu",
        'notu = 82\nif notu >= 90:\n    print("A")\nelif notu >= 80:\n    print("B")\nelse:\n    print("C")',
        ["B", "A", "C", "82"],
        "B",
        { migo: "Koşulları sırayla kontrol et. İlk doğru olan dal çalışır, sonrakiler atlanır." },
      ),
      mcStep(
        "step-3",
        "Kaç dal çalışır?",
        ["Yalnızca ilk doğru dal", "Tüm doğru dallar", "Her zaman else", "Hiçbiri"],
        "Yalnızca ilk doğru dal",
        { migo: "if/elif zincirinde yalnızca bir blok çalışır." },
      ),
      fillStep(
        "step-4",
        "Sıcaklık",
        'sicaklik = 15\nif sicaklik >= 30:\n    print("Sıcak")\n____ sicaklik >= 20:\n    print("Ilık")\nelse:\n    print("Soğuk")',
        ["elif", "else", "if", "then"],
        "elif",
        { content: "Orta sıcaklık için elif ekle.", migo: "Birden fazla koşul varsa if'ten sonra hangi anahtar kelimeyi kullanırsın?" },
      ),
      completeStep("step-5", 15, "Mini proje: Bilet fiyatı"),
    ],
    "beginner",
  ),

  "beg-ticket-price": buildLesson(
    "beg-ticket-price",
    "Mini proje: Bilet fiyatı",
    "Yaşa göre bilet fiyatı hesaplayan program yaz.",
    "8 dk",
    25,
    [
      infoStep(
        "step-1",
        "Fiyat kuralları",
        "Yaşa göre farklı bilet fiyatları uygulayan bir program yazacaksın.",
        {
          expectedBehavior:
            "Örnek kurallar: 0–12 yaş ücretsiz, 13–17 indirimli, 18+ tam fiyat. input, int ve if/elif/else kullan.",
          migo: "Kuralları önce kağıda yaz, sonra koda çevir.",
        },
      ),
      miniTaskStep(
        "step-2",
        "Yaş al ve fiyat yazdır",
        "Kullanıcıdan yaş al; en az 2 farklı fiyat kuralı uygula.",
        {
          checklist: [
            "input() ve int() var",
            "if/elif veya if/else kullanılmış",
            "En az 2 farklı fiyat mesajı",
          ],
          exampleSolution:
            'yas = int(input("Yaşınız: "))\nif yas < 18:\n    print("İndirimli: 60 TL")\nelse:\n    print("Tam: 120 TL")',
        },
      ),
      projectStep(
        "step-3",
        "Üç kademeli bilet",
        "Üç yaş grubu ve f-string ile \"Bilet fiyatınız: X TL\" formatında çıktı üret.",
        {
          checklist: [
            "Üç farklı yaş aralığı",
            "elif kullanılmış",
            "f-string ile fiyat gösteriliyor",
          ],
          exampleSolution:
            'yas = int(input("Yaş: "))\nif yas <= 12:\n    fiyat = 0\nelif yas <= 17:\n    fiyat = 50\nelse:\n    fiyat = 100\nprint(f"Bilet fiyatınız: {fiyat} TL")',
          migo: "Önce fiyatı değişkene ata, sonra yazdır — kod daha okunur olur.",
        },
      ),
      completeStep("step-4", 25, "Liste nedir?"),
    ],
    "beginner",
  ),

  "beg-list-intro": buildLesson(
    "beg-list-intro",
    "Liste nedir?",
    "Birden fazla değeri tek değişkende tut.",
    "5 dk",
    10,
    [
      infoStep(
        "step-1",
        "Liste kavramı",
        "Liste, köşeli parantez içinde sıralı değerler tutar. Farklı türler aynı listede olabilir.",
        {
          code: 'meyveler = ["elma", "armut", "muz"]\nprint(meyveler)',
          migo: "Liste, alışveriş sepeti gibi birden fazla öğe taşır.",
        },
      ),
      mcStep(
        "step-2",
        "Geçerli liste hangisi?",
        ['[1, 2, 3]', '(1, 2, 3)', '{1, 2, 3}', '1, 2, 3'],
        "[1, 2, 3]",
        { migo: "Python listeleri köşeli parantezle yazılır." },
      ),
      fillStep(
        "step-3",
        "Boş liste",
        "gorevler = ____",
        ["[]", "{}", "()", '""'],
        "[]",
        { content: "Boş bir görev listesi oluştur.", migo: "Boş liste [] ile yazılır." },
      ),
      outputStep(
        "step-4",
        "Liste çıktısı",
        'renkler = ["kırmızı", "mavi"]\nprint(renkler)',
        ['["kırmızı", "mavi"]', "kırmızı", "mavi", "Hata"],
        '["kırmızı", "mavi"]',
        { migo: "print() listeyi Python gösterimiyle yazar." },
      ),
      completeStep("step-5", 10, "Elemanlara erişme ve ekleme"),
    ],
    "beginner",
  ),

  "beg-list-access": buildLesson(
    "beg-list-access",
    "Elemanlara erişme ve ekleme",
    "İndeks ve append ile liste üzerinde çalış.",
    "5 dk",
    10,
    [
      infoStep(
        "step-1",
        "İndeks ve append",
        "İlk eleman indeks 0'dır. append() listenin sonuna eleman ekler.",
        {
          code: 'notlar = [70, 85, 90]\nprint(notlar[0])\nnotlar.append(95)',
          migo: "Python'da sayma 0'dan başlar — bu birçok dilde böyledir.",
        },
      ),
      mcStep(
        "step-2",
        "notlar[1] ne döner?",
        ["85", "70", "90", "1"],
        "85",
        { code: "notlar = [70, 85, 90]", migo: "İndeks 1 ikinci elemanı verir." },
      ),
      fillStep(
        "step-3",
        "Eleman ekle",
        'alisveris = ["süt", "ekmek"]\nalisveris.____("yumurta")',
        ["append", "add", "push", "insert"],
        "append",
        { migo: "Sona eklemek için append() kullanılır." },
      ),
      outputStep(
        "step-4",
        "İlk eleman",
        'sehirler = ["Ankara", "İzmir", "Bursa"]\nprint(sehirler[0])',
        ["Ankara", "İzmir", "0", "Hata"],
        "Ankara",
        { migo: "İndeks 0 her zaman ilk elemandır." },
      ),
      completeStep("step-5", 10, "Liste uzunluğu"),
    ],
    "beginner",
  ),

  "beg-list-length": buildLesson(
    "beg-list-length",
    "Liste uzunluğu",
    "len() ile listedeki eleman sayısını bul.",
    "5 dk",
    15,
    [
      infoStep(
        "step-1",
        "len() fonksiyonu",
        "len(liste) listedeki eleman sayısını verir. append sonrası uzunluk artar.",
        {
          code: 'kelimeler = ["Python", "Kod", "Migo"]\nprint(len(kelimeler))',
          migo: "Boş listenin uzunluğu 0'dır.",
        },
      ),
      outputStep(
        "step-2",
        "Uzunluk",
        'sayilar = [10, 20, 30, 40]\nprint(len(sayilar))',
        ["4", "40", "3", "Hata"],
        "4",
        { migo: "Dört eleman var — len 4 döner." },
      ),
      mcStep(
        "step-3",
        "append sonrası",
        ["3", "2", "4", "Hata"],
        "3",
        {
          code: 'liste = ["a", "b"]\nliste.append("c")\nprint(len(liste))',
          migo: "append bir eleman ekledi.",
        },
      ),
      fillStep(
        "step-4",
        "Kontrol",
        'urunler = ["kalem", "defter"]\nif len(urunler) ____ 0:\n    print("Liste dolu")',
        [">", "<", "=", "=="],
        ">",
        { content: "Liste boş değilse mesaj yazdır.", migo: "Eleman sayısı 0'dan büyük mü?" },
      ),
      completeStep("step-5", 15, "Mini proje: Alışveriş listesi"),
    ],
    "beginner",
  ),

  "beg-shopping-list": buildLesson(
    "beg-shopping-list",
    "Mini proje: Alışveriş listesi",
    "Liste oluştur, eleman ekle ve listeyi yazdır.",
    "8 dk",
    25,
    [
      infoStep(
        "step-1",
        "Alışveriş listesi",
        "Python listesi ile alışveriş listesi oluşturacaksın.",
        {
          expectedBehavior:
            "Başlangıç listesi oluştur, append ile ürün ekle ve listeyi (veya özetini) ekrana yazdır.",
          migo: "Gerçek hayattaki liste mantığının aynısını kodluyorsun.",
        },
      ),
      miniTaskStep(
        "step-2",
        "Liste oluştur",
        "En az 2 elemanlı liste oluştur, 1 append yap ve listeyi yazdır.",
        {
          checklist: [
            "Liste tanımlı",
            "append() kullanılmış",
            "Liste print() ile gösteriliyor",
          ],
          exampleSolution:
            'alisveris = ["elma", "su"]\nalisveris.append("çay")\nprint(alisveris)',
        },
      ),
      projectStep(
        "step-3",
        "Özet çıktı",
        "Alışveriş listesine 2 ürün ekle; her ürünü ayrı satırda ve toplam ürün sayısını yazdır.",
        {
          checklist: [
            "En az 2 append",
            "Ürünler ayrı satırlarda",
            "len() ile toplam gösteriliyor",
          ],
          exampleSolution:
            'liste = ["süt"]\nliste.append("ekmek")\nliste.append("yumurta")\nfor urun in liste:\n    print(f"- {urun}")\nprint(f"Toplam: {len(liste)} ürün")',
          migo: "for döngüsünü bir sonraki ünitede derinleştireceğiz — burada basit kullanım yeterli.",
        },
      ),
      completeStep("step-4", 25, "for döngüsü"),
    ],
    "beginner",
  ),

  "beg-for-loop": buildLesson(
    "beg-for-loop",
    "for döngüsü",
    "Aynı işlemi birden fazla kez tekrarla.",
    "5 dk",
    10,
    [
      infoStep(
        "step-1",
        "for döngüsü",
        "for değişken in dizi: yapısı her eleman için bloktaki kodu bir kez çalıştırır.",
        {
          code: 'for i in [1, 2, 3]:\n    print(i)',
          migo: "Döngü, tekrar eden işleri otomatikleştirir.",
        },
      ),
      outputStep(
        "step-2",
        "Çıktı",
        'for harf in ["A", "B"]:\n    print(harf)',
        ["A\nB", "AB", "harf", "Hata"],
        "A\nB",
        { migo: "Her iterasyonda bir print çalışır." },
      ),
      fillStep(
        "step-3",
        "Döngü yaz",
        "for sehir in sehirler:\n    ____",
        ["print(sehir)", "print sehir", "sehir.print()", "print(sehirler)"],
        "print(sehir)",
        { content: "Her şehri yazdır.", migo: "Döngü değişkeni o anki elemanı tutar." },
      ),
      mcStep(
        "step-4",
        "Kaç kez çalışır?",
        ["3", "2", "1", "0"],
        "3",
        {
          code: 'for x in ["a", "b", "c"]:\n    print(x)',
          migo: "Üç eleman — üç iterasyon.",
        },
      ),
      completeStep("step-5", 10, "range() kullanımı"),
    ],
    "beginner",
  ),

  "beg-range": buildLesson(
    "beg-range",
    "range() kullanımı",
    "Sayı dizileri üretmek için range kullan.",
    "5 dk",
    10,
    [
      infoStep(
        "step-1",
        "range()",
        "range(5) 0'dan 4'e kadar sayılar üretir. for ile birlikte sık kullanılır.",
        {
          code: "for i in range(3):\n    print(i)",
          migo: "range(3) aslında 0, 1, 2 üretir — 3 dahil değil.",
        },
      ),
      outputStep(
        "step-2",
        "range(4)",
        "for n in range(4):\n    print(n)",
        ["0\n1\n2\n3", "1\n2\n3\n4", "4", "Hata"],
        "0\n1\n2\n3",
        { migo: "Başlangıç 0, bitiş hariç 4." },
      ),
      mcStep(
        "step-3",
        "range(2, 5) ne üretir?",
        ["2, 3, 4", "2, 3, 4, 5", "0, 1, 2", "5, 6, 7"],
        "2, 3, 4",
        { migo: "İkinci sayı dahil edilmez." },
      ),
      fillStep(
        "step-4",
        "1'den 3'e",
        "for i in range(____, 4):\n    print(i)",
        ["1", "0", "4", "3"],
        "1",
        { content: "1, 2, 3 yazdırmak için range'i tamamla.", migo: "4 dahil değil — üst sınır 4 olmalı." },
      ),
      completeStep("step-5", 10, "Liste üzerinde dönme"),
    ],
    "beginner",
  ),

  "beg-loop-list": buildLesson(
    "beg-loop-list",
    "Liste üzerinde dönme",
    "for ile liste elemanlarını işle.",
    "6 dk",
    15,
    [
      infoStep(
        "step-1",
        "Liste + for",
        "for öğe in liste: doğrudan elemanlara erişirsin; indeks gerekmez.",
        {
          code: 'notlar = [60, 70, 80]\nfor notu in notlar:\n    print(notu)',
          migo: "Liste üzerinde dönme, günlük Python kalıplarından biridir.",
        },
      ),
      outputStep(
        "step-2",
        "Toplam biriktirme",
        'toplam = 0\nfor n in [10, 20, 5]:\n    toplam = toplam + n\nprint(toplam)',
        ["35", "10", "0", "Hata"],
        "35",
        { migo: "Döngüde toplam değişkeni güncellenir." },
      ),
      miniTaskStep(
        "step-3",
        "Liste yazdır",
        "3 elemanlı bir listeyi for ile her satıra bir eleman yazdır.",
        {
          checklist: [
            "for döngüsü var",
            "Liste en az 3 elemanlı",
            "Her eleman print ediliyor",
          ],
          exampleSolution:
            'meyveler = ["elma", "armut", "muz"]\nfor meyve in meyveler:\n    print(meyve)',
        },
      ),
      fillStep(
        "step-4",
        "Koşullu yazdır",
        'for sayi in [1, 4, 7, 10]:\n    if sayi ____ 5:\n        print(sayi)',
        [">", "<", "==", "!="],
        ">",
        { content: "5'ten büyük sayıları yazdır.", migo: "if ile filtreleme yapabilirsin." },
      ),
      completeStep("step-5", 15, "Mini proje: Günlük görev yazdırıcı"),
    ],
    "beginner",
  ),

  "beg-daily-tasks": buildLesson(
    "beg-daily-tasks",
    "Mini proje: Günlük görev yazdırıcı",
    "Görev listesini numaralı şekilde yazdır.",
    "8 dk",
    25,
    [
      infoStep(
        "step-1",
        "Görev yazdırıcı",
        "Görev listesini numaralı şekilde yazdıracaksın.",
        {
          expectedBehavior:
            "Görevleri bir listede tut; for döngüsü veya range ile her görevi satır satır yazdır.",
          migo: "Numaralı çıktı için range(len(...)) veya enumerate düşünebilirsin.",
        },
      ),
      miniTaskStep(
        "step-2",
        "Basit liste",
        "En az 3 görevli listeyi for ile her satıra bir görev yazdır.",
        {
          checklist: [
            "En az 3 görev",
            "for döngüsü kullanılmış",
            "Her görev ayrı satırda",
          ],
          exampleSolution:
            'gorevler = ["E-posta", "Toplantı", "Kod"]\nfor g in gorevler:\n    print(g)',
        },
      ),
      projectStep(
        "step-3",
        "Numaralı görevler",
        "Görevleri \"1. ...\" formatında numaralandırarak yazdır.",
        {
          checklist: [
            "Numaralandırma var",
            "En az 3 görev",
            "range veya enumerate benzeri mantık",
          ],
          exampleSolution:
            'gorevler = ["Kahvaltı", "Ders", "Proje"]\nfor i in range(len(gorevler)):\n    print(f"{i+1}. {gorevler[i]}")',
          migo: "enumerate ileride öğreneceğin kısa bir alternatiftir.",
        },
      ),
      completeStep("step-4", 25, "Fonksiyon neden kullanılır?"),
    ],
    "beginner",
  ),

  "beg-why-functions": buildLesson(
    "beg-why-functions",
    "Fonksiyon neden kullanılır?",
    "Tekrar eden kodu organize etmenin yollarını keşfet.",
    "5 dk",
    10,
    [
      infoStep(
        "step-1",
        "Fonksiyon fikri",
        "Aynı işi birçok yerde yapıyorsan, kodu fonksiyona alırsın. Bakım kolaylaşır, hata azalır.",
        {
          code: 'def selamla():\n    print("Merhaba!")\n\nselamla()\nselamla()',
          migo: "Fonksiyon bir tarif gibidir — bir kez yaz, istediğin kadar çağır.",
        },
      ),
      mcStep(
        "step-2",
        "Ana fayda",
        [
          "Kod tekrarını azaltmak",
          "Python'u hızlandırmak",
          "Dosya silmek",
          "İnterneti kapatmak",
        ],
        "Kod tekrarını azaltmak",
        { migo: "DRY: Don't Repeat Yourself." },
      ),
      mcStep(
        "step-3",
        "Ne zaman fonksiyon?",
        [
          "Aynı mantık birden fazla yerde kullanılıyorsa",
          "Sadece bir satır kod varsa her zaman",
          "Hiçbir zaman",
          "Sadece print varken",
        ],
        "Aynı mantık birden fazla yerde kullanılıyorsa",
        { migo: "Tek satırlık basit işlerde hemen fonksiyon şart değil; tekrar varsa değer." },
      ),
      fillStep(
        "step-4",
        "Tanım",
        "____ mesaj_yaz():\n    print(\"Tamam\")",
        ["def", "function", "fn", "fun"],
        "def",
        { migo: "Python'da fonksiyon def ile başlar." },
      ),
      completeStep("step-5", 10, "def ile fonksiyon yazma"),
    ],
    "beginner",
  ),

  "beg-def-function": buildLesson(
    "beg-def-function",
    "def ile fonksiyon yazma",
    "Kendi fonksiyonlarını tanımla ve çağır.",
    "6 dk",
    10,
    [
      infoStep(
        "step-1",
        "def sözdizimi",
        "def fonksiyon_adi(): ile tanımlarsın. Çağırmak için fonksiyon_adi() yazarsın.",
        {
          code: 'def kutla():\n    print("Tebrikler!")\n\nkutla()',
          migo: "Tanım ile çağrı farklıdır — önce def, sonra fonksiyon adı ve parantez.",
        },
      ),
      fillStep(
        "step-2",
        "Fonksiyon tanımla",
        "____ topla():\n    print(2 + 3)",
        ["def", "function", "return", "call"],
        "def",
        { migo: "Tanım def ile başlar." },
      ),
      outputStep(
        "step-3",
        "Çağrı sonrası",
        'def yaz():\n    print("OK")\n\nyaz()\nyaz()',
        ["OK\nOK", "OK", "yaz", "Hata"],
        "OK\nOK",
        { migo: "İki kez çağrıldı — iki kez OK." },
      ),
      mcStep(
        "step-4",
        "Doğru çağrı",
        ["merhaba()", "call merhaba", "def merhaba()", "print def merhaba"],
        "merhaba()",
        {
          code: "def merhaba():\n    print('Selam')",
          migo: "Tanımdan sonra adı ve parantez ile çağırırsın.",
        },
      ),
      completeStep("step-5", 10, "Parametre ve return"),
    ],
    "beginner",
  ),

  "beg-params-return": buildLesson(
    "beg-params-return",
    "Parametre ve return",
    "Fonksiyona veri gönder ve sonuç al.",
    "6 dk",
    15,
    [
      infoStep(
        "step-1",
        "Parametre ve return",
        "Parametreler fonksiyona girdi verir. return sonucu çağırana geri döndürür.",
        {
          code: "def kare(n):\n    return n * n\n\nprint(kare(4))",
          migo: "return'den sonraki kod o çağrıda çalışmaz.",
        },
      ),
      fillStep(
        "step-2",
        "Parametre ekle",
        "def selamla(____):\n    print(f\"Merhaba, {isim}\")",
        ["isim", '"isim"', "name()", "print"],
        "isim",
        { migo: "Parantez içine parametre adını yaz." },
      ),
      outputStep(
        "step-3",
        "return sonucu",
        "def iki_kat(x):\n    return x * 2\n\nprint(iki_kat(5))",
        ["10", "5", "x", "Hata"],
        "10",
        { migo: "Fonksiyonun döndürdüğü değeri print ile gösterebilirsin. Önce sonucu düşün." },
      ),
      mcStep(
        "step-4",
        "Doğru kullanım",
        [
          "def topla(a, b):\n    return a + b",
          "def topla(a, b):\n    print(a + b)",
          "return def topla():",
          "def topla: return a+b",
        ],
        "def topla(a, b):\n    return a + b",
        { migo: "Sonucu kullanmak için return tercih edilir." },
      ),
      completeStep("step-5", 15, "Mini proje: Selamlama fonksiyonları"),
    ],
    "beginner",
  ),

  "beg-greeting-functions": buildLesson(
    "beg-greeting-functions",
    "Mini proje: Selamlama fonksiyonları",
    "Parametreli selamlama fonksiyonları yaz.",
    "8 dk",
    25,
    [
      infoStep(
        "step-1",
        "Selamlama modülü",
        "Parametreli selamlama fonksiyonları yazacaksın.",
        {
          expectedBehavior:
            "def ile fonksiyon tanımla; isim veya saat gibi parametrelerle farklı selamlama mesajları üret.",
          migo: "Koşul ve return bir arada kullanılabilir.",
        },
      ),
      miniTaskStep(
        "step-2",
        "Tek fonksiyon",
        "İsim parametresi alan ve \"Merhaba, X\" döndüren fonksiyon yaz; sonucu print et.",
        {
          checklist: [
            "def ile fonksiyon tanımlı",
            "En az 1 parametre",
            "return veya print ile çıktı",
          ],
          exampleSolution:
            'def merhaba(isim):\n    return f"Merhaba, {isim}"\n\nprint(merhaba("Efe"))',
        },
      ),
      projectStep(
        "step-3",
        "İki fonksiyon",
        "selamla(isim) ve resmi_selam(isim, soyisim) fonksiyonlarını yaz ve ikisini de çağır.",
        {
          checklist: [
            "İki ayrı fonksiyon",
            "f-string kullanılmış",
            "Her ikisi de çağrılıp yazdırılıyor",
          ],
          exampleSolution:
            'def selamla(isim):\n    return f"Selam {isim}!"\n\ndef resmi_selam(isim, soyisim):\n    return f"Sayın {isim} {soyisim}"\n\nprint(selamla("Ayşe"))\nprint(resmi_selam("Ayşe", "Yılmaz"))',
          migo: "Fonksiyonları küçük ve tek işe odaklı tut.",
        },
      ),
      completeStep("step-4", 25, "Proje: Quiz uygulaması — Bölüm 1"),
    ],
    "beginner",
  ),

  "beg-quiz-project-1": buildLesson(
    "beg-quiz-project-1",
    "Proje: Quiz uygulaması — Bölüm 1",
    "Tek soruluk quiz uygulamasının temelini kur.",
    "10 dk",
    40,
    [
      infoStep(
        "step-1",
        "Quiz yapısı",
        "Soru metni, seçenekler ve doğru cevap kontrolü. input ve if ile başlayabilirsin.",
        {
          code: 'soru = "2+2 kaç?"\ncevap = input(soru + " ")\nif cevap == "4":\n    print("Doğru!")\nelse:\n    print("Yanlış")',
          migo: "input her zaman string döndürür — \"4\" ile karşılaştır.",
        },
      ),
      projectStep(
        "step-2",
        "Tek soru quiz",
        "Bir soru sor, cevabı kontrol et, doğru/yanlış mesajı yazdır.",
        {
          checklist: [
            "input() ile cevap alınıyor",
            "if/else ile kontrol var",
            "Doğru ve yanlış mesajı farklı",
          ],
          exampleSolution:
            'print("Python\'da liste hangi parantezle yazılır?")\ncevap = input("Cevap: ")\nif cevap == "[]":\n    print("Doğru!")\nelse:\n    print("Yanlış. Cevap: []")',
          migo: "Soruyu net yaz; kullanıcı ne cevap vereceğini bilsin.",
        },
      ),
      projectStep(
        "step-3",
        "Puan ekle",
        "Doğru cevapta +10 puan göster; yanlışta doğru cevabı açıkla.",
        {
          checklist: [
            "Puan değişkeni veya mesajı",
            "Doğru cevapta tebrik",
            "Yanlışta açıklama",
          ],
          exampleSolution:
            'puan = 0\ncevap = input("5*2=? ")\nif cevap == "10":\n    puan = 10\n    print(f"Doğru! +{puan} puan")\nelse:\n    print("Yanlış. Cevap: 10")',
        },
      ),
      completeStep("step-4", 40, "Proje: Quiz uygulaması — Bölüm 2"),
    ],
    "beginner",
  ),

  "beg-quiz-project-2": buildLesson(
    "beg-quiz-project-2",
    "Proje: Quiz uygulaması — Bölüm 2",
    "Çok soruluk quiz ve toplam puan hesabı.",
    "10 dk",
    40,
    [
      infoStep(
        "step-1",
        "Çoklu soru",
        "Her soru için aynı kalıbı tekrarla veya fonksiyon kullan. Toplam puanı biriktir.",
        {
          code: 'puan = 0\ndef sor(cvp, dogru):\n    global puan\n    if cvp == dogru:\n        puan += 10\n        print("Doğru")\n    else:\n        print("Yanlış")',
          migo: "Başlangıçta global kullanmadan her soruda puan += 10 da yeterli.",
        },
      ),
      projectStep(
        "step-2",
        "İki soru",
        "En az 2 soruluk quiz yaz; her doğru +10 puan; sonunda toplam puanı yazdır.",
        {
          checklist: [
            "En az 2 soru",
            "Toplam puan hesaplanıyor",
            "Son satırda toplam puan",
          ],
          exampleSolution:
            'puan = 0\ncevap1 = input("2+2? ")\nif cevap1 == "4":\n    puan += 10\ncevap2 = input("Python dili? ")\nif cevap2.lower() == "python":\n    puan += 10\nprint(f"Toplam puan: {puan}")',
        },
      ),
      projectStep(
        "step-3",
        "Fonksiyonlu quiz",
        "soru_sor(metin, dogru) fonksiyonu ile en az 2 soru sor ve bitiş mesajı ekle.",
        {
          checklist: [
            "Fonksiyon tanımlı",
            "En az 2 soru fonksiyonla",
            "Bitiş mesajı var",
          ],
          exampleSolution:
            'puan = 0\n\ndef soru_sor(metin, dogru):\n    global puan\n    c = input(metin + " ")\n    if c == dogru:\n        puan += 10\n        print("Doğru")\n    else:\n        print(f"Yanlış. Cevap: {dogru}")\n\nsoru_sor("3*3?", "9")\nsoru_sor("[] ne tür?", "liste")\nprint(f"Oyun bitti. Puan: {puan}")',
          migo: "Tebrikler — Başlangıç yolunu tamamladın!",
        },
      ),
      completeStep("step-4", 40, "Python Temel Yolu", {
        content: "Quiz projeni bitirdin. Başlangıç yolundaki tüm temel konuları tamamladın!",
      }),
    ],
    "beginner",
  ),
};
