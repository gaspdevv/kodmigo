import type { StageTheme } from "@/components/dashboard/stageThemes";
import type { LessonStep } from "@/data/lessons";

type TaskTargetPanelProps = {
  step: LessonStep;
  theme: StageTheme;
};

export default function TaskTargetPanel({ step, theme }: TaskTargetPanelProps) {
  const hasTarget = Boolean(step.targetOutput || step.expectedBehavior);

  if (!hasTarget) return null;

  return (
    <div className="mb-4 space-y-3">
      {step.targetOutput && (
        <div
          className={`rounded-2xl border p-4 ${theme.cardBorder} bg-orange-50/60`}
        >
          <p className={`mb-2 text-xs font-bold uppercase tracking-wide ${theme.sectionAccent}`}>
            Hedef çıktı
          </p>
          <pre
            className={`whitespace-pre-wrap font-sans text-sm leading-relaxed ${theme.primaryText}`}
          >
            {step.targetOutput}
          </pre>
          {step.taskNote && (
            <p className={`mt-3 text-xs leading-relaxed ${theme.mutedText}`}>
              {step.taskNote}
            </p>
          )}
        </div>
      )}

      {step.expectedBehavior && (
        <div
          className={`rounded-2xl border p-4 ${theme.cardBorder} ${theme.cardBackground}`}
        >
          <p className={`mb-2 text-xs font-bold uppercase tracking-wide ${theme.sectionAccent}`}>
            Beklenen davranış
          </p>
          <p className={`text-sm leading-relaxed ${theme.mutedText}`}>
            {step.expectedBehavior}
          </p>
        </div>
      )}
    </div>
  );
}
