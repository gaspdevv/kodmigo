import Link from "next/link";
import type { ReactNode } from "react";
import Footer from "@/components/Footer";

type LegalPageLayoutProps = {
  title: string;
  description: string;
  lastUpdated: string;
  children: ReactNode;
};

export default function LegalPageLayout({
  title,
  description,
  lastUpdated,
  children,
}: LegalPageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="relative flex-1 overflow-x-hidden bg-gradient-to-b from-kodmigo-orange-light/70 via-kodmigo-cream/50 to-background px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-kodmigo-orange/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 top-40 h-48 w-48 rounded-full bg-kodmigo-amber/10 blur-3xl" />

        <div className="relative mx-auto w-full max-w-3xl">
          <header className="mb-8 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-kodmigo-orange text-lg font-bold text-white shadow-md shadow-kodmigo-orange/30">
                K
              </span>
              <span className="text-xl font-bold tracking-tight text-kodmigo-navy">
                Kodmigo
              </span>
            </Link>
            <Link
              href="/"
              className="text-sm font-medium text-slate-600 transition hover:text-kodmigo-orange"
            >
              ← Ana sayfa
            </Link>
          </header>

          <div className="mb-8 flex items-start gap-4 rounded-3xl border border-kodmigo-orange/20 bg-white/85 p-6 shadow-sm shadow-kodmigo-orange/10 sm:p-8">
            <span className="hidden text-4xl sm:block" aria-hidden="true">
              🦊
            </span>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-kodmigo-navy sm:text-4xl">
                {title}
              </h1>
              <p className="mt-3 text-base leading-relaxed text-slate-600">
                {description}
              </p>
            </div>
          </div>

          <div className="space-y-5">{children}</div>

          <p className="mt-8 text-center text-sm text-slate-500">
            Son güncelleme: {lastUpdated}
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
