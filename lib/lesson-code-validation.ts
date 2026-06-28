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
    (/\bdef\s/.test(checklist) || /\bdef\s+\w/.test(taskText))
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
  }
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
