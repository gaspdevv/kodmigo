import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
};

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: AuthShellProps) {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-kodmigo-orange-light/70 via-kodmigo-cream/50 to-background px-4 py-8 sm:px-6">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-kodmigo-orange/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-kodmigo-amber/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-md">
        <header className="mb-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-kodmigo-orange text-lg font-bold text-white shadow-md shadow-kodmigo-orange/30">
              K
            </span>
            <span className="text-xl font-bold tracking-tight text-kodmigo-navy">
              Kodmigo
            </span>
          </Link>
          <span className="text-3xl" aria-hidden="true">
            🦊
          </span>
        </header>

        <section className="min-w-0 rounded-3xl border border-kodmigo-orange/20 bg-white p-6 shadow-xl shadow-kodmigo-orange/10 sm:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-kodmigo-navy">{title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {subtitle}
            </p>
          </div>

          {children}

          <div className="mt-6 text-center text-sm text-slate-600">{footer}</div>
        </section>
      </div>
    </main>
  );
}
