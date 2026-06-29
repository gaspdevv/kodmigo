import type { LessonStep, LessonStepType } from "@/data/lessons/types";

const ANSWER_LEAK_PATTERNS = [
  /\bdoğru\s+(cevap|şık|seçenek)/i,
  /\b(cevap|şık)\s+[A-D]\b/i,
  /\bşu\s+şıkkı\s+seç/i,
  /\bşöyle\s+yazmalısın/i,
  /\bdoğru\s+kod\b/i,
  /\bdoğru\s+sıra\b/i,
  /\bcevap\s+.+\s+olmalı/i,
  /\bburada\s+çıktı\b/i,
  /\bşu\s+kodu\s+yaz/i,
  /\bhata\s+.+\s+satırında\b/i,
  /\beksik\s+olan\s+şey\b/i,
  /\bkod\s+ekrana\s+.+\s+yazar\b/i,
  /\d+\s*[<>!=]+\s*\d+.*(doğru|çalışır)/i,
  /\belif\s+dalı\s+çalışır/i,
  /\belse\s+çalışır/i,
  /en\s+sonda\s+çalışmalı/i,
  /\b\d+\s*[\*\+\-\/]\s*\d+\s*=\s*\d+/,
  /\bsırayla\b.+\bsonra\b.+\bgörün/i,
  /\bprint\s+içindeki\s+metin\s+olduğu\s+gibi/i,
  /\batama\s+print['']?ten\s+önce/i,
  /\bönce\s+değişken\b[^.]{0,40}\bsonra\s+print/i,
  /\bönce\s+tanımla\b[^.]{0,40}\bsonra\b/i,
  /\bhangi\s+komutu\s+kullanmıştık/i,
  /\bhangi\s+komutu\s+kullanırsın/i,
  /\bçağrı\s+en\s+sonda\s+mı\s+olmalı/i,
  /\bsonunda\s+\d+\s+kalır/i,
  /\b—\s*and\b/i,
  /\b—\s*or\b/i,
  /\bdict\s+için\s+ideal/i,
  /\blist\s+için\s+ideal/i,
  /\bnameerror\s+verir/i,
  /\btanımsız\s+değişken\b/i,
  /\bhangi\s+anahtar\s+kelime\b/i,
  /\bhangi\s+parantez\s+türü\b/i,
  /\b\d+\s+numaralı\s+indeks\b/i,
  /\bprint\s*\(\s*["'][^"']+["']\s*\)/,
];

const GENERIC_PRE_HINTS: Partial<Record<LessonStepType, string>> = {
  "multiple-choice":
    "Seçenekleri tek tek oku. Python'da kodun ne yaptığını anlamak için önce hangi işlemin çalıştığına bak.",
  "fill-blank":
    "Boşluğu doldurmadan önce cümlenin tamamını oku ve hangi yapının eksik olduğunu düşün.",
  "output-quiz":
    "Kodun çıktısını tahmin ederken satırları yukarıdan aşağıya takip et. Her print() ayrı çıktı üretir.",
  "code-order":
    "Sıralama yaparken önce hangi satırın diğerleri için gerekli olduğunu düşün.",
  "debug-choice":
    "Python'da yazım ve büyük/küçük harf duyarlılığına dikkat et. Parantez, tırnak ve girintiyi de kontrol et.",
  "match-concept":
    "Her kavramın yaptığı işi düşün: biri ekrana çıktı verir, biri bilgiyi saklar.",
  "code-writing":
    "Bu görevde gerekli Python yapılarını düşün. input(), dönüşüm ve print(...) adımlarını sırayla planla.",
  "project-step":
    "Bu adımda birkaç kavram birleşir. Veriyi hazırla, işlemi yap, sonucu yazdır — adım adım düşün.",
  "mini-task":
    "Görev metnindeki anahtar kelimelere dikkat et. Kodun ne yapması gerektiğini küçük adımlara böl.",
  info: "Bir sonraki adımda göreceğin görev için bu bilgiyi aklında tut.",
};

const GENERIC_INCORRECT_FEEDBACK =
  "Henüz tam değil. Soruyu ve seçenekleri tekrar oku; kodun davranışını veya kavramı düşünerek yeniden dene.";

/** Short generic answers where token overlap is expected in conceptual hints. */
const COMMON_ANSWER_WORDS = new Set([
  "true",
  "false",
  "none",
  "hata",
  "error",
  "1",
  "0",
  "ok",
  "evet",
  "hayır",
  "print",
  "list",
  "dict",
  "if",
  "else",
  "elif",
  "for",
  "while",
  "def",
  "and",
  "or",
  "not",
  "int",
  "str",
  "float",
]);

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeForLeakCompare(text: string): string {
  return text.trim().toLowerCase().replace(/\n/g, " ").replace(/\s+/g, " ");
}

function isDistinctiveAnswerToken(token: string): boolean {
  const normalized = token.trim().toLowerCase();
  if (normalized.length < 3) return false;
  if (COMMON_ANSWER_WORDS.has(normalized)) return false;
  return true;
}

function answersEquivalent(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

function collectAnswerTokens(step: LessonStep): string[] {
  const tokens = new Set<string>();

  const addToken = (value: string | undefined) => {
    const trimmed = value?.trim();
    if (!trimmed || trimmed.length < 2) return;
    tokens.add(trimmed);
    for (const part of trimmed.split(/\||\n/)) {
      const piece = part.trim();
      if (piece.length >= 2) tokens.add(piece);
    }
  };

  addToken(step.correctAnswer);
  addToken(step.targetOutput);
  addToken(step.expectedText);

  for (const option of step.options ?? []) {
    if (step.correctAnswer && answersEquivalent(option, step.correctAnswer)) {
      addToken(option);
    }
  }

  for (const pair of step.matchPairs ?? []) {
    addToken(pair.answer);
    addToken(pair.concept);
  }

  if (step.orderLines?.length && step.correctAnswer) {
    addToken(step.correctAnswer);
  }

  return [...tokens];
}

export function messageLeaksAnswer(message: string, step: LessonStep): boolean {
  const trimmed = message.trim();
  if (!trimmed) return false;

  for (const pattern of ANSWER_LEAK_PATTERNS) {
    if (pattern.test(trimmed)) return true;
  }

  const lowerMessage = trimmed.toLowerCase();
  const normalizedMessage = normalizeForLeakCompare(trimmed);

  if (step.correctAnswer) {
    const normalizedAnswer = normalizeForLeakCompare(step.correctAnswer);
    if (
      normalizedAnswer.length >= 6 &&
      normalizedMessage.includes(normalizedAnswer)
    ) {
      return true;
    }
  }

  if (step.targetOutput) {
    const normalizedTarget = normalizeForLeakCompare(step.targetOutput);
    if (
      normalizedTarget.length >= 6 &&
      normalizedMessage.includes(normalizedTarget)
    ) {
      return true;
    }
  }

  for (const token of collectAnswerTokens(step)) {
    if (!isDistinctiveAnswerToken(token)) continue;

    const lowerToken = token.toLowerCase();

    if (lowerToken.length >= 8 && lowerMessage.includes(lowerToken)) {
      return true;
    }

    if (lowerToken.length >= 3 && lowerToken.length <= 60) {
      const wordPattern = new RegExp(`\\b${escapeRegex(lowerToken)}\\b`, "i");
      if (wordPattern.test(trimmed)) return true;
    }
  }

  return false;
}

export function getGenericPreAnswerHint(stepType: LessonStepType): string {
  return (
    GENERIC_PRE_HINTS[stepType] ??
    "Cevap vermeden önce soruyu sakin oku ve ne istendiğini netleştir."
  );
}

export function getPreAnswerMigoMessage(step: LessonStep): string | null {
  const raw = step.migoMessage?.trim();

  if (raw && !messageLeaksAnswer(raw, step)) {
    return raw;
  }

  if (raw && messageLeaksAnswer(raw, step)) {
    return getGenericPreAnswerHint(step.type);
  }

  if (
    step.type === "multiple-choice" ||
    step.type === "fill-blank" ||
    step.type === "output-quiz" ||
    step.type === "code-order" ||
    step.type === "debug-choice" ||
    step.type === "match-concept" ||
    step.type === "code-writing" ||
    step.type === "project-step" ||
    step.type === "mini-task" ||
    step.type === "info"
  ) {
    return getGenericPreAnswerHint(step.type);
  }

  return null;
}

export function getPostCorrectMigoMessage(step: LessonStep): string | null {
  const after = step.migoMessageAfterCorrect?.trim();
  if (after) return after;

  return null;
}

export function getSafeQuizIncorrectFeedback(step: LessonStep): string {
  const custom = step.feedback?.incorrect?.trim();
  if (custom && !messageLeaksAnswer(custom, step)) {
    return custom;
  }

  if (step.type === "output-quiz") {
    return "Kodun satırlarını sırayla takip etmeyi dene. print() her çalıştığında ekrana yeni bir çıktı ekler.";
  }

  if (step.type === "debug-choice") {
    return "Bu seçenek tam isabet değil. Parantez, tırnak, girinti ve yazımı tekrar kontrol et.";
  }

  if (step.type === "fill-blank") {
    return "Boşluk henüz doğru değil. Cümlenin anlamına ve Python sözdizimine tekrar bak.";
  }

  if (step.type === "match-concept") {
    return "Bazı eşleştirmeler uyumsuz görünüyor. Kavramları seçeneklerle tekrar karşılaştır.";
  }

  if (step.type === "code-order") {
    return "Satır sırası henüz doğru değil. Önce hangi satırın diğerleri için gerekli olduğunu düşün.";
  }

  return GENERIC_INCORRECT_FEEDBACK;
}

export function getSafeQuizCorrectFeedback(step: LessonStep): string {
  const custom = step.feedback?.correct?.trim();
  if (custom) return custom;
  return "Doğru!";
}
