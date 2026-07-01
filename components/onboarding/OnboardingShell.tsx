"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MigoMessage from "@/components/onboarding/MigoMessage";
import OnboardingProgress from "@/components/onboarding/OnboardingProgress";
import OnboardingStep from "@/components/onboarding/OnboardingStep";
import OptionCard from "@/components/onboarding/OptionCard";
import { useAppStateSync } from "@/components/providers/AppStateSyncProvider";
import { useAuthUser } from "@/lib/auth/useAuthUser";
import {
  dailyTimeOptions,
  getDailyTimeLabel,
  getGoalsLabel,
  getLevelLabel,
  getPathLevelLabel,
  goalOptions,
  hasCompletedOnboarding,
  levelOptions,
  pathLevelFromCodingLevel,
  saveOnboardingProfile,
  type OnboardingSelections,
} from "@/lib/onboarding-data";
import {
  getLocalAppState,
  upsertRemoteAppState,
} from "@/lib/userAppState";
import { persistAppStateIfAuthed } from "@/lib/appStatePersist";
import { createClient } from "@/lib/supabase/client";

type Screen = "welcome" | "level" | "goal" | "time" | "result";

const QUESTION_SCREENS: Screen[] = ["level", "goal", "time", "result"];
const TOTAL_PROGRESS_STEPS = 4;

function getProgressStep(screen: Screen): number | null {
  const index = QUESTION_SCREENS.indexOf(screen);
  return index >= 0 ? index + 1 : null;
}

function canProceed(screen: Screen, selections: OnboardingSelections): boolean {
  switch (screen) {
    case "welcome":
      return true;
    case "level":
      return selections.level !== null;
    case "goal":
      return selections.goals.length > 0;
    case "time":
      return selections.dailyTime !== null;
    case "result":
      return true;
    default:
      return false;
  }
}

function getNextScreen(screen: Screen): Screen | null {
  switch (screen) {
    case "welcome":
      return "level";
    case "level":
      return "goal";
    case "goal":
      return "time";
    case "time":
      return "result";
    default:
      return null;
  }
}

function getPreviousScreen(screen: Screen): Screen | null {
  switch (screen) {
    case "level":
      return "welcome";
    case "goal":
      return "level";
    case "time":
      return "goal";
    case "result":
      return "time";
    default:
      return null;
  }
}

export default function OnboardingShell() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthUser();
  const { syncing, syncedUserId } = useAppStateSync();
  const [screen, setScreen] = useState<Screen>("welcome");
  const [selections, setSelections] = useState<OnboardingSelections>({
    level: null,
    goals: [],
    dailyTime: null,
  });
  const [goalError, setGoalError] = useState<string | null>(null);
  const [finishError, setFinishError] = useState<string | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace("/auth/sign-up");
      return;
    }

    if (syncing || syncedUserId !== user.id) return;

    if (hasCompletedOnboarding(getLocalAppState().onboardingProfile)) {
      router.replace("/dashboard");
    }
  }, [authLoading, user, syncing, syncedUserId, router]);

  const progressStep = getProgressStep(screen);
  const showProgress = progressStep !== null;
  const showBack = screen !== "welcome";
  const isResult = screen === "result";
  const canGoNext = canProceed(screen, selections);

  function toggleGoal(goal: (typeof goalOptions)[number]["value"]) {
    setGoalError(null);
    setSelections((prev) => {
      const isSelected = prev.goals.includes(goal);
      return {
        ...prev,
        goals: isSelected
          ? prev.goals.filter((item) => item !== goal)
          : [...prev.goals, goal],
      };
    });
  }

  function handleNext() {
    if (screen === "goal" && selections.goals.length === 0) {
      setGoalError("Devam etmek için en az bir neden seçmelisin.");
      return;
    }

    if (!canGoNext) return;

    const next = getNextScreen(screen);
    if (next) {
      setScreen(next);
    }
  }

  function handleBack() {
    const prev = getPreviousScreen(screen);
    if (prev) {
      setScreen(prev);
    }
  }

  async function handleFinish() {
    if (isFinishing) return;

    if (
      selections.level === null ||
      selections.goals.length === 0 ||
      selections.dailyTime === null
    ) {
      setFinishError("Eksik seçim var. Lütfen tüm adımları tamamla.");
      return;
    }

    if (!user) {
      setFinishError("Oturum bulunamadı. Lütfen tekrar giriş yap.");
      return;
    }

    setIsFinishing(true);
    setFinishError(null);

    try {
      const pathLevel = pathLevelFromCodingLevel(selections.level);

      saveOnboardingProfile({
        codingLevel: pathLevel,
        learningGoals: selections.goals,
        learningGoal: selections.goals[0],
        dailyTime: selections.dailyTime,
        completedAt: new Date().toISOString(),
      });

      const supabase = createClient();
      if (!supabase) {
        throw new Error("Supabase bağlantısı yapılandırılmamış.");
      }

      const saveError = await upsertRemoteAppState(user.id, getLocalAppState());
      if (saveError) {
        throw new Error(saveError);
      }

      await persistAppStateIfAuthed(true);
      router.replace("/dashboard");
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("[Kodmigo] onboarding finish hatası:", error);
      }
      setFinishError("Onboarding kaydedilemedi. Lütfen tekrar dene.");
    } finally {
      setIsFinishing(false);
    }
  }

  const waitingForAppState = Boolean(
    user && (syncing || syncedUserId !== user.id),
  );

  if (authLoading || waitingForAppState || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-slate-500">Yükleniyor...</p>
      </main>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-gradient-to-b from-kodmigo-orange-light/50 via-background to-background">
      <div className="pointer-events-none absolute -right-16 top-0 h-48 w-48 rounded-full bg-kodmigo-orange/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-12 bottom-32 h-40 w-40 rounded-full bg-kodmigo-amber/10 blur-3xl" />

      <header className="relative z-10 px-4 pb-2 pt-6 sm:px-6">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <Link href="/" className="flex cursor-pointer items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-kodmigo-orange text-lg font-bold text-white shadow-md shadow-kodmigo-orange/30">
              K
            </span>
            <span className="text-lg font-bold tracking-tight text-kodmigo-navy">
              Kodmigo
            </span>
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col px-4 pb-8 pt-4 sm:px-6">
        {showProgress && progressStep !== null && (
          <div className="mb-8">
            <OnboardingProgress
              currentStep={progressStep}
              totalSteps={TOTAL_PROGRESS_STEPS}
            />
          </div>
        )}

        <div className="flex flex-1 flex-col">
          {screen === "welcome" && (
            <div className="flex flex-1 flex-col gap-8">
              <OnboardingStep
                title="Python yolculuğuna başlamadan önce seni biraz tanıyalım"
                description="Kodmigo, sana uygun bir başlangıç yolu oluşturmak için birkaç kısa soru soracak."
              >
                <MigoMessage message="Merak etme, sadece 1 dakikanı alacak." />
              </OnboardingStep>
            </div>
          )}

          {screen === "level" && (
            <OnboardingStep title="Kodlama seviyen ne?">
              <div className="flex flex-col gap-3">
                {levelOptions.map((option) => (
                  <OptionCard
                    key={option.value}
                    label={option.label}
                    description={option.description}
                    selected={selections.level === option.value}
                    onSelect={() =>
                      setSelections((prev) => ({ ...prev, level: option.value }))
                    }
                  />
                ))}
              </div>
            </OnboardingStep>
          )}

          {screen === "goal" && (
            <OnboardingStep title="Python'u neden öğrenmek istiyorsun?">
              <p className="mb-3 text-sm text-slate-500">
                Birden fazla seçenek işaretleyebilirsin.
              </p>
              <div className="flex flex-col gap-3">
                {goalOptions.map((option) => (
                  <OptionCard
                    key={option.value}
                    label={option.label}
                    selected={selections.goals.includes(option.value)}
                    onSelect={() => toggleGoal(option.value)}
                  />
                ))}
              </div>
              {goalError && (
                <p className="mt-3 text-sm font-medium text-rose-600">
                  {goalError}
                </p>
              )}
            </OnboardingStep>
          )}

          {screen === "time" && (
            <OnboardingStep title="Günde ne kadar zaman ayırabilirsin?">
              <div className="grid grid-cols-2 gap-3">
                {dailyTimeOptions.map((option) => (
                  <OptionCard
                    key={option.value}
                    label={option.label}
                    selected={selections.dailyTime === option.value}
                    onSelect={() =>
                      setSelections((prev) => ({
                        ...prev,
                        dailyTime: option.value,
                      }))
                    }
                  />
                ))}
              </div>
            </OnboardingStep>
          )}

          {screen === "result" &&
            selections.level &&
            selections.goals.length > 0 &&
            selections.dailyTime && (
              <div className="flex flex-1 flex-col gap-6">
                <OnboardingStep
                  title={`Python ${getPathLevelLabel(pathLevelFromCodingLevel(selections.level))} Yolun hazır`}
                  description="Seçimlerine göre sana uygun, kısa ve uygulanabilir bir Python yolu hazırladık."
                >
                  <div className="rounded-2xl border border-kodmigo-orange/20 bg-white p-5 shadow-sm">
                    <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-kodmigo-orange">
                      Özet
                    </h2>
                    <dl className="space-y-3">
                      <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
                        <dt className="text-sm text-slate-500">Seviye</dt>
                        <dd className="break-words text-right text-sm font-semibold text-kodmigo-navy">
                          {getLevelLabel(selections.level)}
                        </dd>
                      </div>
                      <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
                        <dt className="text-sm text-slate-500">Hedef</dt>
                        <dd className="break-words text-right text-sm font-semibold text-kodmigo-navy">
                          {getGoalsLabel(selections.goals)}
                        </dd>
                      </div>
                      <div className="flex items-start justify-between gap-4">
                        <dt className="text-sm text-slate-500">Günlük hedef</dt>
                        <dd className="break-words text-right text-sm font-semibold text-kodmigo-navy">
                          {getDailyTimeLabel(selections.dailyTime)}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <MigoMessage
                    message="İlk ders kısa olacak. Sadece küçük bir adım atman yeterli."
                    compact
                  />
                </OnboardingStep>
              </div>
            )}
        </div>

        {finishError && (
          <p className="mt-4 text-center text-sm font-medium text-rose-600">
            {finishError}
          </p>
        )}

        <div className="mt-8 flex gap-3">
          {showBack && (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex h-12 flex-1 cursor-pointer items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-base font-semibold text-kodmigo-navy shadow-sm transition hover:border-kodmigo-orange/40 hover:bg-kodmigo-orange-light/30"
            >
              Geri
            </button>
          )}

          {isResult ? (
            <button
              type="button"
              onClick={handleFinish}
              disabled={isFinishing}
              className={`inline-flex h-12 flex-1 items-center justify-center rounded-2xl px-4 text-base font-semibold text-white shadow-lg shadow-kodmigo-orange/25 transition ${
                isFinishing
                  ? "cursor-not-allowed bg-kodmigo-orange/70"
                  : "cursor-pointer bg-kodmigo-orange hover:bg-orange-600"
              }`}
            >
              {isFinishing ? "Kaydediliyor..." : "Ana Sayfa'ya geç"}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              disabled={screen !== "goal" && !canGoNext}
              className={`inline-flex h-12 items-center justify-center rounded-2xl px-4 text-base font-semibold transition ${
                showBack ? "flex-1" : "w-full"
              } ${
                screen === "goal" || canGoNext
                  ? "cursor-pointer bg-kodmigo-orange text-white shadow-lg shadow-kodmigo-orange/25 hover:bg-orange-600"
                  : "cursor-not-allowed bg-slate-200 text-slate-400"
              }`}
            >
              {screen === "welcome" ? "Başlayalım" : "İleri"}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
