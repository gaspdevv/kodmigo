import LessonPageClient from "@/components/lesson/LessonPageClient";
import { getLessonById } from "@/data/lessons";

type LessonPageProps = {
  params: Promise<{ lessonId: string }>;
};

export default async function LessonPage({ params }: LessonPageProps) {
  const { lessonId } = await params;
  const lesson = getLessonById(lessonId);

  return <LessonPageClient lesson={lesson ?? null} />;
}
