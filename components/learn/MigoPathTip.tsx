import { getDashboardTheme } from "@/components/dashboard/getDashboardTheme";

type MigoPathTipProps = {
  migoTip: string;
};

export default function MigoPathTip({ migoTip }: MigoPathTipProps) {
  const theme = getDashboardTheme();

  return (
    <section
      className={`mb-6 rounded-3xl border p-5 ${theme.cardBackground} ${theme.cardBorder} ${theme.cardShadow}`}
    >
      <div className="flex gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl ring-2 ${theme.iconBadge}`}
        >
          🦊
        </div>
        <div className="min-w-0 flex-1">
          <h2 className={`mb-1 text-sm font-bold ${theme.migoAccent}`}>Migo</h2>
          <p className={`break-words text-sm leading-relaxed ${theme.mutedText}`}>
            {migoTip}
          </p>
        </div>
      </div>
    </section>
  );
}
