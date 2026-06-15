import { getDashboardTheme } from "@/components/dashboard/getDashboardTheme";
import { pythonPathMeta, pythonPathProgress } from "@/data/pythonPath";

export default function LearningPathHeader() {
  const theme = getDashboardTheme();
  const { completedLessons, totalLessons, progressPercent } = pythonPathProgress;

  return (
    <header className="mb-6">
      <h1 className={`text-2xl font-bold tracking-tight sm:text-3xl ${theme.primaryText}`}>
        {pythonPathMeta.title}
      </h1>
      <p className={`mt-2 text-sm leading-relaxed sm:text-base ${theme.mutedText}`}>
        {pythonPathMeta.description}
      </p>

      <div className="mt-5">
        <p className={`mb-2 text-sm font-medium ${theme.mutedText}`}>
          {completedLessons} / {totalLessons} ders tamamlandı
        </p>
        <div className={`h-2.5 overflow-hidden rounded-full ${theme.progressTrack}`}>
          <div
            className={`h-full rounded-full transition-all duration-300 ${theme.progressBar}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className={`mt-2 text-xs ${theme.mutedText}`}>
          %{progressPercent} tamamlandı
        </p>
      </div>
    </header>
  );
}
