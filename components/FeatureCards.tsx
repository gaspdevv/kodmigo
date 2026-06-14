const features = [
  {
    icon: "⏱️",
    title: "Kısa günlük dersler",
    description: "Uzun videolar yerine birkaç dakikada tamamlanabilen sade ve odaklı görevlerle ilerle.",
    accent: "bg-kodmigo-orange-light text-kodmigo-orange",
  },
  {
    icon: "💻",
    title: "Kod yazarak öğren",
    description: "Sadece okumakla kalma; örnekleri incele, çıktıları tahmin et ve küçük kod parçalarını tamamla.",
    accent: "bg-kodmigo-orange-light text-kodmigo-amber",
  },
  {
    icon: "📈",
    title: "İlerledikçe motive ol",
    description:
      "Dersleri tamamladıkça XP kazan, serini koru ve Python öğrenme yolunda adım adım seviye atla.",
    accent: "bg-kodmigo-orange-light text-kodmigo-navy ring-1 ring-kodmigo-orange/15",
  },
];

export default function FeatureCards() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-kodmigo-navy sm:text-4xl">
            Neden <span className="text-kodmigo-orange">Kodmigo</span>?
          </h2>
          <p className="mt-3 text-slate-600">
            Küçük adımlarla büyük ilerleme kaydet.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-3xl border border-kodmigo-orange/10 bg-white p-6 shadow-lg shadow-slate-200/50 transition hover:-translate-y-1 hover:border-kodmigo-orange/20 hover:shadow-xl"
            >
              <span
                className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl text-3xl ${feature.accent}`}
              >
                {feature.icon}
              </span>
              <h3 className="mb-2 text-lg font-bold text-kodmigo-navy">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
