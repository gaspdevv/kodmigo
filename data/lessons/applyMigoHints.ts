import type { LessonContent, LessonStepType } from "./types";

/** Contextual Migo hints keyed by "lessonId/stepId". Applied at export time. */
export const MIGO_HINT_OVERRIDES: Record<string, string> = {
  // --- Beginner ---
  "beg-output-prediction/step-5":
    "Hedef çıktıya benzer bir sonuç için print(...) kullan. Metin yazarken tırnak, değişken yazdırırken değişken adını kullan.",
  "python-intro-task/step-5":
    "Bu görevde en az bir print(...) satırı olmalı. Kendini tanıtan kısa bir metin yazdır; tırnak kullanmayı unutma.",
  "beg-variables-intro/step-5":
    "Değişkene = ile değer ata, sonra print(...) ile ekranda göster. Değişken adı anlamlı olmalı.",
  "beg-boolean-fstring/step-5":
    "f-string için tırnaktan önce f yazılır. Değişken değerlerini süslü parantez içinde kullan.",
  "beg-input-basics/step-4":
    "Kullanıcıdan veri almak için input(...) kullanılır. Aldığın değeri print(...) ile ekranda gösterebilirsin.",
  "beg-age-calculator/step-2":
    "Doğum yılını input ile al, int(...) ile sayıya çevir. Yaşı bulmak için mevcut yıldan çıkarman gerekir.",
  "beg-ticket-price/step-2":
    "Yaşı input ile alıp int'e çevir. Farklı yaş aralıkları için if/elif/else ile farklı fiyat yazdırabilirsin.",
  "beg-shopping-list/step-2":
    "Liste köşeli parantezle yazılır. En az üç eleman tanımla; append(...) ile sonradan da ekleyebilirsin.",
  "beg-loop-list/step-3":
    "for döngüsü listedeki her eleman için bir kez çalışır. Döngü gövdesinde print(...) ile elemanı yazdır.",
  "beg-daily-tasks/step-2":
    "Görevleri bir listede tut. for ile gezerken her elemanı print(...) ile satır satır yazdırabilirsin.",
  "beg-greeting-functions/step-2":
    "def ile fonksiyon tanımla; parantez içine parametre yaz. return ile metin döndürüp print ile test edebilirsin.",
  "beg-quiz-project-1/step-3":
    "Kullanıcı cevabını input ile al. if ile kontrol edip koşul sağlanırsa puan değişkenini artır.",
  "beg-quiz-project-2/step-2":
    "Her soru için input ve if kullan. Puanı bir değişkende biriktir; soruları sırayla sorup sonunda yazdır.",

  // --- Basic ---
  "bas-quick-print/step-3":
    "Önce x değişkeninin değerini takip et. print(...) içindeki ifade hesaplanır; + sayılar için toplama yapar.",
  "bas-quick-print/step-5":
    "Bir değişkene = ile sayı ata, sonra print(...) ile yazdır. Sayı yazarken tırnak kullanma.",
  "bas-quick-types/step-3":
    "Tırnak içindeki değer metindir; tırnaksız sayı ile toplanamaz. Tür uyumsuzluğu hatasını düşün.",
  "bas-quick-types/step-4":
    "print(...) içindeki ifade önce hesaplanır. İki tam sayının + ile toplanması matematiksel sonuç verir.",
  "bas-quick-types/step-5":
    "Değişkene değer ata, sonra type(...) ile türünü print(...) ile göster. type bir fonksiyondur.",
  "bas-output-prediction/step-3":
    "print(...) içindeki çarpma işlemi önce hesaplanır, sonra sonuç ekrana yazılır.",
  "bas-debug-intro/step-2":
    "Parantezler eşleşmeli. Açılan her ( için kapanan bir ) olup olmadığını satır satır kontrol et.",
  "bas-debug-intro/step-5":
    "Değişken önce tanımlanmalı, sonra kullanılmalı. Atama satırı print satırından önce gelir.",
  "bas-if-elif-else/step-2":
    "Koşulları yukarıdan aşağı kontrol et. İlk sağlanan dal çalışır; sonraki dallar atlanır.",
  "bas-comparisons/step-2":
    "Eşitlik kontrolü için çift eşittir operatörü kullanılır. Tek = atama içindir, karşılaştırma değildir.",
  "bas-comparisons/step-4":
    "Karşılaştırma operatörleri True veya False döndürür. 10 ile 8'i büyüklük açısından düşün.",
  "bas-logical-ops/step-2":
    "and operatörü her iki taraf da True ise True döndürür. True and False ifadesini adım adım değerlendir.",
  "bas-logical-ops/step-3":
    "or operatöründe taraflardan biri True ise sonuç True olur. False or True ifadesini düşün.",
  "bas-grade-system/step-2":
    "Notu input ile al, int(...) ile sayıya çevir. if/else ile iki farklı mesaj yazdırabilirsin.",
  "bas-grade-system/step-3":
    "Birden fazla not aralığı için elif kullan. Sonucu f-string ile yazdırmayı düşün.",
  "bas-list-review/step-2":
    "Python'da indeks 0'dan başlar. Listenin ilk elemanına erişmek için hangi numarayı kullanırsın?",
  "bas-list-review/step-3":
    "append sonrası listeye yeni eleman eklenir. print(...) listeyi köşeli parantezli gösterimle yazar.",
  "bas-list-review/step-4":
    "len(...) bir koleksiyondaki eleman sayısını verir. Boş listenin uzunluğunu düşün.",
  "bas-dict-intro/step-2":
    "Dict süslü parantez ve anahtar: değer çiftleriyle yazılır. Köşeli parantez liste içindir.",
  "bas-dict-intro/step-3":
    "Dict değerine anahtar adıyla erişilir. Köşeli parantez içine anahtarı yazman gerekir.",
  "bas-dict-intro/step-4":
    "Anahtar-değer yapısı dict'tir. Liste sıralı eleman tutar; dict etiketli alanlar saklar.",
  "bas-list-dict-diff/step-2":
    "Sıralı ürün listesi için elemanları sırayla tutan yapı uygundur. Anahtar-değer modeli farklı amaç içindir.",
  "bas-list-dict-diff/step-4":
    "Dict'ten anahtar ile değer alınır. d['x'] ifadesinde köşeli parantez içindeki anahtarın değerini düşün.",
  "bas-contact-book/step-2":
    "Dict süslü parantezle yazılır; her alan bir anahtar. ad ve email gibi alanları tanımla ve yazdır.",
  "bas-contact-book/step-3":
    "Dict'leri liste içinde tutabilirsin. for ile gezip her kişinin ad alanını yazdır.",
  "bas-for-review/step-2":
    "range(2, 5) 2, 3, 4 üretir; üst sınır dahil değildir. Her değer ayrı bir print satırı oluşturur.",
  "bas-for-review/step-3":
    "Önce döngü tanımlanmalı, sonra döngü dışındaki print gelir. Girinti hangi satırın döngüye ait olduğunu belirler.",
  "bas-for-review/step-4":
    "for item in liste: yapısı listedeki her elemanı sırayla item değişkenine verir.",
  "bas-list-processing/step-2":
    "s=0 ile başla; döngüde her elemanı s'ye ekle. += ile biriktirme yapılır.",
  "bas-list-processing/step-3":
    "for ile listedeki her sayıyı gez. if ile çift olup olmadığını kontrol edip uygun olanları yazdır.",
  "bas-list-processing/step-4":
    "for döngüsü gövdesindeki satırlar girintili olmalı. Girintisiz satır döngü dışında kalır.",
  "bas-sum-average/step-2":
    "sum(...) toplamı verir; len(...) eleman sayısını. Ortalama için toplamı eleman sayısına bölersin.",
  "bas-sum-average/step-3":
    "Ortalama = toplam / eleman sayısı. Eleman sayısı için len(...) kullanılır.",
  "bas-sum-average/step-4":
    "Önce listeyi tanımla, sonra toplamı hesapla, ardından ortalamayı bul ve en son yazdır.",
  "bas-expense-tracker/step-2":
    "Harcamaları listede tut. sum(...) ile toplamı bulup print(...) ile yazdırabilirsin.",
  "bas-expense-tracker/step-3":
    "Toplam, ortalama ve en yüksek değer için sum, len ve max kullanılabilir. Her birini ayrı yazdır.",
  "bas-function-design/step-2":
    "Fonksiyon adı işlevi yansıtmalı. x veya fn1 gibi belirsiz isimler yerine ne yaptığını anlatan ad düşün.",
  "bas-function-design/step-4":
    "Fonksiyon tanımlamak için özel bir anahtar kelime kullanılır. İki nokta üst üste satırın sonunda olmalı.",
  "bas-params-return/step-2":
    "Fonksiyona verilen değer parametrenin yerine geçer. Gövdedeki işlem bu değerle hesaplanır.",
  "bas-params-return/step-3":
    "Fonksiyon sonucunu dışarı veren anahtar kelime print değildir. Sonucu geri gönderen yapıyı düşün.",
  "bas-params-return/step-4":
    "def satırının sonunda iki nokta üst üste olmalı. Python sözdiziminde bu zorunludur.",
  "bas-helper-functions/step-2":
    "def ile fonksiyon tanımla; % operatörü bölüm kalansını verir. True/False sonucu için uygun ifade kullan.",
  "bas-helper-functions/step-4":
    "Karşılaştırma operatörleri True veya False üretir. Bu sonuç hangi veri türüne aittir?",
  "bas-calculator/step-2":
    "def ile iki parametre alan fonksiyon yaz. return ile toplamı döndür, sonra çağırıp yazdır.",
  "bas-calculator/step-3":
    "Her işlem için ayrı fonksiyon tanımla. input ile işlem seçip if ile hangi fonksiyonu çağıracağını belirle.",
  "bas-syntax-errors/step-2":
    "if satırının sonunda iki nokta üst üste olmalı. Girinti de if bloğu için önemlidir.",
  "bas-syntax-errors/step-3":
    "print(...) içinde parantezler eşleşmeli. Açılan parantez kapanmadan satır biterse hata oluşur.",
  "bas-syntax-errors/step-4":
    "Geçerli if bloğunda iki nokta üst üste ve girintili gövde olmalı. Sözdizimini seçeneklerle karşılaştır.",
  "bas-variable-bugs/step-2":
    "Döngüde tanımladığın değişken adıyla toplama satırındaki ad aynı olmalı. Yazım farkı hataya yol açar.",
  "bas-variable-bugs/step-3":
    "Python'da büyük-küçük harf duyarlıdır. Isim ve isim farklı değişkenler sayılır.",
  "bas-variable-bugs/step-4":
    "print(...) içine yazdırılacak değişkenin tam adını yaz. Tanımladığın isimle aynı olmalı.",
  "bas-type-conversion-bugs/step-3":
    "input metin döndürür. Sayısal toplama için int(...) ile dönüştürmen gerekir.",
  "bas-type-conversion-bugs/step-4":
    "int(...) yalnızca sayıya çevrilebilir metinlerde çalışır. Geçersiz metinde hangi hata türü oluşabilir?",
  "bas-habit-project-1/step-2":
    "Alışkanlıkları köşeli parantezli listede tut. En az üç eleman tanımla ve listeyi yazdır.",
  "bas-habit-project-1/step-3":
    "Her alışkanlık bir dict olabilir: ad ve tamamlandi alanları. Dict'leri liste içinde sakla.",
  "bas-habit-project-2/step-2":
    "for ile dict listesini gez. if ile tamamlandi True olanları say; sayaç değişkeni kullan.",
  "bas-habit-project-2/step-3":
    "Tamamlanan sayısını len(...) ile toplam sayıya böl; yüzde için 100 ile çarp. f-string ile yazdır.",
  "bas-habit-project-3/step-2":
    "input ile alışkanlık adı al. append(...) ile listeye {'ad': ..., 'tamamlandi': False} dict'i ekle.",
  "bas-habit-project-3/step-3":
    "ozet_yazdir fonksiyonunda for ile tamamlananları say. len ve f-string ile toplam, tamamlanan ve yüzde yazdır.",

  // --- Intermediate (continued) ---
  "int-function-split/step-2":
    "Her fonksiyon tek bir iş yapmalı. İsimden ve açıklamadan hangi sorumluluğa ait olduğunu eşleştir.",
  "int-function-split/step-3":
    "def satırının sonunda iki nokta üst üste eksikse SyntaxError oluşur. Satır sonunu kontrol et.",
  "int-return-power/step-2":
    "Fonksiyon içindeki if dalları sırayla değerlendirilir. sign(-5) için hangi return çalışır?",
  "int-return-power/step-3":
    "Fonksiyon gövdesindeki satırlar girintili olmalı. return satırı def bloğunun içinde olmalı.",
  "int-return-power/step-5":
    "Negatif sayı için if ile kontrol et. Koşul sağlanırsa işaretini değiştir; return ile sonucu ver.",
  "int-conditional-functions/step-2":
    "Koşul True ise indirimli fiyat hesaplanır. if bloğundaki işlemi parametre değerleriyle düşün.",
  "int-conditional-functions/step-4":
    "if satırı def bloğu içinde girintili olmalı. Girintisiz if satırı sözdizimi hatası verir.",
  "int-conditional-functions/step-5":
    "def ile fonksiyon tanımla; notu parametre al. Karşılaştırma sonucunu return ile döndür.",
  "int-score-function/step-2":
    "def ile fonksiyon tanımla. Doğru sayısını parametre al; return ile puan hesabını döndür.",
  "int-score-function/step-3":
    "Fonksiyon çağrıldığında parametreler yerine geçer. return ifadesindeki işlemi adım adım hesapla.",
  "int-score-function/step-4":
    "Fonksiyon gövdesindeki return satırı girintili olmalı. def bloğu içindeki satırlar boşlukla girintilenir.",
  "int-score-function/step-5":
    "Negatif sonucu engellemek için max(0, ...) veya if kullanabilirsin. İki parametre al.",
  "int-list-dict-practice/step-3":
    "Dict'te olmayan anahtar ile erişim KeyError verir. Hangi anahtarın eksik olduğunu düşün.",
  "int-list-dict-practice/step-4":
    "d['a'] bir liste döndürür; [1] indeksi ikinci elemana erişir. İç içe yapıyı adım adım takip et.",
  "int-list-dict-practice/step-5":
    "Dict süslü parantezle yazılır; ad ve not anahtarları tanımla. Köşeli parantezle bir alanı yazdır.",
  "int-search-filter/step-2":
    "in operatörü bir değerin liste veya metin içinde olup olmadığını kontrol eder. Sonucu yazdır.",
  "int-search-filter/step-3":
    "Önce listeyi tanımla, boş sonuç listesi oluştur, for ile gez, if ile filtrele, append ile ekle.",
  "int-search-filter/step-4":
    "in operatörü alt string araması yapar. 'py' ifadesi 'python' içinde var mı diye kontrol eder.",
  "int-data-model/step-2":
    "Birden fazla alanı olan kayıt için dict uygundur. Sipariş verisi alan adlarıyla erişilir.",
  "int-data-model/step-3":
    "Dict'e yeni alan atamak için köşeli parantez kullanılır. Stok sayısal bir değer olmalı.",
  "int-data-model/step-4":
    "Dict anahtarları alan adlarını temsil eder. E-posta bilgisi hangi anahtar adına uygun?",
  "int-student-grades/step-2":
    "Her öğrenci bir dict; ad ve not alanları tanımla. Dict'leri liste içinde tut, for ile yazdır.",
  "int-student-grades/step-3":
    "Notları topla, len ile öğrenci sayısına böl. f-string ile ortalamayı yazdır.",
  "int-conditional-loop/step-2":
    "Sayaç 0 ile başlar; koşul sağlanınca artırılır. Döngü bitince sayacın değerini düşün.",
  "int-conditional-loop/step-3":
    "for ile listedeki her sayıyı gez. if ile pozitif olanları seçip print ile yazdır.",
  "int-conditional-loop/step-4":
    "Eşik kontrolü için karşılaştırma operatörü kullanılır. 100'den büyük fiyatları seçmek için hangisi?",
  "int-counter-logic/step-2":
    "Döngü her 'a' harfinde sayacı artırır. Döngü bitince c değişkeninin son halini düşün.",
  "int-counter-logic/step-3":
    "Sayaç genelde 0'dan başlar; henüz sayılmamış durumu temsil eder.",
  "int-counter-logic/step-4":
    "Önce sayacı sıfırla, sonra döngüyle say, en son print ile sonucu yazdır.",
  "int-min-max/step-3":
    "Python'da en büyük değeri bulmak için yerleşik bir fonksiyon vardır. Liste adını parametre olarak ver.",
  "int-expense-analysis/step-2":
    "Dict listesindeki tutar alanlarını topla. sum(...) veya döngü ile biriktirme yapabilirsin.",
  "int-expense-analysis/step-3":
    "for ile harcamaları gez; if ile kategoriyi filtrele. Uyan tutarları toplayıp f-string ile yazdır.",
  "int-string-case/step-2":
    "upper() metindeki tüm harfleri büyük harfe çevirir. Dönüşüm sonrası ekrana ne yazılır?",
  "int-string-case/step-3":
    "Metni küçük harfe çevirmek için metin üzerinde bir string metodu kullanılır.",
  "int-string-case/step-4":
    "upper() ve dilimleme birleşince karşılaştırma nasıl sonuçlanır? Metin dönüşümlerini adım adım izle.",
  "int-string-split/step-2":
    "split() metni parçalara ayırır ve liste döndürür. len(...) parça sayısını verir.",
  "int-string-split/step-3":
    "Kelime ayırmak için split'e ayırıcı karakter verilir. Boşlukla ayrılmış kelimeler için ne kullanılır?",
  "int-string-split/step-4":
    "Metni ayırıcı karaktere göre parçalayan string metodunu düşün. CSV satırları için hangisi uygundur?",
  "int-string-in/step-2":
    "in operatörü bir alt dizinin metin içinde olup olmadığını kontrol eder. Sonuç True veya False olur.",
  "int-string-in/step-3":
    "strip() baş/son boşlukları temizler, lower() küçük harfe çevirir. İkisini zincirleme kullanabilirsin.",
  "int-string-in/step-4":
    "if bloğu içindeki print girintili olmalı. Girinti Python'da blok yapısını belirler.",
  "int-word-counter/step-2":
    "Metni split ile kelime listesine ayır, len ile kaç parça olduğunu bul. print ile yazdır.",
  "int-word-counter/step-3":
    "split ile kelimelere ayır, for ile gez. len(kelime) ile uzunluğu kontrol et; koşula uyanları say.",
  "int-read-buggy-code/step-2":
    "range üst sınırı dahil etmez. 1'den 5'e kadar toplamak için üst sınırı düşün.",
  "int-read-buggy-code/step-3":
    "Boş listede len 0 döner; sıfıra bölme hataya yol açar. Edge case'i düşün.",
  "int-read-buggy-code/step-4":
    "Hata ayıklamada önce programın ne yapması gerektiğini netleştir. Sonra kodu satır satır izle.",
  "int-extract-function/step-2":
    "Fonksiyon tanımı kullanımdan önce gelmeli. Önce def, sonra çağrılar mantıklı akıştır.",
  "int-extract-function/step-3":
    "Tekrar eden satırları def ile fonksiyona al. Fonksiyonu birden fazla yerde çağırabilirsin.",
  "int-extract-function/step-4":
    "DRY: aynı kodu tekrarlama. Tekrar eden mantığı fonksiyona taşımayı önerir.",
  "int-readable-code/step-2":
    "Değişken ve fonksiyon adları ne yaptığını anlatmalı. t veya x1 yerine anlamlı isim seç.",
  "int-readable-code/step-4":
    "Fonksiyon adı ne yaptığını yansıtmalı. KDV hesaplayan fonksiyon için uygun sonek düşün.",
  "int-project-planning/step-2":
    "Koda geçmeden önce ne istendiğini netleştir. Seçeneklerden hangisi planlama, hangisi kodlama adımı?",
  "int-project-planning/step-3":
    "Kullanıcıdan metin almak için yerleşik bir fonksiyon vardır. Parantez içine istem yazılır.",
  "int-project-planning/step-4":
    "Proje adımları mantıklı sırayla gelir: anlama, yapı kurma, kod yazma, çalıştırma. Akışı düşün.",
  "int-task-tracker-1/step-2":
    "Boş liste oluştur, append ile dict ekle. Her görev ad ve tamam alanları içermeli.",
  "int-task-tracker-1/step-3":
    "def ile listele fonksiyonu yaz. for ile görevleri gez, f-string ile ad ve durumu yazdır.",
  "int-task-tracker-2/step-2":
    "for ile görev listesini gez. if ile ad eşleşirse tamam alanını True yap.",
};

const MIGO_REQUIRED_TYPES = new Set<LessonStepType>([
  "multiple-choice",
  "fill-blank",
  "output-quiz",
  "code-order",
  "debug-choice",
  "match-concept",
  "code-writing",
  "project-step",
  "mini-task",
]);

export { MIGO_REQUIRED_TYPES as MIGO_REQUIRED_STEP_TYPES };

export function applyMigoHintsToLessons(
  lessons: Record<string, LessonContent>,
): Record<string, LessonContent> {
  const result: Record<string, LessonContent> = {};

  for (const [lessonId, lesson] of Object.entries(lessons)) {
    let changed = false;
    const steps = lesson.steps.map((step) => {
      const key = `${lessonId}/${step.id}`;
      const override = MIGO_HINT_OVERRIDES[key];
      if (!override || !MIGO_REQUIRED_TYPES.has(step.type)) {
        return step;
      }
      if (step.migoMessage?.trim() === override.trim()) {
        return step;
      }
      changed = true;
      return { ...step, migoMessage: override };
    });

    result[lessonId] = changed ? { ...lesson, steps } : lesson;
  }

  return result;
}
