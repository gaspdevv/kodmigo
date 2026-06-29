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
      infoStep("step-1", "Hızlı tekrar", "Değişkene atayıp print ile yazdırabilirsin.", {
        code: 'isim = "Efe"\nprint(isim)',
        migo: "Temel yolda hızlı ilerliyoruz — temelleri sağlam tut.",
      }),
      fillStep("step-2", "Eksik komut", 'mesaj = "Hazır"\n____(mesaj)', ["print", "input", "def", "str"], "print", {
        migo: "Değişkenin değerini ekranda göstermek için hangi yapı gerekir?",
      }),
      outputStep("step-3", "Çıktı", 'x = 5\nprint(x + 3)', ["8", "53", "x+3", "Hata"], "8"),
      codeOrderLinesStep(
        "step-4",
        "Atama ve print sırası",
        ['mesaj = "Hazır"', "print(mesaj)"],
        { migo: "Sıralama yaparken önce hangi satırın diğerleri için gerekli olduğunu düşün." },
      ),
      codeWritingStep(
        "step-5",
        "Kendi örneğin",
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
      infoStep("step-1", "Türler", "type() ile türü kontrol edebilirsin.", {
        code: 'print(type(42))\nprint(type("42"))',
        migo: "Aynı görünen değerler farklı türde olabilir.",
      }),
      matchPairsStep(
        "step-2",
        "Tür eşleştir",
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
        "Tür hatası",
        'sonuc = "10" + 5',
        [
          "Metin ile sayı toplanamaz",
          "Değişken adı hatalı",
          "Tırnak fazla",
          "Kod doğru",
        ],
        "Metin ile sayı toplanamaz",
      ),
      outputStep("step-4", "Toplama", "print(10 + 5)", ["15", "105", "Hata", "10 5"], "15"),
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
      infoStep("step-1", "Sıralı print", "Birden fazla print ardışık çalışır.", {
        code: 'print("A")\nprint("B")',
      }),
      outputStep("step-2", "Tahmin", 'a = "1"\nprint(a + "2")', ["12", "3", "a2", "Hata"], "12", {
        migo: "Metin birleştirme.",
      }),
      outputStep("step-3", "Sayı", "print(3 * 4)", ["12", "34", "7", "Hata"], "12"),
      debugStep(
        "step-4",
        "Sıra hatası",
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
        "Çıktı eşleştir",
        'print("A" + "B") sonucu',
        ["AB", "A B", "Hata", "BA"],
        "AB",
        { migo: "Metin birleştirmede + araya boşluk koymaz." },
      ),
      codeOrderLinesStep(
        "step-6",
        "Doğru kod sırası",
        ['isim = "Ali"', 'print(f"Merhaba {isim}")'],
        { content: "Önce atama, sonra f-string print.", migo: "Değişken tanımlanmadan kullanılamaz." },
      ),
      completeStep("step-7", 15, "Debug görevi: Hatalı kodu bul"),
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
        "Hatayı bul",
        'print("Selam"\nprint("Dünya")',
        ["İlk satırda kapanmayan parantez", "İkinci print yanlış", "Tırnak hatası yok", "import eksik"],
        "İlk satırda kapanmayan parantez",
      ),
      debugStep(
        "step-3",
        "Değişken hatası",
        "print(isim)\nisim = 'Ali'",
        ["isim tanımlanmadan kullanılmış", "print yanlış", "tırnak hatası", "else eksik"],
        "isim tanımlanmadan kullanılmış",
        { migo: "Önce tanımla, sonra kullan." },
      ),
      matchStep(
        "step-4",
        "Hata türü",
        "print(isim) satırı isim tanımlanmadan çalışırsa ne olur?",
        ["NameError", "SyntaxError", "TypeError", "Hiç hata olmaz"],
        "NameError",
        { migo: "Tanımlanmamış bir isim kullanıldığında Python genelde hata verir. Hata türlerini seçeneklerden incele." },
      ),
      codeWritingStep(
        "step-5",
        "Düzeltilmiş kod",
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
      completeStep("step-6", 15, "if/elif/else tekrarı"),
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
      infoStep("step-1", "Zincir yapı", "if → elif → else sırası önemlidir.", {
        code: 'n = 75\nif n >= 90: print("A")\nelif n >= 70: print("B")\nelse: print("C")',
      }),
      outputStep("step-2", "Sonuç", 'puan = 70\nif puan >= 90:\n    print("A")\nelif puan >= 70:\n    print("B")\nelse:\n    print("C")', ["B", "A", "C", "70"], "B"),
      mcStep("step-3", "Kaç blok çalışır?", ["1", "2", "3", "Hepsi"], "1", {
        migo: "İlk doğru dal çalışır, diğerleri atlanır.",
      }),
      debugStep(
        "step-4",
        "Girinti hatası",
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
      completeStep("step-6", 10, "Karşılaştırmalar"),
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
      infoStep("step-1", "Operatörler", "== eşitlik, != eşitsizlik, < > <= >= sayısal karşılaştırma.", {
        code: "print(5 == 5)\nprint(3 != 4)",
      }),
      matchStep("step-2", "Operatör", "Eşitlik kontrolü hangisi?", ["==", "=", "===", "<>"], "=="),
      outputStep("step-3", "Sonuç", 'print("a" < "b")', ["True", "False", "Hata", "ab"], "True", {
        migo: "Metinlerde alfabetik sıra kullanılır.",
      }),
      fillStep("step-4", "Tamamla", "if yas ____ 18:\n    print('Reşit')", [">=", "=", "=<", "=>"], ">="),
      completeStep("step-5", 10, "and / or operatörleri"),
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
      infoStep("step-1", "and / or", "and: her ikisi doğru olmalı. or: biri doğru yeter.", {
        code: 'yas = 25\naktif = True\nif yas >= 18 and aktif:\n    print("Giriş OK")',
      }),
      mcStep("step-2", "and sonucu", ["False", "True", "Hata", "None"], "False", {
        code: "print(True and False)",
      }),
      outputStep("step-3", "or", "print(False or True)", ["True", "False", "Hata", "1"], "True"),
      fillStep(
        "step-4",
        "İki koşul",
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
      completeStep("step-4", 25, "Liste tekrarı"),
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
      infoStep("step-1", "Liste", "Köşeli parantez, indeks 0'dan başlar.", {
        code: 'nums = [10, 20, 30]\nprint(nums[1])\nnums.append(40)',
      }),
      fillStep("step-2", "İlk eleman", "print(sehirler[____])", ["0", "1", "-1", "ilk"], "0", {
        content: "sehirler = ['Ankara', 'İzmir'] — ilk şehir?",
      }),
      outputStep("step-3", "append", 'l = [1]\nl.append(2)\nprint(l)', ["[1, 2]", "[2, 1]", "3", "Hata"], "[1, 2]"),
      mcStep("step-4", "len([ ])", ["0", "1", "Hata", "None"], "0", { code: "print(len([]))" }),
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
      infoStep("step-1", "Sözlük", "dict süslü parantezle yazılır; anahtar: değer çiftleri tutar.", {
        code: 'kisi = {"ad": "Efe", "yas": 28}\nprint(kisi["ad"])',
        migo: "Liste sıraya göre, sözlük anahtara göre erişir.",
      }),
      mcStep("step-2", "Geçerli dict", ['{"a": 1}', "[a: 1]", "(a, 1)", "a = 1"], '{"a": 1}'),
      fillStep("step-3", "Erişim", 'fiyatlar = {"elma": 5}\nprint(fiyatlar[____])', ['"elma"', "elma", "0", "fiyat"], '"elma"'),
      matchStep("step-4", "Kavram", "Anahtar ile değere erişen yapı?", ["dict", "list", "int", "for"], "dict"),
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
      outputStep("step-4", "Dict erişim", 'd = {"x": 10}\nprint(d["x"])', ["10", "x", "Hata", '{"x": 10}'], "10"),
      completeStep("step-5", 15, "Mini proje: Kişi rehberi"),
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
      completeStep("step-4", 25, "for ve range tekrarı"),
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
      infoStep("step-1", "for + range", "range(n) 0..n-1 üretir.", { code: "for i in range(3):\n    print(i)" }),
      outputStep("step-2", "range(2,5)", "for x in range(2, 5):\n    print(x)", ["2\n3\n4", "2\n3\n4\n5", "0\n1\n2", "Hata"], "2\n3\n4"),
      codeOrderStep(
        "step-3",
        "Döngü sırası",
        [
          "for i in range(3):\n    print(i)\nprint('Bitti')",
          "print('Bitti')\nfor i in range(3):\n    print(i)",
          "    print(i)\nfor i in range(3):\nprint('Bitti')",
          "for i in range(3):\nprint('Bitti')\n    print(i)",
        ],
        "for i in range(3):\n    print(i)\nprint('Bitti')",
      ),
      fillStep("step-4", "Liste dön", "for item in ____:\n    print(item)", ["urunler", "print", "range", "def"], "urunler", {
        content: "urunler = ['A', 'B']",
      }),
      completeStep("step-5", 10, "Liste üzerinde işlem"),
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
      outputStep("step-2", "Toplam", "s=0\nfor x in [5, 5]:\n    s += x\nprint(s)", ["10", "55", "0", "Hata"], "10"),
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
        "Hata",
        "toplam = 0\nfor n in [1, 2, 3]:\ntoplam += n",
        ["for gövdesi girintisiz", "toplam yanlış", "n tanımsız", "print eksik"],
        "for gövdesi girintisiz",
      ),
      completeStep("step-5", 15, "Toplam ve ortalama bulma"),
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
      infoStep("step-1", "Ortalama", "toplam / len(liste)", {
        code: "notlar = [70, 80, 90]\nprint(sum(notlar) / len(notlar))",
        migo: "sum() yerine döngüyle toplam da yapılabilir.",
      }),
      outputStep("step-2", "Ortalama", "nums = [10, 20]\nprint(sum(nums) / len(nums))", ["15.0", "30", "10", "Hata"], "15.0"),
      fillStep("step-3", "Ortalama", "ortalama = toplam / ____", ["len(notlar)", "notlar", "2", "0"], "len(notlar)", {
        content: "notlar listesinin ortalaması",
      }),
      codeOrderStep(
        "step-4",
        "Adımlar",
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
      miniTaskStep("step-2", "Toplam", "En az 3 harcamalı liste; toplamı yazdır.", {
        checklist: ["3+ eleman", "sum veya döngü", "toplam print"],
        exampleSolution: "h = [10, 20, 30]\nprint(sum(h))",
        validation: {
          validationMode: "spendingSummaryTotal",
          mustIncludePrint: true,
          minLength: 20,
        },
      }),
      projectStep("step-3", "Özet rapor", "Toplam, ortalama ve en yüksek harcamayı yazdır.", {
        checklist: ["toplam", "ortalama", "max() veya döngü ile en yüksek"],
        exampleSolution:
          'h = [100, 50, 200]\nprint(f"Toplam: {sum(h)}")\nprint(f"Ortalama: {sum(h)/len(h)}")\nprint(f"En yüksek: {max(h)}")',
        validation: {
          validationMode: "spendingSummaryReport",
          mustIncludePrint: true,
          minLength: 40,
        },
      }),
      completeStep("step-4", 25, "Fonksiyon tasarlama"),
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
      infoStep("step-1", "Tasarım", "İsim fiil içersin: hesapla_ortalama, yazdir_ozet.", {
        code: "def kare(n):\n    return n * n",
        migo: "Bir fonksiyon bir iş yapsın.",
      }),
      matchStep("step-2", "İyi isim", "Liste toplamı için?", ["toplam_liste", "x", "fn1", "liste"], "toplam_liste"),
      mcStep("step-3", "Tek iş", ["def tek(): pass", "def hersey(): ... 50 satır", "def import os", "def 2x()"], "def tek(): pass", {
        migo: "Küçük ve odaklı fonksiyonlar.",
      }),
      fillStep("step-4", "Tanım", "____ mesaj_yaz(metin):\n    print(metin)", ["def", "function", "return", "class"], "def"),
      completeStep("step-5", 10, "Parametre ve return"),
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
      infoStep("step-1", "Parametre/return", "Sonucu return et; print sadece gösterir.", {
        code: "def topla(a, b):\n    return a + b\n\nprint(topla(3, 5))",
      }),
      outputStep("step-2", "Sonuç", "def iki_kat(n):\n    return n * 2\nprint(iki_kat(4))", ["8", "4", "n", "Hata"], "8"),
      fillStep("step-3", "return", "def kare(n):\n    ____ n * n", ["return", "print", "def", "input"], "return"),
      debugStep(
        "step-4",
        "Hata",
        "def selam(isim)\n    return f'Merhaba {isim}'",
        ["def satırında : eksik", "return yanlış", "f-string hatası", "isim tanımsız"],
        "def satırında : eksik",
      ),
      completeStep("step-5", 10, "Yardımcı fonksiyonlar"),
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
      infoStep("step-1", "Yardımcı", "format_para, gecildi_mi gibi küçük fonksiyonlar ana kodu okunur kılar.", {
        code: "def gecildi(notu):\n    return notu >= 50\n\nprint(gecildi(60))",
      }),
      miniTaskStep("step-2", "cift_mi", "n çift ise True dönen fonksiyon yaz.", {
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
        "Sıra",
        [
          "def topla(a, b):\n    return a + b\nprint(topla(2, 3))",
          "print(topla(2, 3))\ndef topla(a, b):\n    return a + b",
          "def main():\n    print(topla(2, 3))\ndef topla(a, b):\n    return a + b",
          "def topla(a, b):\n    return a + b\ndef main():\n    print(topla(2, 3))",
        ],
        "def topla(a, b):\n    return a + b\nprint(topla(2, 3))",
        { migo: "Fonksiyon çağrılmadan önce tanımlanmalı." },
      ),
      matchStep("step-4", "Kavram", "gecildi(notu) ne döndürür?", ["bool", "str", "list", "void"], "bool"),
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
      completeStep("step-4", 25, "Syntax error mantığı"),
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
      debugStep("step-2", "Hata", "if x > 0\n    print(x)", ["if satırında : eksik", "print yanlış", "x tanımsız", "else gerekli"], "if satırında : eksik"),
      debugStep("step-3", "Parantez", 'print("Merhaba"', ["Kapanmayan parantez", "print yanlış", "tırnak fazla", "import eksik"], "Kapanmayan parantez"),
      mcStep("step-4", "Geçerli mi?", ["if True:\n    pass", "if True\n    pass", "if True:pass", "while True:\n    pass"], "if True:\n    pass"),
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
        "Bul",
        "toplam = 0\nfor n in [1, 2, 3]:\n    toplam = toplam + m",
        ["m yerine n kullanılmalı", "toplam yanlış", "for hatası", "liste boş"],
        "m yerine n kullanılmalı",
      ),
      debugStep(
        "step-3",
        "Yazım",
        "Isim = 'Ali'\nprint(isim)",
        ["isim / Isim büyük-küçük harf uyumsuz", "print hatası", "tırnak", "for eksik"],
        "isim / Isim büyük-küçük harf uyumsuz",
      ),
      fillStep("step-4", "Düzelt", "kullanici_adi = 'Efe'\nprint(____)", ["kullanici_adi", "kullaniciadi", "user_adi", "adi"], "kullanici_adi"),
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
        "Hata",
        'a = input("Sayı: ")\nb = input("Sayı2: ")\nprint(a + b)',
        ["Metin birleştirme; int() gerekli", "input yanlış", "print fazla", "b tanımsız"],
        "Metin birleştirme; int() gerekli",
        { migo: '"2"+"3" = "23" — toplama için int gerekir.' },
      ),
      mcStep("step-3", "Doğru toplama", ['int("2") + int("3")', '"2" + "3"', "2 + 3", 'int("2" + "3")'], 'int("2") + int("3")'),
      matchStep("step-4", "Hata türü", 'int("merhaba") ne üretir?', ["ValueError", "SyntaxError", "TypeError", "KeyError"], "ValueError"),
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
      projectStep("step-2", "Liste oluştur", "En az 3 alışkanlıklı liste yazdır.", {
        checklist: ["3+ alışkanlık", "liste tanımla", "print ile yazdır"],
        exampleSolution:
          'aliskanliklar = ["Meditasyon", "Kod", "Yürüyüş"]\nprint(aliskanliklar)',
        validation: {
          validationMode: "simpleListAndPrint",
        },
      }),
      projectStep("step-3", "Tamamlandı dict", "Her alışkanlık için dict: ad ve tamamlandi (bool).", {
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
      projectStep("step-2", "Sayaç", "Tamamlanan alışkanlık sayısını hesapla ve yazdır.", {
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
      projectStep("step-3", "Yüzde", "Tamamlanma yüzdesini f-string ile göster.", {
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
      projectStep("step-2", "Yeni ekle", "Kullanıcıdan alışkanlık adı al ve listeye dict olarak ekle.", {
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
      projectStep("step-3", "Tam proje", "ozet_yazdir(gorevler) fonksiyonu: toplam, tamamlanan, yüzde.", {
        checklist: ["ozet_yazdir fonksiyonu", "toplam/tamamlanan/yüzde", "f-string print"],
        exampleSolution:
          'def ozet_yazdir(gorevler):\n    toplam = len(gorevler)\n    tamamlanan = 0\n    for g in gorevler:\n        if g["tamamlandi"]: tamamlanan += 1\n    yuzde = tamamlanan / toplam * 100\n    print(f"Toplam: {toplam}")\n    print(f"Tamamlanan: {tamamlanan}")\n    print(f"Yüzde: %{yuzde}")\n\ngorevler = [{"ad":"Kod","tamamlandi":True},{"ad":"Spor","tamamlandi":False}]\nozet_yazdir(gorevler)',
        migo: "Temel yolu tamamladın — harika iş!",
        validation: {
          validationMode: "habitTrackerSummaryFunction",
        },
      }),
      completeStep("step-4", 40, "Python Orta Yolu", {
        content: "Alışkanlık takipçisi projeni bitirdin. Temel yol tamamlandı!",
      }),
    ],
    "basic",
  ),
};
