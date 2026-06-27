"use client";

import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";

export default function AuthStartPageClient() {
  return (
    <AuthShell
      title="Kodmigo'ya nasıl devam etmek istersin?"
      subtitle="Hesabın varsa giriş yap; yeni başlıyorsan kısa tanışma adımlarından sonra kayıt ol."
      footer={
        <Link href="/" className="text-slate-500 hover:text-kodmigo-orange">
          Ana sayfaya dön
        </Link>
      }
    >
      <div className="space-y-4">
        <section className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          <h2 className="mb-1 text-base font-bold text-kodmigo-navy">
            Hesabım var
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-slate-600">
            Daha önce kayıt olduysan giriş yap.
          </p>
          <Link
            href="/auth/sign-in?redirect=/dashboard"
            className="inline-flex h-11 w-full items-center justify-center rounded-2xl bg-kodmigo-orange text-sm font-semibold text-white shadow-lg shadow-kodmigo-orange/25 transition hover:bg-orange-600"
          >
            Giriş yap
          </Link>
        </section>

        <section className="rounded-2xl border border-kodmigo-orange/20 bg-kodmigo-orange-light/20 p-4">
          <h2 className="mb-1 text-base font-bold text-kodmigo-navy">
            Yeni başlıyorum
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-slate-600">
            Kısa tanışma adımlarından sonra hesabını oluştur.
          </p>
          <Link
            href="/onboarding"
            className="inline-flex h-11 w-full items-center justify-center rounded-2xl border border-kodmigo-orange/30 bg-white text-sm font-semibold text-kodmigo-navy transition hover:border-kodmigo-orange/50 hover:bg-kodmigo-orange-light/40"
          >
            Kayıt akışına başla
          </Link>
        </section>
      </div>
    </AuthShell>
  );
}
