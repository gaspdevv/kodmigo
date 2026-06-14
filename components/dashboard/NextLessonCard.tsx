import { getDashboardTheme } from "@/components/dashboard/getDashboardTheme";
import { dashboardMock } from "@/lib/dashboard-mock";

export default function NextLessonCard() {
  const { title, description, tags } = dashboardMock.nextLesson;
  const theme = getDashboardTheme();

  return (
    <section
      className={`mb-4 rounded-3xl border-2 p-5 ${theme.cardBackground} ${theme.cardBorder} ${theme.cardShadow}`}
    >
      <p
        className={`mb-1 text-xs font-semibold uppercase tracking-wide ${theme.sectionAccent}`}
      >
        Sıradaki ders
      </p>
      <h2 className={`mb-2 text-xl font-bold ${theme.primaryText}`}>
        {title}
      </h2>
      <p className={`mb-4 text-sm ${theme.mutedText}`}>{description}</p>

      <div className="mb-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className={`rounded-full px-3 py-1 text-xs font-medium ${theme.softBadge}`}
          >
            {tag}
          </span>
        ))}
      </div>

      <button
        type="button"
        className={`w-full rounded-2xl py-3 text-sm font-semibold transition ${theme.secondaryButton} ${theme.secondaryButtonHover}`}
      >
        Derse başla
      </button>
    </section>
  );
}
