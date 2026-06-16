"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MigoMessage from "@/components/onboarding/MigoMessage";
import {
  getRemainingRestores,
  getStreakProgress,
  restoreStreak,
  startNewStreak,
  type StreakProgress,
} from "@/lib/streak";
import { playClickSound } from "@/lib/sounds";

export default function StreakRescueCard() {
  const router = useRouter();
  const [progress, setProgress] = useState<StreakProgress | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setProgress(getStreakProgress());
  }, []);

  const remaining = progress ? getRemainingRestores(progress) : 0;

  const handleRestore = () => {
    if (isSubmitting || remaining <= 0) return;
    playClickSound();
    setIsSubmitting(true);
    restoreStreak();
    router.replace("/dashboard");
  };

  const handleNewStreak = () => {
    if (isSubmitting) return;
    playClickSound();
    setIsSubmitting(true);
    startNewStreak();
    router.replace("/dashboard");
  };

  return (
    <div className="w-full max-w-md">
      <div
        className="rounded-3xl border border-orange-200/60 bg-white p-6 shadow-xl shadow-orange-100/50 sm:p-8"
      >
        <div className="mb-4 text-center">
          <span
            className="flame-emoji text-5xl leading-none sm:text-6xl"
            aria-hidden="true"
          >
            🔥
          </span>
        </div>

        <h1 className="mb-3 text-center text-2xl font-bold text-kodmigo-navy sm:text-3xl">
          Serini kurtar! 🔥
        </h1>

        <p className="mb-6 text-center text-sm leading-relaxed text-slate-600 sm:text-base">
          Bir günü kaçırdın. İstersen seri alevlendirme hakkını kullanarak
          kaldığın yerden devam edebilirsin.
        </p>

        <p className="mb-6 text-center text-sm leading-relaxed text-slate-500">
          Serini alevlendirirsen kaldığın yerden devam edersin. Yeni seri
          başlatırsan bugün ilk dersinle yeni bir başlangıç yaparsın.
        </p>

        <div className="mb-6">
          <MigoMessage>
            Kalan yenileme hakkı:{" "}
            <span className="font-semibold text-kodmigo-orange">{remaining}</span>
          </MigoMessage>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleRestore}
            disabled={isSubmitting || remaining <= 0}
            className={`w-full rounded-2xl py-3.5 text-sm font-semibold transition ${
              isSubmitting || remaining <= 0
                ? "cursor-not-allowed bg-orange-300 text-white"
                : "cursor-pointer bg-gradient-to-r from-kodmigo-orange to-orange-500 text-white hover:from-orange-600 hover:to-orange-500"
            }`}
          >
            Serimi alevlendir
          </button>
          <button
            type="button"
            onClick={handleNewStreak}
            disabled={isSubmitting}
            className={`w-full rounded-2xl border-2 border-slate-200 bg-white py-3.5 text-sm font-semibold text-kodmigo-navy transition ${
              isSubmitting
                ? "cursor-not-allowed opacity-60"
                : "cursor-pointer hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            Yeni seri başlat
          </button>
        </div>
      </div>
    </div>
  );
}
