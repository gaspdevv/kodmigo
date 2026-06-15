import Link from "next/link";
import { getDashboardTheme } from "@/components/dashboard/getDashboardTheme";

type NavTab = "Yol" | "Görevler" | "Profil";

type BottomNavProps = {
  activeTab?: NavTab;
};

const navItems: { label: NavTab; icon: string; href: string }[] = [
  { label: "Yol", icon: "🛤️", href: "/learn/python" },
  { label: "Görevler", icon: "✅", href: "/dashboard" },
  { label: "Profil", icon: "👤", href: "/dashboard" },
];

export default function BottomNav({ activeTab = "Yol" }: BottomNavProps) {
  const theme = getDashboardTheme();

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-sm ${theme.navBorder} ${theme.navBackground}`}
    >
      <div className="mx-auto flex max-w-lg items-center justify-around px-4 py-3">
        {navItems.map((item) => {
          const isActive = item.label === activeTab;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 rounded-xl px-4 py-1 transition ${
                isActive
                  ? `${theme.activeNav} ${theme.activeNavText}`
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
