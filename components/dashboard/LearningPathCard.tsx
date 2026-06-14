import { getDashboardTheme } from "@/components/dashboard/getDashboardTheme";
import { dashboardMock } from "@/lib/dashboard-mock";

export default function LearningPathCard() {
  const { title, description, progress, completedLessons, totalLessons } =
    dashboardMock.learningPath;
  const theme = getDashboardTheme();

  return (
    <section
      className={`mb-4 rounded-3xl border p-5 ${theme.cardBackground} ${theme.cardBorder} ${theme.cardShadow}`}
    >
      <h2 className={`mb-2 text-lg font-bold ${theme.primaryText}`}>
        {title}
      </h2>
      <p className={`mb-4 text-sm ${theme.mutedText}`}>{description}</p>

      <div
        className={`mb-2 h-2.5 overflow-hidden rounded-full ${theme.progressTrack}`}
      >
        <div
          className={`h-full rounded-full ${theme.progressBar}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div
        className={`flex items-center justify-between text-xs ${theme.mutedText}`}
      >
        <span>%{progress} tamamlandı</span>
        <span>
          {completedLessons} / {totalLessons} ders tamamlandı
        </span>
      </div>
    </section>
  );
}
