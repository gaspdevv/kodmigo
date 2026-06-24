import type { LessonStep, LessonContent, StepValidation, MatchPair } from "./types";

function withCodeValidationDefaults(
  validation?: StepValidation,
): StepValidation {
  return {
    mustLookLikePython: true,
    ...validation,
  };
}

type TaskStepFields = {
  targetOutput?: string;
  expectedBehavior?: string;
  taskNote?: string;
};

export function xpLabel(amount: number): string {
  return `+${amount} XP`;
}

export function infoStep(
  id: string,
  title: string,
  content: string,
  opts?: {
    code?: string;
    migo?: string;
    button?: string;
    targetOutput?: string;
    expectedBehavior?: string;
    taskNote?: string;
  },
): LessonStep {
  return {
    id,
    type: "info",
    title,
    content,
    code: opts?.code,
    targetOutput: opts?.targetOutput,
    expectedBehavior: opts?.expectedBehavior,
    taskNote: opts?.taskNote,
    migoMessage: opts?.migo,
    buttonLabel: opts?.button ?? "Devam et",
  };
}

export function mcStep(
  id: string,
  title: string,
  options: string[],
  correct: string,
  opts?: {
    content?: string;
    code?: string;
    migo?: string;
    correctFb?: string;
    incorrectFb?: string;
  },
): LessonStep {
  return {
    id,
    type: "multiple-choice",
    title,
    content: opts?.content,
    code: opts?.code,
    options,
    correctAnswer: correct,
    migoMessage: opts?.migo,
    feedback: {
      correct: opts?.correctFb ?? "Doğru!",
      incorrect: opts?.incorrectFb ?? "Tam değil. Bir daha dene.",
    },
  };
}

export function fillStep(
  id: string,
  title: string,
  fillBlankCode: string,
  options: string[],
  correct: string,
  opts?: { content?: string; migo?: string },
): LessonStep {
  return {
    id,
    type: "fill-blank",
    title,
    content: opts?.content,
    fillBlankCode,
    options,
    correctAnswer: correct,
    migoMessage: opts?.migo,
    feedback: {
      correct: "Harika!",
      incorrect: "Tam değil. Bir daha dene.",
    },
  };
}

export function outputStep(
  id: string,
  title: string,
  code: string,
  options: string[],
  correct: string,
  opts?: { migo?: string },
): LessonStep {
  return {
    id,
    type: "output-quiz",
    title,
    code,
    options,
    correctAnswer: correct,
    migoMessage: opts?.migo,
    feedback: {
      correct: "Doğru tahmin!",
      incorrect: "Tam değil. Çıktıyı tekrar düşün.",
    },
  };
}

export function codeOrderLinesStep(
  id: string,
  title: string,
  lines: string[],
  opts?: { content?: string; migo?: string },
): LessonStep {
  return {
    id,
    type: "code-order",
    title,
    content: opts?.content,
    orderLines: lines,
    correctAnswer: lines.join("\n"),
    migoMessage: opts?.migo,
    feedback: {
      correct: "Satırlar doğru sırada!",
      incorrect: "Sıralama yanlış. Kodun akışını tekrar düşün.",
    },
  };
}

export function matchPairsStep(
  id: string,
  title: string,
  pairs: MatchPair[],
  distractors: string[],
  opts?: { content?: string; migo?: string },
): LessonStep {
  const answers = pairs.map((pair) => pair.answer);
  const options = [...new Set([...answers, ...distractors])];

  return {
    id,
    type: "match-concept",
    title,
    content: opts?.content,
    matchPairs: pairs,
    options,
    correctAnswer: answers.join("|"),
    migoMessage: opts?.migo,
    feedback: {
      correct: "Tüm eşleştirmeler doğru!",
      incorrect: "Bazı eşleştirmeler yanlış. Kavramları tekrar incele.",
    },
  };
}

export function codeOrderStep(
  id: string,
  title: string,
  options: string[],
  correct: string,
  opts?: { content?: string; migo?: string },
): LessonStep {
  return {
    id,
    type: "code-order",
    title,
    content: opts?.content,
    options,
    correctAnswer: correct,
    migoMessage: opts?.migo,
    feedback: {
      correct: "Satırlar doğru sırada!",
      incorrect: "Sıralama yanlış. Kodun akışını tekrar düşün.",
    },
  };
}

export function debugStep(
  id: string,
  title: string,
  code: string,
  options: string[],
  correct: string,
  opts?: { migo?: string },
): LessonStep {
  return {
    id,
    type: "debug-choice",
    title,
    code,
    options,
    correctAnswer: correct,
    migoMessage: opts?.migo,
    feedback: {
      correct: "Hatayı doğru buldun!",
      incorrect: "Bu hata değil. Kodu satır satır oku.",
    },
  };
}

export function matchStep(
  id: string,
  title: string,
  content: string,
  options: string[],
  correct: string,
  opts?: { migo?: string; code?: string },
): LessonStep {
  return {
    id,
    type: "match-concept",
    title,
    content,
    code: opts?.code,
    options,
    correctAnswer: correct,
    migoMessage: opts?.migo,
    feedback: {
      correct: "Doğru eşleştirme!",
      incorrect: "Bu örnek bu kavrama uymuyor. Tekrar dene.",
    },
  };
}

export function miniTaskStep(
  id: string,
  title: string,
  content: string,
  opts: {
    placeholder?: string;
    checklist: string[];
    exampleSolution: string;
    migo?: string;
    validation?: StepValidation;
  } & TaskStepFields,
): LessonStep {
  return {
    id,
    type: "mini-task",
    title,
    content,
    placeholder: opts.placeholder ?? "Kodunu buraya yaz...",
    checklist: opts.checklist,
    exampleSolution: opts.exampleSolution,
    targetOutput: opts.targetOutput,
    expectedBehavior: opts.expectedBehavior,
    taskNote: opts.taskNote,
    migoMessage: opts.migo,
    validation: withCodeValidationDefaults(
      opts.validation ?? { minLength: 12 },
    ),
  };
}

export function codeWritingStep(
  id: string,
  title: string,
  content: string,
  opts: {
    placeholder?: string;
    checklist?: string[];
    exampleSolution?: string;
    migo?: string;
    validation: StepValidation;
  } & TaskStepFields,
): LessonStep {
  return {
    id,
    type: "code-writing",
    title,
    content,
    placeholder: opts.placeholder ?? "Kodunu yaz...",
    checklist: opts.checklist,
    exampleSolution: opts.exampleSolution,
    targetOutput: opts.targetOutput,
    expectedBehavior: opts.expectedBehavior,
    taskNote: opts.taskNote,
    migoMessage: opts.migo,
    validation: withCodeValidationDefaults(
      opts.validation ?? { minLength: 12 },
    ),
  };
}

export function projectStep(
  id: string,
  title: string,
  content: string,
  opts: {
    placeholder?: string;
    checklist: string[];
    exampleSolution: string;
    migo?: string;
    validation?: StepValidation;
  } & TaskStepFields,
): LessonStep {
  return {
    id,
    type: "project-step",
    title,
    content,
    placeholder: opts.placeholder ?? "Kodunu yaz...",
    checklist: opts.checklist,
    exampleSolution: opts.exampleSolution,
    targetOutput: opts.targetOutput,
    expectedBehavior: opts.expectedBehavior,
    taskNote: opts.taskNote,
    migoMessage: opts.migo,
    validation: withCodeValidationDefaults(
      opts.validation ?? { minLength: 15 },
    ),
  };
}

export function completeStep(
  id: string,
  xp: number,
  nextLesson: string,
  opts?: { content?: string; title?: string },
): LessonStep {
  return {
    id,
    type: "complete",
    title: opts?.title ?? "Dersi tamamladın!",
    content: opts?.content ?? "Harika iş çıkardın. Bir sonraki derse geçebilirsin.",
    completeRewards: {
      xp: xpLabel(xp),
      streak: "Serine katkı sağlandı",
      nextLesson: `Sıradaki ders: ${nextLesson}`,
    },
  };
}

export function buildLesson(
  id: string,
  title: string,
  description: string,
  duration: string,
  xpReward: number,
  steps: LessonStep[],
  pathLevel?: LessonContent["pathLevel"],
): LessonContent {
  const withComplete = steps.some((s) => s.type === "complete")
    ? steps
    : [
        ...steps,
        completeStep("complete", xpReward, "Bir sonraki ders", {
          content: "Bu derste önemli adımları tamamladın.",
        }),
      ];

  return {
    id,
    title,
    description,
    duration,
    xpReward,
    pathLevel,
    steps: withComplete,
  };
}
