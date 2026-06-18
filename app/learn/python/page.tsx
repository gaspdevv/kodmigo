import { Suspense } from "react";
import PythonLearnView from "@/components/learn/PythonLearnView";

function PythonLearnFallback() {
  return (
    <main
      className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 via-stone-50 to-amber-50"
      aria-busy="true"
    >
      <div className="h-8 w-8 animate-pulse rounded-full bg-orange-200/80" />
    </main>
  );
}

export default function PythonLearnPage() {
  return (
    <Suspense fallback={<PythonLearnFallback />}>
      <PythonLearnView />
    </Suspense>
  );
}
