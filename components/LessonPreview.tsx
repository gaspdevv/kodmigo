const options = [
  { text: "Ekrana Merhaba Kodmigo yazar", correct: true },
  { text: "Dosya oluşturur", correct: false },
  { text: "Hata verir", correct: false },
];

export default function LessonPreview() {
  return (
    <section id="preview" className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-kodmigo-navy sm:text-4xl">
          <span className="text-kodmigo-orange">Kodmigo</span>’da bir ders nasıl görünür?
          </h2>
          <p className="mt-3 text-slate-600">
            Mobil deneyimde dersler böyle görünür.
          </p>
        </div>

        <div className="mx-auto max-w-sm">
          <div className="rounded-[2.5rem] border-4 border-kodmigo-navy bg-kodmigo-navy p-3 shadow-2xl shadow-slate-300/50">
            <div className="mb-3 flex items-center justify-center gap-1">
              <div className="h-1 w-12 rounded-full bg-slate-600" />
            </div>

            <div className="rounded-[2rem] bg-slate-50 p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-kodmigo-orange">
                  Günlük görev
                </span>
                <span className="rounded-full bg-kodmigo-orange-light px-2.5 py-0.5 text-xs font-bold text-kodmigo-orange">
                  🔥 3 gün seri
                </span>
              </div>

              <h3 className="mb-1 text-lg font-bold text-kodmigo-navy">
                Python: print() komutu
              </h3>
              <p className="mb-4 text-sm text-slate-600">
                Aşağıdaki kod ne yapar?
              </p>

              <pre className="mb-4 overflow-x-auto rounded-xl bg-kodmigo-navy px-4 py-3 font-mono text-sm text-kodmigo-amber-light">
                <code>print(&quot;Merhaba Kodmigo&quot;)</code>
              </pre>

              <div className="flex flex-col gap-2">
                {options.map((option) => (
                  <div
                    key={option.text}
                    className={`rounded-xl border-2 px-4 py-3 text-sm font-medium transition ${
                      option.correct
                        ? "border-kodmigo-green bg-kodmigo-green-light text-kodmigo-green"
                        : "border-slate-200 bg-white text-slate-600"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {option.correct && (
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-kodmigo-green text-xs text-white">
                          ✓
                        </span>
                      )}
                      {option.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
