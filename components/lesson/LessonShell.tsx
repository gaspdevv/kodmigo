"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { StageTheme } from "@/components/dashboard/stageThemes";
import ChoiceCard from "@/components/lesson/ChoiceCard";
import CodeOrderActivity, {
  getInitialCodeOrderLines,
} from "@/components/lesson/CodeOrderActivity";
import LessonCodeBlock from "@/components/lesson/LessonCodeBlock";
import LessonComplete from "@/components/lesson/LessonComplete";
import LessonFeedback from "@/components/lesson/LessonFeedback";
import LessonProgress from "@/components/lesson/LessonProgress";
import MatchConceptActivity from "@/components/lesson/MatchConceptActivity";
import TaskTargetPanel from "@/components/lesson/TaskTargetPanel";
import type { LessonContent, LessonStep } from "@/data/lessons";
import {
  isQuizStepType,
  isTaskStepType,
  isValidatedTaskStepType,
} from "@/data/lessons";
import { getLessonXpReward, isLessonInChain } from "@/data/pythonPath";
import { resolveLessonXpReward } from "@/lib/xp-rewards";
import { getActivePathLevel } from "@/lib/onboarding-data";
import { isLessonCompleted } from "@/lib/progress";
import {
  answersMatch,
  getStableQuizOptions,
} from "@/lib/lesson-answers";
import { validateTaskStep } from "@/lib/lesson-code-validation";
import {
  getPostCorrectMigoMessage,
  getPreAnswerMigoMessage,
  getSafeQuizCorrectFeedback,
  getSafeQuizIncorrectFeedback,
} from "@/lib/lesson-migo-safety";
import { playCorrectSound, playClickSound, playWrongSound } from "@/lib/sounds";
import { useRequireAuth } from "@/lib/auth/useRequireAuth";

type LessonShellProps = {
  lesson: LessonContent;
  theme: StageTheme;
};

type FeedbackState = "none" | "correct" | "incorrect";

function MigoTip({
  message,
  theme,
}: {
  message: string;
  theme: StageTheme;
}) {
  return (
    <div
      className={`mt-4 rounded-2xl border p-4 ${theme.cardBackground} ${theme.cardBorder}`}
    >
      <div className="flex gap-3">
        <span className="text-xl" aria-hidden>
          🦊
        </span>
        <div>
          <p className={`mb-1 text-xs font-bold ${theme.migoAccent}`}>Migo</p>
          <p className={`text-sm leading-relaxed ${theme.mutedText}`}>
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LessonShell({ lesson, theme }: LessonShellProps) {
  const router = useRouter();
  const { loading: authLoading, isAuthenticated } = useRequireAuth();
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<FeedbackState>("none");
  const [taskInput, setTaskInput] = useState("");
  const [taskRevealed, setTaskRevealed] = useState(false);
  const [taskError, setTaskError] = useState<string | null>(null);
  const [orderedLines, setOrderedLines] = useState<string[]>([]);
  const [matchSelections, setMatchSelections] = useState<Record<string, string>>(
    {},
  );

  const step = lesson.steps[stepIndex];
  const totalSteps = lesson.steps.length;
  const isCompleteStep = step.type === "complete";
  const isInfoStep = step.type === "info";
  const isQuiz = isQuizStepType(step.type);
  const isTask = isTaskStepType(step.type);
  const isStrictTask = isValidatedTaskStepType(step.type);
  const isMatchConcept = step.type === "match-concept";
  const isDebugChoice = step.type === "debug-choice";
  const isCodeOrderInteractive = step.type === "code-order" && !!step.orderLines?.length;
  const isCodeWriting = step.type === "code-writing";
  const isProjectStep = step.type === "project-step";
  const isMiniTask = step.type === "mini-task";
  const isCodeTask = isCodeWriting || isProjectStep || isMiniTask;
  const showInfoCode = Boolean(step.code) && !step.targetOutput && !isCodeTask;
  const xpReward = resolveLessonXpReward(
    lesson.xpReward,
    getLessonXpReward(lesson.id),
  );

  const preAnswerMigo = useMemo(() => {
    if (isCompleteStep) return null;
    if (isTask && (taskError !== null || taskRevealed)) return null;
    if (!isInfoStep && feedbackState !== "none") return null;
    return getPreAnswerMigoMessage(step);
  }, [
    isCompleteStep,
    isTask,
    isInfoStep,
    taskError,
    taskRevealed,
    feedbackState,
    step,
  ]);

  const postCorrectMigo = useMemo(() => {
    if (feedbackState !== "correct" || isTask) return null;
    return getPostCorrectMigoMessage(step);
  }, [feedbackState, isTask, step]);

  const quizPresentation = useMemo(() => {
    if (!isQuiz || isCodeOrderInteractive || isMatchConcept && step.matchPairs?.length) {
      return { options: step.options ?? [], correctAnswer: step.correctAnswer ?? "" };
    }

    if (!step.options || !step.correctAnswer) {
      return { options: step.options ?? [], correctAnswer: step.correctAnswer ?? "" };
    }

    return getStableQuizOptions(
      lesson.id,
      step.id,
      step.options,
      step.correctAnswer,
    );
  }, [
    isQuiz,
    isCodeOrderInteractive,
    isMatchConcept,
    lesson.id,
    step.correctAnswer,
    step.id,
    step.matchPairs,
    step.options,
  ]);

  const answerMode = step.type === "code-order" ? "code-order" : "default";

  const isAnswerCorrect = isCodeOrderInteractive
    ? feedbackState === "correct"
    : isMatchConcept && step.matchPairs?.length
      ? feedbackState === "correct"
      : isMatchConcept
        ? feedbackState === "correct" &&
          selectedAnswer !== null &&
          answersMatch(selectedAnswer, quizPresentation.correctAnswer, answerMode)
        : feedbackState === "correct" &&
          selectedAnswer !== null &&
          answersMatch(selectedAnswer, quizPresentation.correctAnswer, answerMode);

  const matchPairsReady =
    !step.matchPairs?.length ||
    step.matchPairs.every((pair) => matchSelections[pair.concept]);

  const effectiveCodeOrderLines = useMemo(() => {
    if (!isCodeOrderInteractive || !step.orderLines?.length) return [];
    if (orderedLines.length === step.orderLines.length) return orderedLines;
    return getInitialCodeOrderLines(lesson.id, step.id, step.orderLines);
  }, [
    isCodeOrderInteractive,
    lesson.id,
    orderedLines,
    step.id,
    step.orderLines,
  ]);

  const isCodeOrderReady =
    !isCodeOrderInteractive ||
    effectiveCodeOrderLines.length === (step.orderLines?.length ?? 0);

  useEffect(() => {
    if (!isCodeOrderInteractive || !step.orderLines?.length) return;
    setOrderedLines(getInitialCodeOrderLines(lesson.id, step.id, step.orderLines));
  }, [stepIndex, isCodeOrderInteractive, lesson.id, step.id, step.orderLines]);

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;

    const startLevel = getActivePathLevel();
    const inChain = isLessonInChain(lesson.id, startLevel);
    const completed = isLessonCompleted("python", lesson.id);

    if (!inChain && !completed) {
      router.replace("/learn/python");
    }
  }, [authLoading, isAuthenticated, lesson.id, router]);

  const resetAnswerState = useCallback(() => {
    setSelectedAnswer(null);
    setFeedbackState("none");
    setTaskInput("");
    setTaskRevealed(false);
    setTaskError(null);
    setOrderedLines([]);
    setMatchSelections({});
  }, []);

  const goToNextStep = useCallback(() => {
    if (stepIndex < totalSteps - 1) {
      setStepIndex((prev) => prev + 1);
      resetAnswerState();
    }
  }, [stepIndex, totalSteps, resetAnswerState]);

  const goToPreviousStep = useCallback(() => {
    if (stepIndex > 0) {
      setStepIndex((prev) => prev - 1);
      resetAnswerState();
    } else {
      router.back();
    }
  }, [stepIndex, resetAnswerState, router]);

  const handleSelectAnswer = (answer: string) => {
    if (feedbackState === "correct") return;
    setSelectedAnswer(answer);
    if (feedbackState === "incorrect") {
      setFeedbackState("none");
    }
  };

  const handleCheckAnswer = () => {
    if (isCodeOrderInteractive && step.orderLines) {
      const selected = effectiveCodeOrderLines.join("\n");
      const correct = step.correctAnswer ?? step.orderLines.join("\n");

      if (answersMatch(selected, correct, "code-order")) {
        setFeedbackState("correct");
        playCorrectSound();
      } else {
        setFeedbackState("incorrect");
        playWrongSound();
      }
      return;
    }

    if (isMatchConcept && step.matchPairs?.length) {
      const allSelected = step.matchPairs.every(
        (pair) => matchSelections[pair.concept],
      );
      if (!allSelected) return;

      const isCorrect = step.matchPairs.every(
        (pair) => matchSelections[pair.concept] === pair.answer,
      );

      if (isCorrect) {
        setFeedbackState("correct");
        playCorrectSound();
      } else {
        setFeedbackState("incorrect");
        playWrongSound();
      }
      return;
    }

    if (!selectedAnswer || !quizPresentation.correctAnswer) return;

    if (
      answersMatch(
        selectedAnswer,
        quizPresentation.correctAnswer,
        answerMode,
      )
    ) {
      setFeedbackState("correct");
      playCorrectSound();
    } else {
      setFeedbackState("incorrect");
      playWrongSound();
    }
  };

  const handleCheckTask = () => {
    const result = validateTaskStep(taskInput, step);

    if (!result.valid) {
      setTaskError(result.message ?? "Cevabın henüz uygun değil.");
      setTaskRevealed(false);
      setFeedbackState("incorrect");
      playWrongSound();
      return;
    }

    playCorrectSound();
    setTaskError(null);
    setTaskRevealed(true);
    setFeedbackState("correct");
  };

  const handlePrimaryAction = () => {
    if (isInfoStep || isAnswerCorrect || (isTask && taskRevealed)) {
      playClickSound();
      goToNextStep();
    } else if (isQuiz) {
      handleCheckAnswer();
    } else if (isTask && !taskRevealed) {
      handleCheckTask();
    }
  };

  const primaryLabel = isInfoStep
    ? (step.buttonLabel ?? "Devam et")
    : isTask
      ? taskRevealed
        ? "Devam et"
        : "Denemeni kontrol et"
      : isAnswerCorrect
        ? "Devam et"
        : "Cevabı kontrol et";

  const primaryDisabled =
    (isQuiz &&
      !isAnswerCorrect &&
      !isCodeOrderInteractive &&
      !(isMatchConcept && step.matchPairs?.length) &&
      selectedAnswer === null) ||
    (isCodeOrderInteractive && !isAnswerCorrect && !isCodeOrderReady) ||
    (isMatchConcept &&
      step.matchPairs?.length &&
      !isAnswerCorrect &&
      !matchPairsReady) ||
    (isStrictTask && !taskRevealed && taskInput.trim().length === 0);

  const showFeedback =
    (isQuiz && feedbackState !== "none" && step.feedback) ||
    (isTask && taskError !== null) ||
    (isTask && taskRevealed && feedbackState === "correct");

  const feedbackMessage = isTask
    ? taskError ??
      (taskRevealed && feedbackState === "correct"
        ? "Kodun görevle uyumlu görünüyor. Devam edebilirsin."
        : undefined)
    : feedbackState === "correct"
      ? getSafeQuizCorrectFeedback(step)
      : feedbackState === "incorrect"
        ? getSafeQuizIncorrectFeedback(step)
        : undefined;

  const feedbackType: "correct" | "incorrect" = isTask
    ? taskError
      ? "incorrect"
      : feedbackState === "correct"
        ? "correct"
        : "incorrect"
    : feedbackState === "correct"
      ? "correct"
      : "incorrect";

  if (authLoading || !isAuthenticated) {
    return (
      <div
        className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 py-5 sm:px-6"
        aria-busy="true"
      >
        <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200/60" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col overflow-x-hidden px-4 py-5 sm:px-6">
      {!isCompleteStep && (
        <header className="mb-4">
          <div className="mb-4 flex items-center gap-3">
            <button
              type="button"
              onClick={goToPreviousStep}
              className={`flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border transition ${theme.cardBackground} ${theme.cardBorder} ${theme.primaryText} hover:opacity-80`}
              aria-label="Geri"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div className="min-w-0 flex-1">
              <p className={`truncate text-xs font-medium ${theme.mutedText}`}>
                {lesson.duration}
              </p>
              <h1
                className={`truncate text-base font-bold ${theme.primaryText}`}
              >
                {lesson.title}
              </h1>
            </div>
          </div>
          <LessonProgress
            currentStep={stepIndex + 1}
            totalSteps={totalSteps}
            theme={theme}
          />
        </header>
      )}

      <article
        className={`flex min-w-0 flex-1 flex-col rounded-3xl border p-5 ${theme.cardBackground} ${theme.cardBorder} ${theme.cardShadow}`}
      >
        {isCompleteStep ? (
          <LessonComplete
            lessonId={lesson.id}
            step={step}
            theme={theme}
            xpReward={xpReward}
          />
        ) : (
          <>
            <h2
              className={`mb-3 text-lg font-bold leading-snug ${theme.primaryText}`}
            >
              {step.title}
            </h2>

            {step.content && !isMatchConcept && (
              <p className={`mb-4 text-sm leading-relaxed ${theme.mutedText}`}>
                {step.content}
              </p>
            )}

            {(step.targetOutput || step.expectedBehavior) && (
              <TaskTargetPanel step={step} theme={theme} />
            )}

            {showInfoCode && !isDebugChoice && (
              <div className="mb-4">
                <LessonCodeBlock code={step.code!} theme={theme} />
              </div>
            )}

            {isDebugChoice && step.code && (
              <div className="mb-4">
                <div
                  className={`mb-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${theme.cardBorder} bg-rose-50 text-rose-700`}
                >
                  <span aria-hidden>🔍</span>
                  Hata dedektifi
                </div>
                <LessonCodeBlock code={step.code} theme={theme} />
              </div>
            )}

            {step.fillBlankCode && (
              <div className="mb-4">
                <LessonCodeBlock code={step.fillBlankCode} theme={theme} />
              </div>
            )}

            {isMatchConcept && (
              <MatchConceptActivity
                step={step}
                theme={theme}
                selectedAnswer={selectedAnswer}
                selections={matchSelections}
                feedbackState={feedbackState}
                onSelectSingle={(answer) => {
                  if (feedbackState === "correct") return;
                  setSelectedAnswer(answer);
                  if (feedbackState === "incorrect") {
                    setFeedbackState("none");
                  }
                }}
                onSelectPair={(concept, answer) => {
                  if (feedbackState === "correct") return;
                  setMatchSelections((prev) => ({ ...prev, [concept]: answer }));
                  if (feedbackState === "incorrect") {
                    setFeedbackState("none");
                  }
                }}
              />
            )}

            {isCodeOrderInteractive && step.orderLines && (
              <CodeOrderActivity
                lessonId={lesson.id}
                stepId={step.id}
                lines={step.orderLines}
                orderedLines={effectiveCodeOrderLines}
                feedbackState={feedbackState}
                theme={theme}
                onReorder={(lines) => {
                  setOrderedLines(lines);
                  if (feedbackState === "incorrect") {
                    setFeedbackState("none");
                  }
                }}
              />
            )}

            {isQuiz &&
              !isMatchConcept &&
              !isCodeOrderInteractive &&
              quizPresentation.options.length > 0 && (
              <div className="mb-4 space-y-2">
                {quizPresentation.options.map((option) => (
                  <ChoiceCard
                    key={option}
                    label={option}
                    selected={selectedAnswer === option}
                    disabled={feedbackState === "correct"}
                    feedbackResult={
                      selectedAnswer === option && feedbackState !== "none"
                        ? feedbackState
                        : "none"
                    }
                    onSelect={() => handleSelectAnswer(option)}
                    theme={theme}
                  />
                ))}
              </div>
            )}

            {isTask && (
              <div className="mb-4">
                <p className={`mb-2 text-xs font-bold uppercase tracking-wide ${theme.sectionAccent}`}>
                  Görev
                </p>
                <div
                  className={`rounded-2xl border p-4 ${
                    isProjectStep
                      ? `${theme.cardBorder} ${theme.lessonAccentSoft}`
                      : isCodeWriting
                        ? "border-slate-300 bg-slate-900/95"
                        : `${theme.cardBorder} ${theme.cardBackground}`
                  }`}
                >
                  {isProjectStep && (
                    <p className={`mb-2 text-xs font-bold uppercase tracking-wide ${theme.sectionAccent}`}>
                      Proje adımı
                    </p>
                  )}
                  {isCodeWriting && (
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-300">
                      Kodunu yaz
                    </p>
                  )}
                  <textarea
                    value={taskInput}
                    onChange={(e) => {
                      setTaskInput(e.target.value);
                      if (taskError) setTaskError(null);
                      if (feedbackState === "incorrect") {
                        setFeedbackState("none");
                      }
                    }}
                    placeholder={step.placeholder ?? "Kodunu yaz..."}
                    rows={isProjectStep ? 8 : 5}
                    className={`box-border max-w-full w-full resize-y rounded-xl border px-4 py-3 font-mono text-sm leading-relaxed outline-none transition ${theme.lessonFocusRing} ${
                      isCodeWriting
                        ? "border-slate-600 bg-slate-950 text-emerald-100 placeholder:text-slate-500"
                        : `${theme.cardBorder} ${theme.cardBackground} ${theme.primaryText}`
                    }`}
                  />
                </div>
              </div>
            )}

            {preAnswerMigo && (
              <MigoTip message={preAnswerMigo} theme={theme} />
            )}

            {postCorrectMigo && (
              <MigoTip message={postCorrectMigo} theme={theme} />
            )}

            {showFeedback && feedbackMessage && (
              <div
                key={`${feedbackType}-${selectedAnswer}-${taskError}`}
                className="mt-4"
              >
                <LessonFeedback type={feedbackType} message={feedbackMessage} />
              </div>
            )}

            <div className="mt-auto pt-6">
              <button
                type="button"
                onClick={handlePrimaryAction}
                disabled={primaryDisabled}
                className={`inline-flex w-full items-center justify-center rounded-xl py-3 text-sm font-semibold transition ${theme.primaryButton} ${theme.primaryButtonHover} ${
                  primaryDisabled
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                }`}
              >
                {primaryLabel}
              </button>
            </div>
          </>
        )}
      </article>
    </div>
  );
}
