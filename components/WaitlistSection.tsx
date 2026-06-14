export default function WaitlistSection() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl border border-kodmigo-orange/20 bg-gradient-to-br from-kodmigo-orange-light/60 via-kodmigo-cream to-white p-8 shadow-xl shadow-kodmigo-orange/10 sm:p-10">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-kodmigo-navy sm:text-3xl">
            İlk Python kodunu yazmaya hazır mısın?
            </h2>
            <p className="mt-3 text-slate-600">
            Kodmigo ile programlamaya karmaşık kaynaklar arasında kaybolmadan, sade ve eğlenceli bir başlangıç yap.
            </p>
            <a
              href="#preview"
              className="mt-6 inline-flex h-12 items-center justify-center rounded-2xl bg-kodmigo-orange px-8 font-semibold text-white shadow-lg shadow-kodmigo-orange/25 transition hover:bg-orange-600"
            >
              Python yoluna başla
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
