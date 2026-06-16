type LessonFeedbackProps = {
  type: "correct" | "incorrect";
  message: string;
};

export default function LessonFeedback({
  type,
  message,
}: LessonFeedbackProps) {
  const isCorrect = type === "correct";
  const icon = isCorrect ? "✨" : "💡";

  const containerClasses = isCorrect
    ? "border-2 border-emerald-400 bg-emerald-50 text-emerald-900 shadow-lg shadow-emerald-200/40"
    : "border-2 border-rose-300 bg-rose-50 text-rose-900 shadow-md shadow-rose-200/30";

  return (
    <div
      className={`lesson-feedback-in rounded-2xl px-4 py-4 ${containerClasses}`}
      role="status"
    >
      <div className="flex items-start gap-3">
        <span className="text-xl leading-none" aria-hidden>
          {icon}
        </span>
        <p className="text-sm font-semibold leading-relaxed">{message}</p>
      </div>
    </div>
  );
}
