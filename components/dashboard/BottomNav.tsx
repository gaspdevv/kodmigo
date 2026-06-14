import { getDashboardTheme } from "@/components/dashboard/getDashboardTheme";

const navItems = [
  { label: "Yol", icon: "🛤️", active: true },
  { label: "Görevler", icon: "✅", active: false },
  { label: "Profil", icon: "👤", active: false },
];

export default function BottomNav() {
  const theme = getDashboardTheme();

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-sm ${theme.navBorder} ${theme.navBackground}`}
    >
      <div className="mx-auto flex max-w-lg items-center justify-around px-4 py-3">
        {navItems.map((item) => (
          <button
            key={item.label}
            type="button"
            className={`flex flex-col items-center gap-0.5 rounded-xl px-4 py-1 transition ${
              item.active
                ? `${theme.activeNav} ${theme.activeNavText}`
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
