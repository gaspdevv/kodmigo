"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import StreakRescueCard from "@/components/streak/StreakRescueCard";
import { getStreakProgress, shouldRedirectToRescue } from "@/lib/streak";

export default function StreakRescuePage() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const progress = getStreakProgress();

    if (!shouldRedirectToRescue(progress)) {
      router.replace("/dashboard");
      return;
    }

    setIsReady(true);
  }, [router]);

  if (!isReady) {
    return (
      <main
        className="flex min-h-screen items-center justify-center bg-gradient-to-b from-kodmigo-cream via-orange-50 to-amber-50 px-4"
        aria-busy="true"
      >
        <div className="h-8 w-8 animate-pulse rounded-full bg-orange-200" />
      </main>
    );
  }

  return (
    <main
      className="flex min-h-screen items-center justify-center overflow-x-hidden bg-gradient-to-b from-kodmigo-cream via-orange-50 to-amber-50 px-4 py-8"
    >
      <StreakRescueCard />
    </main>
  );
}
