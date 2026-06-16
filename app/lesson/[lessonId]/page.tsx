import LessonNotFound from "@/components/lesson/LessonNotFound";
import LessonShell from "@/components/lesson/LessonShell";
import { getDashboardTheme } from "@/components/dashboard/getDashboardTheme";
import { getLessonById } from "@/data/lessons";

type LessonPageProps = {
  params: Promise<{ lessonId: string }>;
};

export default async function LessonPage({ params }: LessonPageProps) {
  const { lessonId } = await params;
  const lesson = getLessonById(lessonId);
  const theme = getDashboardTheme();

  if (!lesson) {
    return (
      <main className={`min-h-screen ${theme.pageBackground}`}>
        <LessonNotFound theme={theme} />
      </main>
    );
  }

  return (
    <main className={`min-h-screen ${theme.pageBackground}`}>
      <LessonShell lesson={lesson} theme={theme} />
    </main>
  );
}
