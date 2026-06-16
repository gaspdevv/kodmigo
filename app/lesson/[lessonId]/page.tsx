import { notFound } from "next/navigation";
import LessonShell from "@/components/lesson/LessonShell";
import { getLessonById } from "@/data/lessons";
import { getDashboardTheme } from "@/components/dashboard/getDashboardTheme";

type LessonPageProps = {
  params: Promise<{ lessonId: string }>;
};

export default async function LessonPage({ params }: LessonPageProps) {
  const { lessonId } = await params;
  const lesson = getLessonById(lessonId);

  if (!lesson) {
    notFound();
  }

  const theme = getDashboardTheme();

  return (
    <main className={`min-h-screen ${theme.pageBackground}`}>
      <LessonShell lesson={lesson} theme={theme} />
    </main>
  );
}
