import type { PathLevel } from "@/lib/onboarding-data";

export type LessonStepType =
  | "info"
  | "multiple-choice"
  | "fill-blank"
  | "output-quiz"
  | "code-order"
  | "debug-choice"
  | "mini-task"
  | "project-step"
  | "code-writing"
  | "match-concept"
  | "complete";

export type LessonStepFeedback = {
  correct: string;
  incorrect: string;
};

export type StepValidation = {
  requiredIncludes?: string[];
  requiredPatterns?: string[];
  rejectPatterns?: string[];
  minLength?: number;
  hint?: string;
};

export type MatchPair = {
  concept: string;
  answer: string;
};

export type LessonStep = {
  id: string;
  type: LessonStepType;
  title: string;
  content?: string;
  code?: string;
  fillBlankCode?: string;
  options?: string[];
  orderLines?: string[];
  matchPairs?: MatchPair[];
  correctAnswer?: string;
  migoMessage?: string;
  feedback?: LessonStepFeedback;
  buttonLabel?: string;
  placeholder?: string;
  expectedText?: string;
  checklist?: string[];
  exampleSolution?: string;
  validation?: StepValidation;
  completeRewards?: {
    xp: string;
    streak: string;
    nextLesson: string;
  };
};

export type LessonContent = {
  id: string;
  title: string;
  description: string;
  duration: string;
  pathLevel?: PathLevel;
  xpReward?: number;
  steps: LessonStep[];
};

export function isQuizStepType(type: LessonStepType): boolean {
  return (
    type === "multiple-choice" ||
    type === "fill-blank" ||
    type === "output-quiz" ||
    type === "code-order" ||
    type === "debug-choice" ||
    type === "match-concept"
  );
}

export function isTaskStepType(type: LessonStepType): boolean {
  return (
    type === "mini-task" ||
    type === "project-step" ||
    type === "code-writing"
  );
}

export function isValidatedTaskStepType(type: LessonStepType): boolean {
  return type === "code-writing" || type === "project-step";
}
