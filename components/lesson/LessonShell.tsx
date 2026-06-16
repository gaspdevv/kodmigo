"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import type { StageTheme } from "@/components/dashboard/stageThemes";
import ChoiceCard from "@/components/lesson/ChoiceCard";
import LessonCodeBlock from "@/components/lesson/LessonCodeBlock";
import LessonComplete from "@/components/lesson/LessonComplete";
import LessonFeedback from "@/components/lesson/LessonFeedback";
import LessonProgress from "@/components/lesson/LessonProgress";
import type { LessonContent, LessonStep } from "@/data/lessons";
import { playCorrectSound, playClickSound, playWrongSound } from "@/lib/sounds";

type LessonShellProps = {
  lesson: LessonContent;
  theme: StageTheme;
};

type FeedbackState = "none" | "correct" | "incorrect";

function isQuizStep(step: LessonStep): boolean {
  return (
    step.type === "multiple-choice" ||
    step.type === "fill-blank" ||
    step.type === "output-quiz"
  );
}

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
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<FeedbackState>("none");

  const step = lesson.steps[stepIndex];
  const totalSteps = lesson.steps.length;
  const isCompleteStep = step.type === "complete";
  const isInfoStep = step.type === "info";
  const isQuiz = isQuizStep(step);
  const isAnswerCorrect =
    feedbackState === "correct" &&
    selectedAnswer === step.correctAnswer;

  const resetAnswerState = useCallback(() => {
    setSelectedAnswer(null);
    setFeedbackState("none");
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
    if (!selectedAnswer || !step.correctAnswer) return;

    if (selectedAnswer === step.correctAnswer) {
      setFeedbackState("correct");
      playCorrectSound();
    } else {
      setFeedbackState("incorrect");
      playWrongSound();
    }
  };

  const handlePrimaryAction = () => {
    if (isInfoStep || isAnswerCorrect) {
      playClickSound();
      goToNextStep();
    } else if (isQuiz) {
      handleCheckAnswer();
    }
  };

  const primaryLabel = isInfoStep
    ? (step.buttonLabel ?? "Devam et")
    : isAnswerCorrect
      ? "Devam et"
      : "Cevabı kontrol et";

  const primaryDisabled =
    isQuiz && !isAnswerCorrect && selectedAnswer === null;

  const showFeedback =
    isQuiz && feedbackState !== "none" && step.feedback;

  const feedbackMessage =
    feedbackState === "correct"
      ? step.feedback?.correct
      : step.feedback?.incorrect;

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col px-4 py-5 sm:px-6">
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
        className={`flex flex-1 flex-col rounded-3xl border p-5 ${theme.cardBackground} ${theme.cardBorder} ${theme.cardShadow}`}
      >
        {isCompleteStep ? (
          <LessonComplete step={step} theme={theme} />
        ) : (
          <>
            <h2
              className={`mb-3 text-lg font-bold leading-snug ${theme.primaryText}`}
            >
              {step.title}
            </h2>

            {step.content && (
              <p
                className={`mb-4 text-sm leading-relaxed ${theme.mutedText}`}
              >
                {step.content}
              </p>
            )}

            {step.code && (
              <div className="mb-4">
                <LessonCodeBlock code={step.code} theme={theme} />
              </div>
            )}

            {step.fillBlankCode && (
              <div className="mb-4">
                <LessonCodeBlock code={step.fillBlankCode} theme={theme} />
              </div>
            )}

            {isQuiz && step.options && (
              <div className="mb-4 space-y-2">
                {step.options.map((option) => (
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

            {step.migoMessage && (
              <MigoTip message={step.migoMessage} theme={theme} />
            )}

            {showFeedback && feedbackMessage && (
              <div key={`${feedbackState}-${selectedAnswer}`} className="mt-4">
                <LessonFeedback
                  type={feedbackState}
                  message={feedbackMessage}
                />
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
