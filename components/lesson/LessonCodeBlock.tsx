import type { StageTheme } from "@/components/dashboard/stageThemes";

type LessonCodeBlockProps = {
  code: string;
  theme: StageTheme;
};

export default function LessonCodeBlock({ code, theme }: LessonCodeBlockProps) {
  return (
    <pre
      className={`overflow-x-auto rounded-xl px-4 py-3 font-mono text-sm leading-relaxed ${theme.lessonCodeBackground}`}
    >
      <code>{code}</code>
    </pre>
  );
}
