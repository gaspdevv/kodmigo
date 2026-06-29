import type { LessonStep, StepValidation } from "@/data/lessons/types";

export type ValidationResult = {
  valid: boolean;
  message?: string;
};

export const VALIDATION_MODES = [
  "printStringLiteral",
  "multiplePrintStringLiteral",
  "variableAssignment",
  "variableAndPrint",
  "miniProfile",
  "fStringIntro",
  "extendedProfileCard",
  "miniProject",
  "inputSumTwoNumbers",
  "ageCalculatorBasic",
  "personalizedAgeOutput",
  "ticketPriceRules",
  "listAppendAndPrint",
  "simpleListAndPrint",
  "habitDictList",
  "habitCompletionPercentage",
  "habitTrackerSummaryFunction",
  "listLoopSummary",
  "spendingSummaryTotal",
  "spendingSummaryReport",
  "functionReturnAndPrint",
  "mathFunctionAddAndPrint",
  "booleanHelperFunction",
  "twoGreetingFunctions",
  "quizFunctionProject",
  "scoreCalculatorFunction",
  "listMembershipCheck",
  "studentGradeAverage",
  "categorySpendingTotal",
  "inputNormalizeStripLower",
  "wordCountInputSplitLen",
  "longWordsFilterCount",
  "taskMarkCompleteByName",
  "taskTrackerFullProject",
] as const;

export type ValidationMode = (typeof VALIDATION_MODES)[number];

const LEGACY_MODE_ALIASES: Record<string, ValidationMode> = {
  selfIntroPrint: "printStringLiteral",
  fString: "fStringIntro",
};

const JUNK_EXACT = new Set([
  "abc",
  "test",
  "asdasd",
  "asd",
  "xxx",
  "qwerty",
  "qwe",
  "123",
  "lorem",
  "deneme",
  "hello",
  "hi",
  "ok",
  "evet",
  "hayır",
  "migo",
  "merhaba",
  "isim",
  "for",
  "if",
  "def",
  "while",
  "elif",
  "else",
  "return",
  "print",
]);

const LONE_KEYWORD_PATTERN =
  /^(for|while|if|elif|else|def|print|return|import|class|isim|migo|merhaba|x|y|z)$/i;

const PYTHON_INDICATORS =
  /print\s*\(|def\s+\w|^\s*if\s+|^\s*elif\s+|^\s*else\s*:|^\s*for\s+|^\s*while\s+|=\s*[^=]|input\s*\(|return\s+|import\s+|class\s+|f["']/im;

const SOLUTION_LEAK_PATTERN =
  /print\s*\([^)]+\)|=\s*["'][^"']+["']|def\s+\w+\s*\(|input\s*\([^)]+\)/i;

const DEFAULT_HINTS = {
  empty: "Lütfen Python kodunu yaz. Boş bırakılamaz.",
  junk:
    "Kodun biraz alakasız görünüyor. Görevde istenen hedef çıktıyı tekrar okuyup ona uygun bir kod yazmayı dene.",
  tooShort:
    "Cevabın çok kısa görünüyor. Görevin istediği ifadeyi yazmayı dene.",
  notPython:
    "Cümleni Python kodu olarak yazmalısın. print(...) kullanmayı dene.",
  missingPrint: "Bu görevde print() satırı kullanmalısın.",
  emptyPrint: "print() içine yazdırmak istediğin metni eklemelisin.",
  wrongCasePrint: "Python'da print küçük harfle yazılır: print(...)",
  unquotedString:
    'Metinleri yazdırırken tırnak kullanmalısın: print("Merhaba")',
  unquotedAssignment:
    'Metin değerlerini değişkene atarken tırnak kullanmalısın: ad = "Efe"',
  undefinedPrintVariable:
    "print() veya f-string içinde kullandığın değişkeni önce tanımlamalısın.",
  missingFString:
    "Bu görevde f-string kullanmalısın. f-string, tırnaktan önce f harfiyle yazılır.",
  missingFStringVariable:
    "f-string içinde değişkeni süslü parantezle kullanmalısın: {ad}",
  undefinedFStringVariable:
    "f-string içinde kullandığın değişkeni önce tanımlamalısın.",
  missingAssignment: "Bu görevde değişken tanımlamalısın.",
  missingAssignmentCount: "Bu görevde en az 2 değişken tanımlamalısın.",
  incompleteAssignment:
    'Değişkene bir değer vermelisin. Örneğin: ad = "Efe"',
  missingBoolean:
    "Bu görevde True veya False değeri olan bir boolean değişken eklemelisin.",
  invalidBooleanCase:
    "Python'da boolean değerler True veya False şeklinde büyük harfle yazılır.",
  missingKeyword:
    "Kodunda görevle ilgili beklenen bir kelime eksik. Görev metnini tekrar oku.",
  missingAnyKeyword:
    "Kodunda görevle ilgili beklenen kelimelerden en az biri geçmeli.",
  missingStructure:
    "Güzel deneme! Ama bu cevap henüz görevin istediği Python yapısını içermiyor.",
  missingPrintCount: "Bu görevde en az 2 print() satırı kullanmalısın.",
  missingPrintCount3: "Bu görevde en az 3 print() satırı kullanmalısın.",
  missingLines:
    "Bu adım birkaç satırlık kod bekliyor. Görevi parça parça yazmayı dene.",
  consoleLog:
    "Bu JavaScript kodu. Bu görevde Python kullanıyoruz: print(...)",
  plainTextOnly:
    "Cümleni Python kodu olarak yazmalısın. print(...) kullanmayı dene.",
  missingInputCount:
    "Bu görevde kullanıcıdan iki sayı almak için iki input() kullanmalısın.",
  missingInputConversion:
    "input() metin döndürür. Toplama yapmak için sayıya çevirmelisin: int(input(...))",
  missingInputSumPrint:
    "Sonucu ekrana yazdırmak için print(...) kullanmalısın.",
  missingAddition:
    "İki sayıyı toplamak için + işlemini kullanmalısın.",
  missingInputPrompt:
    'input() içine kullanıcıya ne soracağını yazmalısın. Örneğin: input("Birinci sayı: ")',
  wrongCaseInput:
    "Python'da input küçük harfle yazılır: input(...)",
  missingAgeInput:
    "Bu görevde doğum yılını almak için input() kullanmalısın.",
  missingAgeInputConversion:
    "input() metin döndürür. Yaş hesabı yapmak için doğum yılını sayıya çevirmelisin: int(input(...))",
  missingAgeSubtraction:
    "Yaşı hesaplamak için mevcut yıldan doğum yılını çıkarmalısın.",
  missingAgePrint:
    "Hesaplanan yaşı ekrana yazdırmak için print(...) kullanmalısın.",
  missingPersonalizedNameInput:
    "Bu görevde kullanıcı adını almak için input() kullanmalısın.",
  missingPersonalizedBirthYearInput:
    "Bu görevde doğum yılını almak için ikinci bir input() kullanmalısın.",
  missingPersonalizedInputConversion:
    "input() metin döndürür. Yaş hesabı yapmak için doğum yılını sayıya çevirmelisin: int(input(...))",
  missingPersonalizedAgeSubtraction:
    "Yaşı hesaplamak için mevcut yıldan doğum yılını çıkarmalısın.",
  missingPersonalizedFStringName:
    "f-string içinde kullanıcı adını süslü parantezle kullanmalısın.",
  missingPersonalizedFStringAge:
    "f-string içinde hesaplanan yaşı da kullanmalısın.",
  missingPersonalizedPrint:
    "Sonucu ekrana yazdırmak için print(...) kullanmalısın.",
  missingTicketAgeInput:
    "Bu görevde kullanıcıdan yaş almak için input() kullanmalısın.",
  missingTicketInputConversion:
    "input() metin döndürür. Yaş karşılaştırması yapmak için sayıya çevirmelisin: int(input(...))",
  missingTicketIf:
    "Fiyat kuralı yazmak için if koşulu kullanmalısın.",
  missingTicketSecondRule:
    "Bu görevde en az 2 farklı fiyat kuralı olmalı. else veya elif eklemeyi dene.",
  missingTicketPriceValue:
    "Koşullara göre bir fiyat değeri belirlemelisin.",
  missingTicketPrint:
    "Hesaplanan fiyatı ekrana yazdırmak için print(...) kullanmalısın.",
  missingListDefinition:
    "Bu görevde köşeli parantezlerle bir liste oluşturmalısın: [...]",
  missingListMinElements:
    "Başlangıç listende en az 2 eleman olmalı.",
  missingListAppend:
    "Listeye yeni eleman eklemek için append() kullanmalısın.",
  wrongCaseAppend:
    "Python'da append küçük harfle yazılır: liste.append(...)",
  missingListAppendTarget:
    "append() işlemini oluşturduğun liste değişkeni üzerinde kullanmalısın.",
  missingListPrint:
    "Listeyi ekrana yazdırmak için print(...) kullanmalısın.",
  missingSimpleListMinElements:
    "Bu görevde listede en az 3 eleman olmalı.",
  missingSimpleListQuotedElements:
    "Liste içindeki metinleri tırnak içinde yazmalısın.",
  missingListMembershipDefinition:
    "Bu görevde isimleri köşeli parantezlerle bir liste içinde yazmalısın: [...]",
  missingListMembershipIn:
    "Liste içinde arama yapmak için in operatörünü kullanmalısın.",
  missingListMembershipPrint:
    "Arama sonucunu ekrana yazdırmak için print(...) kullanmalısın.",
  missingListMembershipQuotedElements:
    "Liste içindeki metinleri tırnak içinde yazmalısın.",
  missingListMembershipNotString:
    "İsimleri tek metin olarak değil, liste olarak yazmalısın.",
  missingStudentGradeList:
    "Bu görevde öğrencileri liste içinde tutmalısın.",
  missingStudentGradeDictFields:
    "Her öğrenciyi ad ve not alanları olan dict olarak yazmalısın.",
  missingStudentGradeNotField:
    "Her öğrenci dict'inde not alanı olmalı.",
  missingStudentGradeNumericNot:
    "Öğrenci notları sayı olarak yazılmalı.",
  missingStudentGradeMinCount:
    "Ortalama hesaplamak için en az 2 öğrenci olmalı.",
  missingStudentGradeTotal:
    "Ortalama için önce notları toplamalısın.",
  missingStudentGradeLen:
    "Öğrenci sayısını bulmak için len(...) kullanmalısın.",
  missingStudentGradeAverage:
    "Ortalama için toplam notu öğrenci sayısına bölmelisin.",
  missingStudentGradePrint:
    "Ortalama sonucunu ekrana yazdırmak için print(...) kullanmalısın.",
  missingCategorySpendingList:
    "Bu görevde harcamaları liste içinde tutmalısın.",
  missingCategorySpendingDictFields:
    "Her harcamayı kategori ve tutar alanları olan dict olarak yazmalısın.",
  missingCategorySpendingKategoriField:
    "Her harcama dict'inde kategori alanı olmalı.",
  missingCategorySpendingTutarField:
    "Her harcama dict'inde tutar alanı olmalı.",
  missingCategorySpendingNumericTutar:
    "Harcama tutarları sayı olarak yazılmalı.",
  missingCategorySpendingMinCount:
    "Bu görevde listede en az 2 harcama olmalı.",
  missingCategorySpendingForLoop:
    "Harcamaları tek tek kontrol etmek için for döngüsü kullanmalısın.",
  missingCategorySpendingIf:
    "Belirli kategoriyi seçmek için if koşulu kullanmalısın.",
  missingCategorySpendingFilter:
    "Toplamı sadece belirli bir kategori için hesaplamalısın.",
  missingCategorySpendingTotal:
    "Seçilen kategorideki tutarları toplamalısın.",
  missingCategorySpendingPrint:
    "Kategori toplamını ekrana yazdırmak için print(...) kullanmalısın.",
  missingInputNormalizeInput:
    "Bu görevde kullanıcıdan veri almak için input() kullanmalısın.",
  missingInputNormalizeStrip:
    "Baştaki ve sondaki boşlukları temizlemek için strip() kullanmalısın.",
  missingInputNormalizeLower:
    "Girdiyi küçük harfe çevirmek için lower() kullanmalısın.",
  missingInputNormalizePrint:
    "Temizlenmiş girdiyi ekrana yazdırmak için print(...) kullanmalısın.",
  wrongCaseStrip:
    "Python'da strip küçük harfle yazılır: strip()",
  wrongCaseLower:
    "Python'da lower küçük harfle yazılır: lower()",
  missingWordCountInput:
    "Bu görevde kullanıcıdan cümle almak için input() kullanmalısın.",
  missingWordCountSplit:
    "Cümleyi kelimelere ayırmak için split() kullanmalısın.",
  missingWordCountLen:
    "Kelime sayısını bulmak için len(...) kullanmalısın.",
  missingWordCountPrint:
    "Kelime sayısını ekrana yazdırmak için print(...) kullanmalısın.",
  missingWordCountLenSplit:
    "Kelime sayısını bulmak için split() sonucunu len(...) ile saymalısın.",
  missingLongWordsInput:
    "Bu görevde kullanıcıdan cümle almak için input() kullanmalısın.",
  missingLongWordsSplit:
    "Cümleyi kelimelere ayırmak için split() kullanmalısın.",
  missingLongWordsFor:
    "Kelimeleri tek tek kontrol etmek için for döngüsü kullanmalısın.",
  missingLongWordsIf:
    "5 harften uzun kelimeleri seçmek için if koşulu kullanmalısın.",
  missingLongWordsLen:
    "Kelimenin uzunluğunu kontrol etmek için len(...) kullanmalısın.",
  missingLongWordsLengthCheck:
    "Bu görevde 5 harften uzun kelimeleri kontrol etmelisin.",
  missingLongWordsAppend:
    "Uzun kelimeleri ayrı bir listeye eklemelisin.",
  missingLongWordsCountPrint:
    "Uzun kelime sayısını yazdırmak için len(uzun_kelimeler) kullanmalısın.",
  missingLongWordsListPrint:
    "Uzun kelimeleri liste olarak da yazdırmalısın.",
  missingLongWordsPrint:
    "Sonucu ekrana yazdırmak için print(...) kullanmalısın.",
  missingTaskMarkList:
    "Bu görevde görevleri liste içinde tutmalısın.",
  missingTaskMarkDictFields:
    "Her görevi ad ve tamam alanları olan dict olarak yazmalısın.",
  missingTaskMarkAdField:
    "Her görev dict'inde ad alanı olmalı.",
  missingTaskMarkTamamField:
    "Her görev dict'inde tamam alanı olmalı.",
  missingTaskMarkBooleanNotString:
    "tamam değeri metin değil, boolean olmalı: True veya False.",
  missingTaskMarkFor:
    "Görevleri tek tek kontrol etmek için for döngüsü kullanmalısın.",
  missingTaskMarkIf:
    "Görev adına göre seçim yapmak için if koşulu kullanmalısın.",
  missingTaskMarkNameCompare:
    "Tamamlanacak görevi ad alanına göre bulmalısın.",
  missingTaskMarkTamamAssignment:
    "Eşleşen görevin tamam değerini True yapmalısın.",
  missingTaskMarkPrint:
    "Güncel görev listesini ekrana yazdırmak için print(...) kullanmalısın.",
  wrongCaseFor: "Python'da for küçük harfle yazılır: for",
  wrongCaseIf: "Python'da if küçük harfle yazılır: if",
  missingTaskTrackerAllFunctions:
    "Bu görevde ekle, listele, tamamla ve ozet fonksiyonlarını yazmalısın.",
  missingTaskTrackerEkle:
    "Görev eklemek için ekle(...) fonksiyonunu yazmalısın.",
  missingTaskTrackerListele:
    "Görevleri yazdırmak için listele(...) fonksiyonunu yazmalısın.",
  missingTaskTrackerTamamla:
    "Görev adına göre tamamlamak için tamamla(...) fonksiyonunu yazmalısın.",
  missingTaskTrackerOzet:
    "Toplam ve tamamlanan sayısını göstermek için ozet(...) fonksiyonunu yazmalısın.",
  missingTaskTrackerDict:
    "Görevleri ad ve tamam alanları olan dict olarak saklamalısın.",
  missingTaskTrackerBooleanNotString:
    "tamam değeri metin değil, boolean olmalı: True veya False.",
  missingTaskTrackerAppend:
    "Yeni görevi listeye eklemek için append(...) kullanmalısın.",
  missingTaskTrackerTamamlaIf:
    "Tamamlanacak görevi adına göre bulmak için if kullanmalısın.",
  missingTaskTrackerTamamAssignment:
    "Eşleşen görevin tamam değerini True yapmalısın.",
  missingTaskTrackerOzetLen:
    "Toplam görev sayısını bulmak için len(...) kullanmalısın.",
  missingTaskTrackerOzetCompletedCount:
    "ozet fonksiyonunda tamamlanan görev sayısını da hesaplamalısın.",
  missingTaskTrackerExampleUsage:
    "Fonksiyonları örnek bir görev listesiyle çağırmalısın.",
  wrongCaseSplit:
    "Python'da split küçük harfle yazılır: split()",
  wrongCaseLen:
    "Python'da len küçük harfle yazılır: len(...)",
  missingHabitDictList:
    "Bu görevde birden fazla alışkanlığı dict olarak liste içinde yazmalısın.",
  missingHabitDictFields:
    "Her dict içinde ad ve tamamlandi alanları olmalı.",
  missingHabitDictBooleanNotString:
    "tamamlandi değeri metin değil, boolean olmalı: True veya False.",
  missingHabitCompletionList:
    "Bu görevde alışkanlıkları liste içinde tutmalısın.",
  missingHabitCompletionDictFields:
    "Her alışkanlığı ad ve tamamlandi alanları olan dict olarak yazmalısın.",
  missingHabitCompletionForLoop:
    "Tamamlanan alışkanlıkları saymak için for döngüsü kullanmalısın.",
  missingHabitCompletionIfCheck:
    "tamamlandi değerini kontrol etmek için if kullanmalısın.",
  missingHabitCompletionLen:
    "Toplam alışkanlık sayısını bulmak için len(...) kullanmalısın.",
  missingHabitCompletionPercentage:
    "Yüzde hesabı için tamamlanan sayısını toplam sayıya bölüp 100 ile çarpmalısın.",
  missingHabitCompletionFString:
    "Sonucu göstermek için f-string kullanmalısın.",
  missingHabitCompletionPrint:
    "Yüzde sonucunu ekrana yazdırmak için print(...) kullanmalısın.",
  missingHabitTrackerFunction:
    "Bu görevde ozet_yazdir(...) adlı bir fonksiyon tanımlamalısın.",
  missingHabitTrackerParam:
    "ozet_yazdir fonksiyonu görev listesini parametre olarak almalı.",
  missingHabitTrackerDictStructure:
    "Görevleri ad ve tamamlandi alanları olan dict'lerden oluşan bir listeyle temsil etmelisin.",
  missingHabitTrackerLen:
    "Toplam görev sayısını bulmak için len(...) kullanmalısın.",
  missingHabitTrackerForLoop:
    "Tamamlanan görevleri saymak için for döngüsü kullanmalısın.",
  missingHabitTrackerIfCheck:
    "tamamlandi değerini kontrol etmek için if kullanmalısın.",
  missingHabitTrackerPercentage:
    "Yüzde hesabı için tamamlanan sayısını toplam sayıya bölüp 100 ile çarpmalısın.",
  missingHabitTrackerFString:
    "Sonuçları göstermek için f-string kullanmalısın.",
  missingHabitTrackerPrint:
    "Toplam, tamamlanan ve yüzde değerlerini print(...) ile yazdırmalısın.",
  missingHabitTrackerCall:
    "Yazdığın ozet_yazdir(...) fonksiyonunu görev listesiyle çağırmalısın.",
  missingListLoopDefinition:
    "Bu görevde bir liste oluşturmalısın.",
  missingListLoopAppend:
    "Listeye ürün eklemek için append() kullanmalısın.",
  missingListLoopAppendCount:
    "Bu görevde listeye en az 2 ürün eklemelisin.",
  missingListLoopFor:
    "Her ürünü ayrı satırda yazdırmak için for döngüsü kullanmalısın.",
  missingListLoopForPrint:
    "Her ürünü yazdırmak için döngü içinde print(...) kullanmalısın.",
  missingListLoopLen:
    "Toplam ürün sayısını yazdırmak için len(liste) kullanmalısın.",
  missingListLoopPrint:
    "Listeyi ekrana yazdırmak için print(...) kullanmalısın.",
  missingSpendingListDefinition:
    "Bu görevde harcamaları köşeli parantezlerle bir liste içinde yazmalısın: [...]",
  missingSpendingListMinElements:
    "Bu görevde listede en az 3 harcama değeri olmalı.",
  missingSpendingSum:
    "Liste toplamını hesaplamak için sum(...) kullanmalısın.",
  missingSpendingSumTarget:
    "sum(...) içinde oluşturduğun harcama listesini kullanmalısın.",
  missingSpendingPrint:
    "Toplam harcamayı ekrana yazdırmak için print(...) kullanmalısın.",
  wrongCaseSum:
    "Python'da sum küçük harfle yazılır: sum(...)",
  missingSpendingReportSum:
    "Toplam harcamayı hesaplamak için sum(...) kullanmalısın.",
  missingSpendingReportAverage:
    "Ortalama harcamayı bulmak için toplamı eleman sayısına bölmelisin: toplam / len(liste)",
  missingSpendingReportMax:
    "En yüksek harcamayı bulmak için max(...) kullanmalısın.",
  missingSpendingReportPrint:
    "Toplam, ortalama ve en yüksek harcamayı ekrana yazdırmak için print(...) kullanmalısın.",
  missingSpendingReportOutputs:
    "Bu görevde toplam, ortalama ve en yüksek harcamayı ayrı ayrı yazdırmalısın.",
  wrongCaseReportBuiltins:
    "Python'da sum, len ve max küçük harfle yazılır.",
  missingFunctionDef:
    "Bu görevde def ile bir fonksiyon tanımlamalısın.",
  missingFunctionParam:
    "Fonksiyonun bir isim parametresi almalı.",
  missingFunctionReturn:
    "Bu görevde fonksiyon sonucu return ile döndürmeli.",
  missingFunctionParamInReturn:
    "Selamlamada fonksiyona gelen ismi kullanmalısın.",
  missingFunctionGreeting:
    "Fonksiyonun 'Merhaba' ile başlayan bir selamlama döndürmeli.",
  missingFunctionCall:
    "Fonksiyonu bir isim vererek çağırmalısın.",
  missingFunctionPrint:
    "Fonksiyon sonucunu ekrana yazdırmak için print(...) kullanmalısın.",
  missingMathFunctionTwoParams:
    "Fonksiyon iki sayı parametresi almalı.",
  missingMathFunctionReturn:
    "Bu görevde sonucu return ile döndürmelisin.",
  missingMathFunctionCall:
    "Yazdığın fonksiyonu örnek iki sayı ile çağırmalısın.",
  missingBooleanHelperParam:
    "Fonksiyon bir sayı parametresi almalı.",
  missingBooleanHelperModulo:
    "Sayının çift olup olmadığını kontrol etmek için % 2 kullanmalısın.",
  missingBooleanHelperBooleanCheck:
    "Fonksiyon True veya False döndüren bir kontrol yapmalı.",
  missingBooleanHelperReturn:
    "Bu görevde sonucu return ile döndürmelisin.",
  missingBooleanHelperCall:
    "Yazdığın fonksiyonu örnek bir sayı ile çağırmalısın.",
  missingTwoFunctions:
    "Bu görevde iki farklı fonksiyon tanımlamalısın.",
  missingGreetingOneParam:
    "selamla fonksiyonu bir isim parametresi almalı.",
  missingGreetingTwoParam:
    "resmi_selam fonksiyonu isim ve soyisim olmak üzere iki parametre almalı.",
  missingTwoFunctionReturn:
    "Bu görevde fonksiyonlar sonucu return ile döndürmeli.",
  missingTwoFunctionParamInReturn:
    "Fonksiyonun döndürdüğü metinde gelen parametreleri kullanmalısın.",
  missingTwoFunctionCall:
    "Yazdığın fonksiyonları örnek değerlerle çağırmalısın.",
  missingTwoFunctionPrint:
    "Fonksiyon sonuçlarını ekrana yazdırmak için print(...) kullanmalısın.",
  undefinedFunctionFStringVariable:
    "f-string içinde yalnızca tanımladığın değişkenleri veya fonksiyon parametrelerini kullanmalısın.",
  missingQuizFunction:
    "Bu görevde soru_sor(...) benzeri bir fonksiyon tanımlamalısın.",
  missingQuizTwoParams:
    "soru_sor fonksiyonu soru metni ve doğru cevap için iki parametre almalı.",
  missingQuizInput:
    "Her soru için kullanıcı cevabını almak üzere input() kullanmalısın.",
  missingQuizIf:
    "Kullanıcının cevabını doğru cevapla karşılaştırmak için if kullanmalısın.",
  missingQuizTwoCalls:
    "Bu görevde soru_sor(...) fonksiyonunu en az 2 kez çağırmalısın.",
  missingQuizEndingMessage:
    "Quiz sonunda bir bitiş mesajı yazdırmalısın.",
  missingQuizPrint:
    "Sonuçları ekrana yazdırmak için print(...) kullanmalısın.",
  undefinedQuizFStringVariable:
    "f-string içinde yalnızca tanımladığın değişkenleri veya fonksiyon parametrelerini kullanmalısın.",
  missingScoreCalculatorFunctionDef:
    "Bu görevde def ile bir puan hesaplama fonksiyonu yazmalısın.",
  missingScoreCalculatorTwoParams:
    "Fonksiyon dogru ve yanlis olmak üzere iki değer almalı.",
  missingScoreCalculation:
    "Puanı hesaplamak için doğru sayısından puan kazanıp yanlış sayısından puan düşmelisin.",
  missingScoreNegativeClamp:
    "Negatif puanı 0'a sabitlemek için if kontrolü veya max(0, puan) kullanmalısın.",
  missingScoreCalculatorReturn:
    "Hesaplanan puanı return ile döndürmelisin.",
  missingScoreCalculatorPrint:
    "Fonksiyon sonucunu ekrana yazdırmak için print(...) kullanmalısın.",
  default:
    "Henüz tam değil. Görevi tekrar oku ve küçük bir düzenleme daha dene.",
};

type HintKey = keyof typeof DEFAULT_HINTS;

const QUOTED_PRINT_LINE =
  /^\s*print\s*\(\s*(["'])([\s\S]*?)\1\s*\)\s*$/;
const FSTRING_PRINT_LINE_PARSE =
  /^\s*print\s*\(\s*f(["'])([\s\S]*?)\1\s*\)\s*$/;
const FSTRING_VAR_REF = /\{([a-zA-Z_]\w*)\}/g;
const EMPTY_PRINT_LINE = /^\s*print\s*\(\s*\)\s*$/;
const ASSIGNMENT_LINE = /^\s*[a-zA-Z_]\w*\s*=/;
const VARIABLE_PRINT_LINE = /^\s*print\s*\(\s*[a-zA-Z_]\w*\s*\)\s*$/;
const ASSIGNMENT_LINE_PARSE = /^\s*([a-zA-Z_]\w*)\s*=\s*(.*)$/;

const ASSIGNMENT_VALUE_SKIP = new Set(["True", "False", "None"]);

function looksLikeSolution(text: string): boolean {
  return SOLUTION_LEAK_PATTERN.test(text);
}

function pickHint(
  validation: StepValidation | undefined,
  key: HintKey,
): string {
  const fromHints = validation?.hints?.[key];
  if (fromHints && !looksLikeSolution(fromHints)) {
    return fromHints;
  }

  const legacy = validation?.hint;
  if (legacy && !looksLikeSolution(legacy)) {
    return legacy;
  }

  return DEFAULT_HINTS[key];
}

function printCountHintKey(count: number): HintKey {
  if (count >= 3) return "missingPrintCount3";
  return "missingPrintCount";
}

function isJunkInput(trimmed: string): boolean {
  const normalized = trimmed.toLowerCase().replace(/\s+/g, " ").trim();

  if (JUNK_EXACT.has(normalized)) {
    return true;
  }

  if (normalized.length <= 12 && !PYTHON_INDICATORS.test(trimmed)) {
    const words = normalized.split(/\s+/);
    if (words.length === 1 && /^[a-zçğıöşü]+$/i.test(words[0]!)) {
      return true;
    }
  }

  return false;
}

function looksLikePythonCode(input: string): boolean {
  return PYTHON_INDICATORS.test(input);
}

function countNonEmptyLines(input: string): number {
  return input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean).length;
}

function hasEmptyPrint(input: string): boolean {
  return /print\s*\(\s*\)/i.test(input);
}

function hasConsoleLog(input: string): boolean {
  return /console\.log\s*\(/i.test(input);
}

function isLoneKeyword(input: string): boolean {
  const normalized = input.trim().replace(/\s+/g, " ");
  return LONE_KEYWORD_PATTERN.test(normalized);
}

function isBareAssignmentFragment(input: string): boolean {
  if (/^\s*=\s*["']/.test(input)) return true;
  if (/^\s*[a-zA-Z_]\w*\s*=\s*$/m.test(input)) return true;
  return false;
}

function hasWrongCaseInput(input: string): boolean {
  const matches = [...input.matchAll(/([a-zA-Z_]\w*)\s*\(/g)];
  for (const match of matches) {
    const name = match[1] ?? "";
    if (name.toLowerCase() === "input" && name !== "input") {
      return true;
    }
  }
  return false;
}

function countInputCalls(input: string): number {
  return (input.match(/\binput\s*\(/g) ?? []).length;
}

function countConvertedInputCalls(input: string): number {
  return (input.match(/\b(?:int|float)\s*\(\s*input\s*\(/gi) ?? []).length;
}

function hasEmptyInputPrompt(input: string): boolean {
  return /\binput\s*\(\s*\)/.test(input);
}

function hasAdditionOutsideStrings(input: string): boolean {
  const withoutStrings = stripStringLiterals(input);
  return /\+/.test(withoutStrings);
}

function stripStringLiterals(input: string): string {
  return input.replace(/(["'])(?:\\.|(?!\1)[\s\S])*?\1/g, "");
}

function collectBirthYearVariables(input: string): string[] {
  const vars: string[] = [];
  for (const line of nonEmptyLines(input)) {
    const match = line.match(
      /^\s*([a-zA-Z_]\w*)\s*=\s*(?:int|float)\s*\(\s*input\s*\(/i,
    );
    if (match) {
      vars.push(match[1] ?? "");
    }
  }
  return vars;
}

function expressionUsesBirthYearInSubtraction(
  expr: string,
  birthYearVars: string[],
): boolean {
  const stripped = stripStringLiterals(expr);
  if (!/-/.test(stripped)) {
    return false;
  }
  return birthYearVars.some((varName) =>
    new RegExp(`\\b${varName}\\b`).test(stripped),
  );
}

function hasAgeSubtraction(input: string, birthYearVars: string[]): boolean {
  if (birthYearVars.length === 0) {
    return false;
  }

  for (const line of nonEmptyLines(input)) {
    const assignMatch = line.match(/^\s*[a-zA-Z_]\w*\s*=\s*(.+)$/);
    if (
      assignMatch &&
      expressionUsesBirthYearInSubtraction(assignMatch[1] ?? "", birthYearVars)
    ) {
      return true;
    }

    const printMatch = line.match(/print\s*\(([\s\S]*)\)\s*$/i);
    if (
      printMatch &&
      expressionUsesBirthYearInSubtraction(printMatch[1] ?? "", birthYearVars)
    ) {
      return true;
    }
  }

  return false;
}

function collectAgeResultVariables(
  input: string,
  birthYearVars: string[],
): Set<string> {
  const ageVars = new Set<string>();
  for (const line of nonEmptyLines(input)) {
    const match = line.match(/^\s*([a-zA-Z_]\w*)\s*=\s*(.+)$/);
    if (!match) continue;

    const name = match[1] ?? "";
    if (birthYearVars.includes(name)) continue;

    if (expressionUsesBirthYearInSubtraction(match[2] ?? "", birthYearVars)) {
      ageVars.add(name);
    }
  }
  return ageVars;
}

function printShowsAgeResult(
  input: string,
  birthYearVars: string[],
  ageVars: Set<string>,
): boolean {
  for (const line of nonEmptyLines(input)) {
    if (!/\bprint\s*\(/i.test(line)) continue;

    const match = line.match(/print\s*\(([\s\S]*)\)\s*$/i);
    if (!match) continue;

    const args = match[1] ?? "";
    if (expressionUsesBirthYearInSubtraction(args, birthYearVars)) {
      return true;
    }

    const strippedArgs = stripStringLiteralsFromArgs(args);
    for (const ageVar of ageVars) {
      if (new RegExp(`\\b${ageVar}\\b`).test(strippedArgs)) {
        return true;
      }
    }
  }

  return false;
}

function collectPlainInputVariables(input: string): string[] {
  const vars: string[] = [];
  for (const line of nonEmptyLines(input)) {
    if (/^\s*[a-zA-Z_]\w*\s*=\s*(?:int|float)\s*\(\s*input/i.test(line)) {
      continue;
    }
    const match = line.match(/^\s*([a-zA-Z_]\w*)\s*=\s*input\s*\(/i);
    if (match) {
      vars.push(match[1] ?? "");
    }
  }
  return vars;
}

function findFStringPrintContent(input: string): string | null {
  for (const line of nonEmptyLines(input)) {
    const match = line.match(FSTRING_PRINT_LINE_PARSE);
    if (match) {
      return match[2] ?? "";
    }
  }
  return null;
}

function fStringReferencesVar(content: string, varNames: string[]): boolean {
  const refs = [...content.matchAll(FSTRING_VAR_REF)].map((m) => m[1] ?? "");
  return varNames.some((name) => refs.includes(name));
}

function fStringHasAgeExpression(
  content: string,
  birthYearVars: string[],
  ageVars: Set<string>,
): boolean {
  if (fStringReferencesVar(content, [...ageVars])) {
    return true;
  }

  const expressions = [...content.matchAll(/\{([^}]+)\}/g)];
  for (const match of expressions) {
    const expr = (match[1] ?? "").trim();
    if ([...ageVars].includes(expr)) {
      return true;
    }
    if (expressionUsesBirthYearInSubtraction(expr, birthYearVars)) {
      return true;
    }
  }

  return false;
}

function hasAgeCalculation(
  input: string,
  birthYearVars: string[],
): boolean {
  if (hasAgeSubtraction(input, birthYearVars)) {
    return true;
  }

  const fContent = findFStringPrintContent(input);
  if (!fContent || birthYearVars.length === 0) {
    return false;
  }

  const expressions = [...fContent.matchAll(/\{([^}]+)\}/g)];
  for (const match of expressions) {
    if (expressionUsesBirthYearInSubtraction(match[1] ?? "", birthYearVars)) {
      return true;
    }
  }

  return false;
}

function hasPrintCall(input: string): boolean {
  return /\bprint\s*\(/.test(input);
}

function validateInputSumTwoNumbersMode(
  input: string,
  rules: StepValidation,
): ValidationResult {
  if (hasWrongCaseInput(input)) {
    return { valid: false, message: pickHint(rules, "wrongCaseInput") };
  }

  const inputCount = countInputCalls(input);
  if (inputCount < 2) {
    return { valid: false, message: pickHint(rules, "missingInputCount") };
  }

  if (hasEmptyInputPrompt(input)) {
    return { valid: false, message: pickHint(rules, "missingInputPrompt") };
  }

  const convertedCount = countConvertedInputCalls(input);
  if (convertedCount < inputCount) {
    return { valid: false, message: pickHint(rules, "missingInputConversion") };
  }

  if (!hasPrintCall(input)) {
    return { valid: false, message: pickHint(rules, "missingInputSumPrint") };
  }

  if (!hasAdditionOutsideStrings(input)) {
    return { valid: false, message: pickHint(rules, "missingAddition") };
  }

  return { valid: true };
}

function validateAgeCalculatorBasicMode(
  input: string,
  rules: StepValidation,
): ValidationResult {
  if (hasWrongCaseInput(input)) {
    return { valid: false, message: pickHint(rules, "wrongCaseInput") };
  }

  const inputCount = countInputCalls(input);
  if (inputCount < 1) {
    return { valid: false, message: pickHint(rules, "missingAgeInput") };
  }

  const birthYearVars = collectBirthYearVariables(input);
  const convertedCount = countConvertedInputCalls(input);
  if (convertedCount < 1 || birthYearVars.length === 0) {
    return {
      valid: false,
      message: pickHint(rules, "missingAgeInputConversion"),
    };
  }

  if (!hasAgeSubtraction(input, birthYearVars)) {
    return { valid: false, message: pickHint(rules, "missingAgeSubtraction") };
  }

  if (!hasPrintCall(input)) {
    return { valid: false, message: pickHint(rules, "missingAgePrint") };
  }

  const ageVars = collectAgeResultVariables(input, birthYearVars);
  if (!printShowsAgeResult(input, birthYearVars, ageVars)) {
    return { valid: false, message: pickHint(rules, "missingAgeSubtraction") };
  }

  return { valid: true };
}

function validatePersonalizedAgeOutputMode(
  input: string,
  rules: StepValidation,
): ValidationResult {
  if (hasWrongCaseInput(input)) {
    return { valid: false, message: pickHint(rules, "wrongCaseInput") };
  }

  const nameVars = collectPlainInputVariables(input);
  const birthYearVars = collectBirthYearVariables(input);
  const inputCount = countInputCalls(input);

  if (nameVars.length === 0) {
    return {
      valid: false,
      message: pickHint(rules, "missingPersonalizedNameInput"),
    };
  }

  if (inputCount < 2) {
    return {
      valid: false,
      message: pickHint(rules, "missingPersonalizedBirthYearInput"),
    };
  }

  if (birthYearVars.length === 0) {
    return {
      valid: false,
      message: pickHint(rules, "missingPersonalizedInputConversion"),
    };
  }

  if (!hasPrintCall(input)) {
    return { valid: false, message: pickHint(rules, "missingPersonalizedPrint") };
  }

  const fContent = findFStringPrintContent(input);
  if (!fContent) {
    return { valid: false, message: pickHint(rules, "missingFString") };
  }

  if (!fStringReferencesVar(fContent, nameVars)) {
    return {
      valid: false,
      message: pickHint(rules, "missingPersonalizedFStringName"),
    };
  }

  const ageVars = collectAgeResultVariables(input, birthYearVars);
  if (!fStringHasAgeExpression(fContent, birthYearVars, ageVars)) {
    return {
      valid: false,
      message: pickHint(rules, "missingPersonalizedFStringAge"),
    };
  }

  if (!hasAgeCalculation(input, birthYearVars)) {
    return {
      valid: false,
      message: pickHint(rules, "missingPersonalizedAgeSubtraction"),
    };
  }

  if (!/merhaba/i.test(fContent) || !/yaşın|yasin/i.test(fContent)) {
    return {
      valid: false,
      message: pickHint(rules, "missingPersonalizedFStringAge"),
    };
  }

  return { valid: true };
}

function hasIfStatement(input: string): boolean {
  return /^\s*if\s+/m.test(input);
}

function hasElifOrElse(input: string): boolean {
  return /^\s*elif\s+/m.test(input) || /^\s*else\s*:/m.test(input);
}

function isAgeInputLine(line: string): boolean {
  const trimmed = line.trim();
  return (
    /^(?:int|float)\s*\(\s*input\s*\(/i.test(trimmed) ||
    /^[a-zA-Z_]\w*\s*=\s*(?:int|float)\s*\(\s*input/i.test(trimmed)
  );
}

function collectPriceRuleSignatures(input: string): string[] {
  const rules: string[] = [];
  for (const line of nonEmptyLines(input)) {
    if (isAgeInputLine(line)) {
      continue;
    }

    const trimmed = line.trim();
    const assignMatch = trimmed.match(
      /^[a-zA-Z_]\w*\s*=\s*(-?\d+(?:\.\d+)?)\s*$/,
    );
    if (assignMatch) {
      rules.push(`num:${assignMatch[1] ?? "0"}`);
      continue;
    }

    const printNumMatch = trimmed.match(
      /^print\s*\(\s*(-?\d+(?:\.\d+)?)\s*[,)]/i,
    );
    if (printNumMatch) {
      rules.push(`num:${printNumMatch[1] ?? "0"}`);
      continue;
    }

    const printStrMatch = trimmed.match(/^print\s*\(\s*(["'])([\s\S]*?)\1/i);
    if (printStrMatch) {
      rules.push(`str:${printStrMatch[2] ?? ""}`);
    }
  }
  return rules;
}

function validateTicketPriceRulesMode(
  input: string,
  rules: StepValidation,
): ValidationResult {
  if (hasWrongCaseInput(input)) {
    return { valid: false, message: pickHint(rules, "wrongCaseInput") };
  }

  if (countInputCalls(input) < 1) {
    return { valid: false, message: pickHint(rules, "missingTicketAgeInput") };
  }

  if (countConvertedInputCalls(input) < 1) {
    return {
      valid: false,
      message: pickHint(rules, "missingTicketInputConversion"),
    };
  }

  if (!hasIfStatement(input)) {
    return { valid: false, message: pickHint(rules, "missingTicketIf") };
  }

  if (!hasElifOrElse(input)) {
    return { valid: false, message: pickHint(rules, "missingTicketSecondRule") };
  }

  if (!hasPrintCall(input)) {
    return { valid: false, message: pickHint(rules, "missingTicketPrint") };
  }

  const priceRules = collectPriceRuleSignatures(input);
  if (priceRules.length === 0) {
    return { valid: false, message: pickHint(rules, "missingTicketPriceValue") };
  }

  if (new Set(priceRules).size < 2) {
    return { valid: false, message: pickHint(rules, "missingTicketSecondRule") };
  }

  return { valid: true };
}

type ListDefinition = {
  varName: string;
  elementCount: number;
  numericElementCount: number;
  inner: string;
};

function hasWrongCaseAppend(input: string): boolean {
  const matches = [
    ...input.matchAll(/([a-zA-Z_]\w*)\s*\.\s*([a-zA-Z_]\w*)\s*\(/g),
  ];
  for (const match of matches) {
    const method = match[2] ?? "";
    if (method.toLowerCase() === "append" && method !== "append") {
      return true;
    }
  }
  return false;
}

function splitListElements(inner: string): string[] {
  const trimmed = inner.trim();
  if (!trimmed) {
    return [];
  }

  const elements: string[] = [];
  let current = "";
  let inString: string | null = null;

  for (let i = 0; i < trimmed.length; i++) {
    const ch = trimmed[i] ?? "";
    if (inString) {
      current += ch;
      if (ch === inString && trimmed[i - 1] !== "\\") {
        inString = null;
      }
      continue;
    }
    if (ch === '"' || ch === "'") {
      inString = ch;
      current += ch;
      continue;
    }
    if (ch === ",") {
      if (current.trim()) {
        elements.push(current.trim());
      }
      current = "";
      continue;
    }
    current += ch;
  }

  if (current.trim()) {
    elements.push(current.trim());
  }

  return elements;
}

function countListElements(inner: string): number {
  return splitListElements(inner).length;
}

function countNumericListElements(inner: string): number {
  return splitListElements(inner).filter((element) =>
    /^-?\d+(\.\d+)?$/.test(element.trim()),
  ).length;
}

function parseListDefinitions(input: string): ListDefinition[] {
  const defs: ListDefinition[] = [];
  for (const line of nonEmptyLines(input)) {
    const match = line.match(/^\s*([a-zA-Z_]\w*)\s*=\s*\[(.*)\]\s*$/);
    if (!match) {
      continue;
    }

    const inner = match[2] ?? "";
    defs.push({
      varName: match[1] ?? "",
      elementCount: countListElements(inner),
      numericElementCount: countNumericListElements(inner),
      inner,
    });
  }
  return defs;
}

function findAppendCalls(input: string): { varName: string }[] {
  const calls: { varName: string }[] = [];
  for (const line of nonEmptyLines(input)) {
    const match = line.match(/^\s*([a-zA-Z_]\w*)\s*\.\s*append\s*\(/i);
    if (match) {
      calls.push({ varName: match[1] ?? "" });
    }
  }
  return calls;
}

function printUsesListVar(input: string, varName: string): boolean {
  const pattern = new RegExp(
    `^\\s*print\\s*\\(\\s*${varName}\\s*\\)\\s*$`,
    "i",
  );
  return nonEmptyLines(input).some((line) => pattern.test(line));
}

function isValidListElement(element: string): boolean {
  const trimmed = element.trim();
  if (/^(["'])([\s\S]*)\1$/.test(trimmed)) {
    return true;
  }
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    return true;
  }
  return false;
}

function listInnerHasUnquotedElements(inner: string): boolean {
  const elements = splitListElements(inner);
  if (elements.length === 0) {
    return false;
  }
  return elements.some((element) => !isValidListElement(element));
}

function validateSimpleListAndPrintMode(
  input: string,
  rules: StepValidation,
): ValidationResult {
  const minElements = rules.minListElements ?? 3;
  const listDefs = parseListDefinitions(input);

  if (listDefs.length === 0) {
    return { valid: false, message: pickHint(rules, "missingListDefinition") };
  }

  for (const def of listDefs) {
    if (listInnerHasUnquotedElements(def.inner)) {
      return {
        valid: false,
        message: pickHint(rules, "missingSimpleListQuotedElements"),
      };
    }
  }

  const qualifiedLists = listDefs.filter((def) => def.elementCount >= minElements);
  if (qualifiedLists.length === 0) {
    return {
      valid: false,
      message: pickHint(rules, "missingSimpleListMinElements"),
    };
  }

  if (!hasPrintCall(input)) {
    return { valid: false, message: pickHint(rules, "missingListPrint") };
  }

  const printedList = qualifiedLists.find((def) =>
    printUsesListVar(input, def.varName),
  );
  if (!printedList) {
    return { valid: false, message: pickHint(rules, "missingListPrint") };
  }

  return { valid: true };
}

function hasStringListAssignment(input: string): boolean {
  return nonEmptyLines(input).some((line) => {
    if (/=\s*\[/.test(line)) return false;
    return /^\s*[a-zA-Z_]\w*\s*=\s*["']/.test(line);
  });
}

function hasMembershipPrintCheck(
  input: string,
  listVarNames: string[],
): boolean {
  const listVarSet = new Set(listVarNames);
  for (const line of nonEmptyLines(input)) {
    const argsMatch = line.match(/print\s*\(([\s\S]*)\)\s*$/i);
    if (!argsMatch) continue;
    const stripped = stripStringLiteralsFromArgs(argsMatch[1] ?? "");
    if (!/\bin\b/.test(stripped)) continue;
    const inMatch = stripped.match(/\bin\s+([a-zA-Z_]\w*)\b/);
    if (!inMatch?.[1]) continue;
    if (listVarSet.has(inMatch[1])) return true;
  }
  return false;
}

function validateListMembershipCheckMode(
  input: string,
  rules: StepValidation,
): ValidationResult {
  const listDefs = parseListDefinitions(input);

  if (listDefs.length === 0) {
    if (hasStringListAssignment(input)) {
      return {
        valid: false,
        message: pickHint(rules, "missingListMembershipNotString"),
      };
    }
    return {
      valid: false,
      message: pickHint(rules, "missingListMembershipDefinition"),
    };
  }

  for (const def of listDefs) {
    if (listInnerHasUnquotedElements(def.inner)) {
      return {
        valid: false,
        message: pickHint(rules, "missingListMembershipQuotedElements"),
      };
    }
  }

  const listVarNames = listDefs.map((def) => def.varName);

  if (!hasPrintCall(input)) {
    return {
      valid: false,
      message: pickHint(rules, "missingListMembershipPrint"),
    };
  }

  if (!hasMembershipPrintCheck(input, listVarNames)) {
    return {
      valid: false,
      message: pickHint(rules, "missingListMembershipIn"),
    };
  }

  return { valid: true };
}

function getDictKeyValue(dictStr: string, key: string): string | null {
  const match = dictStr.match(new RegExp(`["']${key}["']\\s*:\\s*([^,}]+)`));
  return match?.[1]?.trim() ?? null;
}

function isNumericGradeValue(value: string): boolean {
  const trimmed = value.trim();
  if (/^["']/.test(trimmed)) return false;
  return /^-?\d+(\.\d+)?$/.test(trimmed);
}

function findStudentDictList(
  input: string,
): { varName: string; dicts: string[] } | null {
  for (const assignment of extractBracketListAssignments(input)) {
    const dicts = splitDictElements(assignment.inner);
    if (dicts.length > 0) {
      return { varName: assignment.varName, dicts };
    }
  }
  return null;
}

function hasGradeTotalCalculation(input: string): boolean {
  if (!/\[["']not["']\]/i.test(input)) return false;
  const stripped = stripStringLiterals(input);
  if (/\+\s*=/.test(stripped)) return true;
  if (/=\s*\w+\s*\+/.test(stripped)) return true;
  if (/\bsum\s*\(/i.test(stripped)) return true;
  return false;
}

function hasStudentGradeAverageCalculation(input: string): boolean {
  const stripped = stripStringLiterals(input);
  return /\//.test(stripped) && /\blen\s*\(/i.test(stripped);
}

function printsAverageResult(input: string): boolean {
  for (const line of nonEmptyLines(input)) {
    const argsMatch = line.match(/print\s*\(([\s\S]*)\)\s*$/i);
    if (!argsMatch) continue;
    const args = argsMatch[1] ?? "";
    const stripped = stripStringLiteralsFromArgs(args).trim();
    if (/\/\s*len\s*\(/i.test(stripped)) return true;
    if (/\bortalama\b/i.test(stripped)) return true;
    if (/f["']/.test(args) && /\/\s*len\s*\(/i.test(args)) return true;
  }
  return false;
}

function validateStudentGradeAverageMode(
  input: string,
  rules: StepValidation,
): ValidationResult {
  const studentList = findStudentDictList(input);
  if (!studentList) {
    return {
      valid: false,
      message: pickHint(rules, "missingStudentGradeList"),
    };
  }

  if (studentList.dicts.length < 2) {
    return {
      valid: false,
      message: pickHint(rules, "missingStudentGradeMinCount"),
    };
  }

  for (const dictStr of studentList.dicts) {
    const hasAd = hasDictKey(dictStr, "ad");
    const hasNot = hasDictKey(dictStr, "not");

    if (!hasAd || !hasNot) {
      if (hasAd && !hasNot) {
        return {
          valid: false,
          message: pickHint(rules, "missingStudentGradeNotField"),
        };
      }
      return {
        valid: false,
        message: pickHint(rules, "missingStudentGradeDictFields"),
      };
    }

    const notValue = getDictKeyValue(dictStr, "not");
    if (!notValue || !isNumericGradeValue(notValue)) {
      return {
        valid: false,
        message: pickHint(rules, "missingStudentGradeNumericNot"),
      };
    }
  }

  if (!hasGradeTotalCalculation(input) && !hasStudentGradeAverageCalculation(input)) {
    return {
      valid: false,
      message: pickHint(rules, "missingStudentGradeTotal"),
    };
  }

  if (!hasStudentGradeAverageCalculation(input)) {
    return {
      valid: false,
      message: pickHint(rules, "missingStudentGradeAverage"),
    };
  }

  if (!hasGradeTotalCalculation(input)) {
    if (!/\bsum\s*\(/i.test(input) || !/\[["']not["']\]/i.test(input)) {
      return {
        valid: false,
        message: pickHint(rules, "missingStudentGradeTotal"),
      };
    }
  }

  if (!hasLenCall(input)) {
    return {
      valid: false,
      message: pickHint(rules, "missingStudentGradeLen"),
    };
  }

  if (!hasPrintCall(input)) {
    return {
      valid: false,
      message: pickHint(rules, "missingStudentGradePrint"),
    };
  }

  if (!printsAverageResult(input)) {
    return {
      valid: false,
      message: pickHint(rules, "missingStudentGradeAverage"),
    };
  }

  return { valid: true };
}

function findExpenseDictList(
  input: string,
): { varName: string; dicts: string[] } | null {
  for (const assignment of extractBracketListAssignments(input)) {
    const dicts = splitDictElements(assignment.inner);
    if (dicts.length > 0) {
      return { varName: assignment.varName, dicts };
    }
  }
  return null;
}

function isNumericTutarValue(value: string): boolean {
  return isNumericGradeValue(value);
}

function hasExpenseIteration(input: string): boolean {
  if (/^\s*for\s+/im.test(input)) return true;
  if (/\bfor\b/.test(input) && /\bsum\s*\(/i.test(input)) return true;
  return false;
}

function hasCategoryIfCheck(input: string): boolean {
  return /\bif\b[\s\S]*\[["']kategori["']\]/i.test(input);
}

function hasCategoryFilterComparison(input: string): boolean {
  return /\[["']kategori["']\]\s*==\s*["']/.test(input);
}

function hasFilteredTutarTotal(input: string): boolean {
  if (!/\[["']tutar["']\]/i.test(input)) return false;
  if (!hasCategoryFilterComparison(input)) return false;
  const stripped = stripStringLiterals(input);
  if (/\+\s*=/.test(stripped)) return true;
  if (/=\s*\w+\s*\+/.test(stripped)) return true;
  if (/\bsum\s*\(/i.test(stripped)) return true;
  return false;
}

function printsCategoryTotalResult(
  input: string,
  listVarName: string,
): boolean {
  for (const line of nonEmptyLines(input)) {
    const argsMatch = line.match(/print\s*\(([\s\S]*)\)\s*$/i);
    if (!argsMatch) continue;
    const args = argsMatch[1] ?? "";
    const stripped = stripStringLiteralsFromArgs(args).trim();
    if (new RegExp(`^${listVarName}\\s*$`, "i").test(stripped)) {
      return false;
    }
    return true;
  }
  return false;
}

function validateCategorySpendingTotalMode(
  input: string,
  rules: StepValidation,
): ValidationResult {
  const expenseList = findExpenseDictList(input);
  if (!expenseList) {
    return {
      valid: false,
      message: pickHint(rules, "missingCategorySpendingList"),
    };
  }

  if (expenseList.dicts.length < 2) {
    return {
      valid: false,
      message: pickHint(rules, "missingCategorySpendingMinCount"),
    };
  }

  for (const dictStr of expenseList.dicts) {
    const hasKategori = hasDictKey(dictStr, "kategori");
    const hasTutar = hasDictKey(dictStr, "tutar");

    if (!hasKategori && !hasTutar) {
      return {
        valid: false,
        message: pickHint(rules, "missingCategorySpendingDictFields"),
      };
    }
    if (!hasKategori) {
      return {
        valid: false,
        message: pickHint(rules, "missingCategorySpendingKategoriField"),
      };
    }
    if (!hasTutar) {
      return {
        valid: false,
        message: pickHint(rules, "missingCategorySpendingTutarField"),
      };
    }

    const tutarValue = getDictKeyValue(dictStr, "tutar");
    if (!tutarValue || !isNumericTutarValue(tutarValue)) {
      return {
        valid: false,
        message: pickHint(rules, "missingCategorySpendingNumericTutar"),
      };
    }
  }

  if (!hasExpenseIteration(input)) {
    return {
      valid: false,
      message: pickHint(rules, "missingCategorySpendingForLoop"),
    };
  }

  if (!hasCategoryIfCheck(input)) {
    return {
      valid: false,
      message: pickHint(rules, "missingCategorySpendingIf"),
    };
  }

  if (!hasCategoryFilterComparison(input)) {
    return {
      valid: false,
      message: pickHint(rules, "missingCategorySpendingFilter"),
    };
  }

  if (!hasFilteredTutarTotal(input)) {
    return {
      valid: false,
      message: pickHint(rules, "missingCategorySpendingTotal"),
    };
  }

  if (!hasPrintCall(input)) {
    return {
      valid: false,
      message: pickHint(rules, "missingCategorySpendingPrint"),
    };
  }

  if (!printsCategoryTotalResult(input, expenseList.varName)) {
    return {
      valid: false,
      message: pickHint(rules, "missingCategorySpendingFilter"),
    };
  }

  return { valid: true };
}

function hasWrongCaseStripMethod(input: string): boolean {
  return /\.Strip\s*\(/.test(input);
}

function hasWrongCaseLowerMethod(input: string): boolean {
  return /\.Lower\s*\(/.test(input);
}

function hasInputVariableAssignment(input: string): boolean {
  return /^\s*[a-zA-Z_]\w*\s*=\s*input\s*\(/m.test(input);
}

function hasStripMethod(input: string): boolean {
  return /\.strip\s*\(/.test(input);
}

function hasLowerMethod(input: string): boolean {
  return /\.lower\s*\(/.test(input);
}

function validateInputNormalizeStripLowerMode(
  input: string,
  rules: StepValidation,
): ValidationResult {
  if (hasWrongCaseInput(input)) {
    return { valid: false, message: pickHint(rules, "wrongCaseInput") };
  }
  if (hasWrongCaseStripMethod(input)) {
    return { valid: false, message: pickHint(rules, "wrongCaseStrip") };
  }
  if (hasWrongCaseLowerMethod(input)) {
    return { valid: false, message: pickHint(rules, "wrongCaseLower") };
  }

  if (!/\binput\s*\(/i.test(input) || !hasInputVariableAssignment(input)) {
    return {
      valid: false,
      message: pickHint(rules, "missingInputNormalizeInput"),
    };
  }

  if (!hasStripMethod(input)) {
    return {
      valid: false,
      message: pickHint(rules, "missingInputNormalizeStrip"),
    };
  }

  if (!hasLowerMethod(input)) {
    return {
      valid: false,
      message: pickHint(rules, "missingInputNormalizeLower"),
    };
  }

  if (!hasPrintCall(input)) {
    return {
      valid: false,
      message: pickHint(rules, "missingInputNormalizePrint"),
    };
  }

  return { valid: true };
}

function hasWrongCaseSplitMethod(input: string): boolean {
  return /\.Split\s*\(/.test(input);
}

function hasSplitMethod(input: string): boolean {
  return /\.split\s*\(/.test(input);
}

function variableAssignedFromSplit(input: string, varName: string): boolean {
  return new RegExp(`\\b${varName}\\s*=\\s*\\w+\\.split\\s*\\(`).test(input);
}

function printsWordCount(input: string): boolean {
  for (const line of nonEmptyLines(input)) {
    const argsMatch = line.match(/print\s*\(([\s\S]*)\)\s*$/i);
    if (!argsMatch) continue;
    const args = argsMatch[1] ?? "";
    if (/len\s*\([^)]*\.split\s*\(/i.test(args)) {
      return true;
    }
    const lenVarMatch = args.match(/len\s*\(\s*([a-zA-Z_]\w*)\s*\)/);
    if (lenVarMatch?.[1] && variableAssignedFromSplit(input, lenVarMatch[1])) {
      return true;
    }
  }
  return false;
}

function hasLenOnRawInputVariable(input: string): boolean {
  for (const line of nonEmptyLines(input)) {
    if (!/len\s*\(/i.test(line) || /\.split\s*\(/i.test(line)) {
      continue;
    }
    const lenMatch = line.match(/len\s*\(\s*([a-zA-Z_]\w*)\s*\)/);
    if (!lenMatch?.[1]) continue;
    const varName = lenMatch[1];
    const fromInput = new RegExp(`\\b${varName}\\s*=\\s*input\\s*\\(`).test(
      input,
    );
    if (fromInput && !variableAssignedFromSplit(input, varName)) {
      return true;
    }
  }
  return false;
}

function validateWordCountInputSplitLenMode(
  input: string,
  rules: StepValidation,
): ValidationResult {
  if (hasWrongCaseInput(input)) {
    return { valid: false, message: pickHint(rules, "wrongCaseInput") };
  }
  if (hasWrongCaseSplitMethod(input)) {
    return { valid: false, message: pickHint(rules, "wrongCaseSplit") };
  }
  if (hasWrongCaseBuiltin(input, "len")) {
    return { valid: false, message: pickHint(rules, "wrongCaseLen") };
  }

  if (!/\binput\s*\(/i.test(input)) {
    return {
      valid: false,
      message: pickHint(rules, "missingWordCountInput"),
    };
  }

  if (hasLenOnRawInputVariable(input)) {
    return {
      valid: false,
      message: pickHint(rules, "missingWordCountLenSplit"),
    };
  }

  if (!hasSplitMethod(input)) {
    return {
      valid: false,
      message: pickHint(rules, "missingWordCountSplit"),
    };
  }

  if (!hasPrintCall(input)) {
    return {
      valid: false,
      message: pickHint(rules, "missingWordCountPrint"),
    };
  }

  if (!printsWordCount(input)) {
    return {
      valid: false,
      message: pickHint(rules, "missingWordCountLenSplit"),
    };
  }

  if (!/\blen\s*\(/i.test(input)) {
    return {
      valid: false,
      message: pickHint(rules, "missingWordCountLen"),
    };
  }

  return { valid: true };
}

function hasLongWordsFilterComprehension(input: string): boolean {
  return /=\s*\[[^\]]*\bfor\b[^\]]*\bif\b[^\]]*len\s*\([^)]+\)\s*>\s*5[^\]]*\]/i.test(
    input,
  );
}

function hasLongWordLengthCheck(input: string): boolean {
  return /len\s*\([^)]+\)\s*>\s*5/i.test(input);
}

function hasForLoopStatement(input: string): boolean {
  return /^\s*for\s+\w+\s+in\b/im.test(input);
}

function hasAppendMethod(input: string): boolean {
  return /\.append\s*\(/i.test(input);
}

function getFilteredLongWordsVars(input: string): Set<string> {
  const vars = new Set<string>();

  const compPattern =
    /([a-zA-Z_]\w*)\s*=\s*\[[^\]]*\bfor\b[^\]]*\bif\b[^\]]*len\s*\([^)]+\)\s*>\s*5[^\]]*\]/gi;
  let match: RegExpExecArray | null;
  while ((match = compPattern.exec(input)) !== null) {
    const varName = match[1];
    if (varName) {
      vars.add(varName);
    }
  }

  for (const emptyMatch of input.matchAll(/([a-zA-Z_]\w*)\s*=\s*\[\s*\]/g)) {
    const varName = emptyMatch[1] ?? "";
    if (!varName) continue;
    const appendRe = new RegExp(`\\b${varName}\\s*\\.append\\s*\\(`, "i");
    if (
      appendRe.test(input) &&
      hasLongWordLengthCheck(input) &&
      hasIfStatement(input)
    ) {
      vars.add(varName);
    }
  }

  return vars;
}

function printsLongWordCount(input: string): boolean {
  const filteredVars = getFilteredLongWordsVars(input);
  if (filteredVars.size === 0) return false;

  for (const line of nonEmptyLines(input)) {
    const argsMatch = line.match(/print\s*\(([\s\S]*)\)\s*$/i);
    if (!argsMatch) continue;
    const args = argsMatch[1] ?? "";
    for (const lenMatch of args.matchAll(/len\s*\(\s*([a-zA-Z_]\w*)\s*\)/gi)) {
      const varName = lenMatch[1] ?? "";
      if (filteredVars.has(varName)) {
        return true;
      }
    }
  }
  return false;
}

function printsLongWordsList(input: string): boolean {
  const filteredVars = getFilteredLongWordsVars(input);
  if (filteredVars.size === 0) return false;

  for (const line of nonEmptyLines(input)) {
    const argsMatch = line.match(/print\s*\(([\s\S]*)\)\s*$/i);
    if (!argsMatch) continue;
    const args = argsMatch[1] ?? "";
    const bareVarMatch = args.match(/^\s*([a-zA-Z_]\w*)\s*$/);
    if (bareVarMatch?.[1] && filteredVars.has(bareVarMatch[1])) {
      return true;
    }
  }
  return false;
}

function validateLongWordsFilterCountMode(
  input: string,
  rules: StepValidation,
): ValidationResult {
  const hasComprehension = hasLongWordsFilterComprehension(input);

  if (hasWrongCaseInput(input)) {
    return { valid: false, message: pickHint(rules, "wrongCaseInput") };
  }
  if (hasWrongCaseSplitMethod(input)) {
    return { valid: false, message: pickHint(rules, "wrongCaseSplit") };
  }
  if (hasWrongCaseBuiltin(input, "len")) {
    return { valid: false, message: pickHint(rules, "wrongCaseLen") };
  }
  if (hasWrongCaseAppend(input)) {
    return { valid: false, message: pickHint(rules, "wrongCaseAppend") };
  }
  if (hasWrongCasePrint(input)) {
    return { valid: false, message: pickHint(rules, "wrongCasePrint") };
  }

  if (!/\binput\s*\(/i.test(input)) {
    return {
      valid: false,
      message: pickHint(rules, "missingLongWordsInput"),
    };
  }

  if (!hasSplitMethod(input)) {
    return {
      valid: false,
      message: pickHint(rules, "missingLongWordsSplit"),
    };
  }

  if (!hasComprehension && !hasForLoopStatement(input)) {
    return {
      valid: false,
      message: pickHint(rules, "missingLongWordsFor"),
    };
  }

  if (!hasComprehension && !hasIfStatement(input)) {
    return {
      valid: false,
      message: pickHint(rules, "missingLongWordsIf"),
    };
  }

  if (!/\blen\s*\(/i.test(input)) {
    return {
      valid: false,
      message: pickHint(rules, "missingLongWordsLen"),
    };
  }

  if (!hasLongWordLengthCheck(input)) {
    return {
      valid: false,
      message: pickHint(rules, "missingLongWordsLengthCheck"),
    };
  }

  if (!hasPrintCall(input)) {
    return {
      valid: false,
      message: pickHint(rules, "missingLongWordsPrint"),
    };
  }

  if (!printsLongWordCount(input)) {
    return {
      valid: false,
      message: pickHint(rules, "missingLongWordsCountPrint"),
    };
  }

  if (!printsLongWordsList(input)) {
    return {
      valid: false,
      message: pickHint(rules, "missingLongWordsListPrint"),
    };
  }

  if (!hasComprehension && !hasAppendMethod(input)) {
    return {
      valid: false,
      message: pickHint(rules, "missingLongWordsAppend"),
    };
  }

  return { valid: true };
}

function extractBracketListAssignments(
  input: string,
): { varName: string; inner: string }[] {
  const results: { varName: string; inner: string }[] = [];
  const flat = input.replace(/\r\n/g, "\n");
  const pattern = /([a-zA-Z_]\w*)\s*=\s*\[/g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(flat)) !== null) {
    const varName = match[1] ?? "";
    const startBracket = match.index + match[0].length - 1;
    let depth = 0;
    let inString: string | null = null;
    let inner = "";

    for (let i = startBracket; i < flat.length; i++) {
      const ch = flat[i] ?? "";
      if (inString) {
        if (depth > 0) {
          inner += ch;
        }
        if (ch === inString && flat[i - 1] !== "\\") {
          inString = null;
        }
        continue;
      }
      if (ch === '"' || ch === "'") {
        inString = ch;
        if (depth > 0) {
          inner += ch;
        }
        continue;
      }
      if (ch === "[") {
        depth += 1;
        if (depth > 1) {
          inner += ch;
        }
        continue;
      }
      if (ch === "]") {
        depth -= 1;
        if (depth === 0) {
          results.push({ varName, inner });
          break;
        }
        inner += ch;
        continue;
      }
      if (depth > 0) {
        inner += ch;
      }
    }
  }

  return results;
}

function splitDictElements(inner: string): string[] {
  const elements: string[] = [];
  let current = "";
  let depth = 0;
  let inString: string | null = null;

  for (let i = 0; i < inner.length; i++) {
    const ch = inner[i] ?? "";
    if (inString) {
      current += ch;
      if (ch === inString && inner[i - 1] !== "\\") {
        inString = null;
      }
      continue;
    }
    if (ch === '"' || ch === "'") {
      inString = ch;
      current += ch;
      continue;
    }
    if (ch === "{") {
      depth += 1;
      current += ch;
      continue;
    }
    if (ch === "}") {
      depth -= 1;
      current += ch;
      continue;
    }
    if (ch === "," && depth === 0) {
      if (current.trim()) {
        elements.push(current.trim());
      }
      current = "";
      continue;
    }
    current += ch;
  }

  if (current.trim()) {
    elements.push(current.trim());
  }

  return elements.filter((element) => element.startsWith("{"));
}

function hasDictKey(dictStr: string, key: string): boolean {
  return new RegExp(`["']${key}["']\\s*:`).test(dictStr);
}

function getTamamlandiValue(dictStr: string): string | null {
  const match = dictStr.match(/["']tamamlandi["']\s*:\s*([^,}]+)/);
  return match?.[1]?.trim() ?? null;
}

function getTamamValue(dictStr: string): string | null {
  const match = dictStr.match(/["']tamam["']\s*:\s*([^,}]+)/);
  return match?.[1]?.trim() ?? null;
}

function validateTamamFieldValue(
  value: string,
  rules: StepValidation,
): ValidationResult | null {
  const trimmed = value.trim();
  if (trimmed === "True" || trimmed === "False") {
    return null;
  }
  if (trimmed === "true" || trimmed === "false") {
    return {
      valid: false,
      message: pickHint(rules, "invalidBooleanCase"),
    };
  }
  if (/^["']/.test(trimmed)) {
    return {
      valid: false,
      message: pickHint(rules, "missingTaskMarkBooleanNotString"),
    };
  }
  return {
    valid: false,
    message: pickHint(rules, "missingTaskMarkBooleanNotString"),
  };
}

function hasTaskNameComparison(input: string): boolean {
  return /\[["']ad["']\]\s*==/.test(input);
}

function hasTamamTrueAssignment(input: string): boolean {
  return /\[["']tamam["']\]\s*=\s*True\b/.test(input);
}

function hasInvalidTamamAssignment(input: string): boolean {
  return (
    /\[["']tamam["']\]\s*=\s*true\b/.test(input) ||
    /\[["']tamam["']\]\s*=\s*false\b/.test(input) ||
    /\[["']tamam["']\]\s*=\s*["']True["']/.test(input) ||
    /\[["']tamam["']\]\s*=\s*["']False["']/.test(input)
  );
}

function validateTaskMarkDictStructure(
  input: string,
  rules: StepValidation,
): ValidationResult | { listVar: string } {
  const minDicts = 2;
  const listAssignments = extractBracketListAssignments(input);

  if (listAssignments.length === 0) {
    return {
      valid: false,
      message: pickHint(rules, "missingTaskMarkList"),
    };
  }

  const qualifiedLists = listAssignments
    .map((assignment) => ({
      ...assignment,
      dicts: splitDictElements(assignment.inner),
    }))
    .filter((assignment) => assignment.dicts.length >= minDicts);

  if (qualifiedLists.length === 0) {
    const partialDicts = listAssignments.flatMap((assignment) =>
      splitDictElements(assignment.inner),
    );
    if (partialDicts.length > 0) {
      return {
        valid: false,
        message: pickHint(rules, "missingTaskMarkDictFields"),
      };
    }
    if (hasStandaloneDictAssignment(input)) {
      return {
        valid: false,
        message: pickHint(rules, "missingTaskMarkList"),
      };
    }
    return {
      valid: false,
      message: pickHint(rules, "missingTaskMarkList"),
    };
  }

  const primary = qualifiedLists[0]!;

  for (const dictStr of primary.dicts) {
    const hasAd = hasDictKey(dictStr, "ad");
    const hasTamam = hasDictKey(dictStr, "tamam");

    if (!hasAd && !hasTamam) {
      return {
        valid: false,
        message: pickHint(rules, "missingTaskMarkDictFields"),
      };
    }
    if (!hasAd) {
      return {
        valid: false,
        message: pickHint(rules, "missingTaskMarkAdField"),
      };
    }
    if (!hasTamam) {
      return {
        valid: false,
        message: pickHint(rules, "missingTaskMarkTamamField"),
      };
    }

    const tamamValue = getTamamValue(dictStr);
    if (!tamamValue) {
      return {
        valid: false,
        message: pickHint(rules, "missingTaskMarkTamamField"),
      };
    }

    const tamamError = validateTamamFieldValue(tamamValue, rules);
    if (tamamError) {
      return tamamError;
    }
  }

  return { listVar: primary.varName };
}

function validateTaskMarkCompleteByNameMode(
  input: string,
  rules: StepValidation,
): ValidationResult {
  if (hasWrongCaseFor(input)) {
    return { valid: false, message: pickHint(rules, "wrongCaseFor") };
  }
  if (hasWrongCaseIfKeyword(input)) {
    return { valid: false, message: pickHint(rules, "wrongCaseIf") };
  }
  if (hasWrongCasePrint(input)) {
    return { valid: false, message: pickHint(rules, "wrongCasePrint") };
  }

  const structureResult = validateTaskMarkDictStructure(input, rules);
  if ("valid" in structureResult && structureResult.valid === false) {
    return structureResult;
  }
  const { listVar } = structureResult as { listVar: string };

  if (!hasForLoopStatement(input)) {
    return {
      valid: false,
      message: pickHint(rules, "missingTaskMarkFor"),
    };
  }

  if (!hasIfStatement(input)) {
    return {
      valid: false,
      message: pickHint(rules, "missingTaskMarkIf"),
    };
  }

  if (!hasTaskNameComparison(input)) {
    return {
      valid: false,
      message: pickHint(rules, "missingTaskMarkNameCompare"),
    };
  }

  if (hasInvalidTamamAssignment(input)) {
    if (/\[["']tamam["']\]\s*=\s*(true|false)\b/.test(input)) {
      return {
        valid: false,
        message: pickHint(rules, "invalidBooleanCase"),
      };
    }
    return {
      valid: false,
      message: pickHint(rules, "missingTaskMarkBooleanNotString"),
    };
  }

  if (!hasTamamTrueAssignment(input)) {
    return {
      valid: false,
      message: pickHint(rules, "missingTaskMarkTamamAssignment"),
    };
  }

  if (!hasPrintCall(input)) {
    return {
      valid: false,
      message: pickHint(rules, "missingTaskMarkPrint"),
    };
  }

  if (!printUsesListVar(input, listVar)) {
    return {
      valid: false,
      message: pickHint(rules, "missingTaskMarkPrint"),
    };
  }

  return { valid: true };
}

const TASK_TRACKER_FUNCTION_NAMES = [
  "ekle",
  "listele",
  "tamamla",
  "ozet",
] as const;

function getMissingTaskTrackerFunctions(
  defs: { name: string; params: string[] }[],
): string[] {
  const names = new Set(defs.map((def) => def.name));
  return TASK_TRACKER_FUNCTION_NAMES.filter((name) => !names.has(name));
}

function hasTaskDictFields(text: string): boolean {
  return /["']ad["']\s*:/.test(text) && /["']tamam["']\s*:/.test(text);
}

function hasTamamIfCheckInBody(bodyText: string): boolean {
  return /if\s+.*\[["']tamam["']\]/i.test(bodyText);
}

function hasCompletedTaskCounting(bodyText: string): boolean {
  if (
    /sum\s*\(\s*1\s+for\b/i.test(bodyText) &&
    /\[["']tamam["']\]/i.test(bodyText)
  ) {
    return true;
  }
  const hasIncrement =
    /\+\s*=\s*1/.test(bodyText) || /=\s*\w+\s*\+\s*1/.test(bodyText);
  return hasIncrement && /\[["']tamam["']\]/i.test(bodyText);
}

function validateTamamBooleanLiteralsInText(
  text: string,
  rules: StepValidation,
): ValidationResult | null {
  for (const match of text.matchAll(/["']tamam["']\s*:\s*([^,}\n]+)/g)) {
    const tamamError = validateTamamFieldValue(match[1] ?? "", rules);
    if (tamamError) {
      return {
        valid: false,
        message: pickHint(rules, "missingTaskTrackerBooleanNotString"),
      };
    }
  }

  if (
    /\[["']tamam["']\]\s*=\s*true\b/.test(text) ||
    /\[["']tamam["']\]\s*=\s*false\b/.test(text)
  ) {
    return {
      valid: false,
      message: pickHint(rules, "invalidBooleanCase"),
    };
  }

  if (
    /\[["']tamam["']\]\s*=\s*["']True["']/.test(text) ||
    /\[["']tamam["']\]\s*=\s*["']False["']/.test(text)
  ) {
    return {
      valid: false,
      message: pickHint(rules, "missingTaskTrackerBooleanNotString"),
    };
  }

  return null;
}

function validateTaskTrackerEkleBody(
  bodyText: string,
  params: string[],
  rules: StepValidation,
): ValidationResult | null {
  if (params.length < 2) {
    return {
      valid: false,
      message: pickHint(rules, "missingTaskTrackerDict"),
    };
  }

  if (!/\.append\s*\(/i.test(bodyText)) {
    return {
      valid: false,
      message: pickHint(rules, "missingTaskTrackerAppend"),
    };
  }

  if (!hasTaskDictFields(bodyText)) {
    return {
      valid: false,
      message: pickHint(rules, "missingTaskTrackerDict"),
    };
  }

  if (!/["']tamam["']\s*:\s*False\b/.test(bodyText)) {
    return {
      valid: false,
      message: pickHint(rules, "missingTaskTrackerDict"),
    };
  }

  return validateTamamBooleanLiteralsInText(bodyText, rules);
}

function validateTaskTrackerListeleBody(
  bodyText: string,
  rules: StepValidation,
): ValidationResult | null {
  if (!hasForLoopStatement(bodyText)) {
    return {
      valid: false,
      message: pickHint(rules, "missingTaskTrackerListele"),
    };
  }

  if (!hasPrintCall(bodyText)) {
    return {
      valid: false,
      message: pickHint(rules, "missingTaskTrackerListele"),
    };
  }

  return null;
}

function validateTaskTrackerTamamlaBody(
  bodyText: string,
  params: string[],
  rules: StepValidation,
): ValidationResult | null {
  if (params.length < 2) {
    return {
      valid: false,
      message: pickHint(rules, "missingTaskTrackerTamamla"),
    };
  }

  if (!hasForLoopStatement(bodyText)) {
    return {
      valid: false,
      message: pickHint(rules, "missingTaskTrackerTamamla"),
    };
  }

  if (!hasIfStatement(bodyText)) {
    return {
      valid: false,
      message: pickHint(rules, "missingTaskTrackerTamamlaIf"),
    };
  }

  if (!hasTaskNameComparison(bodyText)) {
    return {
      valid: false,
      message: pickHint(rules, "missingTaskTrackerTamamlaIf"),
    };
  }

  const booleanError = validateTamamBooleanLiteralsInText(bodyText, rules);
  if (booleanError) {
    return booleanError;
  }

  if (!hasTamamTrueAssignment(bodyText)) {
    return {
      valid: false,
      message: pickHint(rules, "missingTaskTrackerTamamAssignment"),
    };
  }

  return null;
}

function validateTaskTrackerOzetBody(
  bodyText: string,
  rules: StepValidation,
): ValidationResult | null {
  if (!hasLenCall(bodyText)) {
    return {
      valid: false,
      message: pickHint(rules, "missingTaskTrackerOzetLen"),
    };
  }

  if (!hasCompletedTaskCounting(bodyText)) {
    return {
      valid: false,
      message: pickHint(rules, "missingTaskTrackerOzetCompletedCount"),
    };
  }

  if (!hasPrintCall(bodyText)) {
    return {
      valid: false,
      message: pickHint(rules, "missingTaskTrackerOzet"),
    };
  }

  return null;
}

function hasExampleTaskTrackerUsage(input: string): boolean {
  const topLevel = nonEmptyLines(input)
    .filter((line) => !/^\s*def\s+/.test(line))
    .join("\n");

  if (!/=\s*\[\s*\]/.test(topLevel)) {
    return false;
  }
  if (countTopLevelFunctionCalls(input, "ekle") < 1) {
    return false;
  }
  if (countTopLevelFunctionCalls(input, "tamamla") < 1) {
    return false;
  }
  if (countTopLevelFunctionCalls(input, "listele") < 1) {
    return false;
  }
  if (countTopLevelFunctionCalls(input, "ozet") < 1) {
    return false;
  }
  return true;
}

function validateTaskTrackerFullProjectMode(
  input: string,
  rules: StepValidation,
): ValidationResult {
  if (hasWrongCaseFor(input)) {
    return { valid: false, message: pickHint(rules, "wrongCaseFor") };
  }
  if (hasWrongCaseIfKeyword(input)) {
    return { valid: false, message: pickHint(rules, "wrongCaseIf") };
  }
  if (hasWrongCasePrint(input)) {
    return { valid: false, message: pickHint(rules, "wrongCasePrint") };
  }
  if (hasWrongCaseAppend(input)) {
    return { valid: false, message: pickHint(rules, "wrongCaseAppend") };
  }

  const defs = extractFunctionDefs(input);
  const missing = getMissingTaskTrackerFunctions(defs);

  if (missing.length === TASK_TRACKER_FUNCTION_NAMES.length) {
    return {
      valid: false,
      message: pickHint(rules, "missingTaskTrackerAllFunctions"),
    };
  }
  if (missing.includes("ekle")) {
    return {
      valid: false,
      message: pickHint(rules, "missingTaskTrackerEkle"),
    };
  }
  if (missing.includes("listele")) {
    return {
      valid: false,
      message: pickHint(rules, "missingTaskTrackerListele"),
    };
  }
  if (missing.includes("tamamla")) {
    return {
      valid: false,
      message: pickHint(rules, "missingTaskTrackerTamamla"),
    };
  }
  if (missing.includes("ozet")) {
    return {
      valid: false,
      message: pickHint(rules, "missingTaskTrackerOzet"),
    };
  }

  const booleanError = validateTamamBooleanLiteralsInText(input, rules);
  if (booleanError) {
    return booleanError;
  }

  const ekleDef = defs.find((def) => def.name === "ekle")!;
  const ekleError = validateTaskTrackerEkleBody(
    getFunctionBodyLines(input, "ekle").join("\n"),
    ekleDef.params,
    rules,
  );
  if (ekleError) {
    return ekleError;
  }

  const listeleError = validateTaskTrackerListeleBody(
    getFunctionBodyLines(input, "listele").join("\n"),
    rules,
  );
  if (listeleError) {
    return listeleError;
  }

  const tamamlaDef = defs.find((def) => def.name === "tamamla")!;
  const tamamlaError = validateTaskTrackerTamamlaBody(
    getFunctionBodyLines(input, "tamamla").join("\n"),
    tamamlaDef.params,
    rules,
  );
  if (tamamlaError) {
    return tamamlaError;
  }

  const ozetError = validateTaskTrackerOzetBody(
    getFunctionBodyLines(input, "ozet").join("\n"),
    rules,
  );
  if (ozetError) {
    return ozetError;
  }

  if (!hasExampleTaskTrackerUsage(input)) {
    return {
      valid: false,
      message: pickHint(rules, "missingTaskTrackerExampleUsage"),
    };
  }

  return { valid: true };
}

function validateTamamlandiValue(
  value: string,
  rules: StepValidation,
): ValidationResult | null {
  const trimmed = value.trim();
  if (trimmed === "True" || trimmed === "False") {
    return null;
  }
  if (trimmed === "true" || trimmed === "false") {
    return {
      valid: false,
      message: pickHint(rules, "invalidBooleanCase"),
    };
  }
  if (/^["']/.test(trimmed)) {
    return {
      valid: false,
      message: pickHint(rules, "missingHabitDictBooleanNotString"),
    };
  }
  return {
    valid: false,
    message: pickHint(rules, "missingHabitDictBooleanNotString"),
  };
}

function hasStandaloneDictAssignment(input: string): boolean {
  return /^\s*[a-zA-Z_]\w*\s*=\s*\{/m.test(input);
}

function validateHabitDictListMode(
  input: string,
  rules: StepValidation,
): ValidationResult {
  const minDicts = rules.minHabitDictCount ?? 2;
  const listAssignments = extractBracketListAssignments(input);

  if (listAssignments.length === 0) {
    return {
      valid: false,
      message: pickHint(rules, "missingHabitDictList"),
    };
  }

  const qualifiedLists = listAssignments
    .map((assignment) => ({
      ...assignment,
      dicts: splitDictElements(assignment.inner),
    }))
    .filter((assignment) => assignment.dicts.length >= minDicts);

  if (qualifiedLists.length === 0) {
    if (hasStandaloneDictAssignment(input)) {
      return {
        valid: false,
        message: pickHint(rules, "missingHabitDictList"),
      };
    }
    return {
      valid: false,
      message: pickHint(rules, "missingHabitDictList"),
    };
  }

  const primary = qualifiedLists[0]!;

  for (const dictStr of primary.dicts) {
    if (!hasDictKey(dictStr, "ad") || !hasDictKey(dictStr, "tamamlandi")) {
      return {
        valid: false,
        message: pickHint(rules, "missingHabitDictFields"),
      };
    }

    const tamamlandiValue = getTamamlandiValue(dictStr);
    if (!tamamlandiValue) {
      return {
        valid: false,
        message: pickHint(rules, "missingHabitDictFields"),
      };
    }

    const tamamlandiError = validateTamamlandiValue(tamamlandiValue, rules);
    if (tamamlandiError) {
      return tamamlandiError;
    }
  }

  if (!hasPrintCall(input)) {
    return { valid: false, message: pickHint(rules, "missingListPrint") };
  }

  if (!printUsesListVar(input, primary.varName)) {
    return { valid: false, message: pickHint(rules, "missingListPrint") };
  }

  return { valid: true };
}

function hasTamamlandiIfCheck(input: string): boolean {
  return /if\s+.*\[["']tamamlandi["']\]/i.test(input);
}

function hasLenCall(input: string): boolean {
  return /\blen\s*\(/i.test(input);
}

function hasPercentageCalculation(input: string): boolean {
  const stripped = stripStringLiterals(input);
  return /\//.test(stripped) && /\*\s*100/.test(stripped);
}

function hasFStringPrint(input: string): boolean {
  return nonEmptyLines(input).some((line) => /print\s*\(\s*f["']/i.test(line));
}

function validateHabitDictStructureForCompletion(
  input: string,
  rules: StepValidation,
): ValidationResult | null {
  const minDicts = rules.minHabitDictCount ?? 2;
  const listAssignments = extractBracketListAssignments(input);

  if (listAssignments.length === 0) {
    return {
      valid: false,
      message: pickHint(rules, "missingHabitCompletionList"),
    };
  }

  const qualifiedLists = listAssignments
    .map((assignment) => ({
      ...assignment,
      dicts: splitDictElements(assignment.inner),
    }))
    .filter((assignment) => assignment.dicts.length >= minDicts);

  if (qualifiedLists.length === 0) {
    return {
      valid: false,
      message: pickHint(rules, "missingHabitCompletionList"),
    };
  }

  const primary = qualifiedLists[0]!;

  for (const dictStr of primary.dicts) {
    if (!hasDictKey(dictStr, "ad") || !hasDictKey(dictStr, "tamamlandi")) {
      return {
        valid: false,
        message: pickHint(rules, "missingHabitCompletionDictFields"),
      };
    }

    const tamamlandiValue = getTamamlandiValue(dictStr);
    if (!tamamlandiValue) {
      return {
        valid: false,
        message: pickHint(rules, "missingHabitCompletionDictFields"),
      };
    }

    const tamamlandiError = validateTamamlandiValue(tamamlandiValue, rules);
    if (tamamlandiError) {
      return tamamlandiError;
    }
  }

  return null;
}

function validateHabitCompletionPercentageMode(
  input: string,
  rules: StepValidation,
): ValidationResult {
  const dictError = validateHabitDictStructureForCompletion(input, rules);
  if (dictError) {
    return dictError;
  }

  if (!/^\s*for\s+\w+\s+in\s+/im.test(input)) {
    return {
      valid: false,
      message: pickHint(rules, "missingHabitCompletionForLoop"),
    };
  }

  if (!hasTamamlandiIfCheck(input)) {
    return {
      valid: false,
      message: pickHint(rules, "missingHabitCompletionIfCheck"),
    };
  }

  if (!hasLenCall(input)) {
    return {
      valid: false,
      message: pickHint(rules, "missingHabitCompletionLen"),
    };
  }

  if (!hasPercentageCalculation(input)) {
    return {
      valid: false,
      message: pickHint(rules, "missingHabitCompletionPercentage"),
    };
  }

  if (!hasFStringPrint(input)) {
    return {
      valid: false,
      message: pickHint(rules, "missingHabitCompletionFString"),
    };
  }

  if (!hasPrintCall(input)) {
    return {
      valid: false,
      message: pickHint(rules, "missingHabitCompletionPrint"),
    };
  }

  return { valid: true };
}

function validateHabitTrackerDictStructure(
  input: string,
  rules: StepValidation,
): ValidationResult | null {
  const minDicts = rules.minHabitDictCount ?? 2;
  const listAssignments = extractBracketListAssignments(input);

  if (listAssignments.length === 0) {
    return {
      valid: false,
      message: pickHint(rules, "missingHabitTrackerDictStructure"),
    };
  }

  const qualifiedLists = listAssignments
    .map((assignment) => ({
      ...assignment,
      dicts: splitDictElements(assignment.inner),
    }))
    .filter((assignment) => assignment.dicts.length >= minDicts);

  if (qualifiedLists.length === 0) {
    return {
      valid: false,
      message: pickHint(rules, "missingHabitTrackerDictStructure"),
    };
  }

  const primary = qualifiedLists[0]!;

  for (const dictStr of primary.dicts) {
    if (!hasDictKey(dictStr, "ad") || !hasDictKey(dictStr, "tamamlandi")) {
      return {
        valid: false,
        message: pickHint(rules, "missingHabitTrackerDictStructure"),
      };
    }

    const tamamlandiValue = getTamamlandiValue(dictStr);
    if (!tamamlandiValue) {
      return {
        valid: false,
        message: pickHint(rules, "missingHabitTrackerDictStructure"),
      };
    }

    const tamamlandiError = validateTamamlandiValue(tamamlandiValue, rules);
    if (tamamlandiError) {
      return tamamlandiError;
    }
  }

  return null;
}

function countFStringPrints(text: string): number {
  return nonEmptyLines(text).filter((line) =>
    /print\s*\(\s*f["']/i.test(line),
  ).length;
}

function validateHabitTrackerSummaryFunctionMode(
  input: string,
  rules: StepValidation,
): ValidationResult {
  const defs = extractFunctionDefs(input);
  const summaryFunc = defs.find((def) => def.name === "ozet_yazdir");

  if (!summaryFunc) {
    return {
      valid: false,
      message: pickHint(rules, "missingHabitTrackerFunction"),
    };
  }

  if (summaryFunc.params.length === 0) {
    return {
      valid: false,
      message: pickHint(rules, "missingHabitTrackerParam"),
    };
  }

  const dictError = validateHabitTrackerDictStructure(input, rules);
  if (dictError) {
    return dictError;
  }

  const bodyLines = getFunctionBodyLines(input, summaryFunc.name);
  const bodyText = bodyLines.join("\n");

  if (!hasLenCall(bodyText)) {
    return {
      valid: false,
      message: pickHint(rules, "missingHabitTrackerLen"),
    };
  }

  if (!/^\s*for\s+\w+\s+in\s+/im.test(bodyText)) {
    return {
      valid: false,
      message: pickHint(rules, "missingHabitTrackerForLoop"),
    };
  }

  if (!hasTamamlandiIfCheck(bodyText)) {
    return {
      valid: false,
      message: pickHint(rules, "missingHabitTrackerIfCheck"),
    };
  }

  if (!hasPercentageCalculation(bodyText)) {
    return {
      valid: false,
      message: pickHint(rules, "missingHabitTrackerPercentage"),
    };
  }

  if (countFStringPrints(bodyText) < 3) {
    return {
      valid: false,
      message: pickHint(rules, "missingHabitTrackerFString"),
    };
  }

  if (!bodyLines.some((line) => /^print\s*\(/i.test(line))) {
    return {
      valid: false,
      message: pickHint(rules, "missingHabitTrackerPrint"),
    };
  }

  if (countTopLevelFunctionCalls(input, summaryFunc.name) === 0) {
    return {
      valid: false,
      message: pickHint(rules, "missingHabitTrackerCall"),
    };
  }

  return { valid: true };
}

function validateListAppendAndPrintMode(
  input: string,
  rules: StepValidation,
): ValidationResult {
  if (hasWrongCaseAppend(input)) {
    return { valid: false, message: pickHint(rules, "wrongCaseAppend") };
  }

  const listDefs = parseListDefinitions(input);
  const appendCalls = findAppendCalls(input);

  if (listDefs.length === 0) {
    return { valid: false, message: pickHint(rules, "missingListDefinition") };
  }

  const qualifiedLists = listDefs.filter((def) => def.elementCount >= 2);
  if (qualifiedLists.length === 0) {
    return { valid: false, message: pickHint(rules, "missingListMinElements") };
  }

  if (appendCalls.length === 0) {
    return { valid: false, message: pickHint(rules, "missingListAppend") };
  }

  const matchingLists = qualifiedLists.filter((def) =>
    appendCalls.some((call) => call.varName === def.varName),
  );

  if (matchingLists.length === 0) {
    return {
      valid: false,
      message: pickHint(rules, "missingListAppendTarget"),
    };
  }

  if (!hasPrintCall(input)) {
    return { valid: false, message: pickHint(rules, "missingListPrint") };
  }

  const printedList = matchingLists.find((def) =>
    printUsesListVar(input, def.varName),
  );
  if (!printedList) {
    return { valid: false, message: pickHint(rules, "missingListPrint") };
  }

  return { valid: true };
}

function countAppendOnVar(input: string, varName: string): number {
  const pattern = new RegExp(
    `^\\s*${varName}\\s*\\.\\s*append\\s*\\(`,
    "im",
  );
  return nonEmptyLines(input).filter((line) => pattern.test(line)).length;
}

function hasForLoopOverVar(input: string, varName: string): boolean {
  return new RegExp(
    `^\\s*for\\s+\\w+\\s+in\\s+${varName}\\s*:`,
    "im",
  ).test(input);
}

function hasPrintInsideForLoop(input: string): boolean {
  const flat = nonEmptyLines(input);
  for (let i = 0; i < flat.length; i++) {
    if (!/^for\s+\w+\s+in\s+\w+/i.test(flat[i] ?? "")) {
      continue;
    }
    for (let j = i + 1; j < flat.length; j++) {
      if (/^(for|if|def|elif|else|while)\b/i.test(flat[j] ?? "")) {
        break;
      }
      if (/^print\s*\(/i.test(flat[j] ?? "")) {
        return true;
      }
    }
  }
  return false;
}

function hasLenPrintForList(input: string, varName: string): boolean {
  return nonEmptyLines(input).some((line) => {
    if (!/^print\s*\(/i.test(line)) {
      return false;
    }
    return new RegExp(`len\\s*\\(\\s*${varName}\\s*\\)`, "i").test(line);
  });
}

function validateListLoopSummaryMode(
  input: string,
  rules: StepValidation,
): ValidationResult {
  if (hasWrongCaseAppend(input)) {
    return { valid: false, message: pickHint(rules, "wrongCaseAppend") };
  }

  const listDefs = parseListDefinitions(input);
  if (listDefs.length === 0) {
    return {
      valid: false,
      message: pickHint(rules, "missingListLoopDefinition"),
    };
  }

  let primaryList = listDefs[0]!;
  let maxAppends = countAppendOnVar(input, primaryList.varName);
  for (const def of listDefs) {
    const appendCount = countAppendOnVar(input, def.varName);
    if (appendCount > maxAppends) {
      maxAppends = appendCount;
      primaryList = def;
    }
  }

  const varName = primaryList.varName;

  if (maxAppends === 0) {
    return { valid: false, message: pickHint(rules, "missingListLoopAppend") };
  }

  if (maxAppends < 2) {
    return {
      valid: false,
      message: pickHint(rules, "missingListLoopAppendCount"),
    };
  }

  if (!hasForLoopOverVar(input, varName)) {
    return { valid: false, message: pickHint(rules, "missingListLoopFor") };
  }

  if (!hasPrintInsideForLoop(input)) {
    return {
      valid: false,
      message: pickHint(rules, "missingListLoopForPrint"),
    };
  }

  if (!hasLenPrintForList(input, varName)) {
    return { valid: false, message: pickHint(rules, "missingListLoopLen") };
  }

  if (!hasPrintCall(input)) {
    return { valid: false, message: pickHint(rules, "missingListLoopPrint") };
  }

  return { valid: true };
}

function hasWrongCasePrint(input: string): boolean {
  const matches = [...input.matchAll(/([a-zA-Z_]\w*)\s*\(/g)];
  for (const match of matches) {
    const name = match[1] ?? "";
    if (name.toLowerCase() === "print" && name !== "print") {
      return true;
    }
  }
  return false;
}

function hasWrongCaseFor(input: string): boolean {
  return /^\s*For\s+/m.test(input);
}

function hasWrongCaseIfKeyword(input: string): boolean {
  return /^\s*If\s+/m.test(input);
}

function hasWrongCaseBuiltin(input: string, builtin: string): boolean {
  const matches = [...input.matchAll(/([a-zA-Z_]\w*)\s*\(/g)];
  for (const match of matches) {
    const name = match[1] ?? "";
    if (name.toLowerCase() === builtin && name !== builtin) {
      return true;
    }
  }
  return false;
}

function hasWrongCaseSum(input: string): boolean {
  return hasWrongCaseBuiltin(input, "sum");
}

function hasWrongCaseReportBuiltins(input: string): boolean {
  return (
    hasWrongCaseBuiltin(input, "sum") ||
    hasWrongCaseBuiltin(input, "len") ||
    hasWrongCaseBuiltin(input, "max")
  );
}

function usesBuiltinOnListVar(
  input: string,
  builtin: "sum" | "len" | "max",
  listVars: Set<string>,
): boolean {
  const pattern = new RegExp(
    `\\b${builtin}\\s*\\(\\s*([a-zA-Z_][a-zA-Z0-9_]*)\\s*\\)`,
    "g",
  );
  for (const match of input.matchAll(pattern)) {
    if (listVars.has(match[1] ?? "")) {
      return true;
    }
  }
  return false;
}

function findAssignedVariables(
  input: string,
  rhsPattern: RegExp,
): Set<string> {
  const vars = new Set<string>();
  for (const line of nonEmptyLines(input)) {
    const match = line.match(/^\s*([a-zA-Z_]\w*)\s*=\s*(.+)$/);
    if (!match?.[1]) continue;
    if (rhsPattern.test(match[2] ?? "")) {
      vars.add(match[1]);
    }
  }
  return vars;
}

function hasAverageCalculation(input: string, listVars: Set<string>): boolean {
  for (const line of nonEmptyLines(input)) {
    if (!/\//.test(line)) continue;
    for (const listVar of listVars) {
      if (new RegExp(`\\blen\\s*\\(\\s*${listVar}\\s*\\)`).test(line)) {
        return true;
      }
    }
  }
  return false;
}

function printLineShowsTotal(
  line: string,
  sumVars: Set<string>,
): boolean {
  if (/\bsum\s*\(/.test(line)) return true;
  for (const varName of sumVars) {
    if (new RegExp(`\\b${varName}\\b`).test(line)) return true;
  }
  return false;
}

function printLineShowsAverage(
  line: string,
  listVars: Set<string>,
  avgVars: Set<string>,
): boolean {
  if (/\//.test(line) && /\blen\s*\(/.test(line)) {
    for (const listVar of listVars) {
      if (new RegExp(`\\blen\\s*\\(\\s*${listVar}\\s*\\)`).test(line)) {
        return true;
      }
    }
  }
  for (const varName of avgVars) {
    if (new RegExp(`\\b${varName}\\b`).test(line)) return true;
  }
  return false;
}

function printLineShowsMax(
  line: string,
  maxVars: Set<string>,
): boolean {
  if (/\bmax\s*\(/.test(line)) return true;
  for (const varName of maxVars) {
    if (new RegExp(`\\b${varName}\\b`).test(line)) return true;
  }
  return false;
}

function reportMetricsPrinted(
  input: string,
  listVars: Set<string>,
  sumVars: Set<string>,
  avgVars: Set<string>,
  maxVars: Set<string>,
): { total: boolean; average: boolean; max: boolean } {
  const printLines = nonEmptyLines(input).filter((line) => /^print\s*\(/i.test(line));
  const result = { total: false, average: false, max: false };

  for (const line of printLines) {
    if (!result.total && printLineShowsTotal(line, sumVars)) {
      result.total = true;
    }
    if (!result.average && printLineShowsAverage(line, listVars, avgVars)) {
      result.average = true;
    }
    if (!result.max && printLineShowsMax(line, maxVars)) {
      result.max = true;
    }
  }

  return result;
}

function findSumCallsOnVars(input: string): { listVar: string }[] {
  const calls: { listVar: string }[] = [];
  const pattern = /\bsum\s*\(\s*([a-zA-Z_]\w*)\s*\)/g;
  for (const match of input.matchAll(pattern)) {
    calls.push({ listVar: match[1] ?? "" });
  }
  return calls;
}

function findSumResultVariables(input: string): Set<string> {
  const vars = new Set<string>();
  for (const line of nonEmptyLines(input)) {
    const match = line.match(/^\s*([a-zA-Z_]\w*)\s*=\s*sum\s*\(/);
    if (match?.[1]) {
      vars.add(match[1]);
    }
  }
  return vars;
}

function printShowsSpendingTotal(input: string, sumResultVars: Set<string>): boolean {
  return nonEmptyLines(input).some((line) => {
    if (!/^print\s*\(/i.test(line)) {
      return false;
    }
    if (/\bsum\s*\(/.test(line)) {
      return true;
    }
    for (const varName of sumResultVars) {
      if (new RegExp(`\\b${varName}\\b`).test(line)) {
        return true;
      }
    }
    return false;
  });
}

function validateSpendingSummaryTotalMode(
  input: string,
  rules: StepValidation,
): ValidationResult {
  if (hasWrongCaseSum(input)) {
    return { valid: false, message: pickHint(rules, "wrongCaseSum") };
  }

  const listDefs = parseListDefinitions(input);
  if (listDefs.length === 0) {
    return {
      valid: false,
      message: pickHint(rules, "missingSpendingListDefinition"),
    };
  }

  const qualifiedLists = listDefs.filter((def) => def.numericElementCount >= 3);
  if (qualifiedLists.length === 0) {
    return {
      valid: false,
      message: pickHint(rules, "missingSpendingListMinElements"),
    };
  }

  const qualifiedVarNames = new Set(qualifiedLists.map((def) => def.varName));
  const sumCalls = findSumCallsOnVars(input);

  if (sumCalls.length === 0) {
    return { valid: false, message: pickHint(rules, "missingSpendingSum") };
  }

  const sumUsesQualifiedList = sumCalls.some((call) =>
    qualifiedVarNames.has(call.listVar),
  );
  if (!sumUsesQualifiedList) {
    return {
      valid: false,
      message: pickHint(rules, "missingSpendingSumTarget"),
    };
  }

  if (!hasPrintCall(input)) {
    return { valid: false, message: pickHint(rules, "missingSpendingPrint") };
  }

  const sumResultVars = findSumResultVariables(input);
  if (!printShowsSpendingTotal(input, sumResultVars)) {
    return { valid: false, message: pickHint(rules, "missingSpendingSum") };
  }

  return { valid: true };
}

function validateSpendingSummaryReportMode(
  input: string,
  rules: StepValidation,
): ValidationResult {
  if (hasWrongCaseReportBuiltins(input)) {
    return { valid: false, message: pickHint(rules, "wrongCaseReportBuiltins") };
  }

  const listDefs = parseListDefinitions(input);
  if (listDefs.length === 0) {
    return {
      valid: false,
      message: pickHint(rules, "missingSpendingListDefinition"),
    };
  }

  const qualifiedLists = listDefs.filter((def) => def.numericElementCount >= 3);
  if (qualifiedLists.length === 0) {
    return {
      valid: false,
      message: pickHint(rules, "missingSpendingListMinElements"),
    };
  }

  const listVars = new Set(qualifiedLists.map((def) => def.varName));

  if (!usesBuiltinOnListVar(input, "sum", listVars)) {
    return { valid: false, message: pickHint(rules, "missingSpendingReportSum") };
  }

  if (!hasAverageCalculation(input, listVars)) {
    return {
      valid: false,
      message: pickHint(rules, "missingSpendingReportAverage"),
    };
  }

  if (!usesBuiltinOnListVar(input, "max", listVars)) {
    return { valid: false, message: pickHint(rules, "missingSpendingReportMax") };
  }

  if (!hasPrintCall(input)) {
    return { valid: false, message: pickHint(rules, "missingSpendingReportPrint") };
  }

  const sumVars = findAssignedVariables(input, /\bsum\s*\(/);
  const avgVars = findAssignedVariables(input, /\/.*\blen\s*\(/);
  const maxVars = findAssignedVariables(input, /\bmax\s*\(/);
  const printed = reportMetricsPrinted(input, listVars, sumVars, avgVars, maxVars);

  if (!printed.total || !printed.average || !printed.max) {
    return {
      valid: false,
      message: pickHint(rules, "missingSpendingReportOutputs"),
    };
  }

  return { valid: true };
}

function nonEmptyLines(input: string): string[] {
  return input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function quotedStringFromPrintLine(line: string): string | null {
  const match = line.match(QUOTED_PRINT_LINE);
  return match?.[2]?.trim() ?? null;
}

function isFStringPrintLine(line: string): boolean {
  return /^\s*print\s*\(\s*f["']/.test(line);
}

function isPythonBooleanLiteral(value: string): boolean {
  return value === "True" || value === "False";
}

function isInvalidBooleanAttempt(value: string): boolean {
  if (value === "true" || value === "false") return true;
  if (/^(evet|hayır)$/i.test(value)) return true;
  return false;
}

function stripStringLiteralsFromArgs(args: string): string {
  return args
    .replace(/f(["'])(?:\\.|(?!\1)[\s\S])*?\1/g, "")
    .replace(/(["'])(?:\\.|(?!\1)[\s\S])*?\1/g, "");
}

function findUndefinedVariableInPrint(
  line: string,
  definedVars: Set<string>,
): string | null {
  const argsMatch = line.match(/print\s*\(([\s\S]*)\)\s*$/);
  if (!argsMatch) return null;

  const remaining = stripStringLiteralsFromArgs(argsMatch[1] ?? "");
  const ids = [...remaining.matchAll(/\b([a-zA-Z_]\w*)\b/g)];
  for (const match of ids) {
    const id = match[1] ?? "";
    const start = match.index ?? 0;
    const rest = remaining.slice(start + id.length).trimStart();
    if (rest.startsWith("(")) {
      continue;
    }
    if (!ASSIGNMENT_VALUE_SKIP.has(id) && !definedVars.has(id)) {
      return id;
    }
  }
  return null;
}

function validateAssignmentValue(
  value: string,
  definedVars: Set<string>,
  rules: StepValidation,
): ValidationResult {
  if (!value) {
    return { valid: false, message: pickHint(rules, "incompleteAssignment") };
  }

  if (isInvalidBooleanAttempt(value)) {
    return { valid: false, message: pickHint(rules, "invalidBooleanCase") };
  }

  if (/^["']/.test(value)) {
    const quoted = value.match(/^(["'])([\s\S]*)\1$/);
    if (quoted && (quoted[2] ?? "").length > 0) {
      return { valid: true };
    }
    return { valid: false, message: pickHint(rules, "incompleteAssignment") };
  }

  if (/^-?\d+(\.\d+)?$/.test(value)) {
    return { valid: true };
  }

  if (/^(True|False|None)$/.test(value)) {
    return { valid: true };
  }

  if (/^[\[{]/.test(value)) {
    return { valid: true };
  }

  if (/^(input|int|float|str|type)\s*\(/.test(value)) {
    return { valid: true };
  }

  if (/^f["']/.test(value)) {
    return { valid: true };
  }

  if (/^[a-zA-Z_]\w*$/.test(value)) {
    if (definedVars.has(value)) {
      return { valid: true };
    }
    return { valid: false, message: pickHint(rules, "unquotedAssignment") };
  }

  if (
    /^[a-zA-ZçğıöşüÇĞİÖŞÜ_][\wçğıöşüÇĞİÖŞÜ]*(\s+[a-zA-ZçğıöşüÇĞİÖŞÜ_][\wçğıöşüÇĞİÖŞÜ]*)+$/.test(
      value,
    )
  ) {
    return { valid: false, message: pickHint(rules, "unquotedAssignment") };
  }

  return { valid: false, message: pickHint(rules, "incompleteAssignment") };
}

type ParsedSubmission = {
  definedVars: Set<string>;
  assignmentCount: number;
  booleanAssignmentCount: number;
  printCount: number;
  fStringPrintCount: number;
};

function parseSubmission(
  input: string,
  rules: StepValidation,
): { parsed: ParsedSubmission; error: ValidationResult | null } {
  const lines = nonEmptyLines(input);
  const definedVars = new Set<string>();
  let assignmentCount = 0;
  let booleanAssignmentCount = 0;
  let printCount = 0;
  let fStringPrintCount = 0;

  for (const line of lines) {
    const forMatch = line.match(/^\s*for\s+([a-zA-Z_]\w*)\s+in\b/);
    if (forMatch?.[1]) {
      definedVars.add(forMatch[1]);
    }

    const assignMatch = line.match(ASSIGNMENT_LINE_PARSE);
    if (assignMatch) {
      const name = assignMatch[1] ?? "";
      const value = (assignMatch[2] ?? "").trim();
      const valueResult = validateAssignmentValue(value, definedVars, rules);
      if (!valueResult.valid) {
        return { parsed: emptyParsed(), error: valueResult };
      }
      definedVars.add(name);
      assignmentCount += 1;
      if (isPythonBooleanLiteral(value)) {
        booleanAssignmentCount += 1;
      }
      continue;
    }

    if (/print\s*\(/i.test(line)) {
      if (hasWrongCasePrint(line)) {
        return {
          parsed: emptyParsed(),
          error: { valid: false, message: pickHint(rules, "wrongCasePrint") },
        };
      }
      if (EMPTY_PRINT_LINE.test(line)) {
        return {
          parsed: emptyParsed(),
          error: { valid: false, message: pickHint(rules, "emptyPrint") },
        };
      }

      const undefinedVar = findUndefinedVariableInPrint(line, definedVars);
      if (undefinedVar) {
        return {
          parsed: emptyParsed(),
          error: {
            valid: false,
            message: pickHint(rules, "undefinedPrintVariable"),
          },
        };
      }

      printCount += 1;
      if (isFStringPrintLine(line)) {
        fStringPrintCount += 1;
      }
    }
  }

  return {
    parsed: {
      definedVars,
      assignmentCount,
      booleanAssignmentCount,
      printCount,
      fStringPrintCount,
    },
    error: null,
  };
}

function emptyParsed(): ParsedSubmission {
  return {
    definedVars: new Set(),
    assignmentCount: 0,
    booleanAssignmentCount: 0,
    printCount: 0,
    fStringPrintCount: 0,
  };
}

function validatePrintStringLiteralMode(
  input: string,
  rules: StepValidation,
): ValidationResult {
  const lines = nonEmptyLines(input);
  const selfIntro = rules.selfIntroMinChars !== undefined;
  let printCount = 0;

  for (const line of lines) {
    if (hasWrongCasePrint(line)) {
      return { valid: false, message: pickHint(rules, "wrongCasePrint") };
    }
    if (EMPTY_PRINT_LINE.test(line)) {
      return { valid: false, message: pickHint(rules, "emptyPrint") };
    }

    if (QUOTED_PRINT_LINE.test(line)) {
      printCount += 1;
      const content = quotedStringFromPrintLine(line);
      const minChars = rules.selfIntroMinChars ?? 2;
      if (content !== null && content.length < minChars) {
        return {
          valid: false,
          message: selfIntro
            ? "Cevabın çok kısa görünüyor. Kendini tanıtan kısa bir cümle yazmayı dene."
            : pickHint(rules, "tooShort"),
        };
      }
      continue;
    }

    if (isFStringPrintLine(line)) {
      printCount += 1;
      continue;
    }

    if (/print\s*\(/i.test(line)) {
      return { valid: false, message: pickHint(rules, "unquotedString") };
    }

    return { valid: false, message: pickHint(rules, "notPython") };
  }

  if (printCount === 0) {
    return { valid: false, message: pickHint(rules, "missingPrint") };
  }

  return { valid: true };
}

function validateMultiplePrintStringLiteralMode(
  input: string,
  rules: StepValidation,
): ValidationResult {
  const result = validatePrintStringLiteralMode(input, rules);
  if (!result.valid) return result;

  const printCount = (input.match(/print\s*\(/gi) ?? []).length;
  const minPrints = rules.minPrintCount ?? 2;
  if (printCount < minPrints) {
    return {
      valid: false,
      message: pickHint(rules, printCountHintKey(minPrints)),
    };
  }

  return { valid: true };
}

function validateVariableAssignmentMode(
  input: string,
  rules: StepValidation,
): ValidationResult {
  const { parsed, error } = parseSubmission(input, rules);
  if (error) return error;

  const minAssignments = rules.minAssignmentCount ?? 1;
  if (parsed.assignmentCount < minAssignments) {
    return {
      valid: false,
      message: pickHint(
        rules,
        minAssignments >= 2 ? "missingAssignmentCount" : "missingAssignment",
      ),
    };
  }

  if (rules.requiresBoolean && parsed.booleanAssignmentCount === 0) {
    return { valid: false, message: pickHint(rules, "missingBoolean") };
  }

  return { valid: true };
}

function validateVariableAndPrintMode(
  input: string,
  rules: StepValidation,
): ValidationResult {
  const { parsed, error } = parseSubmission(input, rules);
  if (error) return error;

  const minAssignments = rules.minAssignmentCount ?? 1;
  if (parsed.assignmentCount < minAssignments) {
    return {
      valid: false,
      message: pickHint(
        rules,
        minAssignments >= 2 ? "missingAssignmentCount" : "missingAssignment",
      ),
    };
  }

  const minPrints = rules.minPrintCount ?? 1;
  if (parsed.printCount < minPrints) {
    return {
      valid: false,
      message: pickHint(
        rules,
        minPrints >= 2 ? printCountHintKey(minPrints) : "missingPrint",
      ),
    };
  }

  if (rules.requiresBoolean && parsed.booleanAssignmentCount === 0) {
    return { valid: false, message: pickHint(rules, "missingBoolean") };
  }

  return { valid: true };
}

function validateMiniProfileMode(
  input: string,
  rules: StepValidation,
): ValidationResult {
  return validateVariableAndPrintMode(input, {
    ...rules,
    minAssignmentCount: rules.minAssignmentCount ?? 2,
    minPrintCount: rules.minPrintCount ?? 2,
  });
}

function validateFStringIntroMode(
  input: string,
  rules: StepValidation,
): ValidationResult {
  const lines = nonEmptyLines(input);
  const definedVars = new Set<string>();
  let assignmentCount = 0;
  let fStringPrintCount = 0;

  for (const line of lines) {
    const assignMatch = line.match(ASSIGNMENT_LINE_PARSE);
    if (assignMatch) {
      const name = assignMatch[1] ?? "";
      const value = (assignMatch[2] ?? "").trim();
      const valueResult = validateAssignmentValue(value, definedVars, rules);
      if (!valueResult.valid) return valueResult;
      definedVars.add(name);
      assignmentCount += 1;
      continue;
    }

    if (/print\s*\(/i.test(line)) {
      if (hasWrongCasePrint(line)) {
        return { valid: false, message: pickHint(rules, "wrongCasePrint") };
      }
      if (EMPTY_PRINT_LINE.test(line)) {
        return { valid: false, message: pickHint(rules, "emptyPrint") };
      }

      if (!isFStringPrintLine(line)) {
        return { valid: false, message: pickHint(rules, "missingFString") };
      }

      const match = line.match(FSTRING_PRINT_LINE_PARSE);
      if (!match) {
        return { valid: false, message: pickHint(rules, "missingFString") };
      }

      const content = match[2] ?? "";
      const varRefs = [...content.matchAll(FSTRING_VAR_REF)].map(
        (m) => m[1] ?? "",
      );

      if (varRefs.length === 0) {
        return {
          valid: false,
          message: pickHint(rules, "missingFStringVariable"),
        };
      }

      for (const varName of varRefs) {
        if (!definedVars.has(varName)) {
          return {
            valid: false,
            message: pickHint(rules, "undefinedFStringVariable"),
          };
        }
      }

      fStringPrintCount += 1;
    }
  }

  const minAssignments = rules.minAssignmentCount ?? 1;
  if (assignmentCount < minAssignments) {
    return {
      valid: false,
      message: pickHint(
        rules,
        minAssignments >= 2 ? "missingAssignmentCount" : "missingAssignment",
      ),
    };
  }

  if (fStringPrintCount === 0) {
    return { valid: false, message: pickHint(rules, "missingPrint") };
  }

  return { valid: true };
}

function validateExtendedProfileCardMode(
  input: string,
  rules: StepValidation,
): ValidationResult {
  const { parsed, error } = parseSubmission(input, rules);
  if (error) return error;

  const minPrints = rules.minPrintCount ?? 3;
  if (parsed.printCount < minPrints) {
    return {
      valid: false,
      message: pickHint(rules, printCountHintKey(minPrints)),
    };
  }

  if (parsed.fStringPrintCount === 0) {
    return { valid: false, message: pickHint(rules, "missingFString") };
  }

  if (parsed.booleanAssignmentCount === 0) {
    return { valid: false, message: pickHint(rules, "missingBoolean") };
  }

  return { valid: true };
}

function extractFunctionDefs(
  input: string,
): { name: string; params: string[] }[] {
  const results: { name: string; params: string[] }[] = [];
  for (const line of nonEmptyLines(input)) {
    const match = line.match(/^\s*def\s+([a-zA-Z_]\w*)\s*\(([^)]*)\)/);
    if (!match) continue;
    const params = (match[2] ?? "")
      .split(",")
      .map((part) => (part.trim().split("=")[0] ?? "").trim())
      .filter((part) => part.length > 0 && part !== "self");
    results.push({ name: match[1] ?? "", params });
  }
  return results;
}

function getReturnExpressions(input: string): string[] {
  return nonEmptyLines(input)
    .filter((line) => /^\s*return\b/.test(line))
    .map((line) => line.replace(/^\s*return\s+/, "").trim());
}

function returnUsesParam(expression: string, params: string[]): boolean {
  const stripped = stripStringLiteralsFromArgs(expression);
  for (const param of params) {
    if (new RegExp(`\\{${param}\\}`, "i").test(expression)) {
      return true;
    }
    if (new RegExp(`\\b${param}\\b`, "i").test(stripped)) {
      return true;
    }
  }
  return false;
}

function hasDefinedFunctionCallWithString(
  input: string,
  funcName: string,
): boolean {
  return new RegExp(
    `\\b${funcName}\\s*\\(\\s*["'][^"']*["']\\s*\\)`,
    "i",
  ).test(input);
}

function hasValidBooleanEvenLogic(bodyText: string): boolean {
  if (!/%\s*2/.test(bodyText)) {
    return false;
  }

  if (/%\s*2\s*==\s*0/.test(bodyText)) {
    return true;
  }

  if (
    /\breturn\s+True\b/.test(bodyText) &&
    /\breturn\s+False\b/.test(bodyText)
  ) {
    return true;
  }

  for (const line of bodyText.split("\n")) {
    if (!/\breturn\b/.test(line)) {
      continue;
    }
    if (/%\s*2/.test(line) && !/==/.test(line)) {
      return false;
    }
    if (/^\s*return\s+[a-zA-Z_]\w*\s*$/.test(line.trim())) {
      return false;
    }
  }

  return false;
}

function validateBooleanHelperFunctionMode(
  input: string,
  rules: StepValidation,
): ValidationResult {
  const defs = extractFunctionDefs(input);
  if (defs.length === 0) {
    return { valid: false, message: pickHint(rules, "missingFunctionDef") };
  }

  const primary = defs[0]!;
  if (primary.params.length === 0) {
    return {
      valid: false,
      message: pickHint(rules, "missingBooleanHelperParam"),
    };
  }

  const bodyLines = getFunctionBodyLines(input, primary.name);
  const bodyText = bodyLines.join("\n");

  if (!/%\s*2/.test(bodyText)) {
    return {
      valid: false,
      message: pickHint(rules, "missingBooleanHelperModulo"),
    };
  }

  if (!hasValidBooleanEvenLogic(bodyText)) {
    return {
      valid: false,
      message: pickHint(rules, "missingBooleanHelperBooleanCheck"),
    };
  }

  const hasReturnInBody = bodyLines.some((line) => /^\s*return\b/.test(line));
  if (!hasReturnInBody) {
    return {
      valid: false,
      message: pickHint(rules, "missingBooleanHelperReturn"),
    };
  }

  const calledOutsideDef = nonEmptyLines(input).some((line) => {
    if (/^\s*def\s+/.test(line)) {
      return false;
    }
    return new RegExp(`\\b${primary.name}\\s*\\(\\s*[^)]+\\s*\\)`).test(line);
  });
  if (!calledOutsideDef) {
    return {
      valid: false,
      message: pickHint(rules, "missingBooleanHelperCall"),
    };
  }

  if (!isFunctionPrinted(input, primary.name)) {
    return { valid: false, message: pickHint(rules, "missingFunctionPrint") };
  }

  return { valid: true };
}

function hasScoreCalculationLogic(
  bodyText: string,
  params: string[],
): boolean {
  const stripped = stripStringLiterals(bodyText);
  if (params.length < 2) return false;

  const paramsUsed = params.filter((param) =>
    new RegExp(`\\b${param}\\b`).test(stripped),
  );
  if (paramsUsed.length < 2) return false;
  if (!/\*/.test(stripped) || !/-/.test(stripped)) return false;

  return params.some((param) =>
    new RegExp(`\\b${param}\\b\\s*\\*|\\*\\s*\\b${param}\\b`).test(stripped),
  );
}

function hasNegativeScoreClamp(bodyText: string): boolean {
  const stripped = stripStringLiterals(bodyText);

  if (/max\s*\(\s*0\s*,/.test(stripped)) {
    return true;
  }

  if (/if\s+\w+\s*<\s*0/.test(stripped)) {
    if (/=\s*0\b/.test(stripped) || /return\s+0\b/.test(stripped)) {
      return true;
    }
  }

  return false;
}

function validateScoreCalculatorFunctionMode(
  input: string,
  rules: StepValidation,
): ValidationResult {
  const defs = extractFunctionDefs(input);
  if (defs.length === 0) {
    return {
      valid: false,
      message: pickHint(rules, "missingScoreCalculatorFunctionDef"),
    };
  }

  const primary = defs[0]!;
  if (primary.params.length < 2) {
    return {
      valid: false,
      message: pickHint(rules, "missingScoreCalculatorTwoParams"),
    };
  }

  const bodyLines = getFunctionBodyLines(input, primary.name);
  const bodyText = bodyLines.join("\n");

  if (!hasScoreCalculationLogic(bodyText, primary.params)) {
    return { valid: false, message: pickHint(rules, "missingScoreCalculation") };
  }

  if (!hasNegativeScoreClamp(bodyText)) {
    return {
      valid: false,
      message: pickHint(rules, "missingScoreNegativeClamp"),
    };
  }

  const hasReturnInBody = bodyLines.some((line) => /^\s*return\b/.test(line));
  if (!hasReturnInBody) {
    return {
      valid: false,
      message: pickHint(rules, "missingScoreCalculatorReturn"),
    };
  }

  if (!isFunctionPrinted(input, primary.name)) {
    return {
      valid: false,
      message: pickHint(rules, "missingScoreCalculatorPrint"),
    };
  }

  if (countTopLevelFunctionCalls(input, primary.name) === 0) {
    return {
      valid: false,
      message: pickHint(rules, "missingScoreCalculatorPrint"),
    };
  }

  return { valid: true };
}

function validateMathFunctionAddAndPrintMode(
  input: string,
  rules: StepValidation,
): ValidationResult {
  const defs = extractFunctionDefs(input);
  if (defs.length === 0) {
    return { valid: false, message: pickHint(rules, "missingFunctionDef") };
  }

  const primary = defs[0]!;
  if (primary.params.length < 2) {
    return {
      valid: false,
      message: pickHint(rules, "missingMathFunctionTwoParams"),
    };
  }

  const bodyLines = getFunctionBodyLines(input, primary.name);
  const bodyText = bodyLines.join("\n");

  const returnMap = getFunctionReturnMap(input);
  const returnExpr = returnMap.get(primary.name);
  if (!returnExpr) {
    return {
      valid: false,
      message: pickHint(rules, "missingMathFunctionReturn"),
    };
  }

  if (!hasAdditionOutsideStrings(bodyText)) {
    return { valid: false, message: pickHint(rules, "missingAddition") };
  }

  if (!isFunctionPrinted(input, primary.name)) {
    return { valid: false, message: pickHint(rules, "missingFunctionPrint") };
  }

  if (countTopLevelFunctionCalls(input, primary.name) === 0) {
    return {
      valid: false,
      message: pickHint(rules, "missingMathFunctionCall"),
    };
  }

  return { valid: true };
}

function validateFunctionReturnAndPrintMode(
  input: string,
  rules: StepValidation,
): ValidationResult {
  const defs = extractFunctionDefs(input);
  if (defs.length === 0) {
    return { valid: false, message: pickHint(rules, "missingFunctionDef") };
  }

  const primary = defs[0]!;
  if (primary.params.length === 0) {
    return { valid: false, message: pickHint(rules, "missingFunctionParam") };
  }

  const returns = getReturnExpressions(input);
  if (returns.length === 0) {
    return { valid: false, message: pickHint(rules, "missingFunctionReturn") };
  }

  const returnExpr = returns[0]!;
  if (!returnUsesParam(returnExpr, primary.params)) {
    return {
      valid: false,
      message: pickHint(rules, "missingFunctionParamInReturn"),
    };
  }

  if (!/merhaba/i.test(returnExpr)) {
    return {
      valid: false,
      message: pickHint(rules, "missingFunctionGreeting"),
    };
  }

  const called = defs.some((def) =>
    hasDefinedFunctionCallWithString(input, def.name),
  );
  if (!called) {
    return { valid: false, message: pickHint(rules, "missingFunctionCall") };
  }

  if (!hasPrintCall(input)) {
    return { valid: false, message: pickHint(rules, "missingFunctionPrint") };
  }

  return { valid: true };
}

function getFunctionReturnMap(input: string): Map<string, string | undefined> {
  const result = new Map<string, string | undefined>();
  const lines = nonEmptyLines(input);
  let currentFunc: string | null = null;

  for (const line of lines) {
    const defMatch = line.match(/^\s*def\s+([a-zA-Z_]\w*)\s*\(/);
    if (defMatch?.[1]) {
      currentFunc = defMatch[1];
      result.set(currentFunc, undefined);
      continue;
    }
    if (currentFunc && /^\s*return\b/.test(line)) {
      result.set(currentFunc, line.replace(/^\s*return\s+/, "").trim());
      continue;
    }
    if (/^\s*print\s*\(/i.test(line)) {
      currentFunc = null;
    }
  }

  return result;
}

function validateReturnFStringParams(
  expr: string,
  params: string[],
  rules: StepValidation,
): ValidationResult | null {
  const match = expr.match(/^f(["'])([\s\S]*)\1\s*$/);
  if (!match) return null;

  const content = match[2] ?? "";
  const varRefs = [...content.matchAll(FSTRING_VAR_REF)].map((m) => m[1] ?? "");
  const allowed = new Set(params);

  for (const varName of varRefs) {
    if (!allowed.has(varName)) {
      return {
        valid: false,
        message: pickHint(rules, "undefinedFunctionFStringVariable"),
      };
    }
  }

  return null;
}

function isFunctionPrinted(input: string, funcName: string): boolean {
  return new RegExp(`print\\s*\\(\\s*${funcName}\\s*\\(`, "i").test(input);
}

function validateTwoGreetingFunctionsMode(
  input: string,
  rules: StepValidation,
): ValidationResult {
  const defs = extractFunctionDefs(input);
  if (defs.length < 2) {
    return { valid: false, message: pickHint(rules, "missingTwoFunctions") };
  }

  const oneParamFunc = defs.find((d) => d.params.length === 1);
  const twoParamFunc = defs.find((d) => d.params.length === 2);

  if (!oneParamFunc) {
    return {
      valid: false,
      message: pickHint(rules, "missingGreetingOneParam"),
    };
  }
  if (!twoParamFunc) {
    return {
      valid: false,
      message: pickHint(rules, "missingGreetingTwoParam"),
    };
  }

  const returnMap = getFunctionReturnMap(input);
  const targets = [oneParamFunc, twoParamFunc];

  for (const func of targets) {
    const returnExpr = returnMap.get(func.name);
    if (!returnExpr) {
      return {
        valid: false,
        message: pickHint(rules, "missingTwoFunctionReturn"),
      };
    }

    const fStringError = validateReturnFStringParams(
      returnExpr,
      func.params,
      rules,
    );
    if (fStringError) return fStringError;

    if (!returnUsesParam(returnExpr, func.params)) {
      return {
        valid: false,
        message: pickHint(rules, "missingTwoFunctionParamInReturn"),
      };
    }
  }

  for (const func of targets) {
    if (!isFunctionPrinted(input, func.name)) {
      return {
        valid: false,
        message: pickHint(rules, "missingTwoFunctionCall"),
      };
    }
  }

  const printCount = nonEmptyLines(input).filter((line) =>
    /^print\s*\(/i.test(line),
  ).length;
  if (printCount < 2) {
    return {
      valid: false,
      message: pickHint(rules, "missingTwoFunctionPrint"),
    };
  }

  return { valid: true };
}

function extractGlobalAssignmentsBeforeDef(input: string): Set<string> {
  const globals = new Set<string>();
  for (const line of nonEmptyLines(input)) {
    if (/^\s*def\s+/.test(line)) break;
    const assignMatch = line.match(ASSIGNMENT_LINE_PARSE);
    if (assignMatch?.[1]) {
      globals.add(assignMatch[1]);
    }
  }
  return globals;
}

function getFunctionBodyLines(input: string, funcName: string): string[] {
  const lines = nonEmptyLines(input);
  const body: string[] = [];
  let capturing = false;

  for (const line of lines) {
    if (new RegExp(`^\\s*def\\s+${funcName}\\s*\\(`).test(line)) {
      capturing = true;
      continue;
    }
    if (!capturing) continue;
    if (/^\s*def\s+\w/.test(line)) break;
    if (new RegExp(`^\\s*${funcName}\\s*\\(`).test(line)) break;
    body.push(line);
  }

  return body;
}

function countTopLevelFunctionCalls(input: string, funcName: string): number {
  return nonEmptyLines(input).filter((line) => {
    if (/^\s*def\s+/.test(line)) return false;
    return new RegExp(`\\b${funcName}\\s*\\(`, "i").test(line);
  }).length;
}

function getTopLevelLinesAfterFunction(
  input: string,
  funcName: string,
): string[] {
  const lines = nonEmptyLines(input);
  let lastCallIdx = -1;

  for (let i = 0; i < lines.length; i++) {
    if (/^\s*def\s+/.test(lines[i] ?? "")) continue;
    if (new RegExp(`\\b${funcName}\\s*\\(`, "i").test(lines[i] ?? "")) {
      lastCallIdx = i;
    }
  }

  if (lastCallIdx < 0) return [];
  return lines.slice(lastCallIdx + 1);
}

function checkFStringLineScopes(
  line: string,
  allowed: Set<string>,
  rules: StepValidation,
): ValidationResult | null {
  const fMatch = line.match(/print\s*\(\s*f(["'])([\s\S]*?)\1/);
  if (!fMatch) return null;

  const refs = [...(fMatch[2] ?? "").matchAll(FSTRING_VAR_REF)].map(
    (m) => m[1] ?? "",
  );
  for (const ref of refs) {
    if (!allowed.has(ref)) {
      return {
        valid: false,
        message: pickHint(rules, "undefinedQuizFStringVariable"),
      };
    }
  }

  return null;
}

function validateQuizFStrings(
  input: string,
  func: { name: string; params: string[] },
  globalVars: Set<string>,
  rules: StepValidation,
): ValidationResult | null {
  const allowed = new Set([...globalVars, ...func.params]);
  const bodyVars = new Set<string>();

  for (const line of getFunctionBodyLines(input, func.name)) {
    const globalMatch = line.match(/^\s*global\s+(.+)/);
    if (globalMatch) {
      globalMatch[1]
        .split(",")
        .forEach((name) => allowed.add(name.trim()));
    }

    const assignMatch = line.match(ASSIGNMENT_LINE_PARSE);
    if (assignMatch?.[1]) {
      bodyVars.add(assignMatch[1]);
    }

    const err = checkFStringLineScopes(
      line,
      new Set([...allowed, ...bodyVars]),
      rules,
    );
    if (err) return err;
  }

  const topGlobals = new Set(globalVars);
  for (const line of getTopLevelLinesAfterFunction(input, func.name)) {
    const assignMatch = line.match(ASSIGNMENT_LINE_PARSE);
    if (assignMatch?.[1]) {
      topGlobals.add(assignMatch[1]);
    }

    const err = checkFStringLineScopes(line, topGlobals, rules);
    if (err) return err;
  }

  return null;
}

function findQuizFunction(
  defs: { name: string; params: string[] }[],
): { name: string; params: string[] } | null {
  const named = defs.find((d) => d.name === "soru_sor");
  if (named) return named;
  return defs.find((d) => d.params.length >= 2) ?? null;
}

function validateQuizFunctionProjectMode(
  input: string,
  rules: StepValidation,
): ValidationResult {
  if (hasWrongCaseInput(input)) {
    return { valid: false, message: pickHint(rules, "wrongCaseInput") };
  }

  const defs = extractFunctionDefs(input);
  if (defs.length === 0) {
    return { valid: false, message: pickHint(rules, "missingQuizFunction") };
  }

  const quizFunc = findQuizFunction(defs);
  if (!quizFunc) {
    return { valid: false, message: pickHint(rules, "missingQuizFunction") };
  }

  if (quizFunc.params.length < 2) {
    return {
      valid: false,
      message: pickHint(rules, "missingQuizTwoParams"),
    };
  }

  const bodyLines = getFunctionBodyLines(input, quizFunc.name);
  const bodyText = bodyLines.join("\n");

  if (!/input\s*\(/i.test(bodyText)) {
    return { valid: false, message: pickHint(rules, "missingQuizInput") };
  }

  if (!/^\s*if\s+/im.test(bodyText)) {
    return { valid: false, message: pickHint(rules, "missingQuizIf") };
  }

  if (countTopLevelFunctionCalls(input, quizFunc.name) < 2) {
    return { valid: false, message: pickHint(rules, "missingQuizTwoCalls") };
  }

  const topLevelAfter = getTopLevelLinesAfterFunction(input, quizFunc.name);
  const hasEndingMessage = topLevelAfter.some((line) =>
    /^print\s*\(/i.test(line),
  );
  if (!hasEndingMessage) {
    return {
      valid: false,
      message: pickHint(rules, "missingQuizEndingMessage"),
    };
  }

  const globalVars = extractGlobalAssignmentsBeforeDef(input);
  const fStringError = validateQuizFStrings(input, quizFunc, globalVars, rules);
  if (fStringError) return fStringError;

  if (!hasPrintCall(input)) {
    return { valid: false, message: pickHint(rules, "missingQuizPrint") };
  }

  return { valid: true };
}

function validateMiniProjectMode(
  input: string,
  rules: StepValidation,
): ValidationResult {
  const { parsed, error } = parseSubmission(input, rules);
  if (error) return error;

  if (rules.mustIncludeAssignment) {
    const minAssignments = rules.minAssignmentCount ?? 1;
    if (parsed.assignmentCount < minAssignments) {
      return {
        valid: false,
        message: pickHint(
          rules,
          minAssignments >= 2 ? "missingAssignmentCount" : "missingAssignment",
        ),
      };
    }
  }

  if (rules.mustIncludePrint) {
    const minPrints = rules.minPrintCount ?? 1;
    if (parsed.printCount < minPrints) {
      return {
        valid: false,
        message: pickHint(
          rules,
          minPrints >= 2 ? printCountHintKey(minPrints) : "missingPrint",
        ),
      };
    }
  }

  if (rules.mustIncludeDef && !/def\s+\w/i.test(input)) {
    return { valid: false, message: pickHint(rules, "missingStructure") };
  }

  if (rules.mustIncludeIf && !/^\s*if\s+/im.test(input)) {
    return { valid: false, message: pickHint(rules, "missingStructure") };
  }

  if (rules.mustIncludeLoop && !/^\s*(for|while)\s+/im.test(input)) {
    return { valid: false, message: pickHint(rules, "missingStructure") };
  }

  if (rules.requiresBoolean && parsed.booleanAssignmentCount === 0) {
    return { valid: false, message: pickHint(rules, "missingBoolean") };
  }

  if (rules.requiresFString && parsed.fStringPrintCount === 0) {
    return { valid: false, message: pickHint(rules, "missingFString") };
  }

  for (const required of rules.requiredIncludes ?? []) {
    if (!input.toLowerCase().includes(required.toLowerCase())) {
      return { valid: false, message: pickHint(rules, "missingKeyword") };
    }
  }

  const anyKeywords = rules.requiredAnyIncludes ?? [];
  if (anyKeywords.length > 0) {
    const hasAny = anyKeywords.some((keyword) =>
      input.toLowerCase().includes(keyword.toLowerCase()),
    );
    if (!hasAny) {
      return { valid: false, message: pickHint(rules, "missingAnyKeyword") };
    }
  }

  for (const pattern of rules.requiredPatterns ?? []) {
    const regex = new RegExp(pattern, "i");
    if (!regex.test(input)) {
      if (pattern.includes("print")) {
        return { valid: false, message: pickHint(rules, "missingPrint") };
      }
      if (pattern.includes("True|False")) {
        return { valid: false, message: pickHint(rules, "missingBoolean") };
      }
      if (pattern.includes('f["\']')) {
        return { valid: false, message: pickHint(rules, "missingFString") };
      }
      if (pattern === "=" || pattern.includes("=")) {
        return { valid: false, message: pickHint(rules, "missingAssignment") };
      }
      return { valid: false, message: pickHint(rules, "missingStructure") };
    }
  }

  return { valid: true };
}

function validateExtraRequirements(
  input: string,
  rules: StepValidation,
): ValidationResult {
  for (const required of rules.requiredIncludes ?? []) {
    if (!input.toLowerCase().includes(required.toLowerCase())) {
      return { valid: false, message: pickHint(rules, "missingKeyword") };
    }
  }

  const anyKeywords = rules.requiredAnyIncludes ?? [];
  if (anyKeywords.length > 0) {
    const hasAny = anyKeywords.some((keyword) =>
      input.toLowerCase().includes(keyword.toLowerCase()),
    );
    if (!hasAny) {
      return { valid: false, message: pickHint(rules, "missingAnyKeyword") };
    }
  }

  for (const pattern of rules.requiredPatterns ?? []) {
    if (
      pattern.includes("True|False") ||
      pattern.includes('f["\']') ||
      pattern.includes("def") ||
      pattern.includes("if") ||
      pattern.includes("return")
    ) {
      continue;
    }

    const regex = new RegExp(pattern, "i");
    if (!regex.test(input)) {
      if (pattern.includes("print")) {
        return { valid: false, message: pickHint(rules, "missingPrint") };
      }
      if (pattern === "=" || pattern.includes("=")) {
        return { valid: false, message: pickHint(rules, "missingAssignment") };
      }
      return { valid: false, message: pickHint(rules, "missingKeyword") };
    }
  }

  return { valid: true };
}

function validateByMode(
  input: string,
  rules: StepValidation,
): ValidationResult {
  switch (rules.validationMode) {
    case "printStringLiteral":
      return validatePrintStringLiteralMode(input, rules);
    case "multiplePrintStringLiteral":
      return validateMultiplePrintStringLiteralMode(input, rules);
    case "variableAssignment":
      return validateVariableAssignmentMode(input, rules);
    case "variableAndPrint":
      return validateVariableAndPrintMode(input, rules);
    case "miniProfile":
      return validateMiniProfileMode(input, rules);
    case "fStringIntro":
      return validateFStringIntroMode(input, rules);
    case "extendedProfileCard":
      return validateExtendedProfileCardMode(input, rules);
    case "miniProject":
      return validateMiniProjectMode(input, rules);
    case "inputSumTwoNumbers":
      return validateInputSumTwoNumbersMode(input, rules);
    case "ageCalculatorBasic":
      return validateAgeCalculatorBasicMode(input, rules);
    case "personalizedAgeOutput":
      return validatePersonalizedAgeOutputMode(input, rules);
    case "ticketPriceRules":
      return validateTicketPriceRulesMode(input, rules);
    case "listAppendAndPrint":
      return validateListAppendAndPrintMode(input, rules);
    case "simpleListAndPrint":
      return validateSimpleListAndPrintMode(input, rules);
    case "listMembershipCheck":
      return validateListMembershipCheckMode(input, rules);
    case "studentGradeAverage":
      return validateStudentGradeAverageMode(input, rules);
    case "categorySpendingTotal":
      return validateCategorySpendingTotalMode(input, rules);
    case "inputNormalizeStripLower":
      return validateInputNormalizeStripLowerMode(input, rules);
    case "wordCountInputSplitLen":
      return validateWordCountInputSplitLenMode(input, rules);
    case "longWordsFilterCount":
      return validateLongWordsFilterCountMode(input, rules);
    case "taskMarkCompleteByName":
      return validateTaskMarkCompleteByNameMode(input, rules);
    case "taskTrackerFullProject":
      return validateTaskTrackerFullProjectMode(input, rules);
    case "habitDictList":
      return validateHabitDictListMode(input, rules);
    case "habitCompletionPercentage":
      return validateHabitCompletionPercentageMode(input, rules);
    case "habitTrackerSummaryFunction":
      return validateHabitTrackerSummaryFunctionMode(input, rules);
    case "listLoopSummary":
      return validateListLoopSummaryMode(input, rules);
    case "spendingSummaryTotal":
      return validateSpendingSummaryTotalMode(input, rules);
    case "spendingSummaryReport":
      return validateSpendingSummaryReportMode(input, rules);
    case "functionReturnAndPrint":
      return validateFunctionReturnAndPrintMode(input, rules);
    case "mathFunctionAddAndPrint":
      return validateMathFunctionAddAndPrintMode(input, rules);
    case "booleanHelperFunction":
      return validateBooleanHelperFunctionMode(input, rules);
    case "twoGreetingFunctions":
      return validateTwoGreetingFunctionsMode(input, rules);
    case "quizFunctionProject":
      return validateQuizFunctionProjectMode(input, rules);
    case "scoreCalculatorFunction":
      return validateScoreCalculatorFunctionMode(input, rules);
    default:
      return { valid: true };
  }
}

function inferTaskRequirements(step: LessonStep, rules: StepValidation): void {
  const checklist = checklistText(step);
  const taskText = `${step.title} ${step.content ?? ""}`.toLowerCase();

  if (
    rules.mustIncludePrint === undefined &&
    (/\bprint\b/.test(checklist) ||
      /print\s*\(|yazdır|çıktı/.test(taskText))
  ) {
    rules.mustIncludePrint = true;
  }

  if (
    rules.mustIncludeAssignment === undefined &&
    (/\b(değişken|atama|variable)\b/.test(checklist) ||
      /\b(değişken|atama)\b/.test(taskText) ||
      /\bsakla\b/.test(taskText))
  ) {
    rules.mustIncludeAssignment = true;
  }

  if (
    rules.mustIncludeDef === undefined &&
    (/\bdef\s/.test(checklist) ||
      /\bdef\s+\w/.test(taskText) ||
      /\bfonksiyon/.test(checklist) ||
      /\bfonksiyon/.test(taskText))
  ) {
    rules.mustIncludeDef = true;
  }

  if (
    rules.mustIncludeIf === undefined &&
    (/\bif\b/.test(checklist) ||
      /\belif\b/.test(checklist) ||
      /\belse\b/.test(checklist) ||
      /\bkoşul\b/.test(checklist) ||
      /\bif\b/.test(taskText) ||
      /\belif\b/.test(taskText) ||
      /\bkoşul\b/.test(taskText))
  ) {
    rules.mustIncludeIf = true;
  }

  if (
    rules.mustIncludeLoop === undefined &&
    (/\b(for|while)\b/.test(checklist) ||
      /\bdöngü\b/.test(checklist) ||
      /\bfor\b/.test(taskText) ||
      /\bwhile\b/.test(taskText) ||
      /\bdöngü\b/.test(taskText))
  ) {
    rules.mustIncludeLoop = true;
  }

  if (
    rules.requiresBoolean === undefined &&
    (/\bboolean\b/.test(checklist) ||
      /\bboolean\b/.test(taskText) ||
      /\bbool\b/.test(checklist))
  ) {
    rules.requiresBoolean = true;
  }

  if (
    rules.requiresFString === undefined &&
    (/f-string/.test(checklist) || /f-string/.test(taskText))
  ) {
    rules.requiresFString = true;
  }
}

export function normalizeValidationMode(
  mode: string | undefined,
): ValidationMode | undefined {
  if (!mode) return undefined;
  if ((VALIDATION_MODES as readonly string[]).includes(mode)) {
    return mode as ValidationMode;
  }
  return LEGACY_MODE_ALIASES[mode];
}

function inferValidationMode(
  step: LessonStep,
  rules: StepValidation,
): ValidationMode {
  const checklist = checklistText(step);
  const taskText = `${step.title} ${step.content ?? ""}`.toLowerCase();
  const countSource = `${checklist} ${taskText}`;

  if (
    rules.requiresBoolean &&
    (rules.minPrintCount ?? 0) >= 3 &&
    rules.requiresFString
  ) {
    return "extendedProfileCard";
  }

  if (
    /\bboolean\b/.test(countSource) &&
    /\ben az 3 print\b/.test(countSource)
  ) {
    return "extendedProfileCard";
  }

  if (taskRequiresPersonalizedAgeOutput(checklist, taskText)) {
    return "personalizedAgeOutput";
  }

  if (taskRequiresTicketPriceRules(checklist, taskText)) {
    return "ticketPriceRules";
  }

  if (taskRequiresListAppendAndPrint(checklist, taskText)) {
    return "listAppendAndPrint";
  }

  if (taskRequiresListLoopSummary(checklist, taskText)) {
    return "listLoopSummary";
  }

  if (taskRequiresFunctionReturnAndPrint(checklist, taskText)) {
    return "functionReturnAndPrint";
  }

  if (taskRequiresTwoGreetingFunctions(checklist, taskText)) {
    return "twoGreetingFunctions";
  }

  if (taskRequiresQuizFunctionProject(checklist, taskText)) {
    return "quizFunctionProject";
  }

  if (
    rules.mustIncludeDef ||
    rules.mustIncludeLoop ||
    rules.mustIncludeIf
  ) {
    return "miniProject";
  }

  if (taskRequiresFString(checklist, taskText, rules)) {
    return "fStringIntro";
  }

  if (
    /\ben az 2 değişken\b/.test(countSource) &&
    /\ben az 2 print\b/.test(countSource)
  ) {
    return "miniProfile";
  }

  if (
    rules.mustIncludeAssignment &&
    rules.mustIncludePrint &&
    !rules.mustIncludeDef &&
    !rules.mustIncludeIf &&
    !rules.mustIncludeLoop
  ) {
    return "variableAndPrint";
  }

  if (rules.mustIncludeAssignment && !rules.mustIncludePrint) {
    return "variableAssignment";
  }

  if (
    rules.mustIncludePrint &&
    !rules.mustIncludeAssignment &&
    (rules.minPrintCount ?? 0) >= 2
  ) {
    return "multiplePrintStringLiteral";
  }

  if (
    rules.mustIncludePrint &&
    !rules.mustIncludeAssignment &&
    /\biki print\b|\b2 print\b|\bbirkaç print\b/.test(countSource)
  ) {
    return "multiplePrintStringLiteral";
  }

  if (rules.mustIncludePrint && !rules.mustIncludeAssignment) {
    return "printStringLiteral";
  }

  if (
    /\biki input\b/.test(countSource) &&
    /int\s*\(|float\s*\(/.test(countSource) &&
    /topla|toplam/.test(countSource)
  ) {
    return "inputSumTwoNumbers";
  }

  if (
    (/doğum yıl|dogum yil/.test(countSource) ||
      /doğum yıl|dogum yil/.test(taskText)) &&
    (/yaş|yas/.test(countSource) || /yaş|yas/.test(taskText)) &&
    (/hesap|çıkar|çıkarma|yazdır/.test(countSource) ||
      /hesap|çıkar|yazdır/.test(taskText)) &&
    !taskRequiresFString(checklist, taskText, rules)
  ) {
    return "ageCalculatorBasic";
  }

  if (step.type === "project-step") {
    return "miniProject";
  }

  if (rules.mustIncludeAssignment) {
    return "variableAssignment";
  }

  return "printStringLiteral";
}

function applyModeDefaults(rules: StepValidation): void {
  switch (rules.validationMode) {
    case "printStringLiteral":
      rules.mustIncludePrint = true;
      rules.mustIncludeAssignment = false;
      rules.requireQuotedStringsInPrint = true;
      break;
    case "multiplePrintStringLiteral":
      rules.mustIncludePrint = true;
      rules.mustIncludeAssignment = false;
      rules.requireQuotedStringsInPrint = true;
      rules.minPrintCount = rules.minPrintCount ?? 2;
      break;
    case "variableAssignment":
      rules.mustIncludeAssignment = true;
      rules.mustIncludePrint = false;
      break;
    case "variableAndPrint":
      rules.mustIncludeAssignment = true;
      rules.mustIncludePrint = true;
      break;
    case "miniProfile":
      rules.mustIncludeAssignment = true;
      rules.mustIncludePrint = true;
      rules.minAssignmentCount = rules.minAssignmentCount ?? 2;
      rules.minPrintCount = rules.minPrintCount ?? 2;
      break;
    case "fStringIntro":
      rules.mustIncludeAssignment = true;
      rules.mustIncludePrint = true;
      rules.requiresFString = true;
      rules.mustIncludeDef = false;
      rules.mustIncludeIf = false;
      rules.mustIncludeLoop = false;
      break;
    case "extendedProfileCard":
      rules.mustIncludeAssignment = true;
      rules.mustIncludePrint = true;
      rules.requiresBoolean = true;
      rules.requiresFString = true;
      rules.minPrintCount = rules.minPrintCount ?? 3;
      rules.mustIncludeDef = false;
      rules.mustIncludeIf = false;
      rules.mustIncludeLoop = false;
      break;
    case "miniProject":
      break;
    case "inputSumTwoNumbers":
      rules.mustIncludePrint = true;
      rules.mustLookLikePython = true;
      break;
    case "ageCalculatorBasic":
      rules.mustIncludePrint = true;
      rules.mustLookLikePython = true;
      break;
    case "personalizedAgeOutput":
      rules.mustIncludePrint = true;
      rules.mustLookLikePython = true;
      rules.requiresFString = true;
      break;
    case "ticketPriceRules":
      rules.mustIncludePrint = true;
      rules.mustLookLikePython = true;
      rules.mustIncludeIf = true;
      break;
    case "listAppendAndPrint":
      rules.mustIncludePrint = true;
      rules.mustLookLikePython = true;
      rules.mustIncludeAssignment = true;
      break;
    case "simpleListAndPrint":
      rules.mustLookLikePython = true;
      rules.mustIncludeAssignment = false;
      rules.mustIncludeLoop = false;
      break;
    case "listMembershipCheck":
      rules.mustLookLikePython = true;
      rules.mustIncludeAssignment = false;
      rules.mustIncludePrint = true;
      break;
    case "studentGradeAverage":
      rules.mustLookLikePython = true;
      rules.mustIncludeAssignment = false;
      rules.mustIncludePrint = true;
      break;
    case "categorySpendingTotal":
      rules.mustLookLikePython = true;
      rules.mustIncludeAssignment = false;
      rules.mustIncludePrint = true;
      rules.requiresFString = false;
      break;
    case "inputNormalizeStripLower":
      rules.mustLookLikePython = true;
      rules.mustIncludeAssignment = false;
      rules.mustIncludePrint = true;
      break;
    case "wordCountInputSplitLen":
      rules.mustLookLikePython = true;
      rules.mustIncludeAssignment = false;
      rules.mustIncludePrint = true;
      break;
    case "longWordsFilterCount":
      rules.mustLookLikePython = true;
      rules.mustIncludeAssignment = false;
      rules.mustIncludePrint = true;
      rules.mustIncludeLoop = false;
      rules.mustIncludeIf = false;
      break;
    case "taskMarkCompleteByName":
      rules.mustLookLikePython = true;
      rules.mustIncludeAssignment = false;
      rules.mustIncludePrint = true;
      rules.mustIncludeLoop = false;
      rules.mustIncludeIf = false;
      rules.mustIncludeDef = false;
      break;
    case "taskTrackerFullProject":
      rules.mustLookLikePython = true;
      rules.mustIncludeAssignment = false;
      rules.mustIncludePrint = false;
      rules.mustIncludeLoop = false;
      rules.mustIncludeIf = false;
      rules.mustIncludeDef = false;
      rules.requiresFString = false;
      break;
    case "habitDictList":
      rules.mustLookLikePython = true;
      rules.mustIncludeAssignment = false;
      rules.mustIncludeLoop = false;
      rules.requiresBoolean = false;
      break;
    case "habitCompletionPercentage":
      rules.mustLookLikePython = true;
      rules.mustIncludeAssignment = false;
      rules.mustIncludeLoop = false;
      rules.requiresFString = false;
      rules.requiresBoolean = false;
      break;
    case "habitTrackerSummaryFunction":
      rules.mustLookLikePython = true;
      rules.mustIncludeAssignment = false;
      rules.mustIncludeLoop = false;
      rules.requiresFString = false;
      rules.requiresBoolean = false;
      rules.mustIncludeDef = false;
      break;
    case "listLoopSummary":
      rules.mustIncludePrint = true;
      rules.mustLookLikePython = true;
      rules.mustIncludeLoop = true;
      break;
    case "spendingSummaryTotal":
      rules.mustIncludePrint = true;
      rules.mustLookLikePython = true;
      rules.mustIncludeAssignment = false;
      break;
    case "spendingSummaryReport":
      rules.mustIncludePrint = true;
      rules.mustLookLikePython = true;
      rules.mustIncludeAssignment = false;
      break;
    case "functionReturnAndPrint":
      rules.mustLookLikePython = true;
      break;
    case "mathFunctionAddAndPrint":
      rules.mustLookLikePython = true;
      rules.mustIncludeAssignment = false;
      break;
    case "booleanHelperFunction":
      rules.mustLookLikePython = true;
      rules.mustIncludeDef = true;
      rules.mustIncludePrint = true;
      rules.mustIncludeAssignment = false;
      break;
    case "twoGreetingFunctions":
      rules.mustLookLikePython = true;
      break;
    case "quizFunctionProject":
      rules.mustLookLikePython = true;
      break;
    case "scoreCalculatorFunction":
      rules.mustLookLikePython = true;
      rules.mustIncludeDef = true;
      rules.mustIncludePrint = true;
      rules.mustIncludeAssignment = false;
      break;
  }
}

function taskRequiresListLoopSummary(
  checklist: string,
  taskText: string,
): boolean {
  const countSource = `${checklist} ${taskText}`;
  return (
    /append/.test(countSource) &&
    (/for|döngü/.test(countSource)) &&
    (/len|toplam|ürün sayısı|satırda/.test(countSource))
  );
}

function taskRequiresFunctionReturnAndPrint(
  checklist: string,
  taskText: string,
): boolean {
  const source = `${checklist} ${taskText}`;
  return (
    (/def|fonksiyon/.test(source)) &&
    (/return|döndür/.test(source)) &&
    (/print|yazdır/.test(source)) &&
    (/parametre|isim/.test(source) || /merhaba/.test(source)) &&
    !/iki.*fonksiyon|2 fonksiyon|resmi_selam/i.test(source)
  );
}

function taskRequiresTwoGreetingFunctions(
  checklist: string,
  taskText: string,
): boolean {
  const source = `${checklist} ${taskText}`;
  return (
    (/iki.*fonksiyon|2 fonksiyon|ikisini de/i.test(source)) &&
    (/def|fonksiyon/.test(source)) &&
    (/çağır|yazdır|print/.test(source))
  );
}

function taskRequiresQuizFunctionProject(
  checklist: string,
  taskText: string,
): boolean {
  const source = `${checklist} ${taskText}`;
  return (
    (/soru_sor|quiz/.test(source)) &&
    (/fonksiyon|def/.test(source)) &&
    (/en az 2 soru|2 soru|iki soru/.test(source)) &&
    (/bitiş|bitis/.test(source))
  );
}

function taskRequiresListAppendAndPrint(
  checklist: string,
  taskText: string,
): boolean {
  const countSource = `${checklist} ${taskText}`;
  return (
    /liste/.test(countSource) &&
    /append/.test(countSource) &&
    (/yazdır|print|eleman/.test(countSource))
  );
}

function taskRequiresTicketPriceRules(
  checklist: string,
  taskText: string,
): boolean {
  const countSource = `${checklist} ${taskText}`;
  return (
    (/fiyat/.test(countSource)) &&
    (/if|elif|else|koşul/.test(countSource)) &&
    (/yaş|yas/.test(countSource))
  );
}

function taskRequiresPersonalizedAgeOutput(
  checklist: string,
  taskText: string,
): boolean {
  const hasNameAndAgeFormat =
    /merhaba/.test(taskText) && /yaşın|yasin/.test(taskText);
  const hasInputAgeFString =
    /f-string/.test(checklist) &&
    (/doğum yıl|dogum yil/.test(checklist) ||
      /doğum yıl|dogum yil/.test(taskText)) &&
    (/isim|ad\b|kullanıcı ad/.test(checklist) ||
      /kullanıcı ad|isim|adını/.test(taskText));

  return hasNameAndAgeFormat || hasInputAgeFString;
}

function taskRequiresFString(
  checklist: string,
  taskText: string,
  rules: StepValidation,
): boolean {
  if (/f-string/.test(checklist) || /f-string/.test(taskText)) {
    return true;
  }
  return (rules.requiredPatterns ?? []).some((pattern) =>
    pattern.includes('f["\']'),
  );
}

function checklistText(step: LessonStep): string {
  return (step.checklist ?? []).join(" ").toLowerCase();
}

export function mergeTaskValidation(step: LessonStep): StepValidation {
  const checklist = checklistText(step);
  const taskText = `${step.title} ${step.content ?? ""}`.toLowerCase();
  const merged: StepValidation = {
    minLength: 12,
    ...step.validation,
    mustLookLikePython: step.validation?.mustLookLikePython ?? true,
  };

  inferTaskRequirements(step, merged);

  merged.validationMode =
    normalizeValidationMode(merged.validationMode) ??
    inferValidationMode(step, merged);

  if (merged.validationMode === "printStringLiteral") {
    const legacyMode = step.validation?.validationMode;
    if (legacyMode === "selfIntroPrint" || /kendini tanıt|kendini tanıtan/.test(taskText)) {
      merged.selfIntroMinChars = 5;
    }
  }

  applyModeDefaults(merged);

  const countSource = `${checklist} ${taskText}`;
  if (/\ben az 2 değişken\b/.test(countSource)) {
    merged.minAssignmentCount = merged.minAssignmentCount ?? 2;
  }
  if (/\ben az 2 print\b/.test(countSource)) {
    merged.minPrintCount = merged.minPrintCount ?? 2;
  }
  if (/\ben az 3 print\b/.test(countSource)) {
    merged.minPrintCount = merged.minPrintCount ?? 3;
  }

  return merged;
}

export function validateCodeAnswer(
  input: string,
  validation?: StepValidation,
): ValidationResult {
  const trimmed = input.trim();
  const rules: StepValidation = {
    mustLookLikePython: true,
    ...validation,
  };

  if (!trimmed) {
    return { valid: false, message: pickHint(rules, "empty") };
  }

  const forbidden = [
    ...JUNK_EXACT,
    ...(rules.forbiddenExactAnswers ?? []).map((v) => v.toLowerCase()),
  ];
  const normalized = trimmed.toLowerCase().replace(/\s+/g, " ").trim();
  if (forbidden.includes(normalized)) {
    return { valid: false, message: pickHint(rules, "junk") };
  }

  if (isJunkInput(trimmed) || isLoneKeyword(trimmed)) {
    return { valid: false, message: pickHint(rules, "junk") };
  }

  if (isBareAssignmentFragment(trimmed)) {
    return { valid: false, message: pickHint(rules, "incompleteAssignment") };
  }

  for (const pattern of rules.rejectPatterns ?? []) {
    const regex = new RegExp(pattern, "i");
    if (regex.test(trimmed)) {
      return { valid: false, message: pickHint(rules, "junk") };
    }
  }

  if (hasConsoleLog(trimmed)) {
    return { valid: false, message: pickHint(rules, "consoleLog") };
  }

  if (hasWrongCasePrint(trimmed)) {
    return { valid: false, message: pickHint(rules, "wrongCasePrint") };
  }

  if (trimmed.length < (rules.minLength ?? 10)) {
    return { valid: false, message: pickHint(rules, "tooShort") };
  }

  if (rules.mustLookLikePython !== false && !looksLikePythonCode(trimmed)) {
    return { valid: false, message: pickHint(rules, "notPython") };
  }

  if (rules.minLines) {
    const lineCount = countNonEmptyLines(trimmed);
    if (lineCount < rules.minLines) {
      return { valid: false, message: pickHint(rules, "missingLines") };
    }
  }

  if (rules.validationMode) {
    const modeResult = validateByMode(trimmed, rules);
    if (!modeResult.valid) {
      return modeResult;
    }
    const extraResult = validateExtraRequirements(trimmed, rules);
    if (!extraResult.valid) {
      return extraResult;
    }
    return { valid: true };
  }

  return { valid: false, message: pickHint(rules, "missingStructure") };
}

export function validateTaskStep(
  input: string,
  step: LessonStep,
): ValidationResult {
  return validateCodeAnswer(input, mergeTaskValidation(step));
}

/** Fixture tests for dev validation script. */
export const CODE_VALIDATION_FIXTURES: {
  name: string;
  mode: ValidationMode;
  rules?: Partial<StepValidation>;
  input: string;
  expectValid: boolean;
  expectMessage?: RegExp;
}[] = [
  {
    name: "printStringLiteral — çift tırnak kabul",
    mode: "printStringLiteral",
    input: 'print("Merhaba")',
    expectValid: true,
  },
  {
    name: "printStringLiteral — tek tırnak kabul",
    mode: "printStringLiteral",
    input: "print('Merhaba')",
    expectValid: true,
  },
  {
    name: "printStringLiteral — Print büyük harf ret",
    mode: "printStringLiteral",
    input: 'Print("Merhaba")',
    expectValid: false,
    expectMessage: /küçük harfle/,
  },
  {
    name: "printStringLiteral — tırnaksız ret",
    mode: "printStringLiteral",
    input: "print(Merhaba)",
    expectValid: false,
    expectMessage: /tırnak/,
  },
  {
    name: "printStringLiteral — console.log ret",
    mode: "printStringLiteral",
    input: 'console.log("Merhaba")',
    expectValid: false,
    expectMessage: /JavaScript/,
  },
  {
    name: "variableAssignment — string kabul",
    mode: "variableAssignment",
    input: 'ad = "Efe"',
    expectValid: true,
  },
  {
    name: "variableAssignment — sayı kabul",
    mode: "variableAssignment",
    input: "yas = 18",
    expectValid: true,
  },
  {
    name: "variableAssignment — tırnaksız string ret",
    mode: "variableAssignment",
    input: "ad = Efe",
    expectValid: false,
    expectMessage: /tırnak/,
  },
  {
    name: "variableAssignment — yazılı sayı ret",
    mode: "variableAssignment",
    input: "yas = onsekiz",
    expectValid: false,
    expectMessage: /tırnak/,
  },
  {
    name: "variableAssignment — True kabul",
    mode: "variableAssignment",
    input: "aktif = True",
    expectValid: true,
  },
  {
    name: "variableAssignment — true küçük harf ret",
    mode: "variableAssignment",
    input: "aktif = true",
    expectValid: false,
    expectMessage: /boolean|True|False/,
  },
  {
    name: "variableAndPrint — doğru",
    mode: "variableAndPrint",
    input: 'ad = "Efe"\nprint(ad)',
    expectValid: true,
  },
  {
    name: "variableAndPrint — tırnaksız assignment ret",
    mode: "variableAndPrint",
    input: "ad = Efe\nprint(ad)",
    expectValid: false,
    expectMessage: /tırnak/,
  },
  {
    name: "miniProfile — doğru",
    mode: "miniProfile",
    input: 'ad = "Efe"\nyas = 18\nprint(ad)\nprint(yas)',
    expectValid: true,
  },
  {
    name: "miniProfile — tırnaksız assignment ret",
    mode: "miniProfile",
    input: "ad = Efe\nyas = 18\nprint(ad)\nprint(yas)",
    expectValid: false,
    expectMessage: /tırnak/,
  },
  {
    name: "miniProfile — eksik print ret",
    mode: "miniProfile",
    input: 'ad = "Efe"\nprint(ad)',
    expectValid: false,
    expectMessage: /değişken|print/,
  },
  {
    name: "fStringIntro — doğru",
    mode: "fStringIntro",
    input: 'ad = "Efe"\nprint(f"Adım: {ad}")',
    expectValid: true,
  },
  {
    name: "fStringIntro — f-string yok ret",
    mode: "fStringIntro",
    input: 'ad = "Efe"\nprint("Adım: {ad}")',
    expectValid: false,
    expectMessage: /f-string/,
  },
  {
    name: "fStringIntro — tanımsız değişken ret",
    mode: "fStringIntro",
    input: 'ad = "Efe"\nprint(f"Adım: {isim}")',
    expectValid: false,
    expectMessage: /tanımlamalısın/,
  },
  {
    name: "extendedProfileCard — eksik boolean ret",
    mode: "extendedProfileCard",
    input:
      'ad = "Efe"\nsehir = "Kocaeli"\nyas = 19\nprint(f"Ad: {ad}")\nprint(f"Şehir: {sehir}")\nprint(f"Yaş: {yas}")',
    expectValid: false,
    expectMessage: /boolean/,
  },
  {
    name: "extendedProfileCard — doğru kabul",
    mode: "extendedProfileCard",
    input:
      'ad = "Efe"\nsehir = "Kocaeli"\nyas = 19\nogrenci_mi = True\nprint(f"Ad: {ad}")\nprint(f"Şehir: {sehir}")\nprint(f"Yaş: {yas}")\nprint(f"Öğrenci mi: {ogrenci_mi}")',
    expectValid: true,
  },
  {
    name: "extendedProfileCard — boolean string sayılmaz",
    mode: "extendedProfileCard",
    rules: { minPrintCount: 1 },
    input: 'aktif = "True"\nprint(f"Aktif: {aktif}")',
    expectValid: false,
    expectMessage: /boolean/,
  },
  {
    name: "extendedProfileCard — true küçük harf ret",
    mode: "extendedProfileCard",
    rules: { minPrintCount: 1 },
    input: 'aktif = true\nprint(f"Aktif: {aktif}")',
    expectValid: false,
    expectMessage: /boolean|True|False/,
  },
  {
    name: "inputSumTwoNumbers — tam çözüm kabul",
    mode: "inputSumTwoNumbers",
    input:
      'sayi1 = int(input("Birinci sayıyı gir: "))\nsayi2 = int(input("İkinci sayıyı gir: "))\ntoplam = sayi1 + sayi2\nprint("Toplam:", toplam)',
    expectValid: true,
  },
  {
    name: "inputSumTwoNumbers — kısa çözüm kabul",
    mode: "inputSumTwoNumbers",
    input:
      'a = int(input("İlk sayı: "))\nb = int(input("İkinci sayı: "))\nprint("Sonuç:", a + b)',
    expectValid: true,
  },
  {
    name: "inputSumTwoNumbers — float kabul",
    mode: "inputSumTwoNumbers",
    input:
      'x = float(input("Birinci sayı: "))\ny = float(input("İkinci sayı: "))\nprint("Toplam:", x + y)',
    expectValid: true,
  },
  {
    name: "inputSumTwoNumbers — int/float yok ret",
    mode: "inputSumTwoNumbers",
    input:
      'a = input("İlk sayı: ")\nb = input("İkinci sayı: ")\nprint(a + b)',
    expectValid: false,
    expectMessage: /sayıya çevir/,
  },
  {
    name: "inputSumTwoNumbers — tek input ret",
    mode: "inputSumTwoNumbers",
    input: 'a = int(input("İlk sayı: "))\nprint(a)',
    expectValid: false,
    expectMessage: /iki input/,
  },
  {
    name: "inputSumTwoNumbers — print yok ret",
    mode: "inputSumTwoNumbers",
    input:
      'a = int(input("İlk sayı: "))\nb = int(input("İkinci sayı: "))\ntoplam = a + b',
    expectValid: false,
    expectMessage: /print/,
  },
  {
    name: "inputSumTwoNumbers — toplama yok ret",
    mode: "inputSumTwoNumbers",
    input:
      'a = int(input("İlk sayı: "))\nb = int(input("İkinci sayı: "))\nprint(a)',
    expectValid: false,
    expectMessage: /\+/,
  },
  {
    name: "inputSumTwoNumbers — boş prompt ret",
    mode: "inputSumTwoNumbers",
    input: "a = int(input())\nb = int(input())\nprint(a + b)",
    expectValid: false,
    expectMessage: /input\(\) içine/,
  },
  {
    name: "inputSumTwoNumbers — Print büyük harf ret",
    mode: "inputSumTwoNumbers",
    input:
      'a = int(input("İlk sayı: "))\nb = int(input("İkinci sayı: "))\nPrint(a + b)',
    expectValid: false,
    expectMessage: /print küçük harfle/,
  },
  {
    name: "ageCalculatorBasic — kısa çözüm kabul",
    mode: "ageCalculatorBasic",
    input: "dogum_yili = int(input())\nprint(2026 - dogum_yili)",
    expectValid: true,
  },
  {
    name: "ageCalculatorBasic — promptlu çözüm kabul",
    mode: "ageCalculatorBasic",
    input:
      'dogum_yili = int(input("Doğum yılını gir: "))\nyas = 2026 - dogum_yili\nprint(yas)',
    expectValid: true,
  },
  {
    name: "ageCalculatorBasic — farklı değişken adı kabul",
    mode: "ageCalculatorBasic",
    input:
      'yil = int(input("Doğum yılın: "))\nprint(2026 - yil)',
    expectValid: true,
  },
  {
    name: "ageCalculatorBasic — etiketli print kabul",
    mode: "ageCalculatorBasic",
    input:
      'dogum_yili = int(input("Doğum yılını gir: "))\nyas = 2026 - dogum_yili\nprint("Yaşın:", yas)',
    expectValid: true,
  },
  {
    name: "ageCalculatorBasic — int yok ret",
    mode: "ageCalculatorBasic",
    input: "dogum_yili = input()\nprint(2026 - dogum_yili)",
    expectValid: false,
    expectMessage: /sayıya çevir/,
  },
  {
    name: "ageCalculatorBasic — çıkarma yok ret",
    mode: "ageCalculatorBasic",
    input: "dogum_yili = int(input())\nprint(dogum_yili)",
    expectValid: false,
    expectMessage: /çıkarmalısın/,
  },
  {
    name: "ageCalculatorBasic — print yok ret",
    mode: "ageCalculatorBasic",
    input: "dogum_yili = int(input())\nyas = 2026 - dogum_yili",
    expectValid: false,
    expectMessage: /print/,
  },
  {
    name: "ageCalculatorBasic — Print büyük harf ret",
    mode: "ageCalculatorBasic",
    input: "dogum_yili = int(input())\nPrint(2026 - dogum_yili)",
    expectValid: false,
    expectMessage: /print küçük harfle/,
  },
  {
    name: "ageCalculatorBasic — Input büyük harf ret",
    mode: "ageCalculatorBasic",
    input: "dogum_yili = int(Input())\nprint(2026 - dogum_yili)",
    expectValid: false,
    expectMessage: /input küçük harfle/,
  },
  {
    name: "personalizedAgeOutput — kullanıcı cevabı kabul",
    mode: "personalizedAgeOutput",
    input:
      'isim = input()\ndogum_yili = int(input())\nyas = 2026 - dogum_yili\nprint(f"Merhaba {isim}, yaşın {yas}")',
    expectValid: true,
  },
  {
    name: "personalizedAgeOutput — promptlu çözüm kabul",
    mode: "personalizedAgeOutput",
    input:
      'ad = input("Adın: ")\ndogum_yili = int(input("Doğum yılın: "))\nyas = 2026 - dogum_yili\nprint(f"Merhaba {ad}, yaşın {yas}")',
    expectValid: true,
  },
  {
    name: "personalizedAgeOutput — yaş hesabı print içinde kabul",
    mode: "personalizedAgeOutput",
    input:
      'isim = input("Adını yaz: ")\nyil = int(input("Doğum yılını yaz: "))\nprint(f"Merhaba {isim}, yaşın {2026 - yil}")',
    expectValid: true,
  },
  {
    name: "personalizedAgeOutput — int yok ret",
    mode: "personalizedAgeOutput",
    input:
      'isim = input()\ndogum_yili = input()\nyas = 2026 - dogum_yili\nprint(f"Merhaba {isim}, yaşın {yas}")',
    expectValid: false,
    expectMessage: /sayıya çevir/,
  },
  {
    name: "personalizedAgeOutput — f-string yok ret",
    mode: "personalizedAgeOutput",
    input:
      'isim = input()\ndogum_yili = int(input())\nyas = 2026 - dogum_yili\nprint("Merhaba {isim}, yaşın {yas}")',
    expectValid: false,
    expectMessage: /f-string/,
  },
  {
    name: "personalizedAgeOutput — yaş yazdırılmıyor ret",
    mode: "personalizedAgeOutput",
    input:
      'isim = input()\ndogum_yili = int(input())\nprint(f"Merhaba {isim}")',
    expectValid: false,
    expectMessage: /yaşı da kullanmalısın/,
  },
  {
    name: "personalizedAgeOutput — print yok ret",
    mode: "personalizedAgeOutput",
    input:
      "isim = input()\ndogum_yili = int(input())\nyas = 2026 - dogum_yili",
    expectValid: false,
    expectMessage: /print/,
  },
  {
    name: "personalizedAgeOutput — Print büyük harf ret",
    mode: "personalizedAgeOutput",
    input:
      'isim = input()\ndogum_yili = int(input())\nyas = 2026 - dogum_yili\nPrint(f"Merhaba {isim}, yaşın {yas}")',
    expectValid: false,
    expectMessage: /print küçük harfle/,
  },
  {
    name: "personalizedAgeOutput — Input büyük harf ret",
    mode: "personalizedAgeOutput",
    input:
      'isim = Input()\ndogum_yili = int(input())\nyas = 2026 - dogum_yili\nprint(f"Merhaba {isim}, yaşın {yas}")',
    expectValid: false,
    expectMessage: /input küçük harfle/,
  },
  {
    name: "ticketPriceRules — kullanıcı cevabı kabul",
    mode: "ticketPriceRules",
    input:
      "yas = int(input())\n\nif yas <= 12:\n    fiyat = 0\nelif 13 <= yas <= 17:\n    fiyat = 50\nelse:\n    fiyat = 100\n\nprint(fiyat)",
    expectValid: true,
  },
  {
    name: "ticketPriceRules — iki kural kabul",
    mode: "ticketPriceRules",
    input:
      'yas = int(input("Yaşını gir: "))\n\nif yas < 18:\n    fiyat = 50\nelse:\n    fiyat = 100\n\nprint(fiyat)',
    expectValid: true,
  },
  {
    name: "ticketPriceRules — doğrudan print kabul",
    mode: "ticketPriceRules",
    input:
      'yas = int(input("Yaş: "))\n\nif yas <= 12:\n    print(0)\nelse:\n    print(100)',
    expectValid: true,
  },
  {
    name: "ticketPriceRules — üç kademe kabul",
    mode: "ticketPriceRules",
    input:
      'yas = int(input("Yaşını gir: "))\n\nif yas < 7:\n    fiyat = 0\nelif yas < 18:\n    fiyat = 50\nelse:\n    fiyat = 100\n\nprint("Bilet fiyatı:", fiyat)',
    expectValid: true,
  },
  {
    name: "ticketPriceRules — int yok ret",
    mode: "ticketPriceRules",
    input:
      "yas = input()\nif yas < 18:\n    fiyat = 50\nelse:\n    fiyat = 100\nprint(fiyat)",
    expectValid: false,
    expectMessage: /sayıya çevir/,
  },
  {
    name: "ticketPriceRules — koşul yok ret",
    mode: "ticketPriceRules",
    input: "yas = int(input())\nfiyat = 100\nprint(fiyat)",
    expectValid: false,
    expectMessage: /if koşulu/,
  },
  {
    name: "ticketPriceRules — ikinci kural yok ret",
    mode: "ticketPriceRules",
    input: "yas = int(input())\nif yas < 18:\n    fiyat = 50\n\nprint(fiyat)",
    expectValid: false,
    expectMessage: /2 farklı fiyat kuralı/,
  },
  {
    name: "ticketPriceRules — print yok ret",
    mode: "ticketPriceRules",
    input:
      "yas = int(input())\nif yas < 18:\n    fiyat = 50\nelse:\n    fiyat = 100",
    expectValid: false,
    expectMessage: /print/,
  },
  {
    name: "ticketPriceRules — Print büyük harf ret",
    mode: "ticketPriceRules",
    input:
      "yas = int(input())\nif yas < 18:\n    fiyat = 50\nelse:\n    fiyat = 100\n\nPrint(fiyat)",
    expectValid: false,
    expectMessage: /print küçük harfle/,
  },
  {
    name: "listAppendAndPrint — kullanıcı cevabı kabul",
    mode: "listAppendAndPrint",
    input:
      'sehirler = ["İstanbul", "Ankara"]\nsehirler.append("İzmir")\nprint(sehirler)',
    expectValid: true,
  },
  {
    name: "listAppendAndPrint — farklı liste adı kabul",
    mode: "listAppendAndPrint",
    input: 'liste = ["ekmek", "süt"]\nliste.append("yumurta")\nprint(liste)',
    expectValid: true,
  },
  {
    name: "listAppendAndPrint — tek tırnak kabul",
    mode: "listAppendAndPrint",
    input:
      "alisveris = ['elma', 'muz']\nalisveris.append('armut')\nprint(alisveris)",
    expectValid: true,
  },
  {
    name: "listAppendAndPrint — tek eleman ret",
    mode: "listAppendAndPrint",
    input:
      'sehirler = ["İstanbul"]\nsehirler.append("İzmir")\nprint(sehirler)',
    expectValid: false,
    expectMessage: /en az 2 eleman/,
  },
  {
    name: "listAppendAndPrint — append yok ret",
    mode: "listAppendAndPrint",
    input: 'sehirler = ["İstanbul", "Ankara"]\nprint(sehirler)',
    expectValid: false,
    expectMessage: /append/,
  },
  {
    name: "listAppendAndPrint — print yok ret",
    mode: "listAppendAndPrint",
    input:
      'sehirler = ["İstanbul", "Ankara"]\nsehirler.append("İzmir")',
    expectValid: false,
    expectMessage: /print/,
  },
  {
    name: "listAppendAndPrint — Append büyük harf ret",
    mode: "listAppendAndPrint",
    input:
      'sehirler = ["İstanbul", "Ankara"]\nsehirler.Append("İzmir")\nprint(sehirler)',
    expectValid: false,
    expectMessage: /append küçük harfle/,
  },
  {
    name: "listAppendAndPrint — string liste ret",
    mode: "listAppendAndPrint",
    input:
      'sehirler = "İstanbul, Ankara"\nsehirler.append("İzmir")\nprint(sehirler)',
    expectValid: false,
    expectMessage: /köşeli parantezlerle/,
  },
  {
    name: "listAppendAndPrint — yanlış listeye append ret",
    mode: "listAppendAndPrint",
    input:
      'sehirler = ["İstanbul", "Ankara"]\nbaska_liste.append("İzmir")\nprint(sehirler)',
    expectValid: false,
    expectMessage: /liste değişkeni üzerinde/,
  },
  {
    name: "listLoopSummary — kullanıcı cevabı kabul",
    mode: "listLoopSummary",
    input:
      'liste = ["Elma", "Ekmek"]\nliste.append("Süt")\nliste.append("Yumurta")\n\nfor urun in liste:\n    print(urun)\n\nprint(f"Toplam ürün sayısı: {len(liste)}")',
    expectValid: true,
  },
  {
    name: "listLoopSummary — append + for + len kabul",
    mode: "listLoopSummary",
    input:
      'liste = ["Elma", "Ekmek"]\nliste.append("Süt")\nliste.append("Yumurta")\nfor urun in liste:\nprint(urun)\nprint(f"Toplam ürün sayısı: {len(liste)}")',
    expectValid: true,
  },
  {
    name: "listLoopSummary — sadece print(liste) ret",
    mode: "listLoopSummary",
    input:
      'liste = ["Elma", "Ekmek"]\nliste.append("Süt")\nliste.append("Yumurta")\nprint(liste)',
    expectValid: false,
    expectMessage: /for döngüsü/,
  },
  {
    name: "listLoopSummary — len yok ret",
    mode: "listLoopSummary",
    input:
      'liste = ["Elma", "Ekmek"]\nliste.append("Süt")\nliste.append("Yumurta")\nfor urun in liste:\nprint(urun)',
    expectValid: false,
    expectMessage: /len\(liste\)/,
  },
  {
    name: "listLoopSummary — tek append ret",
    mode: "listLoopSummary",
    input:
      'liste = ["Elma", "Ekmek"]\nliste.append("Süt")\nfor urun in liste:\nprint(urun)\nprint(f"Toplam ürün sayısı: {len(liste)}")',
    expectValid: false,
    expectMessage: /en az 2 ürün/,
  },
  {
    name: "listLoopSummary — Append büyük harf ret",
    mode: "listLoopSummary",
    input:
      'liste = ["Elma", "Ekmek"]\nliste.Append("Süt")\nliste.append("Yumurta")\nfor urun in liste:\nprint(urun)\nprint(len(liste))',
    expectValid: false,
    expectMessage: /append küçük harfle/,
  },
  {
    name: "spendingSummaryTotal — kullanıcı cevabı kabul",
    mode: "spendingSummaryTotal",
    input:
      'harcamalar = [150, 45, 220]\ntoplam = sum(harcamalar)\n\nprint(f"Toplam harcama tutarı: {toplam} TL")',
    expectValid: true,
  },
  {
    name: "spendingSummaryTotal — doğrudan print(sum) kabul",
    mode: "spendingSummaryTotal",
    input: "liste = [10, 20, 30]\nprint(sum(liste))",
    expectValid: true,
  },
  {
    name: "spendingSummaryTotal — farklı değişken adı kabul",
    mode: "spendingSummaryTotal",
    input:
      'harcamalar = [100, 200, 50]\nsonuc = sum(harcamalar)\nprint("Toplam:", sonuc)',
    expectValid: true,
  },
  {
    name: "spendingSummaryTotal — float değer kabul",
    mode: "spendingSummaryTotal",
    input:
      "harcamalar = [100.5, 25, 80]\ntoplam = sum(harcamalar)\nprint(f\"Toplam: {toplam}\")",
    expectValid: true,
  },
  {
    name: "spendingSummaryTotal — iki elemanlı liste ret",
    mode: "spendingSummaryTotal",
    input: "harcamalar = [150, 45]\ntoplam = sum(harcamalar)\nprint(toplam)",
    expectValid: false,
    expectMessage: /en az 3 harcama/,
  },
  {
    name: "spendingSummaryTotal — sum yok ret",
    mode: "spendingSummaryTotal",
    input: "harcamalar = [150, 45, 220]\nprint(harcamalar)",
    expectValid: false,
    expectMessage: /sum/,
  },
  {
    name: "spendingSummaryTotal — sum olmadan liste atama ret",
    mode: "spendingSummaryTotal",
    input: "harcamalar = [150, 45, 220]\ntoplam = harcamalar\nprint(toplam)",
    expectValid: false,
    expectMessage: /sum/,
  },
  {
    name: "spendingSummaryTotal — string liste ret",
    mode: "spendingSummaryTotal",
    input:
      'harcamalar = "150, 45, 220"\ntoplam = sum(harcamalar)\nprint(toplam)',
    expectValid: false,
    expectMessage: /köşeli parantezlerle/,
  },
  {
    name: "spendingSummaryTotal — Sum büyük harf ret",
    mode: "spendingSummaryTotal",
    input: "harcamalar = [150, 45, 220]\ntoplam = Sum(harcamalar)\nprint(toplam)",
    expectValid: false,
    expectMessage: /sum küçük harfle/,
  },
  {
    name: "spendingSummaryTotal — Print büyük harf ret",
    mode: "spendingSummaryTotal",
    input:
      "harcamalar = [150, 45, 220]\ntoplam = sum(harcamalar)\nPrint(toplam)",
    expectValid: false,
    expectMessage: /print küçük harfle/,
  },
  {
    name: "spendingSummaryReport — kullanıcı cevabı kabul",
    mode: "spendingSummaryReport",
    input:
      'harcamalar = [150, 45, 220, 85]\n\ntoplam = sum(harcamalar)\nortalama = toplam / len(harcamalar)\nen_yuksek = max(harcamalar)\n\nprint(f"Toplam Harcama: {toplam} TL")\nprint(f"Ortalama Harcama: {ortalama:.2f} TL")\nprint(f"En Yüksek Harcama: {en_yuksek} TL")',
    expectValid: true,
  },
  {
    name: "spendingSummaryReport — doğrudan print kabul",
    mode: "spendingSummaryReport",
    input:
      'liste = [10, 20, 30]\nprint("Toplam:", sum(liste))\nprint("Ortalama:", sum(liste) / len(liste))\nprint("En yüksek:", max(liste))',
    expectValid: true,
  },
  {
    name: "spendingSummaryReport — farklı değişken adları kabul",
    mode: "spendingSummaryReport",
    input:
      "harcamalar = [100, 250, 75, 40]\ntoplam = sum(harcamalar)\nortalama = toplam / len(harcamalar)\nbuyuk = max(harcamalar)\nprint(toplam)\nprint(ortalama)\nprint(buyuk)",
    expectValid: true,
  },
  {
    name: "spendingSummaryReport — iki elemanlı liste ret",
    mode: "spendingSummaryReport",
    input:
      "harcamalar = [150, 45]\ntoplam = sum(harcamalar)\nortalama = toplam / len(harcamalar)\nen_yuksek = max(harcamalar)\nprint(toplam)\nprint(ortalama)\nprint(en_yuksek)",
    expectValid: false,
    expectMessage: /en az 3 harcama/,
  },
  {
    name: "spendingSummaryReport — max yok ret",
    mode: "spendingSummaryReport",
    input:
      "harcamalar = [150, 45, 220]\ntoplam = sum(harcamalar)\nortalama = toplam / len(harcamalar)\nprint(toplam)\nprint(ortalama)",
    expectValid: false,
    expectMessage: /max/,
  },
  {
    name: "spendingSummaryReport — ortalama yok ret",
    mode: "spendingSummaryReport",
    input:
      "harcamalar = [150, 45, 220]\ntoplam = sum(harcamalar)\nen_yuksek = max(harcamalar)\nprint(toplam)\nprint(en_yuksek)",
    expectValid: false,
    expectMessage: /Ortalama|len/,
  },
  {
    name: "spendingSummaryReport — sum yok ret",
    mode: "spendingSummaryReport",
    input: "harcamalar = [150, 45, 220]\nen_yuksek = max(harcamalar)\nprint(en_yuksek)",
    expectValid: false,
    expectMessage: /sum/,
  },
  {
    name: "spendingSummaryReport — büyük harf fonksiyonlar ret",
    mode: "spendingSummaryReport",
    input:
      "harcamalar = [150, 45, 220]\ntoplam = Sum(harcamalar)\nortalama = toplam / Len(harcamalar)\nen_yuksek = Max(harcamalar)\nprint(toplam)\nprint(ortalama)\nprint(en_yuksek)",
    expectValid: false,
    expectMessage: /küçük harfle/,
  },
  {
    name: "spendingSummaryReport — Print büyük harf ret",
    mode: "spendingSummaryReport",
    input:
      "harcamalar = [150, 45, 220]\ntoplam = sum(harcamalar)\nortalama = toplam / len(harcamalar)\nen_yuksek = max(harcamalar)\nPrint(toplam)",
    expectValid: false,
    expectMessage: /print küçük harfle/,
  },
  {
    name: "multiplePrintStringLiteral — iki print kabul",
    mode: "multiplePrintStringLiteral",
    input: 'print("Merhaba")\nprint("Dünya")',
    expectValid: true,
  },
  {
    name: "multiplePrintStringLiteral — tek print ret",
    mode: "multiplePrintStringLiteral",
    input: 'print("Merhaba")',
    expectValid: false,
    expectMessage: /print/,
  },
  {
    name: "miniProject — def + print kabul",
    mode: "miniProject",
    rules: { mustIncludeDef: true, mustIncludePrint: true },
    input: "def selam():\n    print('Merhaba')\nselam()",
    expectValid: true,
  },
  {
    name: "miniProject — def eksik ret",
    mode: "miniProject",
    rules: { mustIncludeDef: true, mustIncludePrint: true },
    input: "print('Merhaba')",
    expectValid: false,
    expectMessage: /yapı/,
  },
  {
    name: "miniProject — for döngüsü kabul",
    mode: "miniProject",
    rules: { mustIncludeLoop: true, mustIncludePrint: true },
    input: 'for i in range(3):\n    print(i)',
    expectValid: true,
  },
  {
    name: "booleanHelperFunction — kullanıcı cevabı kabul",
    mode: "booleanHelperFunction",
    input:
      "def cift_mi(n):\nsonuc = (n % 2 == 0)\nreturn sonuc\n\nprint(cift_mi(4))",
    expectValid: true,
  },
  {
    name: "booleanHelperFunction — doğrudan return kabul",
    mode: "booleanHelperFunction",
    input: "def cift_mi(sayi):\nreturn sayi % 2 == 0\n\nprint(cift_mi(10))",
    expectValid: true,
  },
  {
    name: "booleanHelperFunction — if/else True/False kabul",
    mode: "booleanHelperFunction",
    input:
      "def cift_mi(n):\nif n % 2 == 0:\nreturn True\nelse:\nreturn False\n\nprint(cift_mi(6))",
    expectValid: true,
  },
  {
    name: "booleanHelperFunction — return yok ret",
    mode: "booleanHelperFunction",
    input: "def cift_mi(n):\nprint(n % 2 == 0)\n\ncift_mi(4)",
    expectValid: false,
    expectMessage: /return/,
  },
  {
    name: "booleanHelperFunction — parametre yok ret",
    mode: "booleanHelperFunction",
    input: "def cift_mi():\nreturn True\n\nprint(cift_mi())",
    expectValid: false,
    expectMessage: /parametre/,
  },
  {
    name: "booleanHelperFunction — çiftlik kontrolü yok ret",
    mode: "booleanHelperFunction",
    input: "def cift_mi(n):\nreturn n\n\nprint(cift_mi(4))",
    expectValid: false,
    expectMessage: /% 2/,
  },
  {
    name: "booleanHelperFunction — return n % 2 ret",
    mode: "booleanHelperFunction",
    input: "def cift_mi(n):\nreturn n % 2\n\nprint(cift_mi(4))",
    expectValid: false,
    expectMessage: /True veya False/,
  },
  {
    name: "booleanHelperFunction — Print büyük harf ret",
    mode: "booleanHelperFunction",
    input: "def cift_mi(n):\nreturn n % 2 == 0\n\nPrint(cift_mi(4))",
    expectValid: false,
    expectMessage: /print küçük harfle/,
  },
  {
    name: "functionReturnAndPrint — kullanıcı cevabı kabul",
    mode: "functionReturnAndPrint",
    input:
      'def selamla(isim):\nreturn f"Merhaba, {isim}"\n\nsonuc = selamla("Ahmet")\nprint(sonuc)',
    expectValid: true,
  },
  {
    name: "functionReturnAndPrint — doğrudan print kabul",
    mode: "functionReturnAndPrint",
    input:
      'def selamla(ad):\nreturn f"Merhaba, {ad}"\n\nprint(selamla("Efe"))',
    expectValid: true,
  },
  {
    name: "functionReturnAndPrint — string birleştirme kabul",
    mode: "functionReturnAndPrint",
    input:
      'def merhaba_de(isim):\nreturn "Merhaba, " + isim\n\nprint(merhaba_de("Ayşe"))',
    expectValid: true,
  },
  {
    name: "functionReturnAndPrint — parametre yok ret",
    mode: "functionReturnAndPrint",
    input: 'def selamla():\nreturn "Merhaba"\n\nprint(selamla())',
    expectValid: false,
    expectMessage: /parametre/,
  },
  {
    name: "functionReturnAndPrint — return yok ret",
    mode: "functionReturnAndPrint",
    input:
      'def selamla(isim):\nprint(f"Merhaba, {isim}")\n\nselamla("Ahmet")',
    expectValid: false,
    expectMessage: /return/,
  },
  {
    name: "functionReturnAndPrint — parametre return'de yok ret",
    mode: "functionReturnAndPrint",
    input:
      'def selamla(isim):\nreturn f"Merhaba"\n\nprint(selamla("Ahmet"))',
    expectValid: false,
    expectMessage: /ismi kullanmalısın/,
  },
  {
    name: "functionReturnAndPrint — print yok ret",
    mode: "functionReturnAndPrint",
    input: 'def selamla(isim):\nreturn f"Merhaba, {isim}"\n\nselamla("Ahmet")',
    expectValid: false,
    expectMessage: /print/,
  },
  {
    name: "functionReturnAndPrint — Print büyük harf ret",
    mode: "functionReturnAndPrint",
    input:
      'def selamla(isim):\nreturn f"Merhaba, {isim}"\n\nsonuc = selamla("Ahmet")\nPrint(sonuc)',
    expectValid: false,
    expectMessage: /print küçük harfle/,
  },
  {
    name: "twoGreetingFunctions — kullanıcı cevabı kabul",
    mode: "twoGreetingFunctions",
    input:
      'def selamla(isim):\nreturn f"Merhaba, {isim}"\n\ndef resmi_selam(isim, soyisim):\nreturn f"Sayın {isim} {soyisim}, hoş geldiniz."\n\nprint(selamla("Ahmet"))\nprint(resmi_selam("Mustafa", "Yılmaz"))',
    expectValid: true,
  },
  {
    name: "twoGreetingFunctions — farklı parametre adları kabul",
    mode: "twoGreetingFunctions",
    input:
      'def selamla(ad):\nreturn f"Merhaba, {ad}"\n\ndef resmi_selam(ad, soyad):\nreturn f"Sayın {ad} {soyad}"\n\nprint(selamla("Efe"))\nprint(resmi_selam("Ayşe", "Demir"))',
    expectValid: true,
  },
  {
    name: "twoGreetingFunctions — string birleştirme kabul",
    mode: "twoGreetingFunctions",
    input:
      'def selamla(isim):\nreturn "Merhaba, " + isim\n\ndef resmi_selam(isim, soyisim):\nreturn "Sayın " + isim + " " + soyisim\n\nprint(selamla("Ahmet"))\nprint(resmi_selam("Mustafa", "Yılmaz"))',
    expectValid: true,
  },
  {
    name: "twoGreetingFunctions — ikinci fonksiyon yok ret",
    mode: "twoGreetingFunctions",
    input:
      'def selamla(isim):\nreturn f"Merhaba, {isim}"\n\nprint(selamla("Ahmet"))',
    expectValid: false,
    expectMessage: /iki farklı fonksiyon/,
  },
  {
    name: "twoGreetingFunctions — ikinci fonksiyon çağrılmıyor ret",
    mode: "twoGreetingFunctions",
    input:
      'def selamla(isim):\nreturn f"Merhaba, {isim}"\n\ndef resmi_selam(isim, soyisim):\nreturn f"Sayın {isim} {soyisim}"\n\nprint(selamla("Ahmet"))',
    expectValid: false,
    expectMessage: /çağırmalısın/,
  },
  {
    name: "twoGreetingFunctions — return yok ret",
    mode: "twoGreetingFunctions",
    input:
      'def selamla(isim):\nprint(f"Merhaba, {isim}")\n\ndef resmi_selam(isim, soyisim):\nprint(f"Sayın {isim} {soyisim}")\n\nselamla("Ahmet")\nresmi_selam("Mustafa", "Yılmaz")',
    expectValid: false,
    expectMessage: /return/,
  },
  {
    name: "twoGreetingFunctions — tanımsız f-string değişkeni ret",
    mode: "twoGreetingFunctions",
    input:
      'def selamla(isim):\nreturn f"Merhaba, {ad}"\n\ndef resmi_selam(isim, soyisim):\nreturn f"Sayın {isim} {soyisim}"\n\nprint(selamla("Ahmet"))\nprint(resmi_selam("Mustafa", "Yılmaz"))',
    expectValid: false,
    expectMessage: /f-string içinde yalnızca/,
  },
  {
    name: "twoGreetingFunctions — Print büyük harf ret",
    mode: "twoGreetingFunctions",
    input:
      'def selamla(isim):\nreturn f"Merhaba, {isim}"\n\ndef resmi_selam(isim, soyisim):\nreturn f"Sayın {isim} {soyisim}"\n\nPrint(selamla("Ahmet"))\nprint(resmi_selam("Mustafa", "Yılmaz"))',
    expectValid: false,
    expectMessage: /print küçük harfle/,
  },
  {
    name: "quizFunctionProject — kullanıcı cevabı kabul",
    mode: "quizFunctionProject",
    input:
      'toplam_puan = 0\n\ndef soru_sor(metin, dogru):\nglobal toplam_puan\nprint(metin)\nkullanici_cevabi = input("Cevabınız: ").strip().lower()\nif kullanici_cevabi == dogru.lower():\n    toplam_puan += 10\n    print("Doğru! +10 puan.\\n")\nelse:\n    print(f"Yanlış! Doğru cevap: {dogru}\\n")\n\nsoru_sor("Python\'da fonksiyon tanımlamak için hangi anahtar kelime kullanılır?", "def")\nsoru_sor("Ekrana çıktı yazdırmak için kullanılan fonksiyon hangisidir?", "print")\n\nprint("Quiz tamamlandı! Katılımınız için teşekkürler.")\nprint(f"Toplam Puanınız: {toplam_puan}")',
    expectValid: true,
  },
  {
    name: "quizFunctionProject — basit quiz kabul",
    mode: "quizFunctionProject",
    input:
      'def soru_sor(metin, dogru):\nprint(metin)\ncevap = input("Cevap: ")\nif cevap == dogru:\nprint("Doğru")\nelse:\nprint("Yanlış")\n\nsoru_sor("2 + 2 kaçtır?", "4")\nsoru_sor("Python\'da ekrana yazdırma fonksiyonu nedir?", "print")\nprint("Quiz bitti")',
    expectValid: true,
  },
  {
    name: "quizFunctionProject — input yok ret",
    mode: "quizFunctionProject",
    input:
      'def soru_sor(metin, dogru):\nprint(metin)\n\nsoru_sor("Soru 1", "cevap")\nsoru_sor("Soru 2", "cevap")\nprint("Bitti")',
    expectValid: false,
    expectMessage: /input\(\)/,
  },
  {
    name: "quizFunctionProject — if yok ret",
    mode: "quizFunctionProject",
    input:
      'def soru_sor(metin, dogru):\ncevap = input("Cevap: ")\nprint(cevap)\n\nsoru_sor("Soru 1", "cevap")\nsoru_sor("Soru 2", "cevap")\nprint("Bitti")',
    expectValid: false,
    expectMessage: /if kullanmalısın/,
  },
  {
    name: "quizFunctionProject — tek soru ret",
    mode: "quizFunctionProject",
    input:
      'def soru_sor(metin, dogru):\ncevap = input("Cevap: ")\nif cevap == dogru:\nprint("Doğru")\n\nsoru_sor("Soru 1", "cevap")\nprint("Bitti")',
    expectValid: false,
    expectMessage: /en az 2 kez/,
  },
  {
    name: "quizFunctionProject — bitiş mesajı yok ret",
    mode: "quizFunctionProject",
    input:
      'def soru_sor(metin, dogru):\ncevap = input("Cevap: ")\nif cevap == dogru:\nprint("Doğru")\n\nsoru_sor("Soru 1", "cevap")\nsoru_sor("Soru 2", "cevap")',
    expectValid: false,
    expectMessage: /bitiş mesajı/,
  },
  {
    name: "quizFunctionProject — Input büyük harf ret",
    mode: "quizFunctionProject",
    input:
      'def soru_sor(metin, dogru):\ncevap = Input("Cevap: ")\nif cevap == dogru:\nprint("Doğru")\n\nsoru_sor("Soru 1", "cevap")\nsoru_sor("Soru 2", "cevap")\nprint("Bitti")',
    expectValid: false,
    expectMessage: /input küçük harfle/,
  },
  {
    name: "quizFunctionProject — Print büyük harf ret",
    mode: "quizFunctionProject",
    input:
      'def soru_sor(metin, dogru):\ncevap = input("Cevap: ")\nif cevap == dogru:\nPrint("Doğru")\n\nsoru_sor("Soru 1", "cevap")\nsoru_sor("Soru 2", "cevap")\nprint("Bitti")',
    expectValid: false,
    expectMessage: /print küçük harfle/,
  },
  {
    name: "mathFunctionAddAndPrint — kullanıcı cevabı kabul",
    mode: "mathFunctionAddAndPrint",
    input:
      "def topla(a, b):\nsonuc = a + b\nreturn sonuc\n\nprint(topla(5, 7))",
    expectValid: true,
  },
  {
    name: "mathFunctionAddAndPrint — doğrudan return kabul",
    mode: "mathFunctionAddAndPrint",
    input: "def topla(x, y):\nreturn x + y\n\nprint(topla(3, 4))",
    expectValid: true,
  },
  {
    name: "mathFunctionAddAndPrint — farklı fonksiyon adı kabul",
    mode: "mathFunctionAddAndPrint",
    input:
      "def toplama(sayi1, sayi2):\ntoplam = sayi1 + sayi2\nreturn toplam\n\nprint(toplama(10, 20))",
    expectValid: true,
  },
  {
    name: "mathFunctionAddAndPrint — return yok ret",
    mode: "mathFunctionAddAndPrint",
    input:
      "def topla(a, b):\nsonuc = a + b\nprint(sonuc)\n\ntopla(5, 7)",
    expectValid: false,
    expectMessage: /return/,
  },
  {
    name: "mathFunctionAddAndPrint — tek parametre ret",
    mode: "mathFunctionAddAndPrint",
    input: "def topla(a):\nreturn a\n\nprint(topla(5))",
    expectValid: false,
    expectMessage: /iki sayı parametresi/,
  },
  {
    name: "mathFunctionAddAndPrint — toplama yok ret",
    mode: "mathFunctionAddAndPrint",
    input: "def topla(a, b):\nreturn a - b\n\nprint(topla(5, 7))",
    expectValid: false,
    expectMessage: /\+ işlemini/,
  },
  {
    name: "mathFunctionAddAndPrint — print yok ret",
    mode: "mathFunctionAddAndPrint",
    input: "def topla(a, b):\nreturn a + b\n\ntopla(5, 7)",
    expectValid: false,
    expectMessage: /print/,
  },
  {
    name: "mathFunctionAddAndPrint — Print büyük harf ret",
    mode: "mathFunctionAddAndPrint",
    input: "def topla(a, b):\nreturn a + b\n\nPrint(topla(5, 7))",
    expectValid: false,
    expectMessage: /print küçük harfle/,
  },
  {
    name: "scoreCalculatorFunction — kullanıcı cevabı kabul",
    mode: "scoreCalculatorFunction",
    input:
      "def puan_hesapla(dogru, yanlis):\npuan = dogru * 10 - yanlis * 5\nif puan < 0:\n    puan = 0\nreturn puan\n\nprint(puan_hesapla(3, 8))",
    expectValid: true,
  },
  {
    name: "scoreCalculatorFunction — max(0, puan) kabul",
    mode: "scoreCalculatorFunction",
    input:
      "def puan_hesapla(dogru, yanlis):\npuan = dogru * 10 - yanlis * 5\nreturn max(0, puan)\n\nprint(puan_hesapla(5, 2))",
    expectValid: true,
  },
  {
    name: "scoreCalculatorFunction — farklı fonksiyon adı kabul",
    mode: "scoreCalculatorFunction",
    input:
      "def hesapla(dogru, yanlis):\nsonuc = dogru * 10 - yanlis * 5\nif sonuc < 0:\nreturn 0\nreturn sonuc\n\nprint(hesapla(3, 8))",
    expectValid: true,
  },
  {
    name: "scoreCalculatorFunction — negatif sabitleme yok ret",
    mode: "scoreCalculatorFunction",
    input:
      "def puan_hesapla(dogru, yanlis):\nreturn dogru * 10 - yanlis * 5\n\nprint(puan_hesapla(3, 8))",
    expectValid: false,
    expectMessage: /Negatif puanı 0'a sabitlemek/,
  },
  {
    name: "scoreCalculatorFunction — tek parametre ret",
    mode: "scoreCalculatorFunction",
    input: "def puan_hesapla(dogru):\nreturn dogru * 10\n\nprint(puan_hesapla(3))",
    expectValid: false,
    expectMessage: /iki değer almalı/,
  },
  {
    name: "scoreCalculatorFunction — puan hesabı yok ret",
    mode: "scoreCalculatorFunction",
    input:
      "def puan_hesapla(dogru, yanlis):\npuan = dogru + yanlis\nreturn puan\n\nprint(puan_hesapla(3, 8))",
    expectValid: false,
    expectMessage: /puan kazanıp yanlış sayısından puan düşmelisin/,
  },
  {
    name: "scoreCalculatorFunction — return yok ret",
    mode: "scoreCalculatorFunction",
    input:
      "def puan_hesapla(dogru, yanlis):\npuan = dogru * 10 - yanlis * 5\nif puan < 0:\npuan = 0\n\nprint(puan_hesapla(3, 8))",
    expectValid: false,
    expectMessage: /return ile döndürmelisin/,
  },
  {
    name: "scoreCalculatorFunction — Print büyük harf ret",
    mode: "scoreCalculatorFunction",
    input:
      "def puan_hesapla(dogru, yanlis):\npuan = dogru * 10 - yanlis * 5\nif puan < 0:\npuan = 0\nreturn puan\n\nPrint(puan_hesapla(3, 8))",
    expectValid: false,
    expectMessage: /print küçük harfle/,
  },
  {
    name: "listMembershipCheck — kullanıcı cevabı kabul",
    mode: "listMembershipCheck",
    input:
      'isimler = ["Ali", "Ayşe", "Mehmet"]\nprint("Ali" in isimler)',
    expectValid: true,
  },
  {
    name: "listMembershipCheck — tek tırnak kabul",
    mode: "listMembershipCheck",
    input: 'liste = ["Ali", "Ayşe", "Mehmet"]\nprint(\'Ali\' in liste)',
    expectValid: true,
  },
  {
    name: "listMembershipCheck — aranan değişken kabul",
    mode: "listMembershipCheck",
    input:
      'isimler = ["Ali", "Ayşe", "Mehmet"]\naranan = "Ali"\nprint(aranan in isimler)',
    expectValid: true,
  },
  {
    name: "listMembershipCheck — in yok ret",
    mode: "listMembershipCheck",
    input: 'isimler = ["Ali", "Ayşe", "Mehmet"]\nprint(isimler)',
    expectValid: false,
    expectMessage: /in operatörünü/,
  },
  {
    name: "listMembershipCheck — sadece string print ret",
    mode: "listMembershipCheck",
    input: 'isimler = ["Ali", "Ayşe", "Mehmet"]\nprint("Ali")',
    expectValid: false,
    expectMessage: /in operatörünü/,
  },
  {
    name: "listMembershipCheck — string liste ret",
    mode: "listMembershipCheck",
    input: 'isimler = "Ali, Ayşe, Mehmet"\nprint("Ali" in isimler)',
    expectValid: false,
    expectMessage: /liste olarak yazmalısın/,
  },
  {
    name: "listMembershipCheck — tırnaksız eleman ret",
    mode: "listMembershipCheck",
    input: "isimler = [Ali, Ayşe, Mehmet]\nprint(\"Ali\" in isimler)",
    expectValid: false,
    expectMessage: /tırnak içinde/,
  },
  {
    name: "listMembershipCheck — Print büyük harf ret",
    mode: "listMembershipCheck",
    input: 'isimler = ["Ali", "Ayşe", "Mehmet"]\nPrint("Ali" in isimler)',
    expectValid: false,
    expectMessage: /print küçük harfle/,
  },
  {
    name: "studentGradeAverage — kullanıcı cevabı kabul",
    mode: "studentGradeAverage",
    input:
      'ogrenciler = [\n{"ad": "Ali", "not": 85},\n{"ad": "Ayşe", "not": 90}\n]\n\ntoplam = 0\n\nfor ogrenci in ogrenciler:\ntoplam += ogrenci["not"]\n\nortalama = toplam / len(ogrenciler)\n\nprint(ortalama)',
    expectValid: true,
  },
  {
    name: "studentGradeAverage — f-string etiket kabul",
    mode: "studentGradeAverage",
    input:
      'ogrenciler = [\n{"ad": "Ali", "not": 80},\n{"ad": "Ayşe", "not": 90},\n{"ad": "Mehmet", "not": 70}\n]\n\ntoplam = 0\n\nfor ogrenci in ogrenciler:\ntoplam = toplam + ogrenci["not"]\n\nortalama = toplam / len(ogrenciler)\nprint("Ortalama:", ortalama)',
    expectValid: true,
  },
  {
    name: "studentGradeAverage — sum comprehension kabul",
    mode: "studentGradeAverage",
    input:
      'ogrenciler = [\n{"ad": "Ali", "not": 80},\n{"ad": "Ayşe", "not": 90}\n]\n\nortalama = sum([ogrenci["not"] for ogrenci in ogrenciler]) / len(ogrenciler)\nprint(ortalama)',
    expectValid: true,
  },
  {
    name: "studentGradeAverage — tek öğrenci ret",
    mode: "studentGradeAverage",
    input:
      'ogrenciler = [\n{"ad": "Ali", "not": 85}\n]\n\ntoplam = 0\nfor ogrenci in ogrenciler:\ntoplam += ogrenci["not"]\n\nortalama = toplam / len(ogrenciler)\nprint(ortalama)',
    expectValid: false,
    expectMessage: /en az 2 öğrenci/,
  },
  {
    name: "studentGradeAverage — not alanı yok ret",
    mode: "studentGradeAverage",
    input:
      'ogrenciler = [\n{"ad": "Ali"},\n{"ad": "Ayşe"}\n]\n\nprint(ogrenciler)',
    expectValid: false,
    expectMessage: /not alanı/,
  },
  {
    name: "studentGradeAverage — ortalama yok ret",
    mode: "studentGradeAverage",
    input:
      'ogrenciler = [\n{"ad": "Ali", "not": 85},\n{"ad": "Ayşe", "not": 90}\n]\n\nprint(ogrenciler)',
    expectValid: false,
    expectMessage: /ortalama|toplamalısın/,
  },
  {
    name: "studentGradeAverage — sadece toplam print ret",
    mode: "studentGradeAverage",
    input:
      'ogrenciler = [\n{"ad": "Ali", "not": 85},\n{"ad": "Ayşe", "not": 90}\n]\n\ntoplam = 0\n\nfor ogrenci in ogrenciler:\ntoplam += ogrenci["not"]\n\nprint(toplam)',
    expectValid: false,
    expectMessage: /ortalama|öğrenci sayısına böl/,
  },
  {
    name: "studentGradeAverage — string not ret",
    mode: "studentGradeAverage",
    input:
      'ogrenciler = [\n{"ad": "Ali", "not": "85"},\n{"ad": "Ayşe", "not": "90"}\n]\n\ntoplam = 0\n\nfor ogrenci in ogrenciler:\ntoplam += ogrenci["not"]\n\nortalama = toplam / len(ogrenciler)\nprint(ortalama)',
    expectValid: false,
    expectMessage: /sayı olarak/,
  },
  {
    name: "studentGradeAverage — Print büyük harf ret",
    mode: "studentGradeAverage",
    input:
      'ogrenciler = [\n{"ad": "Ali", "not": 85},\n{"ad": "Ayşe", "not": 90}\n]\n\ntoplam = 0\n\nfor ogrenci in ogrenciler:\ntoplam += ogrenci["not"]\n\nortalama = toplam / len(ogrenciler)\n\nPrint(ortalama)',
    expectValid: false,
    expectMessage: /print küçük harfle/,
  },
  {
    name: "categorySpendingTotal — kullanıcı cevabı kabul",
    mode: "categorySpendingTotal",
    input:
      'harcamalar = [\n{"kategori": "Yemek", "tutar": 50},\n{"kategori": "Ulaşım", "tutar": 30},\n{"kategori": "Yemek", "tutar": 80}\n]\n\ntoplam = 0\n\nfor harcama in harcamalar:\nif harcama["kategori"] == "Yemek":\ntoplam += harcama["tutar"]\n\nprint(toplam)',
    expectValid: true,
  },
  {
    name: "categorySpendingTotal — etiketli print kabul",
    mode: "categorySpendingTotal",
    input:
      'harcamalar = [\n{"kategori": "Market", "tutar": 100},\n{"kategori": "Ulaşım", "tutar": 40},\n{"kategori": "Market", "tutar": 60}\n]\n\ntoplam = 0\n\nfor item in harcamalar:\nif item["kategori"] == "Market":\ntoplam = toplam + item["tutar"]\n\nprint("Toplam:", toplam)',
    expectValid: true,
  },
  {
    name: "categorySpendingTotal — sum comprehension kabul",
    mode: "categorySpendingTotal",
    input:
      'harcamalar = [\n{"kategori": "Yemek", "tutar": 50},\n{"kategori": "Ulaşım", "tutar": 30},\n{"kategori": "Yemek", "tutar": 80}\n]\n\ntoplam = sum(harcama["tutar"] for harcama in harcamalar if harcama["kategori"] == "Yemek")\nprint(toplam)',
    expectValid: true,
  },
  {
    name: "categorySpendingTotal — toplam hesabı yok ret",
    mode: "categorySpendingTotal",
    input:
      'harcamalar = [\n{"kategori": "Yemek", "tutar": 50},\n{"kategori": "Ulaşım", "tutar": 30}\n]\n\nprint(harcamalar)',
    expectValid: false,
    expectMessage: /for döngüsü|kategori için/,
  },
  {
    name: "categorySpendingTotal — kategori filtresi yok ret",
    mode: "categorySpendingTotal",
    input:
      'harcamalar = [\n{"kategori": "Yemek", "tutar": 50},\n{"kategori": "Ulaşım", "tutar": 30}\n]\n\ntoplam = 0\n\nfor harcama in harcamalar:\ntoplam += harcama["tutar"]\n\nprint(toplam)',
    expectValid: false,
    expectMessage: /belirli bir kategori|if koşulu/,
  },
  {
    name: "categorySpendingTotal — tutar alanı yok ret",
    mode: "categorySpendingTotal",
    input:
      'harcamalar = [\n{"kategori": "Yemek"},\n{"kategori": "Ulaşım"}\n]\n\ntoplam = 0\n\nfor harcama in harcamalar:\nif harcama["kategori"] == "Yemek":\ntoplam += harcama["tutar"]\n\nprint(toplam)',
    expectValid: false,
    expectMessage: /tutar alanı/,
  },
  {
    name: "categorySpendingTotal — string tutar ret",
    mode: "categorySpendingTotal",
    input:
      'harcamalar = [\n{"kategori": "Yemek", "tutar": "50"},\n{"kategori": "Yemek", "tutar": "80"}\n]\n\ntoplam = 0\n\nfor harcama in harcamalar:\nif harcama["kategori"] == "Yemek":\ntoplam += harcama["tutar"]\n\nprint(toplam)',
    expectValid: false,
    expectMessage: /sayı olarak/,
  },
  {
    name: "categorySpendingTotal — Print büyük harf ret",
    mode: "categorySpendingTotal",
    input:
      'harcamalar = [\n{"kategori": "Yemek", "tutar": 50},\n{"kategori": "Ulaşım", "tutar": 30}\n]\n\ntoplam = 0\n\nfor harcama in harcamalar:\nif harcama["kategori"] == "Yemek":\ntoplam += harcama["tutar"]\n\nPrint(toplam)',
    expectValid: false,
    expectMessage: /print küçük harfle/,
  },
  {
    name: "inputNormalizeStripLower — kullanıcı cevabı kabul",
    mode: "inputNormalizeStripLower",
    input:
      "girdi = input()\n\ntemiz_girdi = girdi.strip().lower()\n\nprint(temiz_girdi)",
    expectValid: true,
  },
  {
    name: "inputNormalizeStripLower — prompt ile kabul",
    mode: "inputNormalizeStripLower",
    input:
      'metin = input("Bir şey yaz: ")\nsonuc = metin.strip().lower()\nprint(sonuc)',
    expectValid: true,
  },
  {
    name: "inputNormalizeStripLower — print içinde zincir kabul",
    mode: "inputNormalizeStripLower",
    input: "cevap = input()\nprint(cevap.strip().lower())",
    expectValid: true,
  },
  {
    name: "inputNormalizeStripLower — ayrı satırlarda kabul",
    mode: "inputNormalizeStripLower",
    input:
      "girdi = input()\ngirdi = girdi.strip()\ngirdi = girdi.lower()\nprint(girdi)",
    expectValid: true,
  },
  {
    name: "inputNormalizeStripLower — strip ve lower yok ret",
    mode: "inputNormalizeStripLower",
    input: "girdi = input()\nprint(girdi)",
    expectValid: false,
    expectMessage: /strip\(\)/,
  },
  {
    name: "inputNormalizeStripLower — lower yok ret",
    mode: "inputNormalizeStripLower",
    input: "girdi = input()\ntemiz = girdi.strip()\nprint(temiz)",
    expectValid: false,
    expectMessage: /lower\(\)/,
  },
  {
    name: "inputNormalizeStripLower — strip yok ret",
    mode: "inputNormalizeStripLower",
    input: "girdi = input()\ntemiz = girdi.lower()\nprint(temiz)",
    expectValid: false,
    expectMessage: /strip\(\)/,
  },
  {
    name: "inputNormalizeStripLower — Input büyük harf ret",
    mode: "inputNormalizeStripLower",
    input:
      "girdi = Input()\ntemiz_girdi = girdi.strip().lower()\nprint(temiz_girdi)",
    expectValid: false,
    expectMessage: /input küçük harfle/,
  },
  {
    name: "inputNormalizeStripLower — Strip büyük harf ret",
    mode: "inputNormalizeStripLower",
    input:
      "girdi = input()\ntemiz_girdi = girdi.Strip().lower()\nprint(temiz_girdi)",
    expectValid: false,
    expectMessage: /strip küçük harfle/,
  },
  {
    name: "inputNormalizeStripLower — Lower büyük harf ret",
    mode: "inputNormalizeStripLower",
    input:
      "girdi = input()\ntemiz_girdi = girdi.strip().Lower()\nprint(temiz_girdi)",
    expectValid: false,
    expectMessage: /lower küçük harfle/,
  },
  {
    name: "inputNormalizeStripLower — Print büyük harf ret",
    mode: "inputNormalizeStripLower",
    input:
      "girdi = input()\ntemiz_girdi = girdi.strip().lower()\nPrint(temiz_girdi)",
    expectValid: false,
    expectMessage: /print küçük harfle/,
  },
  {
    name: "wordCountInputSplitLen — kullanıcı cevabı kabul",
    mode: "wordCountInputSplitLen",
    input:
      "cumle = input()\n\nkelimeler = cumle.split()\n\nprint(len(kelimeler))",
    expectValid: true,
  },
  {
    name: "wordCountInputSplitLen — prompt ile kabul",
    mode: "wordCountInputSplitLen",
    input:
      'metin = input("Cümle yaz: ")\nkelimeler = metin.split()\nprint(len(kelimeler))',
    expectValid: true,
  },
  {
    name: "wordCountInputSplitLen — print içinde zincir kabul",
    mode: "wordCountInputSplitLen",
    input: "cumle = input()\nprint(len(cumle.split()))",
    expectValid: true,
  },
  {
    name: "wordCountInputSplitLen — kelime sayısı yok ret",
    mode: "wordCountInputSplitLen",
    input: "cumle = input()\nprint(cumle)",
    expectValid: false,
    expectMessage: /split\(\)/,
  },
  {
    name: "wordCountInputSplitLen — liste yazdırma ret",
    mode: "wordCountInputSplitLen",
    input: "cumle = input()\nkelimeler = cumle.split()\nprint(kelimeler)",
    expectValid: false,
    expectMessage: /split\(\) sonucunu len/,
  },
  {
    name: "wordCountInputSplitLen — karakter sayısı ret",
    mode: "wordCountInputSplitLen",
    input: "cumle = input()\nprint(len(cumle))",
    expectValid: false,
    expectMessage: /split\(\) sonucunu len/,
  },
  {
    name: "wordCountInputSplitLen — Split büyük harf ret",
    mode: "wordCountInputSplitLen",
    input:
      "cumle = input()\nkelimeler = cumle.Split()\nprint(len(kelimeler))",
    expectValid: false,
    expectMessage: /split küçük harfle/,
  },
  {
    name: "wordCountInputSplitLen — Len büyük harf ret",
    mode: "wordCountInputSplitLen",
    input:
      "cumle = input()\nkelimeler = cumle.split()\nprint(Len(kelimeler))",
    expectValid: false,
    expectMessage: /len küçük harfle/,
  },
  {
    name: "wordCountInputSplitLen — Print büyük harf ret",
    mode: "wordCountInputSplitLen",
    input:
      "cumle = input()\nkelimeler = cumle.split()\nPrint(len(kelimeler))",
    expectValid: false,
    expectMessage: /print küçük harfle/,
  },
  {
    name: "longWordsFilterCount — kullanıcı cevabı kabul",
    mode: "longWordsFilterCount",
    input:
      "cumle = input()\n\nkelimeler = cumle.split()\nuzun_kelimeler = []\n\nfor kelime in kelimeler:\nif len(kelime) > 5:\nuzun_kelimeler.append(kelime)\n\nprint(len(uzun_kelimeler))\nprint(uzun_kelimeler)",
    expectValid: true,
  },
  {
    name: "longWordsFilterCount — prompt ile kabul",
    mode: "longWordsFilterCount",
    input:
      'metin = input("Cümle yaz: ")\nkelimeler = metin.split()\nuzunlar = []\n\nfor kelime in kelimeler:\nif len(kelime) > 5:\nuzunlar.append(kelime)\n\nprint("Uzun kelime sayısı:", len(uzunlar))\nprint(uzunlar)',
    expectValid: true,
  },
  {
    name: "longWordsFilterCount — list comprehension kabul",
    mode: "longWordsFilterCount",
    input:
      "cumle = input()\nkelimeler = cumle.split()\nuzun_kelimeler = [kelime for kelime in kelimeler if len(kelime) > 5]\nprint(len(uzun_kelimeler))\nprint(uzun_kelimeler)",
    expectValid: true,
  },
  {
    name: "longWordsFilterCount — tüm kelime sayısı ret",
    mode: "longWordsFilterCount",
    input: "cumle = input()\nkelimeler = cumle.split()\nprint(len(kelimeler))",
    expectValid: false,
    expectMessage: /for döngüsü/,
  },
  {
    name: "longWordsFilterCount — if kontrolü yok ret",
    mode: "longWordsFilterCount",
    input:
      "cumle = input()\nkelimeler = cumle.split()\nuzun_kelimeler = []\n\nfor kelime in kelimeler:\nuzun_kelimeler.append(kelime)\n\nprint(len(uzun_kelimeler))\nprint(uzun_kelimeler)",
    expectValid: false,
    expectMessage: /5 harften uzun/,
  },
  {
    name: "longWordsFilterCount — sayı yazdırılmıyor ret",
    mode: "longWordsFilterCount",
    input:
      "cumle = input()\nkelimeler = cumle.split()\nuzun_kelimeler = []\n\nfor kelime in kelimeler:\nif len(kelime) > 5:\nprint(kelime)",
    expectValid: false,
    expectMessage: /Uzun kelime sayısını/,
  },
  {
    name: "longWordsFilterCount — liste yazdırılmıyor ret",
    mode: "longWordsFilterCount",
    input:
      "cumle = input()\nkelimeler = cumle.split()\nuzun_kelimeler = []\n\nfor kelime in kelimeler:\nif len(kelime) > 5:\nuzun_kelimeler.append(kelime)\n\nprint(uzun_kelimeler)",
    expectValid: false,
    expectMessage: /Uzun kelime sayısını/,
  },
  {
    name: "longWordsFilterCount — Append büyük harf ret",
    mode: "longWordsFilterCount",
    input:
      "cumle = input()\nkelimeler = cumle.split()\nuzun_kelimeler = []\n\nfor kelime in kelimeler:\nif len(kelime) > 5:\nuzun_kelimeler.Append(kelime)\n\nprint(len(uzun_kelimeler))\nprint(uzun_kelimeler)",
    expectValid: false,
    expectMessage: /append küçük harfle/,
  },
  {
    name: "longWordsFilterCount — Split büyük harf ret",
    mode: "longWordsFilterCount",
    input:
      "cumle = input()\nkelimeler = cumle.Split()\nuzun_kelimeler = []\n\nfor kelime in kelimeler:\nif len(kelime) > 5:\nuzun_kelimeler.append(kelime)\n\nprint(len(uzun_kelimeler))\nprint(uzun_kelimeler)",
    expectValid: false,
    expectMessage: /split küçük harfle/,
  },
  {
    name: "longWordsFilterCount — Len büyük harf ret",
    mode: "longWordsFilterCount",
    input:
      "cumle = input()\nkelimeler = cumle.split()\nuzun_kelimeler = []\n\nfor kelime in kelimeler:\nif Len(kelime) > 5:\nuzun_kelimeler.append(kelime)\n\nprint(len(uzun_kelimeler))\nprint(uzun_kelimeler)",
    expectValid: false,
    expectMessage: /len küçük harfle/,
  },
  {
    name: "longWordsFilterCount — Print büyük harf ret",
    mode: "longWordsFilterCount",
    input:
      "cumle = input()\nkelimeler = cumle.split()\nuzun_kelimeler = []\n\nfor kelime in kelimeler:\nif len(kelime) > 5:\nuzun_kelimeler.append(kelime)\n\nPrint(len(uzun_kelimeler))\nprint(uzun_kelimeler)",
    expectValid: false,
    expectMessage: /print küçük harfle/,
  },
  {
    name: "taskMarkCompleteByName — kullanıcı cevabı kabul",
    mode: "taskMarkCompleteByName",
    input:
      'gorevler = [\n{"ad": "Kitap oku", "tamam": False},\n{"ad": "Spor yap", "tamam": False}\n]\n\naranan = "Kitap oku"\n\nfor gorev in gorevler:\nif gorev["ad"] == aranan:\ngorev["tamam"] = True\n\nprint(gorevler)',
    expectValid: true,
  },
  {
    name: "taskMarkCompleteByName — doğrudan string karşılaştırma kabul",
    mode: "taskMarkCompleteByName",
    input:
      'gorevler = [\n{"ad": "Ders çalış", "tamam": False},\n{"ad": "Spor yap", "tamam": False}\n]\n\nfor gorev in gorevler:\nif gorev["ad"] == "Spor yap":\ngorev["tamam"] = True\n\nprint(gorevler)',
    expectValid: true,
  },
  {
    name: "taskMarkCompleteByName — güncelleme yok ret",
    mode: "taskMarkCompleteByName",
    input:
      'gorevler = [\n{"ad": "Kitap oku", "tamam": False},\n{"ad": "Spor yap", "tamam": False}\n]\n\nprint(gorevler)',
    expectValid: false,
    expectMessage: /for döngüsü/,
  },
  {
    name: "taskMarkCompleteByName — ad filtresi yok ret",
    mode: "taskMarkCompleteByName",
    input:
      'gorevler = [\n{"ad": "Kitap oku", "tamam": False},\n{"ad": "Spor yap", "tamam": False}\n]\n\nfor gorev in gorevler:\ngorev["tamam"] = True\n\nprint(gorevler)',
    expectValid: false,
    expectMessage: /if koşulu/,
  },
  {
    name: "taskMarkCompleteByName — string boolean ret",
    mode: "taskMarkCompleteByName",
    input:
      'gorevler = [\n{"ad": "Kitap oku", "tamam": "False"},\n{"ad": "Spor yap", "tamam": "False"}\n]\n\naranan = "Kitap oku"\n\nfor gorev in gorevler:\nif gorev["ad"] == aranan:\ngorev["tamam"] = "True"\n\nprint(gorevler)',
    expectValid: false,
    expectMessage: /boolean olmalı/,
  },
  {
    name: "taskMarkCompleteByName — küçük harf boolean ret",
    mode: "taskMarkCompleteByName",
    input:
      'gorevler = [\n{"ad": "Kitap oku", "tamam": false},\n{"ad": "Spor yap", "tamam": false}\n]\n\naranan = "Kitap oku"\n\nfor gorev in gorevler:\nif gorev["ad"] == aranan:\ngorev["tamam"] = true\n\nprint(gorevler)',
    expectValid: false,
    expectMessage: /büyük harfle yazılır/,
  },
  {
    name: "taskMarkCompleteByName — print yok ret",
    mode: "taskMarkCompleteByName",
    input:
      'gorevler = [\n{"ad": "Kitap oku", "tamam": False},\n{"ad": "Spor yap", "tamam": False}\n]\n\naranan = "Kitap oku"\n\nfor gorev in gorevler:\nif gorev["ad"] == aranan:\ngorev["tamam"] = True',
    expectValid: false,
    expectMessage: /print/,
  },
  {
    name: "taskMarkCompleteByName — For büyük harf ret",
    mode: "taskMarkCompleteByName",
    input:
      'gorevler = [\n{"ad": "Kitap oku", "tamam": False},\n{"ad": "Spor yap", "tamam": False}\n]\n\naranan = "Kitap oku"\n\nFor gorev in gorevler:\nif gorev["ad"] == aranan:\ngorev["tamam"] = True\n\nprint(gorevler)',
    expectValid: false,
    expectMessage: /for küçük harfle/,
  },
  {
    name: "taskMarkCompleteByName — If büyük harf ret",
    mode: "taskMarkCompleteByName",
    input:
      'gorevler = [\n{"ad": "Kitap oku", "tamam": False},\n{"ad": "Spor yap", "tamam": False}\n]\n\naranan = "Kitap oku"\n\nfor gorev in gorevler:\nIf gorev["ad"] == aranan:\ngorev["tamam"] = True\n\nprint(gorevler)',
    expectValid: false,
    expectMessage: /if küçük harfle/,
  },
  {
    name: "taskMarkCompleteByName — Print büyük harf ret",
    mode: "taskMarkCompleteByName",
    input:
      'gorevler = [\n{"ad": "Kitap oku", "tamam": False},\n{"ad": "Spor yap", "tamam": False}\n]\n\naranan = "Kitap oku"\n\nfor gorev in gorevler:\nif gorev["ad"] == aranan:\ngorev["tamam"] = True\n\nPrint(gorevler)',
    expectValid: false,
    expectMessage: /print küçük harfle/,
  },
  {
    name: "taskTrackerFullProject — kullanıcı cevabı kabul",
    mode: "taskTrackerFullProject",
    input:
      'def ekle(gorevler, ad):\ngorev = {\n"ad": ad,\n"tamam": False\n}\ngorevler.append(gorev)\n\ndef listele(gorevler):\nfor gorev in gorevler:\nprint(gorev)\n\ndef tamamla(gorevler, ad):\nfor gorev in gorevler:\nif gorev["ad"] == ad:\ngorev["tamam"] = True\n\ndef ozet(gorevler):\ntoplam = len(gorevler)\ntamamlanan = 0\n\nfor gorev in gorevler:\nif gorev["tamam"]:\ntamamlanan += 1\n\nprint(f"Toplam görev: {toplam}")\nprint(f"Tamamlanan görev: {tamamlanan}")\n\ngorevler = []\n\nekle(gorevler, "Kitap oku")\nekle(gorevler, "Spor yap")\n\ntamamla(gorevler, "Kitap oku")\n\nlistele(gorevler)\nozet(gorevler)',
    expectValid: true,
  },
  {
    name: "taskTrackerFullProject — inline dict kabul",
    mode: "taskTrackerFullProject",
    input:
      'def ekle(liste, ad):\nliste.append({"ad": ad, "tamam": False})\n\ndef listele(liste):\nfor gorev in liste:\nprint(gorev)\n\ndef tamamla(liste, ad):\nfor gorev in liste:\nif gorev["ad"] == ad:\ngorev["tamam"] = True\n\ndef ozet(liste):\ntoplam = len(liste)\ntamamlanan = 0\nfor gorev in liste:\nif gorev["tamam"]:\ntamamlanan += 1\nprint(f"Toplam: {toplam}")\nprint(f"Tamamlanan: {tamamlanan}")\n\ngorevler = []\nekle(gorevler, "Ders çalış")\ntamamla(gorevler, "Ders çalış")\nlistele(gorevler)\nozet(gorevler)',
    expectValid: true,
  },
  {
    name: "taskTrackerFullProject — fonksiyonlar eksik ret",
    mode: "taskTrackerFullProject",
    input:
      'def ekle(gorevler, ad):\ngorevler.append({"ad": ad, "tamam": False})\n\ngorevler = []\nekle(gorevler, "Kitap oku")',
    expectValid: false,
    expectMessage: /listele/,
  },
  {
    name: "taskTrackerFullProject — tamam alanı yok ret",
    mode: "taskTrackerFullProject",
    input:
      'def ekle(gorevler, ad):\ngorevler.append({"ad": ad})\n\ndef listele(gorevler):\nfor gorev in gorevler:\nprint(gorev)\n\ndef tamamla(gorevler, ad):\nfor gorev in gorevler:\nif gorev["ad"] == ad:\ngorev["tamam"] = True\n\ndef ozet(gorevler):\nprint(len(gorevler))\n\ngorevler = []\nekle(gorevler, "Kitap oku")\nlistele(gorevler)\nozet(gorevler)',
    expectValid: false,
    expectMessage: /ad ve tamam/,
  },
  {
    name: "taskTrackerFullProject — string boolean ret",
    mode: "taskTrackerFullProject",
    input:
      'def ekle(gorevler, ad):\ngorevler.append({"ad": ad, "tamam": "False"})\n\ndef listele(gorevler):\nfor gorev in gorevler:\nprint(gorev)\n\ndef tamamla(gorevler, ad):\nfor gorev in gorevler:\nif gorev["ad"] == ad:\ngorev["tamam"] = "True"\n\ndef ozet(gorevler):\nprint(len(gorevler))\n\ngorevler = []\nekle(gorevler, "Kitap oku")\ntamamla(gorevler, "Kitap oku")\nlistele(gorevler)\nozet(gorevler)',
    expectValid: false,
    expectMessage: /boolean olmalı/,
  },
  {
    name: "taskTrackerFullProject — tamamla if yok ret",
    mode: "taskTrackerFullProject",
    input:
      'def ekle(gorevler, ad):\ngorevler.append({"ad": ad, "tamam": False})\n\ndef listele(gorevler):\nfor gorev in gorevler:\nprint(gorev)\n\ndef tamamla(gorevler, ad):\nfor gorev in gorevler:\ngorev["tamam"] = True\n\ndef ozet(gorevler):\nprint(len(gorevler))\n\ngorevler = []\nekle(gorevler, "Kitap oku")\ntamamla(gorevler, "Kitap oku")\nlistele(gorevler)\nozet(gorevler)',
    expectValid: false,
    expectMessage: /if kullanmalısın/,
  },
  {
    name: "taskTrackerFullProject — ozet tamamlanan sayısı yok ret",
    mode: "taskTrackerFullProject",
    input:
      'def ekle(gorevler, ad):\ngorevler.append({"ad": ad, "tamam": False})\n\ndef listele(gorevler):\nfor gorev in gorevler:\nprint(gorev)\n\ndef tamamla(gorevler, ad):\nfor gorev in gorevler:\nif gorev["ad"] == ad:\ngorev["tamam"] = True\n\ndef ozet(gorevler):\ntoplam = len(gorevler)\nprint(toplam)\n\ngorevler = []\nekle(gorevler, "Kitap oku")\ntamamla(gorevler, "Kitap oku")\nlistele(gorevler)\nozet(gorevler)',
    expectValid: false,
    expectMessage: /tamamlanan görev sayısını/,
  },
  {
    name: "taskTrackerFullProject — Append büyük harf ret",
    mode: "taskTrackerFullProject",
    input:
      'def ekle(gorevler, ad):\ngorev = {"ad": ad, "tamam": False}\ngorevler.Append(gorev)',
    expectValid: false,
    expectMessage: /append küçük harfle/,
  },
  {
    name: "taskTrackerFullProject — For büyük harf ret",
    mode: "taskTrackerFullProject",
    input:
      'def listele(gorevler):\nFor gorev in gorevler:\nprint(gorev)',
    expectValid: false,
    expectMessage: /for küçük harfle/,
  },
  {
    name: "taskTrackerFullProject — Print büyük harf ret",
    mode: "taskTrackerFullProject",
    input:
      'def listele(gorevler):\nfor gorev in gorevler:\nPrint(gorev)',
    expectValid: false,
    expectMessage: /print küçük harfle/,
  },
  {
    name: "simpleListAndPrint — kullanıcı cevabı kabul",
    mode: "simpleListAndPrint",
    input:
      'aliskanliklar = ["Kitap okumak", "Spor yapmak", "Su içmek"]\nprint(aliskanliklar)',
    expectValid: true,
  },
  {
    name: "simpleListAndPrint — farklı liste adı kabul",
    mode: "simpleListAndPrint",
    input: 'liste = ["kitap", "spor", "su"]\nprint(liste)',
    expectValid: true,
  },
  {
    name: "simpleListAndPrint — tek tırnak kabul",
    mode: "simpleListAndPrint",
    input: "hobiler = ['müzik', 'koşu', 'kod yazmak']\nprint(hobiler)",
    expectValid: true,
  },
  {
    name: "simpleListAndPrint — iki eleman ret",
    mode: "simpleListAndPrint",
    input:
      'aliskanliklar = ["Kitap okumak", "Spor yapmak"]\nprint(aliskanliklar)',
    expectValid: false,
    expectMessage: /en az 3 eleman/,
  },
  {
    name: "simpleListAndPrint — print yok ret",
    mode: "simpleListAndPrint",
    input: 'aliskanliklar = ["Kitap okumak", "Spor yapmak", "Su içmek"]',
    expectValid: false,
    expectMessage: /print/,
  },
  {
    name: "simpleListAndPrint — string liste ret",
    mode: "simpleListAndPrint",
    input:
      'aliskanliklar = "Kitap okumak, Spor yapmak, Su içmek"\nprint(aliskanliklar)',
    expectValid: false,
    expectMessage: /köşeli parantez/,
  },
  {
    name: "simpleListAndPrint — tırnaksız eleman ret",
    mode: "simpleListAndPrint",
    input:
      "aliskanliklar = [Kitap okumak, Spor yapmak, Su içmek]\nprint(aliskanliklar)",
    expectValid: false,
    expectMessage: /tırnak/,
  },
  {
    name: "simpleListAndPrint — Print büyük harf ret",
    mode: "simpleListAndPrint",
    input:
      'aliskanliklar = ["Kitap okumak", "Spor yapmak", "Su içmek"]\nPrint(aliskanliklar)',
    expectValid: false,
    expectMessage: /print küçük harfle/,
  },
  {
    name: "habitDictList — kullanıcı cevabı kabul",
    mode: "habitDictList",
    input:
      'aliskanliklar = [\n{"ad": "Kitap okumak", "tamamlandi": False},\n{"ad": "Spor yapmak", "tamamlandi": True},\n{"ad": "Su içmek", "tamamlandi": False}\n]\n\nprint(aliskanliklar)',
    expectValid: true,
  },
  {
    name: "habitDictList — tek dict ret",
    mode: "habitDictList",
    input:
      'aliskanlik = {\n"ad": "Kitap okumak",\n"tamamlandi": False\n}\n\nprint(aliskanlik)',
    expectValid: false,
    expectMessage: /birden fazla alışkanlığı dict olarak liste/,
  },
  {
    name: "habitDictList — eksik tamamlandi ret",
    mode: "habitDictList",
    input:
      'aliskanliklar = [\n{"ad": "Kitap okumak"},\n{"ad": "Spor yapmak"}\n]\n\nprint(aliskanliklar)',
    expectValid: false,
    expectMessage: /ad ve tamamlandi/,
  },
  {
    name: "habitDictList — string boolean ret",
    mode: "habitDictList",
    input:
      'aliskanliklar = [\n{"ad": "Kitap okumak", "tamamlandi": "False"},\n{"ad": "Spor yapmak", "tamamlandi": "True"}\n]\n\nprint(aliskanliklar)',
    expectValid: false,
    expectMessage: /boolean olmalı/,
  },
  {
    name: "habitDictList — küçük harf boolean ret",
    mode: "habitDictList",
    input:
      'aliskanliklar = [\n{"ad": "Kitap okumak", "tamamlandi": false},\n{"ad": "Spor yapmak", "tamamlandi": true}\n]\n\nprint(aliskanliklar)',
    expectValid: false,
    expectMessage: /büyük harfle/,
  },
  {
    name: "habitDictList — print yok ret",
    mode: "habitDictList",
    input:
      'aliskanliklar = [\n{"ad": "Kitap okumak", "tamamlandi": False},\n{"ad": "Spor yapmak", "tamamlandi": True}\n]',
    expectValid: false,
    expectMessage: /print/,
  },
  {
    name: "habitCompletionPercentage — kullanıcı cevabı kabul",
    mode: "habitCompletionPercentage",
    input:
      'aliskanliklar = [\n{"ad": "Kitap okumak", "tamamlandi": True},\n{"ad": "Spor yapmak", "tamamlandi": False},\n{"ad": "Su içmek", "tamamlandi": True}\n]\n\ntamamlanan_sayi = 0\n\nfor aliskanlik in aliskanliklar:\nif aliskanlik["tamamlandi"]:\ntamamlanan_sayi += 1\n\nyuzde = tamamlanan_sayi / len(aliskanliklar) * 100\n\nprint(f"Tamamlanma yüzdesi: %{yuzde}")',
    expectValid: true,
  },
  {
    name: "habitCompletionPercentage — farklı değişken adları kabul",
    mode: "habitCompletionPercentage",
    input:
      'aliskanliklar = [\n{"ad": "Kitap", "tamamlandi": True},\n{"ad": "Spor", "tamamlandi": False},\n{"ad": "Su", "tamamlandi": True}\n]\n\ntamamlanan = 0\n\nfor item in aliskanliklar:\nif item["tamamlandi"]:\ntamamlanan += 1\n\noran = tamamlanan / len(aliskanliklar) * 100\nprint(f"Tamamlanma oranı: %{oran}")',
    expectValid: true,
  },
  {
    name: "habitCompletionPercentage — string boolean ret",
    mode: "habitCompletionPercentage",
    input:
      'aliskanliklar = [\n{"ad": "Kitap okumak", "tamamlandi": "True"},\n{"ad": "Spor yapmak", "tamamlandi": "False"}\n]',
    expectValid: false,
    expectMessage: /boolean olmalı/,
  },
  {
    name: "habitCompletionPercentage — küçük harf boolean ret",
    mode: "habitCompletionPercentage",
    input:
      'aliskanliklar = [\n{"ad": "Kitap okumak", "tamamlandi": true},\n{"ad": "Spor yapmak", "tamamlandi": false}\n]',
    expectValid: false,
    expectMessage: /büyük harfle/,
  },
  {
    name: "habitCompletionPercentage — yüzde hesabı yok ret",
    mode: "habitCompletionPercentage",
    input:
      'aliskanliklar = [\n{"ad": "Kitap okumak", "tamamlandi": True},\n{"ad": "Spor yapmak", "tamamlandi": False}\n]\n\nprint(aliskanliklar)',
    expectValid: false,
    expectMessage: /for döngüsü/,
  },
  {
    name: "habitCompletionPercentage — for if len yüzde yok ret",
    mode: "habitCompletionPercentage",
    input:
      'aliskanliklar = [\n{"ad": "Kitap okumak", "tamamlandi": True},\n{"ad": "Spor yapmak", "tamamlandi": False}\n]\n\ntamamlanan = 1\nprint(f"Tamamlanan: {tamamlanan}")',
    expectValid: false,
    expectMessage: /for döngüsü/,
  },
  {
    name: "habitCompletionPercentage — f-string yok ret",
    mode: "habitCompletionPercentage",
    input:
      'aliskanliklar = [\n{"ad": "Kitap okumak", "tamamlandi": True},\n{"ad": "Spor yapmak", "tamamlandi": False}\n]\n\ntamamlanan = 0\n\nfor aliskanlik in aliskanliklar:\nif aliskanlik["tamamlandi"]:\ntamamlanan += 1\n\nyuzde = tamamlanan / len(aliskanliklar) * 100\n\nprint("Tamamlanma yüzdesi: %{yuzde}")',
    expectValid: false,
    expectMessage: /f-string/,
  },
  {
    name: "habitTrackerSummaryFunction — kullanıcı cevabı kabul",
    mode: "habitTrackerSummaryFunction",
    input:
      'def ozet_yazdir(gorevler):\ntoplam = len(gorevler)\ntamamlanan = 0\n\nfor gorev in gorevler:\n    if gorev["tamamlandi"]:\n        tamamlanan += 1\n\nyuzde = tamamlanan / toplam * 100\n\nprint(f"Toplam görev: {toplam}")\nprint(f"Tamamlanan görev: {tamamlanan}")\nprint(f"Tamamlanma yüzdesi: %{yuzde}")\n\ngorevler = [\n{"ad": "Kitap okumak", "tamamlandi": True},\n{"ad": "Spor yapmak", "tamamlandi": False},\n{"ad": "Su içmek", "tamamlandi": True}\n]\n\nozet_yazdir(gorevler)',
    expectValid: true,
  },
  {
    name: "habitTrackerSummaryFunction — farklı parametre adı kabul",
    mode: "habitTrackerSummaryFunction",
    input:
      'def ozet_yazdir(liste):\ntoplam = len(liste)\ntamamlanan = 0\n\nfor item in liste:\n    if item["tamamlandi"]:\n        tamamlanan += 1\n\noran = tamamlanan / toplam * 100\n\nprint(f"Toplam: {toplam}")\nprint(f"Tamamlanan: {tamamlanan}")\nprint(f"Yüzde: %{oran}")\n\ngorevler = [\n{"ad": "Kitap", "tamamlandi": True},\n{"ad": "Spor", "tamamlandi": False},\n{"ad": "Su", "tamamlandi": True}\n]\n\nozet_yazdir(gorevler)',
    expectValid: true,
  },
  {
    name: "habitTrackerSummaryFunction — fonksiyon yok ret",
    mode: "habitTrackerSummaryFunction",
    input:
      'gorevler = [\n{"ad": "Kitap okumak", "tamamlandi": True},\n{"ad": "Spor yapmak", "tamamlandi": False}\n]\n\nprint(gorevler)',
    expectValid: false,
    expectMessage: /ozet_yazdir/,
  },
  {
    name: "habitTrackerSummaryFunction — özet hesabı yok ret",
    mode: "habitTrackerSummaryFunction",
    input:
      'def ozet_yazdir(gorevler):\nprint(gorevler)\n\ngorevler = [\n{"ad": "Kitap okumak", "tamamlandi": True},\n{"ad": "Spor yapmak", "tamamlandi": False}\n]\n\nozet_yazdir(gorevler)',
    expectValid: false,
    expectMessage: /len/,
  },
  {
    name: "habitTrackerSummaryFunction — sadece toplam ret",
    mode: "habitTrackerSummaryFunction",
    input:
      'def ozet_yazdir(gorevler):\ntoplam = len(gorevler)\nprint(f"Toplam: {toplam}")\n\ngorevler = [\n{"ad": "Kitap okumak", "tamamlandi": True},\n{"ad": "Spor yapmak", "tamamlandi": False}\n]\n\nozet_yazdir(gorevler)',
    expectValid: false,
    expectMessage: /for döngüsü/,
  },
  {
    name: "habitTrackerSummaryFunction — yüzde yok ret",
    mode: "habitTrackerSummaryFunction",
    input:
      'def ozet_yazdir(gorevler):\ntoplam = len(gorevler)\ntamamlanan = 0\n\nfor gorev in gorevler:\n    if gorev["tamamlandi"]:\n        tamamlanan += 1\n\nprint(f"Toplam: {toplam}")\nprint(f"Tamamlanan: {tamamlanan}")\n\ngorevler = [\n{"ad": "Kitap okumak", "tamamlandi": True},\n{"ad": "Spor yapmak", "tamamlandi": False}\n]\n\nozet_yazdir(gorevler)',
    expectValid: false,
    expectMessage: /100 ile çarp/,
  },
  {
    name: "habitTrackerSummaryFunction — f-string yok ret",
    mode: "habitTrackerSummaryFunction",
    input:
      'def ozet_yazdir(gorevler):\ntoplam = len(gorevler)\ntamamlanan = 0\n\nfor gorev in gorevler:\n    if gorev["tamamlandi"]:\n        tamamlanan += 1\n\nyuzde = tamamlanan / toplam * 100\n\nprint("Toplam görev: {toplam}")\nprint("Tamamlanan görev: {tamamlanan}")\nprint("Tamamlanma yüzdesi: %{yuzde}")\n\ngorevler = [\n{"ad": "Kitap okumak", "tamamlandi": True},\n{"ad": "Spor yapmak", "tamamlandi": False}\n]\n\nozet_yazdir(gorevler)',
    expectValid: false,
    expectMessage: /f-string/,
  },
  {
    name: "habitTrackerSummaryFunction — string boolean ret",
    mode: "habitTrackerSummaryFunction",
    input:
      'def ozet_yazdir(gorevler):\ntoplam = len(gorevler)\ntamamlanan = 0\n\nfor gorev in gorevler:\n    if gorev["tamamlandi"]:\n        tamamlanan += 1\n\nyuzde = tamamlanan / toplam * 100\n\nprint(f"Toplam görev: {toplam}")\nprint(f"Tamamlanan görev: {tamamlanan}")\nprint(f"Tamamlanma yüzdesi: %{yuzde}")\n\ngorevler = [\n{"ad": "Kitap okumak", "tamamlandi": "True"},\n{"ad": "Spor yapmak", "tamamlandi": "False"}\n]\n\nozet_yazdir(gorevler)',
    expectValid: false,
    expectMessage: /boolean olmalı/,
  },
  {
    name: "habitTrackerSummaryFunction — Print büyük harf ret",
    mode: "habitTrackerSummaryFunction",
    input:
      'def ozet_yazdir(gorevler):\ntoplam = len(gorevler)\ntamamlanan = 0\n\nfor gorev in gorevler:\n    if gorev["tamamlandi"]:\n        tamamlanan += 1\n\nyuzde = tamamlanan / toplam * 100\n\nPrint(f"Toplam görev: {toplam}")\n\ngorevler = [\n{"ad": "Kitap okumak", "tamamlandi": True},\n{"ad": "Spor yapmak", "tamamlandi": False}\n]\n\nozet_yazdir(gorevler)',
    expectValid: false,
    expectMessage: /print küçük harfle/,
  },
];

export function runCodeValidationFixtures(): {
  name: string;
  ok: boolean;
  message?: string;
}[] {
  return CODE_VALIDATION_FIXTURES.map((fixture) => {
    const rules: StepValidation = {
      validationMode: fixture.mode,
      minLength: 5,
      ...fixture.rules,
    };
    applyModeDefaults(rules);
    const result = validateCodeAnswer(fixture.input, rules);
    const validOk = result.valid === fixture.expectValid;
    const msgOk =
      !fixture.expectMessage ||
      (result.message !== undefined && fixture.expectMessage.test(result.message));
    return {
      name: fixture.name,
      ok: validOk && msgOk,
      message: result.message,
    };
  });
}
