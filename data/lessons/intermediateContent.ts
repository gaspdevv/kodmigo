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

export const intermediateLessons: Record<string, LessonContent> = {
  "int-function-split": buildLesson(
    "int-function-split",
    "Fonksiyonları parçalamak",
    "Büyük fonksiyonları küçük parçalara böl.",
    "6 dk",
    10,
    [
      infoStep("step-1", "Parçalama", "Her fonksiyon tek bir sorumluluk alsın.", {
        code: "def format_para(tutar):\n    return f'{tutar:.2f} TL'\n\ndef yazdir_fatura(urun, fiyat):\n    print(urun, format_para(fiyat))",
        migo: "format_para sadece biçimlendirme yapar — yeniden kullanılabilir.",
      }),
      matchPairsStep(
        "step-2",
        "Sorumluluk eşleştir",
        [
          { concept: "format_para", answer: "Sadece para biçimlendirir" },
          { concept: "yazdir_fatura", answer: "Ürün ve fiyatı yazdırır" },
        ],
        ["Her şeyi yapar", "Sadece import eder"],
        { content: "def format_para(tutar):\n    return f'{tutar:.2f} TL'" },
      ),
      debugStep(
        "step-3",
        "Fonksiyon hatası",
        "def topla(a, b)\n    return a + b",
        [
          "def satırında iki nokta eksik",
          "return yanlış",
          "Parametre fazla",
          "Kod doğru",
        ],
        "def satırında iki nokta eksik",
      ),
      codeOrderLinesStep(
        "step-4",
        "Refactor sırası",
        ["def hesapla(): return 10", "def goster(): print(hesapla())", "goster()"],
        { content: "Önce fonksiyonlar, sonra çağrı.", migo: "Sıralama yaparken önce hangi satırın diğerleri için gerekli olduğunu düşün." },
      ),
      codeWritingStep(
        "step-5",
        "Küçük yardımcı fonksiyon",
        "İki sayıyı toplayan kısa bir fonksiyon yaz.",
        {
          validation: {
            validationMode: "miniProject",
            mustIncludeDef: true,
            requiredPatterns: ["return"],
            minLength: 20,
          },
          exampleSolution: "def topla(a, b):\n    return a + b",
        },
      ),
      completeStep("step-6", 10, "return mantığını güçlendirmek"),
    ],
    "intermediate",
  ),

  "int-return-power": buildLesson(
    "int-return-power",
    "return mantığını güçlendirmek",
    "Erken return ve çoklu çıktı kalıpları.",
    "6 dk",
    10,
    [
      infoStep("step-1", "Erken return", "Koşul sağlanınca hemen dön — gereksiz else azalır.", {
        code: "def mutlak(n):\n    if n < 0:\n        return -n\n    return n",
      }),
      outputStep("step-2", "Sonuç", "def sign(n):\n    if n > 0: return 1\n    if n < 0: return -1\n    return 0\nprint(sign(-5))", ["-1", "1", "0", "5"], "-1"),
      debugStep(
        "step-3",
        "return hatası",
        "def kare(n):\nreturn n * n",
        [
          "return satırı girintisiz",
          "def yanlış",
          "n tanımsız",
          "Kod doğru",
        ],
        "return satırı girintisiz",
      ),
      matchStep(
        "step-4",
        "return değeri",
        "def kare(n): return n * n sonucu kare(4) için?",
        ["16", "8", "4", "n*n"],
        "16",
        { migo: "return ifadesi fonksiyonun sonucudur." },
      ),
      codeWritingStep(
        "step-5",
        "mutlak değer",
        "Negatif sayıyı pozitife çeviren kısa bir fonksiyon yaz.",
        {
          validation: {
            validationMode: "miniProject",
            mustIncludeDef: true,
            mustIncludeIf: true,
            requiredPatterns: ["return"],
            minLength: 25,
          },
          exampleSolution:
            "def mutlak(n):\n    if n < 0:\n        return -n\n    return n",
        },
      ),
      completeStep("step-6", 10, "Fonksiyon içinde koşul"),
    ],
    "intermediate",
  ),

  "int-conditional-functions": buildLesson(
    "int-conditional-functions",
    "Fonksiyon içinde koşul",
    "Karar mantığını fonksiyonlara taşı.",
    "6 dk",
    15,
    [
      infoStep("step-1", "Koşullu fonksiyon", "gecerli_mi, indirimli_fiyat gibi karar fonksiyonları.", {
        code: "def indirimli(fiyat, ogrenci):\n    if ogrenci:\n        return fiyat * 0.8\n    return fiyat",
      }),
      matchStep(
        "step-2",
        "İndirim mantığı",
        "ogrenci True ise ne yapılır?",
        ["Fiyat %20 indirilir", "Fiyat iki katına çıkar", "Program durur", "Hiçbir şey"],
        "Fiyat %20 indirilir",
        { code: "def indirimli(fiyat, ogrenci):\n    if ogrenci:\n        return fiyat * 0.8\n    return fiyat" },
      ),
      codeOrderLinesStep(
        "step-3",
        "Fonksiyon sırası",
        ["def selam(isim):", '    return f"Merhaba {isim}"', 'print(selam("Migo"))'],
        { migo: "Önce fonksiyon tanımı, sonra çağrı." },
      ),
      debugStep(
        "step-4",
        "Hata",
        "def max2(a,b):\nif a>b:\n    return a\nreturn b",
        ["if satırı girintisiz", "return eksik", "a tanımsız", "def yanlış"],
        "if satırı girintisiz",
      ),
      codeWritingStep(
        "step-5",
        "gecildi_mi",
        "notu >= 50 ise True dönen bir fonksiyon yaz.",
        {
          validation: {
            validationMode: "miniProject",
            mustIncludeDef: true,
            requiredPatterns: ["return", ">="],
            minLength: 25,
          },
          exampleSolution:
            "def gecildi_mi(notu):\n    return notu >= 50\nprint(gecildi_mi(55))",
        },
      ),
      completeStep("step-6", 15, "Mini görev: Puan hesaplama fonksiyonu"),
    ],
    "intermediate",
  ),

  "int-score-function": buildLesson(
    "int-score-function",
    "Mini görev: Puan hesaplama fonksiyonu",
    "Doğru/yanlış sayısından puan hesapla.",
    "8 dk",
    25,
    [
      infoStep("step-1", "Puan formülü", "Doğru ve yanlış sayısından puan hesaplayan bir fonksiyon yazacaksın.", {
        expectedBehavior:
          "dogru ve yanlis parametreleri al; puan = dogru * 10 - yanlis * 2 gibi bir kural uygula ve sonucu döndür.",
        migo: "Negatif puanı engellemek için max veya if kullanabilirsin.",
      }),
      codeWritingStep(
        "step-2",
        "Basit puan",
        "dogru sayısı * 10 dönen bir fonksiyon yaz.",
        {
          validation: {
            validationMode: "miniProject",
            mustIncludeDef: true,
            requiredPatterns: ["return", "\\*\\s*10"],
            minLength: 20,
          },
          exampleSolution: "def puan(d):\n    return d * 10\nprint(puan(3))",
        },
      ),
      outputStep(
        "step-3",
        "Formül çıktısı",
        "def hesapla_puan(dogru, yanlis):\n    return dogru * 10 - yanlis * 2\nprint(hesapla_puan(5, 1))",
        ["48", "50", "40", "Hata"],
        "48",
      ),
      debugStep(
        "step-4",
        "Parametre hatası",
        "def puan(dogru, yanlis):\nreturn dogru * 10",
        [
          "return satırı girintisiz",
          "yanlis kullanılmamış",
          "def yanlış",
          "Kod doğru",
        ],
        "return satırı girintisiz",
      ),
      projectStep("step-5", "Tam puan", "dogru ve yanlis al; negatif puanı 0'a sabitle.", {
        checklist: ["iki parametre", "max(0, ...) veya if", "print örnek"],
        exampleSolution:
          "def puan(d, y):\n    p = d * 10 - y * 2\n    return max(0, p)\nprint(puan(5, 1))",
        validation: {
          validationMode: "miniProject",
          mustIncludeDef: true,
          requiredPatterns: ["return", "max\\s*\\("],
          minLength: 35,
        },
      }),
      completeStep("step-6", 25, "Liste ve dict pratikleri"),
    ],
    "intermediate",
  ),

  "int-list-dict-practice": buildLesson(
    "int-list-dict-practice",
    "Liste ve dict pratikleri",
    "İç içe veri yapılarıyla çalış.",
    "6 dk",
    15,
    [
      infoStep("step-1", "İç içe", "Liste içinde dict yaygın veri modelidir.", {
        code: 'ogrenciler = [{"ad": "Ali", "not": 85}, {"ad": "Ayşe", "not": 92}]',
      }),
      matchPairsStep(
        "step-2",
        "Yapı eşleştir",
        [
          { concept: "Liste", answer: "Sıralı öğe koleksiyonu" },
          { concept: "Dict", answer: "Anahtar-değer çiftleri" },
        ],
        ["Tek bir sayı", "Sadece metin"],
        { migo: "Her kavramın yaptığı işi düşün ve açıklamalarla eşleştir." },
      ),
      debugStep(
        "step-3",
        "Erişim hatası",
        'ogrenci = {"ad": "Ali"}\nprint(ogrenci["yas"])',
        [
          "yas anahtarı yok",
          "ad yanlış",
          "print hatalı",
          "Kod doğru",
        ],
        "yas anahtarı yok",
      ),
      outputStep("step-4", "Erişim", 'd = {"a": [1, 2]}\nprint(d["a"][1])', ["2", "1", "a", "Hata"], "2"),
      codeWritingStep(
        "step-5",
        "Dict oluştur",
        "ad ve not anahtarları olan bir öğrenci dict'i oluştur ve bir alanı yazdır.",
        {
          validation: {
            validationMode: "miniProject",
            mustIncludePrint: true,
            requiredPatterns: ["\\{", ":"],
            minLength: 25,
          },
          exampleSolution:
            'ogrenci = {"ad": "Ali", "not": 85}\nprint(ogrenci["ad"])',
        },
      ),
      completeStep("step-6", 15, "Arama ve filtreleme"),
    ],
    "intermediate",
  ),

  "int-search-filter": buildLesson(
    "int-search-filter",
    "Arama ve filtreleme",
    "Listede arama ve koşullu filtre.",
    "6 dk",
    15,
    [
      infoStep("step-1", "Filtreleme", "for + if ile koşula uyanları yeni listeye ekle.", {
        code: "gecenler = []\nfor o in ogrenciler:\n    if o['not'] >= 50:\n        gecenler.append(o)",
      }),
      miniTaskStep("step-2", "Bul", "İsim listesinde 'Ali' var mı kontrol et (in).", {
        checklist: ["in operatörü", "print bool"],
        exampleSolution: 'isimler = ["Ali", "Can"]\nprint("Ali" in isimler)',
      }),
      codeOrderStep(
        "step-3",
        "Filtre",
        [
          "notlar = [40, 60, 70]\nsonuc = []\nfor n in notlar:\n    if n >= 50:\n        sonuc.append(n)",
          "sonuc = []\nfor n in notlar:\n    if n >= 50:\n        sonuc.append(n)\nnotlar = [40, 60, 70]",
          "for n in notlar:\n    if n >= 50:\n        sonuc.append(n)\nnotlar = [40, 60, 70]\nsonuc = []",
          "notlar = [40, 60, 70]\nfor n in notlar:\nsonuc = []\n    if n >= 50:\n        sonuc.append(n)",
        ],
        "notlar = [40, 60, 70]\nsonuc = []\nfor n in notlar:\n    if n >= 50:\n        sonuc.append(n)",
      ),
      outputStep("step-4", "in", 'print("py" in "python")', ["True", "False", "Hata", "py"], "True"),
      completeStep("step-5", 15, "Basit veri modeli"),
    ],
    "intermediate",
  ),

  "int-data-model": buildLesson(
    "int-data-model",
    "Basit veri modeli",
    "Gerçek problemi dict/liste modeline çevir.",
    "6 dk",
    10,
    [
      infoStep("step-1", "Modelleme", "Ürün: ad, fiyat, stok alanları olan dict.", {
        code: 'urun = {"ad": "Kalem", "fiyat": 15.0, "stok": 100}',
        migo: "Önce veriyi kağıtta alanlara ayır, sonra koda yaz.",
      }),
      mcStep("step-2", "Sipariş modeli", ["dict veya dict listesi", "sadece print", "while zorunlu", "class şart"], "dict veya dict listesi"),
      fillStep("step-3", "Alan ekle", 'urun["stok"] = ____', ["50", '"50"', "stok", "print"], "50"),
      matchStep(
        "step-4",
        "Alan",
        "Kullanıcı e-postası hangi anahtar?",
        ["email", "liste", "for", "len"],
        "email",
        { code: 'kullanici = {"ad": "Efe", "email": "e@test.com"}' },
      ),
      completeStep("step-5", 10, "Mini proje: Öğrenci not listesi"),
    ],
    "intermediate",
  ),

  "int-student-grades": buildLesson(
    "int-student-grades",
    "Mini proje: Öğrenci not listesi",
    "Öğrenci dict listesi ve ortalama not.",
    "8 dk",
    25,
    [
      infoStep("step-1", "Not listesi", "Öğrenci dict listesi ve ortalama not hesaplayacaksın.", {
        expectedBehavior:
          "Her öğrenci için ad ve not alanları olan dict oluştur; for döngüsüyle notları yazdır ve sınıf ortalamasını hesapla.",
        migo: "List comprehension ileride; şimdilik döngü yeterli.",
      }),
      miniTaskStep("step-2", "Liste", "2 öğrencili dict listesi oluştur ve notları yazdır.", {
        checklist: ["2 dict", "not alanı", "for ile print"],
        exampleSolution: 'o=[{"ad":"Ali","not":60},{"ad":"Zeynep","not":90}]\nfor x in o: print(x["ad"], x["not"])',
      }),
      projectStep("step-3", "Ortalama", "Sınıf ortalamasını hesapla ve yazdır.", {
        checklist: ["notları topla", "len ile böl", "f-string özet"],
        exampleSolution:
          'o=[{"ad":"A","not":70},{"ad":"B","not":80},{"ad":"C","not":90}]\nt=sum(x["not"] for x in o)\nprint(f"Ortalama: {t/len(o)}")',
      }),
      completeStep("step-4", 25, "Listede koşullu işlem"),
    ],
    "intermediate",
  ),

  "int-conditional-loop": buildLesson(
    "int-conditional-loop",
    "Listede koşullu işlem",
    "Döngü içinde if ile veri işle.",
    "6 dk",
    15,
    [
      infoStep("step-1", "Koşullu döngü", "Sadece belirli elemanlarda işlem yap.", {
        code: "for n in notlar:\n    if n >= 50:\n        print(f'Geçti: {n}')",
      }),
      outputStep("step-2", "Say", "c=0\nfor x in [1,2,3,4]:\n    if x%2==0: c+=1\nprint(c)", ["2", "4", "1", "0"], "2"),
      miniTaskStep("step-3", "Pozitifler", "Listedeki pozitif sayıları yazdır.", {
        checklist: ["for", "if > 0", "print"],
        exampleSolution: "for n in [-1, 2, 3, -4]:\n    if n > 0:\n        print(n)",
      }),
      fillStep("step-4", "Eşik", "for p in fiyatlar:\n    if p ____ 100:\n        print(p)", [">", "<", "==", "="], ">", { content: "100 TL üzeri fiyatları yazdır." }),
      completeStep("step-5", 15, "Sayaç mantığı"),
    ],
    "intermediate",
  ),

  "int-counter-logic": buildLesson(
    "int-counter-logic",
    "Sayaç mantığı",
    "Döngüde sayaç değişkeni kullan.",
    "5 dk",
    10,
    [
      infoStep("step-1", "Sayaç", "count = 0 ile başla; koşulda count += 1.", {
        code: "adet = 0\nfor kelime in metinler:\n    if len(kelime) > 5:\n        adet += 1",
      }),
      outputStep("step-2", "Adet", "c=0\nfor ch in 'aaa':\n    if ch=='a': c+=1\nprint(c)", ["3", "1", "0", "a"], "3"),
      mcStep("step-3", "Başlangıç", ["0", "1", "None", "-1"], "0", { content: "Sayaç genelde hangi değerle başlar?" }),
      codeOrderStep(
        "step-4",
        "Sayaç",
        [
          "c = 0\nfor x in data:\n    if x:\n        c += 1\nprint(c)",
          "for x in data:\n    if x:\n        c += 1\nc = 0\nprint(c)",
          "c = 0\nprint(c)\nfor x in data:\n    if x:\n        c += 1",
          "for x in data:\nc = 0\n    if x:\n        c += 1\nprint(c)",
        ],
        "c = 0\nfor x in data:\n    if x:\n        c += 1\nprint(c)",
      ),
      completeStep("step-5", 10, "En büyük / en küçük bulma"),
    ],
    "intermediate",
  ),

  "int-min-max": buildLesson(
    "int-min-max",
    "En büyük / en küçük bulma",
    "Döngüyle max/min veya built-in kullan.",
    "6 dk",
    15,
    [
      infoStep("step-1", "max/min", "max(liste) ve min(liste) veya döngü ile ilk elemanı referans al.", {
        code: "nums = [3, 9, 1]\nprint(max(nums))\nprint(min(nums))",
      }),
      outputStep(
        "step-2",
        "Döngü max",
        "nums = [2, 8, 5]\nm = nums[0]\nfor n in nums[1:]:\n    if n > m:\n        m = n\nprint(m)",
        ["8", "2", "5", "Hata"],
        "8",
        { migo: "Döngü boyunca m değişkeninin nasıl güncellendiğini adım adım takip et." },
      ),
      fillStep("step-3", "Built-in", "en_buyuk = ____(sayilar)", ["max", "min", "sum", "len"], "max"),
      debugStep(
        "step-4",
        "Hata",
        "print(max([]))",
        ["Boş listede max ValueError", "0 döner", "None", "Hata yok"],
        "Boş listede max ValueError",
        { migo: "Boş liste edge case — ileride kontrol eklenir." },
      ),
      completeStep("step-5", 15, "Mini proje: Harcama analizi"),
    ],
    "intermediate",
  ),

  "int-expense-analysis": buildLesson(
    "int-expense-analysis",
    "Mini proje: Harcama analizi",
    "Kategori bazlı harcama özeti.",
    "8 dk",
    25,
    [
      infoStep("step-1", "Analiz", "Kategori bazlı harcama özeti oluşturacaksın.", {
        expectedBehavior:
          "dict listesi (kategori + tutar) oluştur; belirli kategorideki harcamaların toplamını hesapla ve yazdır.",
      }),
      miniTaskStep("step-2", "Toplam", "Harcama listesinden genel toplam.", {
        checklist: ["sum veya döngü", "print"],
        exampleSolution: 'h=[{"tutar":10},{"tutar":20}]\nprint(sum(x["tutar"] for x in h))',
      }),
      projectStep("step-3", "Kategori", "Belirli kategorideki harcamaların toplamını bul.", {
        checklist: ["for + if kategori", "toplam biriktir", "f-string"],
        exampleSolution:
          'h=[{"kat":"Ulasim","tutar":40},{"kat":"Yemek","tutar":60},{"kat":"Yemek","tutar":25}]\nt=0\nfor x in h:\n    if x["kat"]=="Yemek": t+=x["tutar"]\nprint(f"Yemek: {t} TL")',
      }),
      completeStep("step-4", 25, "lower / upper kullanımı"),
    ],
    "intermediate",
  ),

  "int-string-case": buildLesson(
    "int-string-case",
    "lower / upper kullanımı",
    "Metin büyük/küçük harf dönüşümü.",
    "5 dk",
    10,
    [
      infoStep("step-1", "lower/upper", "Kullanıcı girdisini normalize etmek için sık kullanılır.", {
        code: 'cevap = input("Evet/Hayır: ")\nif cevap.lower() == "evet":\n    print("Tamam")',
      }),
      outputStep("step-2", "upper", 'print("kodmigo".upper())', ["KODMIGO", "değişmedi", "kod migo", "Hata"], "KODMIGO"),
      fillStep("step-3", "Karşılaştır", 'if metin.____() == "python":', ["lower", "upper", "split", "len"], "lower"),
      mcStep("step-4", "Sonuç", ["True", "False", "Hata", "PY"], "True", { code: 'print("Test" == "test".upper()[:1] + "est")' }),
      completeStep("step-5", 10, "split ile parçalama"),
    ],
    "intermediate",
  ),

  "int-string-split": buildLesson(
    "int-string-split",
    "split ile parçalama",
    "Metni parçalara ayır ve işle.",
    "6 dk",
    10,
    [
      infoStep("step-1", "split", "metin.split(',') virgülden böler; liste döner.", {
        code: 'parca = "elma,armut,muz".split(",")\nprint(parca)',
      }),
      outputStep("step-2", "Parça sayısı", 'print(len("a b c".split()))', ["3", "1", "5", "Hata"], "3"),
      fillStep("step-3", "Ayırıcı", 'kelimeler = cumle.split(____)', ['" "', "''", "split", "len"], '" "'),
      matchStep("step-4", "Kullanım", "CSV satırını parçalamak?", ["split", "print", "if", "def"], "split"),
      completeStep("step-5", 10, "in kontrolü ve temizleme"),
    ],
    "intermediate",
  ),

  "int-string-in": buildLesson(
    "int-string-in",
    "in kontrolü ve temizleme",
    "Metin içinde arama ve basit temizlik.",
    "6 dk",
    15,
    [
      infoStep("step-1", "in ve strip", "'spam' in email; metin.strip() baş/son boşluk siler.", {
        code: 'email = "  user@test.com  "\nprint(email.strip())',
      }),
      outputStep("step-2", "in", 'print("@" in "a@b.com")', ["True", "False", "@", "Hata"], "True"),
      miniTaskStep("step-3", "Temizle", "Kullanıcı girdisini strip ve lower ile normalize et.", {
        checklist: ["strip", "lower", "print sonuç"],
        exampleSolution: 'g = "  EVET  "\nprint(g.strip().lower())',
      }),
      debugStep(
        "step-4",
        "Hata",
        'if "admin" in kullanici_adi:\nprint("Yasak")',
        ["print girintisiz", "in yanlış", "if eksik", "admin tanımsız"],
        "print girintisiz",
      ),
      completeStep("step-5", 15, "Mini proje: Kelime sayacı"),
    ],
    "intermediate",
  ),

  "int-word-counter": buildLesson(
    "int-word-counter",
    "Mini proje: Kelime sayacı",
    "Metindeki kelime sayısını hesapla.",
    "8 dk",
    25,
    [
      infoStep("step-1", "Kelime sayısı", "Metindeki kelimeleri sayacak bir program yazacaksın.", {
        expectedBehavior:
          "split() ile kelime listesi oluştur; len ile say. İstersen uzun kelimeleri ayrıca filtrele.",
      }),
      miniTaskStep("step-2", "Say", "Bir cümledeki kelime sayısını yazdır.", {
        checklist: ["split", "len", "print"],
        exampleSolution: 't = "bir iki uc"\nprint(len(t.split()))',
      }),
      projectStep("step-3", "Uzun kelimeler", "5 harften uzun kelimeleri say ve listele.", {
        checklist: ["split + for", "len(kelime) > 5", "sayaç veya liste"],
        exampleSolution:
          't = "kod python listeler"\nc=0\nfor w in t.split():\n    if len(w)>5: c+=1; print(w)\nprint(f"Adet: {c}")',
      }),
      completeStep("step-4", 25, "Hatalı kodu okuma"),
    ],
    "intermediate",
  ),

  "int-read-buggy-code": buildLesson(
    "int-read-buggy-code",
    "Hatalı kodu okuma",
    "Mantık hatalarını satır satır bul.",
    "6 dk",
    15,
    [
      infoStep("step-1", "Okuma", "Önce ne yapması gerektiğini anla, sonra satır satır izle.", {
        code: "# Beklenen: 1-5 toplamı 15\n# Hata: range(1,5) 4 dahil değil",
      }),
      debugStep(
        "step-2",
        "Toplam",
        "t=0\nfor i in range(1,5):\n    t+=i\n# Beklenen 15",
        ["range üst sınırı 5 olmalı (1,6)", "t yanlış", "i tanımsız", "+= hatalı"],
        "range üst sınırı 5 olmalı (1,6)",
      ),
      debugStep(
        "step-3",
        "Ortalama",
        "def ort(nums):\n    return sum(nums) / len(nums)\nprint(ort([]))",
        ["Boş liste sıfıra böler", "sum hatalı", "def yanlış", "print fazla"],
        "Boş liste sıfıra böler",
      ),
      mcStep("step-4", "İlk adım", ["Beklenen davranışı yaz", "Rastgele düzelt", "Kodu sil", "import ekle"], "Beklenen davranışı yaz"),
      completeStep("step-5", 15, "Tekrar eden kodu fonksiyona çevir"),
    ],
    "intermediate",
  ),

  "int-extract-function": buildLesson(
    "int-extract-function",
    "Tekrar eden kodu fonksiyona çevir",
    "DRY ilkesini uygula.",
    "6 dk",
    15,
    [
      infoStep("step-1", "Extract function", "Aynı 3+ satır tekrar ediyorsa fonksiyon yap.", {
        code: "# Önce: iki yerde aynı format\n# Sonra: def format_satir(...)",
      }),
      codeOrderStep(
        "step-2",
        "Refactor",
        [
          "def cizgi():\n    print('-' * 20)\nprint('Başlık')\ncizgi()\ncizgi()",
          "print('Başlık')\ndef cizgi():\n    print('-' * 20)\ncizgi()\ncizgi()",
          "cizgi()\nprint('Başlık')\ndef cizgi():\n    print('-' * 20)\ncizgi()",
          "def cizgi():\n    print('-' * 20)\ncizgi()\ncizgi()\nprint('Başlık')",
        ],
        "def cizgi():\n    print('-' * 20)\nprint('Başlık')\ncizgi()\ncizgi()",
        { content: "Önce tanım, sonra kullanımlar." },
      ),
      miniTaskStep("step-3", "Çek", "İki kez tekrarlanan print('---') satırını fonksiyona al.", {
        checklist: ["def", "2 çağrı", "tekrar azaldı"],
        exampleSolution: "def ayraç():\n    print('---')\nayraç()\nprint('İçerik')\nayraç()",
      }),
      matchStep("step-4", "DRY", "Don't Repeat Yourself ne önerir?", ["Tekrar azalt", "Daha çok kopyala", "Yorum sil", "Global kullan"], "Tekrar azalt"),
      completeStep("step-5", 15, "Daha okunabilir kod yazma"),
    ],
    "intermediate",
  ),

  "int-readable-code": buildLesson(
    "int-readable-code",
    "Daha okunabilir kod yazma",
    "İsimlendirme ve küçük fonksiyonlarla okunurluk.",
    "6 dk",
    15,
    [
      infoStep("step-1", "Okunurluk", "Açık isimler, kısa fonksiyonlar, gereksiz karmaşıklıktan kaçın.", {
        code: "# Kötü: def f(x): return x*0.18\n# İyi: def kdv_tutari(fiyat): return fiyat * 0.18",
      }),
      mcStep("step-2", "Daha iyi isim", ["toplam_fiyat", "t", "x1", "tmp"], "toplam_fiyat"),
      debugStep(
        "step-3",
        "Karmaşık",
        "if a>0 and b>0 and c>0 and d>0:\n    print(a+b+c+d)",
        ["Hepsi pozitif kontrolü fonksiyona alınabilir — okunabilirlik", "if yanlış", "print hatalı", "and fazla"],
        "Hepsi pozitif kontrolü fonksiyona alınabilir — okunabilirlik",
        { migo: "hepsi_pozitif(a,b,c,d) gibi yardımcı isim okumayı kolaylaştırır." },
      ),
      fillStep("step-4", "İsim", "def hesapla____(fiyat, oran):\n    return fiyat * oran", ["_kdv", "()", "print", "123"], "_kdv", {
        content: "KDV hesaplayan fonksiyon adı",
      }),
      completeStep("step-5", 15, "Problemi adımlara ayırma"),
    ],
    "intermediate",
  ),

  "int-project-planning": buildLesson(
    "int-project-planning",
    "Problemi adımlara ayırma",
    "Projeyi küçük görevlere böl.",
    "6 dk",
    10,
    [
      infoStep("step-1", "Planlama", "1) Veri modeli 2) Girdi 3) İşlem 4) Çıktı", {
        code: "# Görev takipçisi:\n# - gorevler listesi\n# - ekle, listele, tamamla",
        migo: "Kodu yazmadan önce 4-5 maddelik plan yap.",
      }),
      mcStep("step-2", "İlk adım", ["Problemi anla ve veri yapısını seç", "Hemen 200 satır yaz", "Sadece import", "Renk seç"], "Problemi anla ve veri yapısını seç"),
      matchStep("step-3", "Adım", "Kullanıcıdan görev adı almak?", ["input", "max", "split", "class"], "input"),
      codeOrderStep(
        "step-4",
        "Proje sırası",
        [
          "Problemi oku\nVeri yapısını tanımla\nFonksiyonları yaz\nAna akışı çalıştır",
          "Fonksiyonları yaz\nProblemi oku\nAna akışı çalıştır\nVeri yapısını tanımla",
          "Ana akışı çalıştır\nVeri yapısını tanımla\nProblemi oku\nFonksiyonları yaz",
          "Veri yapısını tanımla\nAna akışı çalıştır\nProblemi oku\nFonksiyonları yaz",
        ],
        "Problemi oku\nVeri yapısını tanımla\nFonksiyonları yaz\nAna akışı çalıştır",
      ),
      completeStep("step-5", 10, "Proje: Görev takipçisi — Adım 1"),
    ],
    "intermediate",
  ),

  "int-task-tracker-1": buildLesson(
    "int-task-tracker-1",
    "Proje: Görev takipçisi — Adım 1",
    "Görev listesi ve ekleme.",
    "8 dk",
    40,
    [
      infoStep("step-1", "Adım 1", "Görev listesi ve ekleme fonksiyonu yazacaksın.", {
        expectedBehavior:
          "Boş görev listesi oluştur; ekle fonksiyonu ile ad ve tamam alanları olan dict ekle; listele fonksiyonu ile göster.",
      }),
      projectStep("step-2", "Liste + ekle", "Boş liste ve en az bir görev ekleme.", {
        checklist: ["liste", "append dict", "ad + tamam alanı"],
        exampleSolution: 'g = []\ng.append({"ad": "Rapor", "tamam": False})\nprint(g)',
      }),
      projectStep("step-3", "listele", "listele(gorevler) her görevi satır satır yazdır.", {
        checklist: ["fonksiyon", "for döngüsü", "ad gösterimi"],
        exampleSolution:
          'def listele(g):\n    for x in g:\n        print(f"- {x[\'ad\']} ({x[\'tamam\']})")\ng=[{"ad":"A","tamam":False}]\nlistele(g)',
      }),
      completeStep("step-4", 40, "Proje: Görev takipçisi — Adım 2"),
    ],
    "intermediate",
  ),

  "int-task-tracker-2": buildLesson(
    "int-task-tracker-2",
    "Proje: Görev takipçisi — Adım 2",
    "Tamamlama ve özet rapor.",
    "8 dk",
    40,
    [
      infoStep("step-1", "Adım 2", "Görev tamamlama ve özet rapor yazacaksın.", {
        expectedBehavior:
          "tamamla fonksiyonu ile görevi tamamlandı olarak işaretle; ozet fonksiyonu ile toplam ve tamamlanan sayısını göster.",
      }),
      projectStep("step-2", "Tamamla", "Görev adına göre tamam=True yap.", {
        checklist: ["for + if ad", "tamam güncelle", "test"],
        exampleSolution:
          'def tamamla(g, ad):\n    for x in g:\n        if x["ad"]==ad:\n            x["tamam"]=True\ng=[{"ad":"X","tamam":False}]\ntamamla(g,"X")\nprint(g)',
      }),
      projectStep("step-3", "Tam proje", "ekle, listele, tamamla, ozet fonksiyonları ve örnek kullanım.", {
        checklist: ["4 fonksiyon veya 3+ ", "özet istatistik", "örnek senaryo"],
        exampleSolution:
          'def ozet(g):\n    t=len(g)\n    c=sum(1 for x in g if x["tamam"])\n    print(f"{c}/{t} bitti")\ng=[]\ng.append({"ad":"Kod","tamam":True})\ng.append({"ad":"Spor","tamam":False})\nozet(g)',
        migo: "Orta yolu tamamladın — mükemmel ilerleme!",
      }),
      completeStep("step-4", 40, "Öğrenmeye devam et", {
        content: "Görev takipçisi projeni bitirdin. Orta yol tamamlandı!",
      }),
    ],
    "intermediate",
  ),
};
