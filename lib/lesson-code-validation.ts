import type { StepValidation } from "@/data/lessons/types";

export function validateCodeAnswer(
  input: string,
  validation?: StepValidation,
): { valid: boolean; message?: string } {
  const trimmed = input.trim();

  if (!trimmed) {
    return {
      valid: false,
      message: validation?.hint ?? "Lütfen bir cevap yaz.",
    };
  }

  if (!validation) {
    if (trimmed.length < 3) {
      return { valid: false, message: "Cevap çok kısa. Biraz daha detay ekle." };
    }
    return { valid: true };
  }

  if (trimmed.length < (validation.minLength ?? 3)) {
    return {
      valid: false,
      message: validation.hint ?? "Cevap beklenenden kısa.",
    };
  }

  for (const required of validation.requiredIncludes ?? []) {
    if (!trimmed.includes(required)) {
      return {
        valid: false,
        message:
          validation.hint ??
          `Kodunda "${required}" bulunmalı. Görevde istenen yapıyı kullan.`,
      };
    }
  }

  for (const pattern of validation.requiredPatterns ?? []) {
    const regex = new RegExp(pattern, "i");
    if (!regex.test(trimmed)) {
      return {
        valid: false,
        message:
          validation.hint ??
          "Beklenen kod yapısı bulunamadı. Örneği tekrar incele.",
      };
    }
  }

  const lowered = trimmed.toLowerCase();
  const rejectPatterns = validation.rejectPatterns ?? [];
  for (const pattern of rejectPatterns) {
    const regex = new RegExp(pattern, "i");
    if (regex.test(lowered)) {
      return {
        valid: false,
        message:
          validation.hint ??
          "Cevap görevle uyumlu görünmüyor. İstenen kod yapısını kullan.",
      };
    }
  }

  return { valid: true };
}
