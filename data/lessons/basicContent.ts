import type { LessonContent } from "./types";
import {
  buildLesson,
  codeOrderLinesStep,
  codeOrderStep,
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
  codeWritingStep,
} from "./builders";

export const basicLessons: Record<string, LessonContent> = {
  "bas-quick-print": buildLesson(
    "bas-quick-print",
    "print ve değişken tekrarı",
    "print() ve değişken atamayı hızlıca pekiştir.",
    "5 dk",
    10,
    [
      infoStep("step-1", "print() ve değişken", "print() ekrana çıktı verir. Değişken (=) ile bir değeri isimle saklayıp print ile yazdırabilirsin.", {
        code: 'isim = "Efe"\nprint(isim)\nprint("Merhaba")',
        migo: "Önce değişkene değer ata, sonra print ile ekranda göster. Metin yazarken tırnak kullan.",
      }),
      fillStep("step-2", "Mesajı ekrana yazdırmak için boşluğa ne gelmeli?", 'mesaj = "Hazır"\n____(mesaj)', ["print", "input", "def", "str"], "print", {
        content: "Değişkenin değerini ekrana gösterecek Python komutunu seç.",
        migo: "Değişkenin değerini ekranda göstermek için hangi yapı gerekir?",
      }),
      outputStep("step-3", "Bu kodun çıktısı nedir?", 'x = 5\nprint(x + 3)', ["8", "53", "x+3", "Hata"], "8"),
      codeOrderLinesStep(
        "step-4",
        "Kod satırlarını doğru sıraya koy",
        ['mesaj = "Hazır"', "print(mesaj)"],
        { migo: "Sıralama yaparken önce hangi satırın diğerleri için gerekli olduğunu düşün." },
      ),
      codeWritingStep(
        "step-5",
        "Değişkene sayı ata ve print() ile yazdır",
        "Bir değişkene sayı ata ve print() ile yazdır.",
        {
          validation: {
            validationMode: "variableAndPrint",
            mustIncludeAssignment: true,
            mustIncludePrint: true,
            requiredPatterns: ["=\\s*\\d"],
            minLength: 15,
          },
          exampleSolution: "sayi = 10\nprint(sayi)",
        },
      ),
      completeStep("step-6", 10, "Veri türleri hızlı tekrar"),
    ],
    "basic",
  ),

  "bas-quick-types": buildLesson(
    "bas-quick-types",
    "Veri türleri hızlı tekrar",
    "str, int, float ve bool türlerini ayırt et.",
    "5 dk",
    10,
    [
      infoStep("step-1", "Veri türleri", "str (metin) tırnak içinde, int (tam sayı) ve float (ondalık) tırnaksız yazılır. type() ile türü kontrol edebilirsin.", {
        code: 'print(type(42))\nprint(type("42"))\nprint(type(3.14))',
        migo: "Aynı görünen değerler farklı türde olabilir. Tırnak ve ondalık noktaya dikkat et.",
      }),
      matchPairsStep(
        "step-2",
        "Hangi değer hangi veri türüne aittir?",
        [
          { concept: "42", answer: "int" },
          { concept: '"42"', answer: "str" },
          { concept: "3.5", answer: "float" },
        ],
        ["bool", "list", "dict"],
        { migo: "Tırnak ve ondalık işaretlerine dikkat et." },
      ),
      debugStep(
        "step-3",
        "Bu kodda hangi hata var?",
        'sonuc = "10" + 5',
        [
          "Metin ile sayı toplanamaz",
          "Değişken adı hatalı",
          "Tırnak fazla",
          "Kod doğru",
        ],
        "Metin ile sayı toplanamaz",
      ),
      outputStep("step-4", "Bu kodun çıktısı nedir?", "print(10 + 5)", ["15", "105", "Hata", "10 5"], "15"),
      codeWritingStep(
        "step-5",
        "type() ile kontrol",
        "Bir değişkene sayı ata ve type() ile türünü yazdır.",
        {
          validation: {
            validationMode: "variableAndPrint",
            mustIncludeAssignment: true,
            mustIncludePrint: true,
            requiredPatterns: ["type\\s*\\("],
            minLength: 20,
          },
          exampleSolution: "x = 42\nprint(type(x))",
        },
      ),
      completeStep("step-6", 10, "Çıktı tahmini pratiği"),
    ],
    "basic",
  ),

  "bas-output-prediction": buildLesson(
    "bas-output-prediction",
    "Çıktı tahmini pratiği",
    "Karmaşık çıktıları tahmin etmeyi pratik et.",
    "5 dk",
    15,
    [
      infoStep("step-1", "Sıralı print", "Birden fazla print() ardışık çalışır; her biri ayrı satıra yazar. Değişkenlerle birleştirince çıktıyı tahmin etmek için kodu satır satır izle.", {
        code: 'print("A")\nprint("B")',
        migo: "Kod çalışırken yukarıdan aşağı ilerler. Her print ekrana bir satır yazar.",
      }),
      outputStep("step-2", "Bu kodun çıktısı nedir?", 'a = "1"\nprint(a + "2")', ["12", "3", "a2", "Hata"], "12", {
        migo: "Metin birleştirme.",
      }),
      outputStep("step-3", "Bu kodun çıktısı nedir?", "print(3 * 4)", ["12", "34", "7", "Hata"], "12"),
      debugStep(
        "step-4",
        "Bu kodda hangi hata var?",
        'print(isim)\nisim = "Ali"',
        [
          "isim tanımlanmadan kullanılmış",
          "print yanlış",
          "Tırnak hatası",
          "Kod doğru",
        ],
        "isim tanımlanmadan kullanılmış",
        { migo: "Önce tanımla, sonra kullan." },
      ),
      matchStep(
        "step-5",
        "Hangi kod satırı hangi çıktıyı üretir?",
        'print("A" + "B") sonucu',
        ["AB", "A B", "Hata", "BA"],
        "AB",
        { migo: "Metin birleştirmede + araya boşluk koymaz." },
      ),
      infoStep("step-6", "f-string hatırlatma", "Değişkeni metne gömmek için f\"...{degisken}\" kullanılır.", {
        code: 'isim = "Ali"\nprint(f"Merhaba {isim}")',
        migo: "Temel yolda hızlı geçiyoruz — f-string kısa bir hatırlatma.",
      }),
      codeOrderLinesStep(
        "step-7",
        "Doğru kod sırası",
        ['isim = "Ali"', 'print(f"Merhaba {isim}")'],
        { content: "Önce atama, sonra f-string print.", migo: "Değişken tanımlanmadan kullanılamaz." },
      ),
      completeStep("step-8", 15, "Debug görevi: Hatalı kodu bul"),
    ],
    "basic",
  ),

  "bas-debug-intro": buildLesson(
    "bas-debug-intro",
    "Debug görevi: Hatalı kodu bul",
    "Syntax hatalarını tespit et.",
    "6 dk",
    15,
    [
      infoStep("step-1", "Hata okuma", "Kırmızı hata mesajı genelde satır numarası verir.", {
        code: 'print("Merhaba")  # doğru\n# print("Merhaba"  # eksik parantez',
        migo: "Parantez ve tırnak eşleşmesine dikkat et.",
      }),
      debugStep(
        "step-2",
        "Bu kodda hangi hata var?",
        'print("Selam"\nprint("Dünya")',
        ["İlk satırda kapanmayan parantez", "İkinci print yanlış", "Tırnak hatası yok", "import eksik"],
        "İlk satırda kapanmayan parantez",
      ),
      debugStep(
        "step-3",
        "Bu kodda hangi hata var?",
        "print(isim)\nisim = 'Ali'",
        ["isim tanımlanmadan kullanılmış", "print yanlış", "tırnak hatası", "else eksik"],
        "isim tanımlanmadan kullanılmış",
        { migo: "Önce tanımla, sonra kullan." },
      ),
      matchStep(
        "step-4",
        "Bu durumda hangi hata türü oluşur?",
        "print(isim) satırı isim tanımlanmadan çalışırsa ne olur?",
        ["NameError", "SyntaxError", "TypeError", "Hiç hata olmaz"],
        "NameError",
        { migo: "Tanımlanmamış bir isim kullanıldığında Python genelde hata verir. Hata türlerini seçeneklerden incele." },
      ),
      codeWritingStep(
        "step-5",
        "Önce isim değişkenini tanımla, sonra yazdır",
        "Önce isim değişkenini tanımla, sonra print() ile yazdır.",
        {
          validation: {
            validationMode: "variableAndPrint",
            mustIncludeAssignment: true,
            mustIncludePrint: true,
            requiredPatterns: ["isim\\s*="],
            minLength: 20,
          },
          exampleSolution: 'isim = "Ali"\nprint(isim)',
        },
      ),
      completeStep("step-6", 15, "Migo'nun Tanışma Kartı"),
    ],
    "basic",
  ),

  "bas-if-elif-else": buildLesson(
    "bas-if-elif-else",
    "if/elif/else tekrarı",
    "Çok dallı koşulları hızlıca gözden geçir.",
    "5 dk",
    10,
    [
      infoStep("step-1", "if / elif / else", "Koşul doğruysa if bloğu çalışır. elif ek dallar, else son çare dalıdır. Karşılaştırma operatörleri (>=, ==) koşulda kullanılır.", {
        code: 'n = 75\nif n >= 90:\n    print("A")\nelif n >= 70:\n    print("B")\nelse:\n    print("C")',
        migo: "Koşulları yukarıdan aşağı kontrol et — ilk doğru dal çalışır.",
      }),
      outputStep("step-2", "Bu kodun çıktısı nedir?", 'puan = 70\nif puan >= 90:\n    print("A")\nelif puan >= 70:\n    print("B")\nelse:\n    print("C")', ["B", "A", "C", "70"], "B"),
      mcStep("step-3", "Kaç blok çalışır?", ["1", "2", "3", "Hepsi"], "1", {
        migo: "İlk doğru dal çalışır, diğerleri atlanır.",
      }),
      debugStep(
        "step-4",
        "Bu kodda hangi hata var?",
        "if puan >= 50:\nprint('Geçti')",
        [
          "print satırı girintisiz",
          "if yanlış",
          "puan tanımsız",
          "Kod doğru",
        ],
        "print satırı girintisiz",
        { migo: "if bloğu içindeki satırlar girintili olmalı." },
      ),
      matchStep(
        "step-5",
        "Koşul sonucu",
        "puan = 85 için hangi dal çalışır?",
        ["if puan >= 90", "elif puan >= 70", "else", "Hiçbiri"],
        "elif puan >= 70",
        { migo: "İlk doğru koşul çalışır." },
      ),
      completeStep("step-6", 10, "and / or operatörleri"),
    ],
    "basic",
  ),

  "bas-comparisons": buildLesson(
    "bas-comparisons",
    "Karşılaştırmalar",
    "Karşılaştırma operatörlerini pekiştir.",
    "5 dk",
    10,
    [
      infoStep("step-1", "Karşılaştırma operatörleri", "İki değeri karşılaştırıp True veya False üretirsin. == eşitlik, != eşitsizlik, < > <= >= sayısal ve metin karşılaştırması için kullanılır.", {
        code: "print(5 == 5)\nprint(3 != 4)\nprint(10 >= 8)",
        migo: "= atama içindir, == eşitlik kontrolüdür. Bu operatörler if koşullarında kullanılır.",
      }),
      matchStep("step-2", "Eşitlik kontrolü hangi operatörle yapılır?", "Eşitlik kontrolü hangisi?", ["==", "=", "===", "<>"], "=="),
      outputStep("step-3", "Bu kodun çıktısı nedir?", 'print("a" < "b")', ["True", "False", "Hata", "ab"], "True", {
        migo: "Metinlerde alfabetik sıra kullanılır.",
      }),
      fillStep("step-4", "Karşılaştırma için boşluğa hangi operatör gelmeli?", "print(10 ____ 8)", [">", "<", "==", "="], ">"),
      completeStep("step-5", 10, "if/elif/else tekrarı"),
    ],
    "basic",
  ),

  "bas-logical-ops": buildLesson(
    "bas-logical-ops",
    "and / or operatörleri",
    "Birden fazla koşulu birleştir.",
    "6 dk",
    15,
    [
      infoStep("step-1", "and / or", "and: her iki koşul da doğru olmalı. or: en az biri doğru yeter. Birden fazla koşulu birleştirmek için if içinde kullanırsın.", {
        code: 'yas = 25\naktif = True\nif yas >= 18 and aktif:\n    print("Giriş OK")',
        migo: "and daha katı, or daha esnektir. Koşulları tek tek değerlendir.",
      }),
      mcStep("step-2", "Bu kodun çıktısı nedir?", ["False", "True", "Hata", "None"], "False", {
        code: "print(True and False)",
      }),
      outputStep("step-3", "Bu kodun çıktısı nedir?", "print(False or True)", ["True", "False", "Hata", "1"], "True"),
      fillStep(
        "step-4",
        "İki koşulu birleştirmek için boşluğa ne gelmeli?",
        "if puan >= 50 ____ devam == True:\n    print('Geçti')",
        ["and", "or", "not", "if"],
        "and",
        { content: "Hem puan hem devam şartı.", migo: "İki koşulun aynı anda sağlanması gerektiğini düşün." },
      ),
      completeStep("step-5", 15, "Mini proje: Not değerlendirme"),
    ],
    "basic",
  ),

  "bas-grade-system": buildLesson(
    "bas-grade-system",
    "Mini proje: Not değerlendirme",
    "Not aralığına göre harf notu ver.",
    "8 dk",
    25,
    [
      infoStep("step-1", "Not sistemi", "if/elif ile not aralıklarını ayıran bir program yazacaksın.", {
        expectedBehavior:
          "Kullanıcıdan not al; farklı aralıklar için farklı harf veya mesaj yazdır (ör. Pekiyi, İyi, Orta).",
      }),
      miniTaskStep("step-2", "İki kademe", "Not al; 50 altı kaldı, üstü geçti yazdır.", {
        checklist: ["input ve int", "if/else", "İki farklı mesaj"],
        exampleSolution:
          'notu = int(input("Notunuz: "))\nif notu >= 50:\n    print("Geçti")\nelse:\n    print("Kaldı")',
        validation: {
          validationMode: "miniProject",
          mustIncludeIf: true,
          mustIncludePrint: true,
          requiredPatterns: ["input\\s*\\(", "int\\s*\\("],
          minLength: 30,
        },
      }),
      projectStep("step-3", "Üç harf notu", "En az 3 not aralığı ve f-string ile sonuç.", {
        checklist: ["elif kullanılmış", "3 aralık", "f-string çıktı"],
        exampleSolution:
          'n = int(input("Not: "))\nif n >= 90:\n    harf = "A"\nelif n >= 75:\n    harf = "B"\nelse:\n    harf = "C"\nprint(f"Harf notunuz: {harf}")',
        validation: {
          validationMode: "miniProject",
          mustIncludeIf: true,
          requiresFString: true,
          mustIncludePrint: true,
          requiredPatterns: ["input\\s*\\(", "elif"],
          minLength: 40,
        },
      }),
      completeStep("step-4", 25, "Parametre ve return"),
    ],
    "basic",
  ),

  "bas-list-review": buildLesson(
    "bas-list-review",
    "Liste tekrarı",
    "Liste oluşturma, erişim ve append.",
    "5 dk",
    10,
    [
      infoStep("step-1", "Liste tekrarı", "Liste köşeli parantezle yazılır. Elemanlara indeks ile erişirsin (0'dan başlar). append() ile sona eleman eklenir.", {
        code: 'sehirler = ["Ankara", "İzmir"]\nprint(sehirler[0])\nsehirler.append("Bursa")',
        migo: "Liste sıralı veri tutar. İlk eleman her zaman indeks 0'dadır.",
      }),
      fillStep("step-2", "İlk elemana erişmek için boşluğa hangi indeks gelmeli?", "print(sehirler[____])", ["0", "1", "-1", "ilk"], "0", {
        content: "sehirler = ['Ankara', 'İzmir'] — ilk şehir?",
      }),
      outputStep("step-3", "Bu kodun çıktısı nedir?", 'l = [1]\nl.append(2)\nprint(l)', ["[1, 2]", "[2, 1]", "3", "Hata"], "[1, 2]"),
      mcStep("step-4", "Bu kodun çıktısı nedir?", ["0", "1", "Hata", "None"], "0", { code: "print(len([]))" }),
      completeStep("step-5", 10, "Sözlük (dict) mantığı"),
    ],
    "basic",
  ),

  "bas-dict-intro": buildLesson(
    "bas-dict-intro",
    "Sözlük (dict) mantığı",
    "Anahtar-değer çiftleriyle veri sakla.",
    "6 dk",
    10,
    [
      infoStep("step-1", "Sözlük (dict)", "dict süslü parantezle yazılır; anahtar: değer çiftleri tutar. Liste sıraya göre, sözlük anahtara göre erişir.", {
        code: 'kisi = {"ad": "Efe", "yas": 28}\nprint(kisi["ad"])',
        migo: "Birden fazla alanı olan kayıtlar için dict uygundur.",
      }),
      mcStep("step-2", "Hangisi geçerli bir dict tanımıdır?", ['{"a": 1}', "[a: 1]", "(a, 1)", "a = 1"], '{"a": 1}'),
      fillStep("step-3", "Dict değerine erişmek için boşluğa ne yazılmalı?", 'fiyatlar = {"elma": 5}\nprint(fiyatlar[____])', ['"elma"', "elma", "0", "fiyat"], '"elma"'),
      matchStep("step-4", "Anahtar ile değere erişen yapı hangisidir?", "Anahtar ile değere erişen yapı?", ["dict", "list", "int", "for"], "dict"),
      completeStep("step-5", 10, "Liste ve dict farkı"),
    ],
    "basic",
  ),

  "bas-list-dict-diff": buildLesson(
    "bas-list-dict-diff",
    "Liste ve dict farkı",
    "Ne zaman liste, ne zaman dict kullanılır?",
    "5 dk",
    15,
    [
      infoStep("step-1", "Fark", "Liste sıralı koleksiyon; dict etiketli veri modeli.", {
        code: "notlar = [70, 80, 90]\nogrenci = {'ad': 'Ali', 'not': 85}",
      }),
      matchStep("step-2", "Kullanım", "Sıralı ürün listesi için?", ["list", "dict", "if", "print"], "list"),
      mcStep("step-3", "Kişi kartı", ["dict", "list", "int", "str"], "dict", {
        content: "ad, email, telefon alanları olan kayıt?",
        migo: "Birden fazla alanı olan bir kayıt için hangi veri yapısı daha uygun? Seçeneklerin farkını düşün.",
      }),
      outputStep("step-4", "Bu kodun çıktısı nedir?", 'd = {"x": 10}\nprint(d["x"])', ["10", "x", "Hata", '{"x": 10}'], "10"),
      completeStep("step-5", 15, "for ve range tekrarı"),
    ],
    "basic",
  ),

  "bas-contact-book": buildLesson(
    "bas-contact-book",
    "Mini proje: Kişi rehberi",
    "dict ile basit kişi kaydı oluştur.",
    "8 dk",
    25,
    [
      infoStep("step-1", "Rehber", "Kişi bilgilerini dict ile saklayan bir rehber oluşturacaksın.", {
        expectedBehavior:
          "Her kişi bir dict; ad ve iletişim alanlarını tutup print veya f-string ile göster.",
      }),
      miniTaskStep("step-2", "Tek kişi", "ad ve email anahtarlı dict oluştur ve yazdır.", {
        checklist: ["dict tanımlı", "2 anahtar", "print ile gösterim"],
        exampleSolution: 'kisi = {"ad": "Mehmet", "email": "m@test.com"}\nprint(kisi)',
        validation: {
          validationMode: "miniProject",
          mustIncludePrint: true,
          requiredPatterns: ["\\{"],
          minLength: 25,
        },
      }),
      projectStep("step-3", "İki kişi", "İki kişilik liste; for ile her kişinin adını yazdır.", {
        checklist: ["Liste içinde dict", "for döngüsü", "ad alanı yazdırılıyor"],
        exampleSolution:
          'rehber = [\n    {"ad": "Ali", "tel": "111"},\n    {"ad": "Zeynep", "tel": "222"}\n]\nfor k in rehber:\n    print(k["ad"])',
        validation: {
          validationMode: "miniProject",
          mustIncludeLoop: true,
          mustIncludePrint: true,
          minLength: 35,
        },
      }),
      completeStep("step-4", 25, "Toplam ve ortalama bulma"),
    ],
    "basic",
  ),

  "bas-for-review": buildLesson(
    "bas-for-review",
    "for ve range tekrarı",
    "Döngü kalıplarını gözden geçir.",
    "5 dk",
    10,
    [
      infoStep("step-1", "for ve range", "for döngüsü bir listeyi veya range() ile üretilen sayıları tek tek gezer. range(3) 0, 1, 2 değerlerini verir.", {
        code: "for i in range(3):\n    print(i)",
        migo: "Döngü gövdesindeki satırlar girintili olmalı. range üst sınırı dahil değildir.",
      }),
      outputStep("step-2", "Bu kodun çıktısı nedir?", "for x in range(2, 5):\n    print(x)", ["2\n3\n4", "2\n3\n4\n5", "0\n1\n2", "Hata"], "2\n3\n4"),
      codeOrderStep(
        "step-3",
        "Kod satırlarını doğru sıraya koy",
        [
          "for i in range(3):\n    print(i)\nprint('Bitti')",
          "print('Bitti')\nfor i in range(3):\n    print(i)",
          "    print(i)\nfor i in range(3):\nprint('Bitti')",
          "for i in range(3):\nprint('Bitti')\n    print(i)",
        ],
        "for i in range(3):\n    print(i)\nprint('Bitti')",
      ),
      fillStep("step-4", "Liste üzerinde döngü için boşluğa ne gelmeli?", "for item in ____:\n    print(item)", ["urunler", "print", "range", "def"], "urunler", {
        content: "urunler = ['A', 'B']",
      }),
      completeStep("step-5", 15, "Liste üzerinde işlem"),
    ],
    "basic",
  ),

  "bas-list-processing": buildLesson(
    "bas-list-processing",
    "Liste üzerinde işlem",
    "Döngüyle liste elemanlarını işle.",
    "6 dk",
    15,
    [
      infoStep("step-1", "Biriktirme", "toplam = 0 ile başla, döngüde ekle.", {
        code: "toplam = 0\nfor n in [1, 2, 3]:\n    toplam += n\nprint(toplam)",
      }),
      outputStep("step-2", "Bu kodun çıktısı nedir?", "s=0\nfor x in [5, 5]:\n    s += x\nprint(s)", ["10", "55", "0", "Hata"], "10"),
      miniTaskStep("step-3", "Çift sayılar", "Listedeki çift sayıları yazdır (if % 2 == 0).", {
        checklist: ["for döngüsü", "if ile çift kontrol", "print"],
        exampleSolution: 'for n in [1, 2, 3, 4]:\n    if n % 2 == 0:\n        print(n)',
        validation: {
          validationMode: "miniProject",
          mustIncludeLoop: true,
          mustIncludeIf: true,
          mustIncludePrint: true,
          minLength: 25,
        },
      }),
      debugStep(
        "step-4",
        "Bu kodda hangi hata var?",
        "toplam = 0\nfor n in [1, 2, 3]:\ntoplam += n",
        ["for gövdesi girintisiz", "toplam yanlış", "n tanımsız", "print eksik"],
        "for gövdesi girintisiz",
      ),
      completeStep("step-5", 15, "Mini proje: Kişi rehberi"),
    ],
    "basic",
  ),

  "bas-sum-average": buildLesson(
    "bas-sum-average",
    "Toplam ve ortalama bulma",
    "Sayı listesinden istatistik çıkar.",
    "6 dk",
    15,
    [
      infoStep("step-1", "Toplam ve ortalama", "sum(liste) elemanları toplar. Ortalama için toplamı len(liste) ile bölersin. max() en yüksek değeri verir.", {
        code: "notlar = [70, 80, 90]\nprint(sum(notlar))\nprint(sum(notlar) / len(notlar))",
        migo: "Önce listeyi oluştur, sonra sum ve len ile hesapla.",
      }),
      outputStep("step-2", "Bu kodun çıktısı nedir?", "nums = [10, 20]\nprint(sum(nums) / len(nums))", ["15.0", "30", "10", "Hata"], "15.0"),
      fillStep("step-3", "Ortalama hesaplamak için boşluğa ne yazılmalı?", "ortalama = toplam / ____", ["len(notlar)", "notlar", "2", "0"], "len(notlar)", {
        content: "notlar listesinin ortalaması",
      }),
      codeOrderStep(
        "step-4",
        "Ortalama hesaplama adımlarını doğru sıraya koy",
        [
          "nums = [4, 6]\ntoplam = sum(nums)\nortalama = toplam / len(nums)\nprint(ortalama)",
          "toplam = sum(nums)\nnums = [4, 6]\nortalama = toplam / len(nums)\nprint(ortalama)",
          "print(ortalama)\nnums = [4, 6]\ntoplam = sum(nums)\nortalama = toplam / len(nums)",
          "nums = [4, 6]\nprint(ortalama)\ntoplam = sum(nums)\nortalama = toplam / len(nums)",
        ],
        "nums = [4, 6]\ntoplam = sum(nums)\nortalama = toplam / len(nums)\nprint(ortalama)",
      ),
      completeStep("step-5", 15, "Mini proje: Harcama özeti"),
    ],
    "basic",
  ),

  "bas-expense-tracker": buildLesson(
    "bas-expense-tracker",
    "Mini proje: Harcama özeti",
    "Harcama listesinden toplam ve ortalama hesapla.",
    "8 dk",
    25,
    [
      infoStep("step-1", "Harcama listesi", "Harcamaları listede tutup özet istatistik üreteceksin.", {
        expectedBehavior:
          "float değerlerden oluşan harcama listesi oluştur; toplam, ortalama veya en yüksek değeri hesapla.",
      }),
      miniTaskStep("step-2", "Listedeki toplam değer nasıl hesaplanır?", "En az 3 harcamalı liste; toplamı yazdır.", {
        checklist: ["3+ eleman", "sum veya döngü", "toplam print"],
        exampleSolution: "h = [10, 20, 30]\nprint(sum(h))",
        validation: {
          validationMode: "spendingSummaryTotal",
          mustIncludePrint: true,
          minLength: 20,
        },
      }),
      projectStep("step-3", "Toplam, ortalama ve en yüksek harcama nasıl yazdırılır?", "Toplam, ortalama ve en yüksek harcamayı yazdır.", {
        checklist: ["toplam", "ortalama", "max() veya döngü ile en yüksek"],
        exampleSolution:
          'h = [100, 50, 200]\nprint(f"Toplam: {sum(h)}")\nprint(f"Ortalama: {sum(h)/len(h)}")\nprint(f"En yüksek: {max(h)}")',
        validation: {
          validationMode: "spendingSummaryReport",
          mustIncludePrint: true,
          minLength: 40,
        },
      }),
      completeStep("step-4", 25, "Syntax error mantığı"),
    ],
    "basic",
  ),

  "bas-function-design": buildLesson(
    "bas-function-design",
    "Fonksiyon tasarlama",
    "Tek iş yapan küçük fonksiyonlar tasarla.",
    "5 dk",
    10,
    [
      infoStep("step-1", "Fonksiyon tasarlama", "def ile fonksiyon tanımlarsın. İyi fonksiyon tek bir iş yapar ve anlamlı isim taşır. Parametre ve return'ü artık biliyorsun — bunlarla odaklı fonksiyonlar yazabilirsin.", {
        code: "def topla(a, b):\n    return a + b\n\nprint(topla(3, 5))",
        migo: "Fonksiyon adı ne yaptığını anlatmalı. Tek iş kuralına uy — karmaşık fonksiyonları parçala.",
      }),
      matchStep("step-2", "Liste toplamı için hangi isim daha uygundur?", "Liste toplamı için?", ["toplam_liste", "x", "fn1", "liste"], "toplam_liste"),
      mcStep("step-3", "Hangisi tek iş yapan fonksiyondur?", ["def tek(): pass", "def hersey(): ... 50 satır", "def import os", "def 2x()"], "def tek(): pass", {
        migo: "Küçük ve odaklı fonksiyonlar.",
      }),
      fillStep("step-4", "Fonksiyon tanımlamak için boşluğa ne yazılmalı?", "____ mesaj_yaz(metin):\n    print(metin)", ["def", "function", "return", "class"], "def"),
      completeStep("step-5", 10, "Yardımcı fonksiyonlar"),
    ],
    "basic",
  ),

  "bas-params-return": buildLesson(
    "bas-params-return",
    "Parametre ve return",
    "Girdi ve çıktılı fonksiyonlar yaz.",
    "5 dk",
    10,
    [
      infoStep("step-1", "Parametre nedir?", "Parametre, fonksiyonun dışarıdan değer almasını sağlar. Böylece aynı fonksiyon farklı verilerle çalışabilir. return ile hesaplanan sonucu dışarı verirsin.", {
        code: 'def selamla(isim):\n    return f"Merhaba {isim}"\n\nprint(selamla("Efe"))',
        migo: "Parantez içindeki isim, fonksiyonun kullanacağı dış bilgidir. Fonksiyonu çağırırken bu bilgiye değer verirsin.",
      }),
      outputStep("step-2", "Bu kodun çıktısı nedir?", "def iki_kat(n):\n    return n * 2\nprint(iki_kat(4))", ["8", "4", "n", "Hata"], "8"),
      fillStep("step-3", "Sonucu döndürmek için boşluğa ne yazılmalı?", "def kare(n):\n    ____ n * n", ["return", "print", "def", "input"], "return"),
      debugStep(
        "step-4",
        "Bu kodda hangi hata var?",
        "def selam(isim)\n    return f'Merhaba {isim}'",
        ["def satırında : eksik", "return yanlış", "f-string hatası", "isim tanımsız"],
        "def satırında : eksik",
      ),
      completeStep("step-5", 10, "Fonksiyon tasarlama"),
    ],
    "basic",
  ),

  "bas-helper-functions": buildLesson(
    "bas-helper-functions",
    "Yardımcı fonksiyonlar",
    "Ana akışı sadeleştiren yardımcılar yaz.",
    "6 dk",
    15,
    [
      infoStep("step-1", "Yardımcı fonksiyonlar", "gecildi_mi, cift_mi gibi küçük fonksiyonlar ana kodu okunur kılar. Parametre alır, return ile sonuç döndürür; if ile koşul ekleyebilirsin.", {
        code: "def gecildi(notu):\n    return notu >= 50\n\nprint(gecildi(60))",
        migo: "Fonksiyon tek bir karar veya hesap yapsın — ana akış sade kalsın.",
      }),
      miniTaskStep("step-2", "n çift mi kontrol eden fonksiyon nasıl yazılır?", "n çift ise True dönen fonksiyon yaz.", {
        checklist: ["def ve parametre", "return bool", "test print"],
        exampleSolution: "def cift_mi(n):\n    return n % 2 == 0\n\nprint(cift_mi(4))",
        validation: {
          validationMode: "booleanHelperFunction",
          mustIncludePrint: true,
          minLength: 25,
        },
      }),
      codeOrderStep(
        "step-3",
        "Kod satırlarını doğru sıraya koy",
        [
          "def topla(a, b):\n    return a + b\nprint(topla(2, 3))",
          "print(topla(2, 3))\ndef topla(a, b):\n    return a + b",
          "def main():\n    print(topla(2, 3))\ndef topla(a, b):\n    return a + b",
          "def topla(a, b):\n    return a + b\ndef main():\n    print(topla(2, 3))",
        ],
        "def topla(a, b):\n    return a + b\nprint(topla(2, 3))",
        { migo: "Fonksiyon çağrılmadan önce tanımlanmalı." },
      ),
      matchStep("step-4", "gecildi(notu) hangi türde değer döndürür?", "gecildi(notu) ne döndürür?", ["bool", "str", "list", "void"], "bool"),
      completeStep("step-5", 15, "Mini proje: Basit hesap makinesi"),
    ],
    "basic",
  ),

  "bas-calculator": buildLesson(
    "bas-calculator",
    "Mini proje: Basit hesap makinesi",
    "İki sayı ve işlem alan fonksiyonlar.",
    "8 dk",
    25,
    [
      infoStep("step-1", "Hesap makinesi", "Basit işlemler yapan fonksiyonlar yazacaksın.", {
        expectedBehavior:
          "topla, çıkar, çarp gibi fonksiyonlar tanımla; input ile sayı al ve sonucu yazdır.",
      }),
      miniTaskStep("step-2", "Toplama", "İki sayı alan topla fonksiyonu ve print.", {
        checklist: ["def topla", "return", "çağrı ve print"],
        exampleSolution:
          "def topla(a, b):\n    return a + b\nprint(topla(5, 7))",
        validation: {
          validationMode: "mathFunctionAddAndPrint",
        },
      }),
      projectStep("step-3", "Dört işlem", "En az 3 işlem fonksiyonu; kullanıcı seçim yapsın (metin input).", {
        checklist: ["3+ fonksiyon", "if ile işlem seçimi", "sonuç print"],
        exampleSolution:
          'def carp(a,b): return a*b\ndef bol(a,b): return a/b if b else 0\na=float(input("a: "))\nb=float(input("b: "))\nop=input("islem (+,-,*,/): ")\nif op=="*": print(carp(a,b))',
        validation: {
          validationMode: "miniProject",
          mustIncludeDef: true,
          mustIncludeIf: true,
          mustIncludePrint: true,
          requiredPatterns: ["input\\s*\\("],
          minLength: 45,
        },
      }),
      completeStep("step-4", 25, "Liste tekrarı"),
    ],
    "basic",
  ),

  "bas-syntax-errors": buildLesson(
    "bas-syntax-errors",
    "Syntax error mantığı",
    "Sözdizimi hatalarını tanı.",
    "5 dk",
    10,
    [
      infoStep("step-1", "SyntaxError", "Python kodu çalıştırmadan önce sözdizimini kontrol eder.", {
        code: "# SyntaxError: invalid syntax\n# if x > 0  # : eksik",
        migo: "İki nokta, parantez ve girinti sık hata kaynaklarıdır.",
      }),
      debugStep("step-2", "Bu kodda hangi hata var?", "if x > 0\n    print(x)", ["if satırında : eksik", "print yanlış", "x tanımsız", "else gerekli"], "if satırında : eksik"),
      debugStep("step-3", "Bu kodda hangi hata var?", 'print("Merhaba"', ["Kapanmayan parantez", "print yanlış", "tırnak fazla", "import eksik"], "Kapanmayan parantez"),
      mcStep("step-4", "Hangisi geçerli Python ifadesidir?", ["if True:\n    pass", "if True\n    pass", "if True:pass", "while True:\n    pass"], "if True:\n    pass"),
      completeStep("step-5", 10, "Yanlış değişken adı hataları"),
    ],
    "basic",
  ),

  "bas-variable-bugs": buildLesson(
    "bas-variable-bugs",
    "Yanlış değişken adı hataları",
    "NameError ve yazım hatalarını bul.",
    "5 dk",
    15,
    [
      infoStep("step-1", "NameError", "Tanımsız veya yanlış yazılmış değişken adı.", {
        code: "sayi = 10\n# print(sayi)  # doğru\n# print(sayii)  # NameError",
      }),
      debugStep(
        "step-2",
        "Bu kodda hangi hata var?",
        "toplam = 0\nfor n in [1, 2, 3]:\n    toplam = toplam + m",
        ["m yerine n kullanılmalı", "toplam yanlış", "for hatası", "liste boş"],
        "m yerine n kullanılmalı",
      ),
      debugStep(
        "step-3",
        "Bu kodda hangi hata var?",
        "Isim = 'Ali'\nprint(isim)",
        ["isim / Isim büyük-küçük harf uyumsuz", "print hatası", "tırnak", "for eksik"],
        "isim / Isim büyük-küçük harf uyumsuz",
      ),
      fillStep("step-4", "print satırını tamamlamak için boşluğa ne yazılmalı?", "kullanici_adi = 'Efe'\nprint(____)", ["kullanici_adi", "kullaniciadi", "user_adi", "adi"], "kullanici_adi"),
      completeStep("step-5", 15, "Tür dönüşümü hataları"),
    ],
    "basic",
  ),

  "bas-type-conversion-bugs": buildLesson(
    "bas-type-conversion-bugs",
    "Tür dönüşümü hataları",
    "int/float dönüşüm hatalarını anla.",
    "6 dk",
    15,
    [
      infoStep("step-1", "ValueError", 'int("abc") veya int("3.14") hata verebilir.', {
        code: 'yas = int(input("Yaş: "))  # sayı girilmeli',
      }),
      debugStep(
        "step-2",
        "Bu kodda hangi hata var?",
        'a = input("Sayı: ")\nb = input("Sayı2: ")\nprint(a + b)',
        ["Metin birleştirme; int() gerekli", "input yanlış", "print fazla", "b tanımsız"],
        "Metin birleştirme; int() gerekli",
        { migo: '"2"+"3" = "23" — toplama için int gerekir.' },
      ),
      mcStep("step-3", "İki metin girdisi nasıl sayı olarak toplanır?", ['int("2") + int("3")', '"2" + "3"', "2 + 3", 'int("2" + "3")'], 'int("2") + int("3")'),
      matchStep("step-4", "int(\"merhaba\") hangi hata türünü üretir?", 'int("merhaba") ne üretir?', ["ValueError", "SyntaxError", "TypeError", "KeyError"], "ValueError"),
      completeStep("step-5", 15, "Proje: Alışkanlık takipçisi — Adım 1"),
    ],
    "basic",
  ),

  "bas-habit-project-1": buildLesson(
    "bas-habit-project-1",
    "Proje: Alışkanlık takipçisi — Adım 1",
    "Günlük alışkanlık listesi ve tamamlama işareti.",
    "8 dk",
    40,
    [
      infoStep("step-1", "Adım 1", "Alışkanlıkları liste olarak tutacaksın.", {
        expectedBehavior:
          "En az 3 alışkanlıklı liste oluştur ve her birini okunur şekilde yazdır.",
      }),
      projectStep("step-2", "En az 3 alışkanlıklı liste nasıl oluşturulur?", "En az 3 alışkanlıklı liste yazdır.", {
        checklist: ["3+ alışkanlık", "liste tanımla", "print ile yazdır"],
        exampleSolution:
          'aliskanliklar = ["Meditasyon", "Kod", "Yürüyüş"]\nprint(aliskanliklar)',
        validation: {
          validationMode: "simpleListAndPrint",
        },
      }),
      projectStep("step-3", "Alışkanlık dict listesi nasıl oluşturulur?", "Her alışkanlık için dict: ad ve tamamlandi (bool).", {
        checklist: ["dict listesi", "ad ve tamamlandi", "print ile yazdır"],
        exampleSolution:
          'aliskanliklar = [\n    {"ad": "Spor", "tamamlandi": True},\n    {"ad": "Okuma", "tamamlandi": False}\n]\nprint(aliskanliklar)',
        validation: {
          validationMode: "habitDictList",
        },
      }),
      completeStep("step-4", 40, "Proje: Alışkanlık takipçisi — Adım 2"),
    ],
    "basic",
  ),

  "bas-habit-project-2": buildLesson(
    "bas-habit-project-2",
    "Proje: Alışkanlık takipçisi — Adım 2",
    "Tamamlanan sayısı ve yüzde hesapla.",
    "8 dk",
    40,
    [
      infoStep("step-1", "Adım 2", "Tamamlanan alışkanlıkları sayıp yüzde hesaplayacaksın.", {
        expectedBehavior:
          "Her alışkanlık için tamamlandi (bool) alanı olan dict listesi; döngüyle tamamlanan sayısını ve yüzdeyi hesapla.",
      }),
      projectStep("step-2", "Tamamlanan alışkanlık sayısı nasıl hesaplanır?", "Tamamlanan alışkanlık sayısını hesapla ve yazdır.", {
        checklist: ["for + if", "sayaç", "print sonuç"],
        exampleSolution:
          'g = [{"ad":"A","tamamlandi":True},{"ad":"B","tamamlandi":False}]\nc=0\nfor x in g:\n    if x["tamamlandi"]: c+=1\nprint(c)',
        validation: {
          validationMode: "miniProject",
          mustIncludeLoop: true,
          mustIncludeIf: true,
          mustIncludePrint: true,
          minLength: 30,
        },
      }),
      projectStep("step-3", "Tamamlanma yüzdesi nasıl hesaplanır?", "Tamamlanma yüzdesini f-string ile göster.", {
        checklist: ["for + if", "len ve yüzde", "f-string print"],
        exampleSolution:
          'aliskanliklar = [{"ad":"A","tamamlandi":True},{"ad":"B","tamamlandi":True},{"ad":"C","tamamlandi":False}]\nt=0\nfor x in aliskanliklar:\n    if x["tamamlandi"]: t+=1\nyuzde=t/len(aliskanliklar)*100\nprint(f"Tamamlanan: %{yuzde}")',
        validation: {
          validationMode: "habitCompletionPercentage",
        },
      }),
      completeStep("step-4", 40, "Proje: Alışkanlık takipçisi — Adım 3"),
    ],
    "basic",
  ),

  "bas-habit-project-3": buildLesson(
    "bas-habit-project-3",
    "Proje: Alışkanlık takipçisi — Adım 3",
    "Özet rapor ve kullanıcıdan yeni alışkanlık ekleme.",
    "8 dk",
    40,
    [
      infoStep("step-1", "Adım 3", "Kullanıcıdan yeni alışkanlık ekleyip özet göstereceksin.", {
        expectedBehavior:
          "input ile yeni alışkanlık al, listeye dict olarak ekle; özet istatistikleri yazdıran bir fonksiyon kullan.",
      }),
      projectStep("step-2", "Yeni alışkanlık listeye nasıl eklenir?", "Kullanıcıdan alışkanlık adı al ve listeye dict olarak ekle.", {
        checklist: ["input", "append dict", "liste güncelleniyor"],
        exampleSolution:
          'liste = []\nad = input("Alışkanlık: ")\nliste.append({"ad": ad, "tamamlandi": False})\nprint(liste)',
        validation: {
          validationMode: "miniProject",
          mustIncludePrint: true,
          requiredPatterns: ["input\\s*\\(", "append"],
          minLength: 30,
        },
      }),
      projectStep("step-3", "Özet fonksiyonu ile tam proje nasıl tamamlanır?", "ozet_yazdir(gorevler) fonksiyonu: toplam, tamamlanan, yüzde.", {
        checklist: ["ozet_yazdir fonksiyonu", "toplam/tamamlanan/yüzde", "f-string print"],
        exampleSolution:
          'def ozet_yazdir(gorevler):\n    toplam = len(gorevler)\n    tamamlanan = 0\n    for g in gorevler:\n        if g["tamamlandi"]: tamamlanan += 1\n    yuzde = tamamlanan / toplam * 100\n    print(f"Toplam: {toplam}")\n    print(f"Tamamlanan: {tamamlanan}")\n    print(f"Yüzde: %{yuzde}")\n\ngorevler = [{"ad":"Kod","tamamlandi":True},{"ad":"Spor","tamamlandi":False}]\nozet_yazdir(gorevler)',
        migo: "Temel yolu tamamladın — harika iş!",
        validation: {
          validationMode: "habitTrackerSummaryFunction",
        },
      }),
      completeStep("step-4", 40, "Python İleri Seviye Yolu", {
        content: "Alışkanlık takipçisi projeni bitirdin. Temel yol tamamlandı!",
      }),
    ],
    "basic",
  ),
};
