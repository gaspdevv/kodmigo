import { getDashboardTheme } from "@/components/dashboard/getDashboardTheme";
import { dashboardMock } from "@/lib/dashboard-mock";

export default function DashboardHeader() {
  const { name } = dashboardMock.user;
  const theme = getDashboardTheme();

  return (
    <header className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 className={`text-2xl font-bold ${theme.primaryText}`}>
          Merhaba, {name} 👋
        </h1>
        <p className={`mt-1 text-sm ${theme.mutedText}`}>
          Bugün Python yolunda küçük bir adım daha atalım.
        </p>
      </div>
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl shadow-sm ring-2 ${theme.iconBadge}`}
      >
        🦊
      </div>
    </header>
  );
}
