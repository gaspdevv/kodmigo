export type {
  LessonStepType,
  LessonStepFeedback,
  LessonStep,
  LessonContent,
  StepValidation,
} from "./lessons/types";

export {
  isQuizStepType,
  isTaskStepType,
  isValidatedTaskStepType,
  isWrongAnswerTrackedStepType,
} from "./lessons/types";

import type { LessonContent } from "./lessons/types";
import { beginnerLessons } from "./lessons/beginnerContent";
import { basicLessons } from "./lessons/basicContent";
import { intermediateLessons } from "./lessons/intermediateContent";
import { warnLessonValidationIssues } from "./lessons/validate";

export const lessons: Record<string, LessonContent> = {
  ...beginnerLessons,
  ...basicLessons,
  ...intermediateLessons,
};

warnLessonValidationIssues(lessons);

export function getLessonById(lessonId: string): LessonContent | undefined {
  return lessons[lessonId];
}
