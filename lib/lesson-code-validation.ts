import type { LessonStep, StepValidation } from "@/data/lessons/types";

export type ValidationResult = {
  valid: boolean;
  message?: string;
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
  /print\s*\(|def\s+\w|^\s*if\s+|^\s*elif\s+|^\s*else\s*:|^\s*for\s+|^\s*while\s+|=\s*[^=]|input\s*\(|return\s+|import\s+|class\s+|f["']|f["']/im;

const SOLUTION_LEAK_PATTERN =
  /print\s*\([^)]+\)|=\s*["'][^"']+["']|def\s+\w+\s*\(|input\s*\([^)]+\)/i;

const DEFAULT_HINTS = {
  empty: "Lütfen Python kodunu yaz. Boş bırakılamaz.",
  junk:
    "Kodun biraz alakasız görünüyor. Görevde istenen hedef çıktıyı tekrar okuyup ona uygun bir kod yazmayı dene.",
  tooShort:
    "Güzel deneme! Ama bu cevap henüz görevin istediği Python yapısını içermiyor. Biraz daha detay ekle.",
  notPython:
    "Yaklaştın! Bu adımda Python kodu yazmanı istiyoruz. Görevde istenen yapıyı (print, değişken, koşul vb.) düşün.",
  missingPrint:
    "Yaklaştın! Bu adımda Python'da ekrana yazdırmak için print(...) yapısını kullanmayı düşün.",
  emptyPrint:
    "print() kullandın ama içine bir mesaj eklemen gerekiyor. Parantez içine yazdırılacak metni koy.",
  missingAssignment:
    "Güzel deneme! Bu adımda bir değişken tanımlamanı istiyoruz. Değişken oluştururken = işaretini kullanırsın.",
  incompleteAssignment:
    "Değişken ataması yarım kalmış gibi görünüyor. = işaretinin iki tarafını da doldurmayı dene.",
  missingKeyword:
    "Kodunda görevle ilgili beklenen bir kelime eksik. Görev metnini tekrar oku.",
  missingAnyKeyword:
    "Kodunda görevle ilgili beklenen kelimelerden en az biri geçmeli.",
  missingStructure:
    "Güzel deneme! Ama bu cevap henüz görevin istediği Python yapısını içermiyor.",
  missingPrintCount:
    "Tanışma kartı biraz daha dolu olmalı. En az birkaç satır print kullanarak hedef çıktıya yaklaşmayı dene.",
  missingLines:
    "Bu adım birkaç satırlık kod bekliyor. Görevi parça parça yazmayı dene.",
  consoleLog:
    "Bu görev Python için. JavaScript'teki console.log yerine print(...) kullan.",
  plainTextOnly:
    "Sadece düz metin yazmak yerine Python kodu yazmalısın. print veya değişken gibi yapıları kullan.",
  default:
    "Henüz tam değil. Görevi tekrar oku ve küçük bir düzenleme daha dene.",
};

type HintKey = keyof typeof DEFAULT_HINTS;

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

function hasIncompleteAssignment(input: string): boolean {
  return /^\s*[a-zA-Z_]\w*\s*=\s*$/m.test(input);
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

function hasMeaningfulPrint(input: string): boolean {
  if (!/print\s*\(/i.test(input)) return false;
  if (hasEmptyPrint(input)) return false;

  const stringPrints = [...input.matchAll(/print\s*\(\s*(["'])([\s\S]*?)\1/gi)];
  for (const match of stringPrints) {
    const content = (match[2] ?? "").trim();
    if (content.length >= 2) return true;
  }

  if (/print\s*\(\s*f["']/i.test(input)) return true;
  if (/print\s*\(\s*[a-zA-Z_]\w*\s*\)/i.test(input)) return true;
  if (/print\s*\(\s*[^"')\s]/i.test(input)) return true;

  return false;
}

function hasValidAssignment(input: string): boolean {
  return /^\s*[a-zA-Z_]\w*\s*=\s*\S/m.test(input);
}

function inferTaskRequirements(step: LessonStep, rules: StepValidation): void {
  const checklist = checklistText(step);
  const taskText = `${step.title} ${step.content ?? ""}`.toLowerCase();

  if (
    rules.mustIncludePrint === undefined &&
    (/print/.test(checklist) ||
      /print\s*\(|yazdır|çıktı/.test(taskText))
  ) {
    rules.mustIncludePrint = true;
  }

  if (
    rules.mustIncludeAssignment === undefined &&
    (/(değişken|atama|variable)/.test(checklist) ||
      /(değişken|ata|atama|sakla)/.test(taskText))
  ) {
    rules.mustIncludeAssignment = true;
  }

  if (
    rules.mustIncludeDef === undefined &&
    (/(def |fonksiyon)/.test(checklist) || /fonksiyon|def\s/.test(taskText))
  ) {
    rules.mustIncludeDef = true;
  }

  if (
    rules.mustIncludeIf === undefined &&
    (/(if\/elif|if\/else|\bif\b|elif|else|koşul)/.test(checklist) ||
      /\bif\b|elif|else|koşul/.test(taskText))
  ) {
    rules.mustIncludeIf = true;
  }

  if (
    rules.mustIncludeLoop === undefined &&
    (/(for |while |döngü)/.test(checklist) ||
      /\bfor\b|\bwhile\b|döngü/.test(taskText))
  ) {
    rules.mustIncludeLoop = true;
  }

  if (
    rules.mustIncludePrint === undefined &&
    (rules.requiredIncludes ?? []).some(
      (value) => value.toLowerCase() === "print",
    )
  ) {
    rules.mustIncludePrint = true;
  }

  if (
    rules.mustIncludePrint === undefined &&
    (rules.requiredPatterns ?? []).some((pattern) => pattern.includes("print"))
  ) {
    rules.mustIncludePrint = true;
  }
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

  if (trimmed.length < (rules.minLength ?? 10)) {
    return { valid: false, message: pickHint(rules, "tooShort") };
  }

  if (rules.mustLookLikePython !== false && !looksLikePythonCode(trimmed)) {
    return { valid: false, message: pickHint(rules, "notPython") };
  }

  if (rules.mustIncludePrint) {
    if (!hasMeaningfulPrint(trimmed)) {
      if (!/print\s*\(/i.test(trimmed)) {
        return { valid: false, message: pickHint(rules, "missingPrint") };
      }
      if (hasEmptyPrint(trimmed)) {
        return { valid: false, message: pickHint(rules, "emptyPrint") };
      }
      return { valid: false, message: pickHint(rules, "emptyPrint") };
    }
  }

  if (rules.mustIncludeAssignment) {
    if (!hasValidAssignment(trimmed)) {
      return { valid: false, message: pickHint(rules, "missingAssignment") };
    }
    if (hasIncompleteAssignment(trimmed)) {
      return {
        valid: false,
        message: pickHint(rules, "incompleteAssignment"),
      };
    }
  }

  if (rules.mustIncludeDef && !/def\s+\w/i.test(trimmed)) {
    return { valid: false, message: pickHint(rules, "missingStructure") };
  }

  if (rules.mustIncludeIf && !/^\s*if\s+/im.test(trimmed)) {
    return { valid: false, message: pickHint(rules, "missingStructure") };
  }

  if (
    rules.mustIncludeLoop &&
    !/^\s*(for|while)\s+/im.test(trimmed)
  ) {
    return { valid: false, message: pickHint(rules, "missingStructure") };
  }

  for (const required of rules.requiredIncludes ?? []) {
    if (!trimmed.toLowerCase().includes(required.toLowerCase())) {
      return { valid: false, message: pickHint(rules, "missingKeyword") };
    }
  }

  const anyKeywords = rules.requiredAnyIncludes ?? [];
  if (anyKeywords.length > 0) {
    const hasAny = anyKeywords.some((keyword) =>
      trimmed.toLowerCase().includes(keyword.toLowerCase()),
    );
    if (!hasAny) {
      return { valid: false, message: pickHint(rules, "missingAnyKeyword") };
    }
  }

  for (const pattern of rules.requiredPatterns ?? []) {
    const regex = new RegExp(pattern, "i");
    if (!regex.test(trimmed)) {
      if (pattern.includes("print")) {
        return { valid: false, message: pickHint(rules, "missingPrint") };
      }
      if (pattern === "=" || pattern.includes("=")) {
        return { valid: false, message: pickHint(rules, "missingAssignment") };
      }
      if (pattern.includes("Migo") || pattern.includes("Kodmigo")) {
        return { valid: false, message: pickHint(rules, "missingAnyKeyword") };
      }
      return { valid: false, message: pickHint(rules, "missingStructure") };
    }
  }

  if (rules.minPrintCount) {
    const printCount = (trimmed.match(/print\s*\(/gi) ?? []).length;
    if (printCount < rules.minPrintCount) {
      return { valid: false, message: pickHint(rules, "missingPrintCount") };
    }
  }

  if (rules.minLines) {
    const lineCount = countNonEmptyLines(trimmed);
    if (lineCount < rules.minLines) {
      return { valid: false, message: pickHint(rules, "missingLines") };
    }
  }

  if (
    rules.mustLookLikePython !== false &&
    !rules.mustIncludePrint &&
    !rules.mustIncludeAssignment &&
    !rules.mustIncludeDef &&
    !rules.mustIncludeIf &&
    !rules.mustIncludeLoop &&
    !(rules.requiredPatterns ?? []).length &&
    !(rules.requiredIncludes ?? []).length &&
    trimmed.length < 15 &&
    !looksLikePythonCode(trimmed)
  ) {
    return { valid: false, message: pickHint(rules, "plainTextOnly") };
  }

  return { valid: true };
}

function checklistText(step: LessonStep): string {
  return (step.checklist ?? []).join(" ").toLowerCase();
}

export function mergeTaskValidation(step: LessonStep): StepValidation {
  const checklist = checklistText(step);
  const merged: StepValidation = {
    minLength: 12,
    ...step.validation,
    mustLookLikePython: step.validation?.mustLookLikePython ?? true,
  };

  inferTaskRequirements(step, merged);

  if (
    !merged.requiredPatterns?.some((p) => p.includes("input")) &&
    /input/.test(checklist)
  ) {
    merged.requiredPatterns = [
      ...(merged.requiredPatterns ?? []),
      "input\\s*\\(",
    ];
  }

  if (
    !merged.requiredPatterns?.some((p) => p.includes("f[\"']")) &&
    /f-string/.test(checklist)
  ) {
    merged.requiredPatterns = [...(merged.requiredPatterns ?? []), "f[\"']"];
  }

  return merged;
}

export function validateTaskStep(
  input: string,
  step: LessonStep,
): ValidationResult {
  return validateCodeAnswer(input, mergeTaskValidation(step));
}
