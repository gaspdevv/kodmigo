type MigoMessageProps = {
  message: string;
  compact?: boolean;
};

export default function MigoMessage({ message, compact = false }: MigoMessageProps) {
  return (
    <div
      className={`rounded-2xl border border-kodmigo-orange/15 bg-white shadow-sm ${
        compact ? "p-4" : "p-5"
      }`}
    >
      <div className="flex gap-3">
        <div
          className={`flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-kodmigo-orange-light to-kodmigo-amber-light ring-2 ring-kodmigo-orange/20 ${
            compact ? "h-10 w-10 text-xl" : "h-12 w-12 text-2xl"
          }`}
        >
          🦊
        </div>
        <div className="relative min-w-0 flex-1 rounded-xl bg-kodmigo-navy px-4 py-3 text-white">
          <div className="absolute -left-1.5 top-4 h-3 w-3 rotate-45 bg-kodmigo-navy" />
          <p className={`leading-relaxed text-slate-300 ${compact ? "text-sm" : "text-sm sm:text-base"}`}>
            <span className="font-semibold text-kodmigo-amber">Migo:</span> {message}
          </p>
        </div>
      </div>
    </div>
  );
}
