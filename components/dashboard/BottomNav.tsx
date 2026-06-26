import Link from "next/link";
import { getDashboardTheme } from "@/components/dashboard/getDashboardTheme";

type NavTab = "Ana Sayfa" | "Yol" | "Profil";

type BottomNavProps = {
  activeTab?: NavTab;
};

const navItems: { label: NavTab; icon: string; href: string }[] = [
  { label: "Ana Sayfa", icon: "🏠", href: "/dashboard" },
  { label: "Yol", icon: "🛤️", href: "/learn/python" },
  { label: "Profil", icon: "👤", href: "/profile" },
];

export default function BottomNav({ activeTab = "Yol" }: BottomNavProps) {
  const theme = getDashboardTheme();

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-sm ${theme.navBorder} ${theme.navBackground}`}
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {navItems.map((item) => {
          const isActive = item.label === activeTab;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-2 py-1.5 transition ${
                isActive
                  ? `${theme.activeNav} ${theme.activeNavText}`
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              <span className="block max-w-full truncate text-center text-[11px] font-semibold leading-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
