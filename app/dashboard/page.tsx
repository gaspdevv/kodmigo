import BottomNav from "@/components/dashboard/BottomNav";
import DailyQuestCard from "@/components/dashboard/DailyQuestCard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { getDashboardTheme } from "@/components/dashboard/getDashboardTheme";
import LearningPathCard from "@/components/dashboard/LearningPathCard";
import MigoTipCard from "@/components/dashboard/MigoTipCard";
import NextLessonCard from "@/components/dashboard/NextLessonCard";
import StageProgressCard from "@/components/dashboard/StageProgressCard";

export default function DashboardPage() {
  const theme = getDashboardTheme();

  return (
    <main className={`min-h-screen pb-24 ${theme.pageBackground}`}>
      <div className="mx-auto max-w-lg px-4 pb-6 pt-6 sm:px-6">
        <DashboardHeader />
        <StageProgressCard />
        <DailyQuestCard />
        <LearningPathCard />
        <NextLessonCard />
        <MigoTipCard />
      </div>
      <BottomNav />
    </main>
  );
}
