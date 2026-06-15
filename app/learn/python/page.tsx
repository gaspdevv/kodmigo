import BottomNav from "@/components/dashboard/BottomNav";
import { getDashboardTheme } from "@/components/dashboard/getDashboardTheme";
import LearningPathHeader from "@/components/learn/LearningPathHeader";
import MigoPathTip from "@/components/learn/MigoPathTip";
import UnitSection from "@/components/learn/UnitSection";
import { pythonPathUnits } from "@/data/pythonPath";

export default function PythonLearnPage() {
  const theme = getDashboardTheme();

  return (
    <main className={`min-h-screen pb-24 ${theme.pageBackground}`}>
      <div className="mx-auto max-w-lg px-4 pb-6 pt-6 sm:px-6">
        <LearningPathHeader />
        <MigoPathTip />
        {pythonPathUnits.map((unit, index) => (
          <UnitSection key={unit.id} unit={unit} index={index} />
        ))}
      </div>
      <BottomNav activeTab="Yol" />
    </main>
  );
}
