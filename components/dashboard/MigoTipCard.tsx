import { getDashboardTheme } from "@/components/dashboard/getDashboardTheme";
import { dashboardMock } from "@/lib/dashboard-mock";

export default function MigoTipCard() {
  const theme = getDashboardTheme();

  return (
    <section
      className={`mb-4 rounded-3xl border p-5 ${theme.cardBackground} ${theme.cardBorder}`}
    >
      <div className="flex gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-kodmigo-orange-light to-kodmigo-amber-light text-2xl ring-2 ring-kodmigo-orange/20`}
        >
          🦊
        </div>
        <div className="min-w-0 flex-1">
          <h2 className={`mb-1 text-sm font-bold ${theme.migoAccent}`}>
            Migo&apos;dan ipucu
          </h2>
          <p className={`break-words text-sm leading-relaxed ${theme.mutedText}`}>
            {dashboardMock.migoTip}
          </p>
        </div>
      </div>
    </section>
  );
}
