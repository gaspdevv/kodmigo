const steps = [
  {
    number: "1",
    title: "Seviyeni seç",
    description:
      "Kodlamaya tamamen sıfırdan başlasan bile sana uygun ilk adımdan başla.",
  },
  {
    number: "2",
    title: "Günlük görevleri tamamla",
    description:
      "Her ders kısa açıklamalar, mini sorular ve pratik kod egzersizlerinden oluşur.",
  },
  {
    number: "3",
    title: "Mini projeler geliştir",
    description:
      "",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-kodmigo-navy px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          <span className="text-kodmigo-orange">Kodmigo</span> nasıl çalışır?
          </h2>
          <p className="mt-3 text-slate-400">
            Üç basit adımda kodlamaya başla.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="relative text-center md:text-left">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-kodmigo-orange text-xl font-bold text-white shadow-lg shadow-kodmigo-orange/30">
                {step.number}
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
