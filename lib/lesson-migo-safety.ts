import type { LessonStep, LessonStepType } from "@/data/lessons/types";

const ANSWER_LEAK_PATTERNS = [
  /\bdoğru\s+(cevap|şık|seçenek)/i,
  /\b(cevap|şık)\s+[A-D]\b/i,
  /\bşu\s+şıkkı\s+seç/i,
  /\bşöyle\s+yazmalısın/i,
  /\bdoğru\s+kod\b/i,
  /\d+\s*[<>!=]+\s*\d+.*(doğru|False|True|çalışır)/i,
  /\b(False|True)\s+döner/i,
  /\belif\s+dalı\s+çalışır/i,
  /\belse\s+çalışır/i,
  /en\s+sonda\s+çalışmalı/i,
  /\b\d+\s*[\*\+\-\/]\s*\d+\s*=\s*\d+/,
];

const GENERIC_PRE_HINTS: Partial<Record<LessonStepType, string>> = {
  "multiple-choice":
    "Seçenekleri tek tek oku. Ezberden çok kavramın ne anlama geldiğine odaklan.",
  "fill-blank":
    "Boşluğu doldurmadan önce cümlenin tamamını oku ve hangi yapının eksik olduğunu düşün.",
  "output-quiz":
    "Kodu satır satır takip et. Önce hangi satırın çalıştığını, sonra ekranda ne görüneceğini düşün.",
  "code-order":
    "Python'da önce tanımlama, sonra kullanım sırası önemlidir. Kodun akışını düşün.",
  "debug-choice":
    "Hata ayıklarken parantez, tırnak, girinti ve değişken adlarına bakmak iyi bir başlangıçtır.",
  "match-concept":
    "Her kavramı seçeneklerle tek tek eşleştir. Acele etme, anlam üzerinden git.",
  "code-writing":
    "Görevde istenen çıktıyı veya davranışı tekrar oku. Python yapısını kendin kur.",
  "project-step":
    "Hedef çıktıyı aklında tut ve adım adım ilerle. Küçük parçalarla başlayabilirsin.",
  "mini-task":
    "Görev metnindeki anahtar kelimelere dikkat et ve ona uygun bir kod yaz.",
  info: "Bir sonraki adımda göreceğin görev için bu bilgiyi aklında tut.",
};

const GENERIC_INCORRECT_FEEDBACK =
  "Henüz tam değil. Soruyu ve seçenekleri tekrar oku; kodun davranışını veya kavramı düşünerek yeniden dene.";

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function collectAnswerTokens(step: LessonStep): string[] {
  const tokens = new Set<string>();

  if (step.correctAnswer) {
    tokens.add(step.correctAnswer.trim());
    for (const part of step.correctAnswer.split(/\||\n/)) {
      const piece = part.trim();
      if (piece.length >= 2) tokens.add(piece);
    }
  }

  for (const option of step.options ?? []) {
    if (step.correctAnswer && answersEquivalent(option, step.correctAnswer)) {
      tokens.add(option.trim());
    }
  }

  for (const pair of step.matchPairs ?? []) {
    tokens.add(pair.answer.trim());
  }

  return [...tokens].filter((token) => token.length >= 2);
}

function answersEquivalent(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

export function messageLeaksAnswer(message: string, step: LessonStep): boolean {
  const trimmed = message.trim();
  if (!trimmed) return false;

  for (const pattern of ANSWER_LEAK_PATTERNS) {
    if (pattern.test(trimmed)) return true;
  }

  for (const token of collectAnswerTokens(step)) {
    const lowerToken = token.toLowerCase();
    const lowerMessage = trimmed.toLowerCase();

    if (lowerToken.length >= 8 && lowerMessage.includes(lowerToken)) {
      return true;
    }

    if (lowerToken.length >= 2 && lowerToken.length <= 40) {
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
  if (!raw) return null;

  if (messageLeaksAnswer(raw, step)) {
    return getGenericPreAnswerHint(step.type);
  }

  return raw;
}

export function getPostCorrectMigoMessage(step: LessonStep): string | null {
  const after = step.migoMessageAfterCorrect?.trim();
  if (after) return after;

  const pre = step.migoMessage?.trim();
  if (pre && !messageLeaksAnswer(pre, step)) {
    return null;
  }

  return null;
}

export function getSafeQuizIncorrectFeedback(step: LessonStep): string {
  const custom = step.feedback?.incorrect?.trim();
  if (custom && !messageLeaksAnswer(custom, step)) {
    return custom;
  }

  if (step.type === "output-quiz") {
    return "Çıktıyı tekrar düşün. Kodu satır satır okuyup her print'in ne yazdırdığını takip et.";
  }

  if (step.type === "debug-choice") {
    return "Bu seçenek tam isabet değil. Parantez, tırnak, girinti ve değişken adlarını tekrar kontrol et.";
  }

  if (step.type === "fill-blank") {
    return "Boşluk henüz doğru değil. Cümlenin anlamına ve Python sözdizimine tekrar bak.";
  }

  if (step.type === "match-concept") {
    return "Bazı eşleştirmeler uyumsuz görünüyor. Kavramları seçeneklerle tekrar karşılaştır.";
  }

  if (step.type === "code-order") {
    return "Satır sırası henüz doğru değil. Önce tanımlama, sonra kullanım mantığını düşün.";
  }

  return GENERIC_INCORRECT_FEEDBACK;
}

export function getSafeQuizCorrectFeedback(step: LessonStep): string {
  const custom = step.feedback?.correct?.trim();
  if (custom) return custom;
  return "Doğru!";
}
