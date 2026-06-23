import { answersMatch } from "@/lib/lesson-answers";
import type { LessonContent, LessonStep } from "./types";
import { isQuizStepType, isTaskStepType } from "./types";

const QUIZ_TYPES = new Set([
  "multiple-choice",
  "fill-blank",
  "output-quiz",
  "code-order",
  "debug-choice",
  "match-concept",
]);

function hasDuplicateOptions(options: string[]): boolean {
  const seen = new Set<string>();
  for (const option of options) {
    const key = option.trim().toLowerCase();
    if (seen.has(key)) return true;
    seen.add(key);
  }
  return false;
}

function correctInOptions(step: LessonStep): boolean {
  if (!step.options || !step.correctAnswer) return true;

  const mode = step.type === "code-order" ? "code-order" : "default";
  return step.options.some((option) =>
    answersMatch(option, step.correctAnswer!, mode),
  );
}

export type LessonValidationIssue = {
  lessonId: string;
  stepId: string;
  message: string;
};

export function validateLessonsForDev(
  lessons: Record<string, LessonContent>,
): LessonValidationIssue[] {
  const issues: LessonValidationIssue[] = [];
  const ids = new Set<string>();

  for (const lesson of Object.values(lessons)) {
    if (ids.has(lesson.id)) {
      issues.push({
        lessonId: lesson.id,
        stepId: "-",
        message: "Duplicate lesson id",
      });
    }
    ids.add(lesson.id);

    for (const step of lesson.steps) {
      if (!isQuizStepType(step.type) && !isTaskStepType(step.type)) {
        if (step.type === "code-writing" && !step.validation) {
          issues.push({
            lessonId: lesson.id,
            stepId: step.id,
            message: "code-writing step missing validation",
          });
        }
        continue;
      }

      if (isTaskStepType(step.type)) continue;

      if (step.type === "code-order" && step.orderLines?.length) {
        if (!step.correctAnswer) {
          issues.push({
            lessonId: lesson.id,
            stepId: step.id,
            message: "code-order lines step missing correctAnswer",
          });
        }
        continue;
      }

      if (step.type === "match-concept" && step.matchPairs?.length) {
        if (!step.options || step.options.length < 2) {
          issues.push({
            lessonId: lesson.id,
            stepId: step.id,
            message: "match-concept pairs step needs options",
          });
        }
        continue;
      }

      if (!step.options || step.options.length < 2) {
        issues.push({
          lessonId: lesson.id,
          stepId: step.id,
          message: `Quiz step needs at least 2 options (${step.type})`,
        });
        continue;
      }

      if (!step.correctAnswer) {
        issues.push({
          lessonId: lesson.id,
          stepId: step.id,
          message: "Missing correctAnswer",
        });
        continue;
      }

      if (hasDuplicateOptions(step.options)) {
        issues.push({
          lessonId: lesson.id,
          stepId: step.id,
          message: "Duplicate options detected",
        });
      }

      if (!correctInOptions(step)) {
        issues.push({
          lessonId: lesson.id,
          stepId: step.id,
          message: "correctAnswer not found in options",
        });
      }

      if (QUIZ_TYPES.has(step.type)) {
        const correctIndex = step.options.findIndex((option) =>
          answersMatch(
            option,
            step.correctAnswer!,
            step.type === "code-order" ? "code-order" : "default",
          ),
        );
        if (correctIndex === 0 && step.options.length > 1) {
          const allFirst = lesson.steps
            .filter((s) => isQuizStepType(s.type) && s.options && s.correctAnswer)
            .every((s) => {
              const idx = s.options!.findIndex((o) =>
                answersMatch(o, s.correctAnswer!),
              );
              return idx === 0;
            });
          if (allFirst && lesson.steps.filter((s) => isQuizStepType(s.type)).length > 2) {
            // informational only — stable shuffle handles runtime
          }
        }
      }
    }
  }

  return issues;
}

export function warnLessonValidationIssues(
  lessons: Record<string, LessonContent>,
): void {
  if (process.env.NODE_ENV === "production") return;

  const issues = validateLessonsForDev(lessons);
  for (const issue of issues) {
    console.warn(
      `[lesson-validation] ${issue.lessonId} / ${issue.stepId}: ${issue.message}`,
    );
  }
}
