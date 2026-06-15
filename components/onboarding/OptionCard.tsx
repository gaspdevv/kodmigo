type OptionCardProps = {
  label: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
};

export default function OptionCard({
  label,
  description,
  selected,
  onSelect,
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full cursor-pointer rounded-2xl border-2 px-4 py-4 text-left transition-all sm:px-5 sm:py-4 ${
        selected
          ? "border-kodmigo-orange bg-kodmigo-orange-light/60 shadow-md shadow-kodmigo-orange/10 ring-1 ring-kodmigo-orange/30"
          : "border-slate-200/80 bg-white hover:border-kodmigo-orange/40 hover:bg-kodmigo-cream/50 active:scale-[0.99]"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
            selected
              ? "border-kodmigo-orange bg-kodmigo-orange"
              : "border-slate-300 bg-white"
          }`}
        >
          {selected && (
            <svg
              className="h-3 w-3 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p
            className={`font-semibold ${
              selected ? "text-kodmigo-navy" : "text-kodmigo-navy"
            }`}
          >
            {label}
          </p>
          {description && (
            <p className="mt-1 text-sm leading-relaxed text-slate-500">{description}</p>
          )}
        </div>
      </div>
    </button>
  );
}
