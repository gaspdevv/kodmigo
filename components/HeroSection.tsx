import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-kodmigo-orange-light/70 via-kodmigo-cream/50 to-background px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pb-24 lg:pt-12">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-kodmigo-orange/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-kodmigo-amber/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <header className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-kodmigo-orange text-lg font-bold text-white shadow-md shadow-kodmigo-orange/30">
              K
            </span>
            <span className="text-xl font-bold tracking-tight text-kodmigo-navy">
              Kodmigo
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="hidden text-sm text-slate-500 sm:block">
              Yazılım öğrenmenin en eğlenceli yolu.
            </span>
            <Link
              href="/auth/sign-in?redirect=/dashboard"
              className="text-sm font-medium text-slate-600 transition hover:text-kodmigo-orange"
            >
              Giriş yap
            </Link>
          </div>
        </header>

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-6">
            <span className="inline-flex w-fit items-center rounded-full border border-kodmigo-orange/25 bg-white px-4 py-1.5 text-sm font-medium text-kodmigo-orange shadow-sm">
              Türkçe kodlama öğrenme platformu
            </span>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-kodmigo-navy sm:text-5xl lg:text-[3.25rem]">
              {" "}
              <span className="text-kodmigo-orange">Python</span> öğrenmeye oyun gibi başla.
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-slate-600">
            <span className="text-kodmigo-orange">Kodmigo</span>, sıfırdan başlayanlar için Python öğrenmeyi kısa görevler, anlaşılır örnekler ve Migo’nun rehberliğiyle daha kolay hale getirir.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/auth/sign-up"
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-kodmigo-orange px-6 text-base font-semibold text-white shadow-lg shadow-kodmigo-orange/25 transition hover:bg-orange-600"
              >
                Python yoluna başla
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-base font-semibold text-kodmigo-navy shadow-sm transition hover:border-kodmigo-orange/40 hover:bg-kodmigo-orange-light/40"
              >
                Nasıl çalışır?
              </a>
            </div>
          </div>

          <div className="mx-auto w-full max-w-md lg:max-w-none">
            <div className="rounded-3xl border border-kodmigo-orange/20 bg-kodmigo-cream p-6 shadow-xl shadow-kodmigo-orange/10 sm:p-8">
              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-kodmigo-orange-light to-kodmigo-amber-light text-4xl shadow-inner ring-2 ring-kodmigo-orange/20">
                  🦊
                </div>
                <div>
                  <p className="text-2xl font-bold text-kodmigo-orange">Migo</p>
                  <p className="text-sm text-slate-500">Tilki mentorun</p>
                </div>
              </div>
              <div className="relative rounded-2xl bg-kodmigo-navy px-5 py-4 text-white">
                <div className="absolute -top-2 left-6 h-4 w-4 rotate-45 bg-kodmigo-navy" />
                <p className="relative text-sm leading-relaxed text-slate-300">
                  <span className="font-semibold text-kodmigo-amber">
                    Migo:
                  </span>{" "}
                  İlk kodunu yazmak sandığından daha kolay. Bugün küçük bir adımla başlayalım.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
