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
    "Python'un ne olduğunu öğren. Programlamaya başlamanın ilk adımı burada.",
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
          migo: "Python'un bilgisayara talimat vermek için kullanılan bir araç türü olduğunu düşün.",
          migoAfterCorrect:
            "Programlama dili, bilgisayara talimat vermek için kullanılır. Python da böyle bir dildir.",
        },
      ),
      matchStep(
        "step-3",
        "Hangi kavram hangi açıklamayla eşleşir?",
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
      infoStep(
        "step-4",
        "print() nedir?",
        "Kod yazarken ekrana bir şey göstermek için print() kullanılır. Parantez içine tırnaklı metin yazarsın; Python bu metni ekranda gösterir.",
        {
          code: 'print("Merhaba Kodmigo")',
          migo: "print(...) içindeki metin ekranda görünür. Metin yazarken tırnak kullanmayı unutma.",
        },
      ),
      mcStep(
        "step-5",
        "print() ne yapar?",
        [
          "Ekrana yazı veya sayı yazdırır",
          "Bilgisayarı kapatır",
          "Yeni dosya oluşturur",
          "Değişken siler",
        ],
        "Ekrana yazı veya sayı yazdırır",
        {
          code: 'print("Merhaba Kodmigo")',
          migo: "Bu komutun amacını düşün — ekranda bir çıktı üretmek için kullanılır.",
          migoAfterCorrect: "print() ekrana çıktı vermek için kullanılır. Bir sonraki derste bunu uygulayacaksın.",
        },
      ),
      completeStep("step-6", 10, "print() ile çıktı üretme", {
        content:
          "Python'un ne olduğunu ve print() komutunun ne işe yaradığını öğrendin. Şimdi print ile kod yazmayı deneyeceksin.",
      }),
    ],
    "beginner",
  ),

  "python-print": buildLesson(
    "python-print",
    "print() ile çıktı üretme",
    "print() ile ekrana metin yazdırmayı öğren. Python'da ilk görünür sonucunu almanın en basit yolu budur.",
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
        {
          content: "Boşluğu tamamlayarak ekrana Selam yazdır.",
          migo: "Boşluğu doldururken bu satırın ekrana yazdırma işlemi yaptığını düşün.",
          migoAfterCorrect: "Ekrana çıktı vermek için print() komutunu kullanırız.",
        },
      ),
      codeOrderLinesStep(
        "step-4",
        "Kod satırlarını doğru sıraya koy",
        ['print("Merhaba")', 'print("Dünya")'],
        {
          content: "Üstteki satır önce çalışır.",
          migo: "Python kodunu yukarıdan aşağıya sırayla oku.",
          migoAfterCorrect: "Her print() ekrana ayrı satır yazar; sıra önemlidir.",
        },
      ),
      outputStep(
        "step-5",
        "Bu kodun çıktısı ne olur?",
        'print("Python öğreniyorum")',
        ["Hata", "Kodmigo", "print", "Python öğreniyorum"],
        "Python öğreniyorum",
        {
          migo: "Tırnak içindeki metne dikkat et — ekranda tam olarak ne görünür?",
          migoAfterCorrect: "print() parantez içindeki metni olduğu gibi ekrana yazar.",
        },
      ),
      codeWritingStep(
        "step-6",
        "Kendi cümleni yaz",
        "print() kullanarak ekrana kendi cümleni yazdır.",
        {
          validation: {
            validationMode: "printStringLiteral",
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
    "Kodu çalıştırmadan önce çıktıyı tahmin etmeyi öğren. Bu alışkanlık ileride hata ayıklamayı kolaylaştırır.",
    "5 dk",
    15,
    [
      infoStep(
        "step-1",
        "Çıktı tahmini",
        "Kodu satır satır okuyarak ekranda ne görüneceğini düşün. Bu alışkanlık hata ayıklamayı kolaylaştırır.",
        {
          code: 'print("A")\nprint("B")',
          migo: "Her print() ekrana ayrı bir satır yazar. Kodun satırlarını yukarıdan aşağıya takip etmeyi dene.",
        },
      ),
      outputStep(
        "step-2",
        "Bu kodun çıktısı nedir?",
        'print("Kodmigo")\nprint("Python")',
        ["Kodmigo\nPython", "Python\nKodmigo", "KodmigoPython", "Hata"],
        "Kodmigo\nPython",
        {
          migo: "Kodu satır satır takip et — her print ayrı bir satır mı oluşturur?",
          migoAfterCorrect: "Her print() yeni bir satıra yazar; sırayla Kodmigo sonra Python görünür.",
        },
      ),
      debugStep(
        "step-3",
        "Bu kodda hangi hata var?",
        'print("Merhaba"\nprint("Dünya")',
        [
          "İlk satırda kapanmayan parantez",
          "İkinci print gereksiz",
          "Tırnak işareti fazla",
          "Kodda hata yok",
        ],
        "İlk satırda kapanmayan parantez",
        {
          migo: "Hata ayıklarken önce parantezlere ve tırnaklara bakmak iyi bir başlangıçtır.",
          migoAfterCorrect: "Her açılan parantez kapanmalıdır — ilk satırda bir parantez eksik.",
        },
      ),
      matchPairsStep(
        "step-4",
        "Kod ve çıktı eşleştir",
        [
          { concept: 'print("A")', answer: "A" },
          { concept: 'print("B")', answer: "B" },
        ],
        ["AB", "Hata", "Boş satır"],
        { content: "Her kod satırının çıktısını doğru eşleştir.", migo: "Her kavramın yaptığı işi düşün: kod satırı ile çıktısı nasıl eşleşir?" },
      ),
      codeWritingStep(
        "step-5",
        "Benzer çıktı üret",
        'İki print() ile önce "Merhaba" sonra "Dünya" yazdır.',
        {
          validation: {
            validationMode: "multiplePrintStringLiteral",
            mustIncludePrint: true,
            requiredPatterns: ["Merhaba", "Dünya"],
            minLength: 20,
          },
          exampleSolution: 'print("Merhaba")\nprint("Dünya")',
        },
      ),
      completeStep("step-6", 15, "Değişken mantığı", {
        content: "Kodu okuyup çıktıyı tahmin etme pratiği yaptın.",
      }),
    ],
    "beginner",
  ),

  "python-intro-task": buildLesson(
    "python-intro-task",
    "Mini görev: Kendini tanıtan çıktı",
    "print() ile kendini tanıtan bir çıktı oluştur. Öğrendiklerini küçük bir görevde bir araya getir.",
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
            validationMode: "printStringLiteral",
            mustIncludePrint: true,
            minLength: 10,
          },
          checklist: [
            "print() kullanıldı",
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
            validationMode: "variableAndPrint",
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
        { content: "Önce değişken atanmalı, sonra yazdırılmalı.", migo: "Sıralama yaparken önce hangi satırın diğerleri için gerekli olduğunu düşün." },
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
            'ad = "Efe"\nsehir = "İstanbul"\nprint("Ad:", ad)\nprint("Şehir:", sehir)',
          validation: {
            validationMode: "miniProfile",
            mustIncludeAssignment: true,
            mustIncludePrint: true,
            minLength: 30,
          },
        },
      ),
      completeStep("step-6", 25, "Migo'nun Tanışma Kartı", {
        content: "print() ile kendini tanıtmayı öğrendin. Değişkenleri de küçük bir görevde kullandın.",
      }),
    ],
    "beginner",
  ),

  "beg-variables-intro": buildLesson(
    "beg-variables-intro",
    "Değişken mantığı",
    "Verileri isimlerle saklamayı öğren. Aynı değeri tekrar yazmak yerine değişken kullanırsın.",
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
        "Hangi kavram hangi açıklamayla eşleşir?",
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
        "Bu kodun çıktısı nedir?",
        'puan = 90\nprint(puan)',
        ["Hata", "print", "puan", "90"],
        "90",
        {
          migo: "Bir değişken gördüğünde önce içinde hangi değerin saklandığını düşün.",
          migoAfterCorrect: "print() değişkenin içindeki değeri yazar, değişken adını değil.",
        },
      ),
      codeWritingStep(
        "step-5",
        "Kendi değişkenini yaz",
        "Bir şehir değişkeni oluştur ve print() ile yazdır.",
        {
          validation: {
            validationMode: "variableAndPrint",
            mustIncludeAssignment: true,
            mustIncludePrint: true,
            minLength: 15,
          },
          exampleSolution: 'sehir = "Ankara"\nprint(sehir)',
        },
      ),
      codeWritingStep(
        "step-6",
        "Float değişkeni nasıl oluşturup yazdırırsın?",
        "Bir fiyat değişkenine ondalıklı sayı (float) ata ve print() ile yazdır.",
        {
          validation: {
            validationMode: "variableAndPrint",
            mustIncludeAssignment: true,
            mustIncludePrint: true,
            requiredPatterns: ["=\\s*\\d+\\.\\d"],
            minLength: 15,
          },
          exampleSolution: "fiyat = 29.90\nprint(fiyat)",
          migo: "Ondalıklı sayı yazarken nokta kullan — örneğin 29.90.",
        },
      ),
      completeStep("step-7", 10, "İsimlendirme kuralları"),
    ],
    "beginner",
  ),

  "beg-naming-rules": buildLesson(
    "beg-naming-rules",
    "İsimlendirme kuralları",
    "Geçerli ve okunabilir değişken adları seç. İyi isimler kodunu anlaşılır kılar.",
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
        "Bu kodda hangi hata var?",
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
        "Kod satırlarını doğru sıraya koy",
        ["urun_fiyati = 19.99", "print(urun_fiyati)"],
        { content: "Önce değişkeni tanımla, sonra yazdır.", migo: "Değişken kullanılmadan önce tanımlanmalı." },
      ),
      fillStep(
        "step-5",
        "Geçerli değişken adı için boşluğa ne gelmeli?",
        "____ = 19.99",
        ["urun_fiyati", "urun-fiyati", "urun fiyati", "19.99"],
        "urun_fiyati",
        {
          content: "Fiyat bilgisini saklayacak geçerli bir değişken adı seç.",
          migo: "Python'da değişken adlarında boşluk ve tire kullanılamaz — hangi karakter uygun?",
          migoAfterCorrect: "Geçerli adlarda boşluk yerine alt çizgi kullanılır: urun_fiyati.",
        },
      ),
      completeStep("step-6", 10, "Metinler ve sayılar"),
    ],
    "beginner",
  ),

  "beg-strings-numbers": buildLesson(
    "beg-strings-numbers",
    "Metinler ve sayılar",
    "Metin (str) ve sayı (int/float) türlerini ayırt et. Karıştırmak sık yapılan bir hatadır.",
    "5 dk",
    10,
    [
      infoStep(
        "step-1",
        "Metin ve sayı türleri",
        "Python'da üç temel türle sık karşılaşırsın: metin (str) tırnak içinde yazılır; tam sayı (int) ve ondalık sayı (float) tırnaksız yazılır. Float, nokta içeren ondalıklı değerlerdir.",
        {
          code: 'print("Migo")\nprint(100)\nprint(29.90)',
          migo: "Tırnak varsa metin, yoksa sayıdır. 29.90 gibi noktalı değerler float türündedir.",
        },
      ),
      matchPairsStep(
        "step-2",
        "Hangi değer hangi veri türüne aittir?",
        [
          { concept: '"100"', answer: "Metin (str)" },
          { concept: "100", answer: "Tam sayı (int)" },
          { concept: "3.14", answer: "Ondalık sayı (float)" },
        ],
        ["Boolean", "Liste", "Fonksiyon"],
        { migo: "Her değerin türünü eşleştirirken tırnak ve ondalık noktaya dikkat et." },
      ),
      infoStep(
        "intro-float",
        "Ondalıklı sayı (float)",
        "Fiyat gibi kesirli değerler float ile tutulur. Nokta içeren sayılar ondalıklı sayıdır ve matematikte kullanılabilir.",
        {
          code: "print(29.90)\nprint(3.14)",
          migo: "Ondalıklı sayıları yazarken nokta kullanırsın — virgül değil.",
        },
      ),
      outputStep(
        "step-3",
        "Bu kodun çıktısı nedir?",
        'print("5" + "3")',
        ["53", "8", "Hata", "5 3"],
        "53",
        {
          migo: "Tırnak içindeki değerler metin sayılır — + işlemi ne yapabilir?",
          migoAfterCorrect: "Metinlerde + birleştirme yapar; sayısal toplama değil.",
        },
      ),
      outputStep(
        "step-4",
        "Bu kodun çıktısı nedir?",
        "print(5 + 3)",
        ["8", "53", "Hata", "5 3"],
        "8",
        {
          migo: "Tırnaksız sayılarda + matematiksel toplama yapar.",
          migoAfterCorrect: "int ve float değerlerle + toplama işlemi yapar.",
        },
      ),
      mcStep(
        "step-5",
        "Hangisi float?",
        ["29.90", '"29.90"', "29", '"float"'],
        "29.90",
        {
          migo: "Ondalık nokta içeren ve tırnaksız yazılan değeri düşün.",
          migoAfterCorrect: "29.90 ondalıklı bir sayıdır (float). Tırnaklı olanlar metindir.",
        },
      ),
      completeStep("step-6", 10, "Değişken mantığı"),
    ],
    "beginner",
  ),

  "beg-migo-intro-card": buildLesson(
    "beg-migo-intro-card",
    "Migo'nun Tanışma Kartı",
    "print ve değişkenleri kullanarak Migo için küçük bir tanışma kartı oluştur. İlk mini projen burada.",
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
            validationMode: "printStringLiteral",
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
            validationMode: "variableAssignment",
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
            validationMode: "multiplePrintStringLiteral",
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
          "Harika! Migo'nun ilk tanışma kartını Python ile oluşturdun. Bu küçük projede print ve değişkenleri gerçek bir amaç için kullandın.",
      }),
    ],
    "beginner",
  ),

  "beg-boolean-fstring": buildLesson(
    "beg-boolean-fstring",
    "Boolean ve f-string",
    "True/False değerleri ve f-string ile düzenli metin oluşturmayı öğren.",
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
        "Hangisi boolean türündedir?",
        "Tırnaklı ve tırnaksız değerlerden boolean olanı seç.",
        ["False", '"False"', "0", '"True"'],
        "False",
        {
          migo: "Tırnak işareti olan ve olmayan değerleri karşılaştır.",
          migoAfterCorrect: "Tırnaksız True ve False boolean değerleridir; tırnaklı olanlar metindir.",
        },
      ),
      codeOrderLinesStep(
        "step-3",
        "Kod satırlarını doğru sıraya koy",
        ['isim = "Can"', 'print(f"Merhaba, {isim}")'],
        { migo: "Önce değişken, sonra f-string print." },
      ),
      outputStep(
        "step-4",
        "Bu kodun çıktısı nedir?",
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
            validationMode: "fStringIntro",
            mustIncludeAssignment: true,
            mustIncludePrint: true,
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
    "Değişkenler ve f-string ile düzenli bir profil kartı oluştur.",
    "7 dk",
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
      codeOrderLinesStep(
        "step-2",
        "Profil satırları sırası",
        ['ad = "Selin"', 'meslek = "Tasarımcı"', 'print(f"{ad} — {meslek}")'],
        { content: "Değişkenler print'ten önce tanımlanmalı.", migo: "Önce veriler, sonra yazdırma." },
      ),
      codeWritingStep(
        "step-3",
        "Temel kart",
        "En az 2 değişken ve print() ile kısa profil çıktısı yaz.",
        {
          validation: {
            validationMode: "variableAndPrint",
            mustIncludeAssignment: true,
            mustIncludePrint: true,
            minAssignmentCount: 2,
            minLength: 25,
          },
          checklist: [
            "En az 2 değişken tanımlı",
            "print() kullanılmış",
            "Çıktı okunabilir bir profil kartı",
          ],
          exampleSolution:
            'ad = "Efe"\nsehir = "Ankara"\nprint("Ad:", ad)\nprint("Şehir:", sehir)',
          migo: "Başlık satırı eklemek kartı daha düzenli gösterir.",
        },
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
            validationMode: "extendedProfileCard",
            mustIncludePrint: true,
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
    "Kullanıcıdan klavye ile veri almayı öğren. Programlar böyle kişiselleşir.",
    "5 dk",
    10,
    [
      infoStep(
        "step-1",
        "input() nedir?",
        "input() kullanıcıdan klavye ile veri alır. Program durur, kullanıcı yazıp Enter'a basana kadar bekler.",
        {
          code: 'isim = input("Adın: ")\nprint(isim)',
          migo: "Parantez içindeki metin, kullanıcıya gösterilen soru veya istektir.",
        },
      ),
      codeOrderLinesStep(
        "step-2",
        "Kod satırlarını doğru sıraya koy",
        ['isim = input("Adın: ")', "print(isim)"],
        { content: "Önce input ile al, sonra yazdır.", migo: "input() kullanıcıdan veri alır." },
      ),
      debugStep(
        "step-3",
        "Bu kodda hangi hata var?",
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
            validationMode: "miniProject",
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
            validationMode: "miniProject",
            mustIncludePrint: true,
            requiresFString: true,
            requiredPatterns: ["input\\s*\\("],
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
    "input() her zaman metin döndürür. Sayısal işlem için int() veya float() kullanırsın.",
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
        "Hangisi geçerli bir int dönüşümüdür?",
        ['sayi = int("42")', 'sayi = int("kırk")', 'sayi = int(True)', 'sayi = int("42.5")'],
        'sayi = int("42")',
        { migo: "int() yalnızca tam sayı metinlerinde sorunsuz çalışır." },
      ),
      fillStep(
        "step-3",
        "Kullanıcı girdisini almak için boşluğa ne gelmeli?",
        'fiyat = float(____("Fiyat: "))',
        ["input", "print", "str", "int"],
        "input",
        {
          content: "Kullanıcıdan ondalıklı fiyat al ve float'a çevir.",
          migo: "Önce kullanıcıdan veri alman, sonra tür dönüşümü yapman gerekir.",
          migoAfterCorrect: "Kullanıcıdan veri almak için input(), ondalığa çevirmek için float() kullanılır.",
        },
      ),
      outputStep(
        "step-4",
        "Bu kodun çıktısı nedir?",
        'a = int("10")\nb = int("5")\nprint(a + b)',
        ["15", "105", "Hata", "10 5"],
        "15",
        {
          migo: "Önce int dönüşümünü düşün, sonra + işleminin ne yapacağını tahmin et.",
          migoAfterCorrect: "Sayıya çevrilmiş değerlerle + toplama yapar.",
        },
      ),
      completeStep("step-5", 10, "Küçük hesaplama görevleri"),
    ],
    "beginner",
  ),

  "beg-calc-tasks": buildLesson(
    "beg-calc-tasks",
    "Küçük hesaplama görevleri",
    "input ve tür dönüşümüyle basit hesaplamalar yap. Gerçek programlarda sık kullanılan bir kalıp.",
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
        "Bu kodun çıktısı nedir?",
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
          validation: {
            validationMode: "inputSumTwoNumbers",
            minLength: 30,
          },
        },
      ),
      fillStep(
        "step-4",
        "Ortalama hesaplamak için boşluğa ne yazılmalı?",
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
    "Doğum yılından yaş hesaplayan mini program yaz. input, int ve print bir arada.",
    "7 dk",
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
        "Doğum yılından yaş nasıl hesaplanır?",
        "Doğum yılını al, yaşı hesapla ve yazdır.",
        {
          checklist: [
            "input() ve int() kullanılmış",
            "Çıkarma işlemi var",
            "Sonuç print() ile gösteriliyor",
          ],
          exampleSolution:
            'dogum_yili = int(input("Doğum yılın: "))\nyas = 2026 - dogum_yili\nprint("Yaşın:", yas)',
          validation: {
            validationMode: "ageCalculatorBasic",
            minLength: 20,
          },
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
          validation: {
            validationMode: "personalizedAgeOutput",
            minLength: 40,
          },
        },
      ),
      completeStep("step-4", 25, "if mantığı"),
    ],
    "beginner",
  ),

  "beg-if-basics": buildLesson(
    "beg-if-basics",
    "if mantığı",
    "Koşul doğruysa belirli kodun çalışmasını sağla. Programların karar vermesi böyle başlar.",
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
        {
          migo: "50 ve üzeri geçer sayılır — hangi karşılaştırma operatörü uygun?",
          migoAfterCorrect: ">= operatörü 'büyük veya eşit' anlamına gelir; 85 >= 50 doğrudur.",
        },
      ),
      outputStep(
        "step-4",
        "Bu kodun çıktısı nedir?",
        'sicaklik = 30\nif sicaklik > 25:\n    print("Sıcak")',
        ["Sıcak", "Hiçbir şey", "Hata", "30"],
        "Sıcak",
        { migo: "Karşılaştırma sonucunu düşün: koşul doğruysa hangi blok çalışır?" },
      ),
      completeStep("step-5", 10, "else kullanımı"),
    ],
    "beginner",
  ),

  "beg-comparisons": buildLesson(
    "beg-comparisons",
    "Karşılaştırmalar",
    "==, !=, <, > gibi operatörlerle değerleri karşılaştır. Koşulların temelini oluşturur.",
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
        "Bu kodun çıktısı nedir?",
        ["True", "False", "10", "Hata"],
        "False",
        { code: 'print("a" == "A")', migo: "Python'da büyük/küçük harf duyarlıdır." },
      ),
      fillStep(
        "step-3",
        "Eşit değil mi?",
        "print(10 ____ 3)",
        ["==", "!=", "=", ">"],
        "!=",
        {
          content: "10 ile 3 eşit değil — hangi operatör bunu kontrol eder?",
          migo: "Eşitlik == ile kontrol edilir; eşit olmama için başka bir operatör vardır.",
          migoAfterCorrect: "!= operatörü 'eşit değildir' anlamına gelir.",
        },
      ),
      outputStep(
        "step-4",
        "Bu kodun çıktısı nedir?",
        "notu = 45\nprint(notu >= 50)",
        ["False", "True", "45", "Hata"],
        "False",
        { migo: "Karşılaştırma operatörünün True veya False döndürdüğünü hatırla." },
      ),
      completeStep("step-5", 10, "if mantığı"),
    ],
    "beginner",
  ),

  "beg-else": buildLesson(
    "beg-else",
    "else kullanımı",
    "Koşul sağlanmazsa alternatif kod çalıştır. İki yollu kararlar için idealdir.",
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
        "Hangisi geçerli if/else yapısıdır?",
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
        "else dalını tamamlamak için boşluğa ne gelmeli?",
        'if bakiye >= fiyat:\n    print("Alındı")\n____:\n    print("Yetersiz bakiye")',
        ["else", "elif", "then", "if"],
        "else",
        {
          migo: "if koşulu doğru değilse alternatif dalı hangi yapı açar? Cümlenin akışını düşün.",
          migoAfterCorrect: "Koşul yanlışsa else bloğu çalışır.",
        },
      ),
      completeStep("step-5", 10, "elif ile birden fazla durum"),
    ],
    "beginner",
  ),

  "beg-elif": buildLesson(
    "beg-elif",
    "elif ile birden fazla durum",
    "Üç veya daha fazla durumu elif ile yönet. Not, sıcaklık gibi çoklu kurallar için kullanılır.",
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
        "Bu kodun çıktısı nedir?",
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
        {
          migo: "Koşulları sırayla kontrol ettiğini düşün — birden fazla dal aynı anda çalışır mı?",
          migoAfterCorrect: "if/elif zincirinde yalnızca ilk doğru dal çalışır; diğerleri atlanır.",
        },
      ),
      fillStep(
        "step-4",
        "İkinci sıcaklık dalı için boşluğa ne gelmeli?",
        'sicaklik = 15\nif sicaklik >= 30:\n    print("Sıcak")\n____ sicaklik >= 20:\n    print("Ilık")\nelse:\n    print("Soğuk")',
        ["elif", "else", "if", "then"],
        "elif",
        {
          content: "Orta sıcaklık için elif ekle.",
          migo: "Birden fazla koşul varsa if'ten sonra ek dallar için hangi yapı kullanılır?",
          migoAfterCorrect: "if ve else arasına ek koşullar için elif kullanılır.",
        },
      ),
      completeStep("step-5", 15, "Mini proje: Bilet fiyatı"),
    ],
    "beginner",
  ),

  "beg-ticket-price": buildLesson(
    "beg-ticket-price",
    "Mini proje: Bilet fiyatı",
    "Yaşa göre farklı bilet fiyatı uygulayan program yaz. if/elif/else pratiği.",
    "7 dk",
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
          validation: {
            validationMode: "ticketPriceRules",
            minLength: 30,
          },
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
          validation: {
            validationMode: "miniProject",
            mustIncludeIf: true,
            requiresFString: true,
            mustIncludePrint: true,
            requiredPatterns: ["input\\s*\\(", "int\\s*\\(", "elif"],
            minLength: 40,
          },
        },
      ),
      completeStep("step-4", 25, "Liste nedir?"),
    ],
    "beginner",
  ),

  "beg-list-intro": buildLesson(
    "beg-list-intro",
    "Liste nedir?",
    "Birden fazla değeri tek bir değişkende tut. Alışveriş listesi gibi düşünebilirsin.",
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
        "Boş liste oluşturmak için boşluğa ne yazılmalı?",
        "gorevler = ____",
        ["[]", "{}", "()", '""'],
        "[]",
        {
          content: "Boş bir görev listesi oluştur.",
          migo: "Python'da sıralı öğeleri tutmak için hangi veri yapısı kullanılır?",
          migoAfterCorrect: "Boş liste köşeli parantezle yazılır: [].",
        },
      ),
      outputStep(
        "step-4",
        "Bu kodun çıktısı nedir?",
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
    "İndeks ile elemana eriş ve append ile sona ekle. Listeleri güncellemenin temel yolları.",
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
        {
          code: "notlar = [70, 85, 90]",
          migo: "Python'da indeks 0'dan başlar. İndeks numarası ile listedeki konumu ilişkilendir.",
          migoAfterCorrect: "İndeks 1 ikinci elemanı verir; bu listede 85.",
        },
      ),
      fillStep(
        "step-3",
        "Sona eleman eklemek için boşluğa ne gelmeli?",
        'alisveris = ["süt", "ekmek"]\nalisveris.____("yumurta")',
        ["append", "add", "push", "insert"],
        "append",
        {
          migo: "Listenin sonuna yeni öğe eklemek için hangi yöntem kullanılır?",
          migoAfterCorrect: "Sona eklemek için append() kullanılır.",
        },
      ),
      outputStep(
        "step-4",
        "Bu kodun çıktısı nedir?",
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
    "len() ile listedeki eleman sayısını bul. Liste boş mu dolu mu kontrol etmek için kullanılır.",
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
        "Bu kodun çıktısı nedir?",
        'sayilar = [10, 20, 30, 40]\nprint(len(sayilar))',
        ["4", "40", "3", "Hata"],
        "4",
        {
          migo: "Listedeki elemanları say — len() kaç eleman olduğunu verir.",
          migoAfterCorrect: "Dört eleman var; len() 4 döner.",
        },
      ),
      mcStep(
        "step-3",
        "Bu kodun çıktısı nedir?",
        ["3", "2", "4", "Hata"],
        "3",
        {
          code: 'liste = ["a", "b"]\nliste.append("c")\nprint(len(liste))',
          migo: "append sonrası listede kaç eleman olduğunu düşün.",
          migoAfterCorrect: "append bir eleman ekledi; toplam 3 eleman oldu.",
        },
      ),
      fillStep(
        "step-4",
        "Liste dolu mu kontrolü için boşluğa hangi operatör gelmeli?",
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
    "Liste oluştur, eleman ekle ve listeyi yazdır. Gerçek hayattaki liste mantığını koda taşı.",
    "7 dk",
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
        "En az 3 elemanlı liste nasıl oluşturulur?",
        "En az 2 elemanlı liste oluştur, 1 append yap ve listeyi yazdır.",
        {
          checklist: [
            "Liste tanımlı",
            "append() kullanılmış",
            "Liste print() ile gösteriliyor",
          ],
          exampleSolution:
            'alisveris = ["elma", "su"]\nalisveris.append("çay")\nprint(alisveris)',
          validation: {
            validationMode: "listAppendAndPrint",
            minLength: 25,
          },
        },
      ),
      projectStep(
        "step-3",
        "Toplam ve ürün sayısı nasıl yazdırılır?",
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
          validation: {
            validationMode: "listLoopSummary",
            minLength: 40,
          },
        },
      ),
      completeStep("step-4", 25, "for döngüsü"),
    ],
    "beginner",
  ),

  "beg-for-loop": buildLesson(
    "beg-for-loop",
    "for döngüsü",
    "Aynı işlemi birden fazla kez tekrarla. Listeler ve tekrar eden görevler için temel araç.",
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
        "Bu kodun çıktısı nedir?",
        'for harf in ["A", "B"]:\n    print(harf)',
        ["A\nB", "AB", "harf", "Hata"],
        "A\nB",
        { migo: "Her iterasyonda bir print çalışır." },
      ),
      fillStep(
        "step-3",
        "Döngü gövdesini tamamlamak için boşluğa ne gelmeli?",
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
          migo: "Döngü değişkeni listedeki her eleman için bir kez çalışır — kaç eleman var?",
          migoAfterCorrect: "Üç eleman olduğu için döngü üç kez çalışır.",
        },
      ),
      completeStep("step-5", 10, "range() kullanımı"),
    ],
    "beginner",
  ),

  "beg-range": buildLesson(
    "beg-range",
    "range() kullanımı",
    "Sayı dizileri üretmek için range kullan. for döngüsüyle birlikte sık çalışır.",
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
        "Bu kodun çıktısı nedir?",
        "for n in range(4):\n    print(n)",
        ["0\n1\n2\n3", "1\n2\n3\n4", "4", "Hata"],
        "0\n1\n2\n3",
        {
          migo: "range() üst sınırı dahil etmez — hangi sayılar üretilir?",
          migoAfterCorrect: "range(4) sıfırdan başlar ve 4 hariç sayıları üretir: 0, 1, 2, 3.",
        },
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
        "1'den 3'e saymak için range nasıl tamamlanır?",
        "for i in range(____, 4):\n    print(i)",
        ["1", "0", "4", "3"],
        "1",
        {
          content: "1, 2, 3 yazdırmak için range'i tamamla.",
          migo: "1'den başlayıp 3'e kadar yazdırmak için başlangıç değerini düşün.",
          migoAfterCorrect: "range(1, 4) bir dahil üç hariç sayıları verir: 1, 2, 3.",
        },
      ),
      completeStep("step-5", 10, "Liste üzerinde dönme"),
    ],
    "beginner",
  ),

  "beg-loop-list": buildLesson(
    "beg-loop-list",
    "Liste üzerinde dönme",
    "for ile liste elemanlarını işle. Toplama ve filtreleme gibi işlemler için kullanılır.",
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
        "Bu kodun çıktısı nedir?",
        'toplam = 0\nfor n in [10, 20, 5]:\n    toplam = toplam + n\nprint(toplam)',
        ["35", "10", "0", "Hata"],
        "35",
        { migo: "Döngüde toplam değişkeni güncellenir." },
      ),
      miniTaskStep(
        "step-3",
        "Liste elemanları for ile nasıl yazdırılır?",
        "3 elemanlı bir listeyi for ile her satıra bir eleman yazdır.",
        {
          checklist: [
            "for döngüsü var",
            "Liste en az 3 elemanlı",
            "Her eleman print ediliyor",
          ],
          exampleSolution:
            'meyveler = ["elma", "armut", "muz"]\nfor meyve in meyveler:\n    print(meyve)',
          validation: {
            validationMode: "miniProject",
            mustIncludeLoop: true,
            mustIncludePrint: true,
            minLength: 30,
          },
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
    "Görev listesini numaralı şekilde yazdır. for döngüsünü gerçek bir çıktıda kullan.",
    "7 dk",
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
        "Basit görev listesi for ile nasıl yazdırılır?",
        "En az 3 görevli listeyi for ile her satıra bir görev yazdır.",
        {
          checklist: [
            "En az 3 görev",
            "for döngüsü kullanılmış",
            "Her görev ayrı satırda",
          ],
          exampleSolution:
            'gorevler = ["E-posta", "Toplantı", "Kod"]\nfor g in gorevler:\n    print(g)',
          validation: {
            validationMode: "miniProject",
            mustIncludeLoop: true,
            mustIncludePrint: true,
            minLength: 30,
          },
        },
      ),
      projectStep(
        "step-3",
        "Görevler numaralandırılarak nasıl yazdırılır?",
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
          validation: {
            validationMode: "miniProject",
            mustIncludeLoop: true,
            requiresFString: true,
            mustIncludePrint: true,
            minLength: 35,
          },
        },
      ),
      completeStep("step-4", 25, "Fonksiyon neden kullanılır?"),
    ],
    "beginner",
  ),

  "beg-why-functions": buildLesson(
    "beg-why-functions",
    "Fonksiyon neden kullanılır?",
    "Tekrar eden kodu organize et. Fonksiyonlar kodunu daha okunur ve yönetilebilir kılar.",
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
        "Fonksiyon kullanmanın ana faydası nedir?",
        [
          "Kod tekrarını azaltmak",
          "Python'u hızlandırmak",
          "Dosya silmek",
          "İnterneti kapatmak",
        ],
        "Kod tekrarını azaltmak",
        { migo: "Aynı mantığı birçok yerde yazmak yerine ne yapabilirsin?" },
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
        "Fonksiyon tanımlamak için boşluğa ne yazılmalı?",
        "____ mesaj_yaz():\n    print(\"Tamam\")",
        ["def", "function", "fn", "fun"],
        "def",
        {
          migo: "Python'da yeniden kullanılabilir kod blokları tanımlamak için hangi yapı kullanılır?",
          migoAfterCorrect: "Python'da fonksiyon def ile tanımlanır.",
        },
      ),
      completeStep("step-5", 10, "def ile fonksiyon yazma"),
    ],
    "beginner",
  ),

  "beg-def-function": buildLesson(
    "beg-def-function",
    "def ile fonksiyon yazma",
    "Kendi fonksiyonlarını tanımla ve çağır. def sözdizimini öğren.",
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
        "Fonksiyon tanımlamak için boşluğa ne yazılmalı?",
        "____ topla():\n    print(2 + 3)",
        ["def", "function", "return", "call"],
        "def",
        {
          migo: "Fonksiyon tanımı hangi kelimeyle başlar?",
          migoAfterCorrect: "Fonksiyon tanımı def ile başlar.",
        },
      ),
      outputStep(
        "step-3",
        "Bu kodun çıktısı nedir?",
        'def yaz():\n    print("OK")\n\nyaz()\nyaz()',
        ["OK\nOK", "OK", "yaz", "Hata"],
        "OK\nOK",
        {
          migo: "Fonksiyon kaç kez çağrıldıysa içindeki kod o kadar çalışır.",
          migoAfterCorrect: "yaz() iki kez çağrıldığı için OK iki kez yazdırılır.",
        },
      ),
      mcStep(
        "step-4",
        "Tanımlı fonksiyon nasıl doğru çağrılır?",
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
    "Fonksiyona veri gönder ve sonuç al. Parametre ve return ile fonksiyonları güçlendir.",
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
        "Bu kodun çıktısı nedir?",
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
        {
          migo: "Fonksiyonun sonucunu başka yerde kullanmak istiyorsan hangi yaklaşım daha uygun?",
          migoAfterCorrect: "Sonucu geri döndürmek için return kullanılır; print yalnızca ekrana yazar.",
        },
      ),
      completeStep("step-5", 15, "Mini proje: Selamlama fonksiyonları"),
    ],
    "beginner",
  ),

  "beg-greeting-functions": buildLesson(
    "beg-greeting-functions",
    "Mini proje: Selamlama fonksiyonları",
    "Parametreli selamlama fonksiyonları yaz. def, parametre ve return bir arada.",
    "7 dk",
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
        "Parametre alan bir selamlama fonksiyonu nasıl yazılır?",
        "İsim parametresi alan ve \"Merhaba, X\" döndüren fonksiyon yaz; sonucu print et.",
        {
          checklist: [
            "def ile fonksiyon tanımlı",
            "En az 1 parametre",
            "return veya print ile çıktı",
          ],
          exampleSolution:
            'def merhaba(isim):\n    return f"Merhaba, {isim}"\n\nprint(merhaba("Efe"))',
          validation: {
            validationMode: "functionReturnAndPrint",
            minLength: 35,
          },
        },
      ),
      projectStep(
        "step-3",
        "İki farklı selamlama fonksiyonu nasıl yazılır?",
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
          validation: {
            validationMode: "twoGreetingFunctions",
            minLength: 50,
          },
        },
      ),
      completeStep("step-4", 25, "Proje: Quiz uygulaması — Bölüm 1"),
    ],
    "beginner",
  ),

  "beg-quiz-project-1": buildLesson(
    "beg-quiz-project-1",
    "Proje: Quiz uygulaması — Bölüm 1",
    "Tek soruluk quiz uygulamasının temelini kur. input ve if ile cevap kontrolü.",
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
          validation: {
            validationMode: "miniProject",
            mustIncludeIf: true,
            mustIncludePrint: true,
            requiredPatterns: ["input\\s*\\("],
            minLength: 35,
          },
        },
      ),
      projectStep(
        "step-3",
        "Doğru cevapta puan nasıl eklenir?",
        "Doğru cevapta +10 puan göster; yanlışta doğru cevabı açıkla.",
        {
          checklist: [
            "Puan değişkeni veya mesajı",
            "Doğru cevapta tebrik",
            "Yanlışta açıklama",
          ],
          exampleSolution:
            'puan = 0\ncevap = input("5*2=? ")\nif cevap == "10":\n    puan = 10\n    print(f"Doğru! +{puan} puan")\nelse:\n    print("Yanlış. Cevap: 10")',
          validation: {
            validationMode: "miniProject",
            mustIncludeIf: true,
            mustIncludePrint: true,
            requiredPatterns: ["input\\s*\\("],
            minLength: 35,
          },
        },
      ),
      completeStep("step-4", 40, "Proje: Quiz uygulaması — Bölüm 2"),
    ],
    "beginner",
  ),

  "beg-quiz-project-2": buildLesson(
    "beg-quiz-project-2",
    "Proje: Quiz uygulaması — Bölüm 2",
    "Çok soruluk quiz ve toplam puan hesabı. Başlangıç yolunun son büyük projesi.",
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
        "İki soruluk quiz nasıl yazılır?",
        "En az 2 soruluk quiz yaz; her doğru +10 puan; sonunda toplam puanı yazdır.",
        {
          checklist: [
            "En az 2 soru",
            "Toplam puan hesaplanıyor",
            "Son satırda toplam puan",
          ],
          exampleSolution:
            'puan = 0\ncevap1 = input("2+2? ")\nif cevap1 == "4":\n    puan += 10\ncevap2 = input("Python dili? ")\nif cevap2 == "python":\n    puan += 10\nprint(f"Toplam puan: {puan}")',
          validation: {
            validationMode: "miniProject",
            mustIncludeIf: true,
            mustIncludePrint: true,
            requiredPatterns: ["input\\s*\\("],
            minLength: 40,
          },
        },
      ),
      projectStep(
        "step-3",
        "Fonksiyonla quiz nasıl yazılır?",
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
          validation: {
            validationMode: "quizFunctionProject",
            minLength: 50,
          },
        },
      ),
      completeStep("step-4", 40, "Python Temel Yolu", {
        content:
          "Quiz projeni bitirdin. Başlangıç yolundaki tüm temel konuları tamamladın — harika iş çıkardın!",
      }),
    ],
    "beginner",
  ),
};
