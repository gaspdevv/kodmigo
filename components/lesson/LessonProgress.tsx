import type { StageTheme } from "@/components/dashboard/stageThemes";

type LessonProgressProps = {
  currentStep: number;
  totalSteps: number;
  theme: StageTheme;
};

export default function LessonProgress({
  currentStep,
  totalSteps,
  theme,
}: LessonProgressProps) {
  const percent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="mb-4">
      <div className="mb-2 flex items-center justify-between">
        <span className={`text-xs font-semibold ${theme.mutedText}`}>
          Adım {currentStep} / {totalSteps}
        </span>
        <span className={`text-xs font-medium ${theme.sectionAccent}`}>
          %{percent}
        </span>
      </div>
      <div
        className={`h-2 overflow-hidden rounded-full ${theme.progressTrack}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ${theme.progressBar}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
