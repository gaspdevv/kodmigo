import { getDashboardTheme } from "@/components/dashboard/getDashboardTheme";
import { dashboardMock } from "@/lib/dashboard-mock";

export default function StageProgressCard() {
  const {
    currentStageName,
    nextStageName,
    currentStageIcon,
    nextStageIcon,
    currentXp,
    requiredXp,
    progressPercent,
    streakDays,
  } = dashboardMock.user;

  const theme = getDashboardTheme();
  const isMaxStage = nextStageName === null;

  return (
    <section
      className={`mb-4 rounded-2xl border p-4 shadow-lg ${theme.stageCardBackground} ${theme.cardBorder} ${theme.cardShadow}`}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className={`text-base font-bold ${theme.primaryText}`}>
          Aşama ilerlemen
        </h2>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold shadow-sm sm:text-base ${theme.streakBg}`}
        >
          <span
            className="flame-emoji text-xl leading-none sm:text-2xl"
            aria-hidden="true"
          >
            🔥
          </span>
          {streakDays} gün seri
        </span>
      </div>

      <p className={`mb-3 text-sm font-semibold ${theme.primaryText}`}>
        {isMaxStage ? (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ${theme.currentBadge}`}
          >
            {currentStageIcon} {currentStageName} aşaması
          </span>
        ) : (
          <>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${theme.currentBadge}`}
            >
              {currentStageIcon} {currentStageName}
            </span>
            <span className="mx-2 text-slate-400">→</span>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${theme.nextBadge}`}
            >
              {nextStageIcon} {nextStageName}
            </span>
          </>
        )}
      </p>

      <div
        className={`mb-1.5 h-2.5 overflow-hidden rounded-full ${theme.progressTrack}`}
      >
        <div
          className={`h-full rounded-full ${theme.progressBar}`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <p className={`text-xs font-medium ${theme.mutedText}`}>
        {currentXp} / {requiredXp} XP
      </p>
    </section>
  );
}
