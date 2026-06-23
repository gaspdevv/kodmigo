export function normalizeAnswer(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'");
}

export function normalizeCodeOrderAnswer(value: string): string {
  return value
    .trim()
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
}

export function answersMatch(
  selected: string,
  correct: string,
  mode: "default" | "code-order" = "default",
): boolean {
  if (mode === "code-order") {
    return (
      normalizeCodeOrderAnswer(selected) === normalizeCodeOrderAnswer(correct)
    );
  }

  return normalizeAnswer(selected) === normalizeAnswer(correct);
}

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) || 1;
}

export function getStableQuizOptions(
  lessonId: string,
  stepId: string,
  options: string[],
  correctAnswer: string,
): { options: string[]; correctAnswer: string } {
  if (options.length <= 1) {
    return { options, correctAnswer };
  }

  const resolvedCorrect =
    options.find((option) => answersMatch(option, correctAnswer)) ??
    options.find((option) =>
      answersMatch(option, correctAnswer, "code-order"),
    ) ??
    correctAnswer;

  const indices = options.map((_, index) => index);
  let seed = hashSeed(`${lessonId}:${stepId}`);

  const nextRandom = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0xffffffff;
  };

  for (let i = indices.length - 1; i > 0; i -= 1) {
    const j = Math.floor(nextRandom() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  return {
    options: indices.map((index) => options[index]),
    correctAnswer: resolvedCorrect,
  };
}
