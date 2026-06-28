import { answersMatch } from "@/lib/lesson-answers";
import {
  mergeTaskValidation,
  normalizeValidationMode,
  runCodeValidationFixtures,
  VALIDATION_MODES,
} from "@/lib/lesson-code-validation";
import { messageLeaksAnswer } from "@/lib/lesson-migo-safety";
import type { LessonContent, LessonStep, LessonStepType } from "./types";
import {
  isTaskStepType,
  isValidatedTaskStepType,
} from "./types";

const VALID_STEP_TYPES = new Set<LessonStepType>([
  "info",
  "multiple-choice",
  "fill-blank",
  "output-quiz",
  "code-order",
  "debug-choice",
  "mini-task",
  "project-step",
  "code-writing",
  "match-concept",
  "complete",
]);

const OPTION_QUIZ_TYPES = new Set<LessonStepType>([
  "multiple-choice",
  "output-quiz",
  "debug-choice",
  "fill-blank",
]);

function normalizeOptionKey(option: string): string {
  return option.trim().toLowerCase().replace(/\n/g, " ").replace(/\s+/g, " ");
}

function normalizeLeakText(text: string): string {
  return text.trim().toLowerCase().replace(/\n/g, " ").replace(/\s+/g, " ");
}

function findDuplicateOption(options: string[]): string | null {
  const exact = new Set<string>();
  const normalized = new Map<string, string>();
  for (const option of options) {
    const key = option.trim().toLowerCase();
    const nearKey = normalizeOptionKey(option);
    if (exact.has(key)) return option.trim() || "(empty)";
    if (normalized.has(nearKey)) return normalized.get(nearKey) ?? option.trim();
    exact.add(key);
    normalized.set(nearKey, option.trim());
  }
  return null;
}

function findEmptyOption(options: string[]): boolean {
  return options.some((option) => option.trim().length === 0);
}

function correctInOptions(step: LessonStep): boolean {
  if (!step.options || !step.correctAnswer) return true;

  const mode = step.type === "code-order" ? "code-order" : "default";
  return step.options.some((option) =>
    answersMatch(option, step.correctAnswer!, mode),
  );
}

function migoHintLeakReason(message: string, step: LessonStep): string | null {
  if (messageLeaksAnswer(message, step)) {
    if (step.correctAnswer) {
      const normAnswer = normalizeLeakText(step.correctAnswer);
      if (
        normAnswer.length >= 4 &&
        normalizeLeakText(message).includes(normAnswer)
      ) {
        return "Migo hint contains correctAnswer text";
      }
    }

    if (step.targetOutput) {
      const normTarget = normalizeLeakText(step.targetOutput);
      if (
        normTarget.length >= 6 &&
        normalizeLeakText(message).includes(normTarget)
      ) {
        return "Migo hint contains expectedOutput/targetOutput text";
      }
    }

    for (const option of step.options ?? []) {
      if (!step.correctAnswer) continue;
      if (
        answersMatch(option, step.correctAnswer) &&
        option.trim().length >= 6 &&
        normalizeLeakText(message).includes(normalizeLeakText(option))
      ) {
        return `Migo hint contains correct option text`;
      }
    }

    return "Migo pre-answer hint leaks answer";
  }

  if (step.exampleSolution) {
    const normSolution = normalizeLeakText(step.exampleSolution);
    if (
      normSolution.length >= 12 &&
      normalizeLeakText(message).includes(normSolution)
    ) {
      return "Migo hint contains exampleSolution code";
    }
  }

  if (step.code && step.type !== "info") {
    const normCode = normalizeLeakText(step.code);
    if (normCode.length >= 12 && normalizeLeakText(message).includes(normCode)) {
      return "Migo hint contains expected code";
    }
  }

  return null;
}

export type LessonValidationIssue = {
  lessonId: string;
  stepId: string;
  stepTitle?: string;
  message: string;
};

function pushIssue(
  issues: LessonValidationIssue[],
  lesson: LessonContent,
  step: LessonStep,
  message: string,
): void {
  issues.push({
    lessonId: lesson.id,
    stepId: step.id,
    stepTitle: step.title,
    message,
  });
}

function validateOptionQuizStep(
  issues: LessonValidationIssue[],
  lesson: LessonContent,
  step: LessonStep,
): void {
  if (!step.options || step.options.length < 2) {
    pushIssue(
      issues,
      lesson,
      step,
      `Quiz step needs at least 2 options (${step.type})`,
    );
    return;
  }

  if (findEmptyOption(step.options)) {
    pushIssue(issues, lesson, step, "Empty option detected");
    return;
  }

  const duplicate = findDuplicateOption(step.options);
  if (duplicate) {
    pushIssue(issues, lesson, step, `Duplicate option: "${duplicate}"`);
  }

  if (!step.correctAnswer) {
    pushIssue(issues, lesson, step, "Missing correctAnswer");
    return;
  }

  if (!correctInOptions(step)) {
    pushIssue(issues, lesson, step, "correctAnswer not found in options");
  }
}

export function validateLessonsForDev(
  lessons: Record<string, LessonContent>,
): LessonValidationIssue[] {
  const issues: LessonValidationIssue[] = [];
  const lessonIds = new Set<string>();

  for (const lesson of Object.values(lessons)) {
    if (lessonIds.has(lesson.id)) {
      issues.push({
        lessonId: lesson.id,
        stepId: "-",
        stepTitle: lesson.title,
        message: "Duplicate lesson id",
      });
    }
    lessonIds.add(lesson.id);

    const stepIds = new Set<string>();

    for (const step of lesson.steps) {
      if (stepIds.has(step.id)) {
        pushIssue(
          issues,
          lesson,
          step,
          `Duplicate activity id within lesson: "${step.id}"`,
        );
      }
      stepIds.add(step.id);

      if (!VALID_STEP_TYPES.has(step.type)) {
        pushIssue(
          issues,
          lesson,
          step,
          `Invalid activity type: "${step.type}"`,
        );
        continue;
      }

      if (step.migoMessage) {
        const leak = migoHintLeakReason(step.migoMessage, step);
        if (leak) {
          pushIssue(issues, lesson, step, leak);
        }
      }

      if (step.feedback?.incorrect) {
        const leak = migoHintLeakReason(step.feedback.incorrect, step);
        if (leak) {
          pushIssue(issues, lesson, step, `Incorrect feedback: ${leak}`);
        }
      }

      if (isValidatedTaskStepType(step.type)) {
        const merged = mergeTaskValidation(step);
        const mode = merged.validationMode;

        if (!mode) {
          pushIssue(
            issues,
            lesson,
            step,
            "codeWriting/projectStep missing validationMode after merge",
          );
        } else {
          const normalized = normalizeValidationMode(mode);
          if (!normalized) {
            pushIssue(
              issues,
              lesson,
              step,
              `Unknown validationMode: "${mode}"`,
            );
          }
        }

        if (merged.minPrintCount !== undefined && merged.minPrintCount < 1) {
          pushIssue(issues, lesson, step, "minPrintCount must be at least 1");
        }

        if (
          merged.minAssignmentCount !== undefined &&
          merged.minAssignmentCount < 1
        ) {
          pushIssue(
            issues,
            lesson,
            step,
            "minAssignmentCount must be at least 1",
          );
        }

        if (step.type === "code-writing" && !step.validation) {
          pushIssue(issues, lesson, step, "code-writing step missing validation");
        }

        continue;
      }

      if (isTaskStepType(step.type)) {
        continue;
      }

      if (step.type === "code-order") {
        if (step.orderLines?.length) {
          if (step.orderLines.length < 2) {
            pushIssue(
              issues,
              lesson,
              step,
              "code-order step needs at least 2 order lines",
            );
          } else {
            const emptyLine = step.orderLines.find((line) => !line.trim());
            if (emptyLine !== undefined) {
              pushIssue(issues, lesson, step, "code-order contains empty line");
            }
          }

          if (!step.correctAnswer) {
            pushIssue(
              issues,
              lesson,
              step,
              "code-order step missing correctAnswer",
            );
          }
        } else {
          validateOptionQuizStep(issues, lesson, step);
        }
        continue;
      }

      if (step.type === "match-concept") {
        if (step.matchPairs?.length) {
          if (step.matchPairs.length < 2) {
            pushIssue(
              issues,
              lesson,
              step,
              "match-concept needs at least 2 match pairs",
            );
          } else {
            for (const pair of step.matchPairs) {
              if (!pair.concept.trim() || !pair.answer.trim()) {
                pushIssue(
                  issues,
                  lesson,
                  step,
                  "match-concept pair has empty concept or answer",
                );
                break;
              }
            }
          }

          if (!step.options || step.options.length < 2) {
            pushIssue(
              issues,
              lesson,
              step,
              "match-concept step needs options",
            );
          } else if (findEmptyOption(step.options)) {
            pushIssue(issues, lesson, step, "Empty option in match-concept");
          }
        } else {
          validateOptionQuizStep(issues, lesson, step);
        }
        continue;
      }

      if (!OPTION_QUIZ_TYPES.has(step.type)) {
        continue;
      }

      validateOptionQuizStep(issues, lesson, step);
    }
  }

  return issues;
}

export function validateCodeFixturesForDev(): LessonValidationIssue[] {
  const issues: LessonValidationIssue[] = [];
  const results = runCodeValidationFixtures();

  for (const result of results) {
    if (!result.ok) {
      issues.push({
        lessonId: "validation-fixtures",
        stepId: result.name,
        stepTitle: result.name,
        message: `Fixture failed${result.message ? `: ${result.message}` : ""}`,
      });
    }
  }

  return issues;
}

export function validateAllLessons(
  lessons: Record<string, LessonContent>,
): LessonValidationIssue[] {
  return [
    ...validateLessonsForDev(lessons),
    ...validateCodeFixturesForDev(),
  ];
}

export function formatLessonValidationIssue(issue: LessonValidationIssue): string {
  const title = issue.stepTitle ? ` ${issue.stepTitle}` : "";
  return `[${issue.lessonId} / ${issue.stepId}]${title}: ${issue.message}`;
}

export function warnLessonValidationIssues(
  lessons: Record<string, LessonContent>,
): void {
  if (process.env.NODE_ENV === "production") return;

  const issues = validateLessonsForDev(lessons);
  for (const issue of issues) {
    console.warn(`[lesson-validation] ${formatLessonValidationIssue(issue)}`);
  }
}

export { VALIDATION_MODES };
