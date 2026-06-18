const STORAGE_KEY = "kodmigo_streak_progress";

export type RescueDecision = "restored" | "new_streak" | "reset" | null;

export type StreakProgress = {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
  restoreMonth: string;
  restoresUsedThisMonth: number;
  monthlyRestoreLimit: number;
  isPremium: boolean;
  rescueDecision: RescueDecision;
  hasUsedStreakRestore: boolean;
};

function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function daysBetween(fromKey: string, toKey: string): number {
  const from = parseDateKey(fromKey);
  const to = parseDateKey(toKey);
  return Math.round((to.getTime() - from.getTime()) / 86400000);
}

export function getTodayKey(): string {
  return formatDateKey(new Date());
}

export function getYesterdayKey(): string {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return formatDateKey(date);
}

export function getMonthKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function getMonthlyRestoreLimit(isPremium: boolean): number {
  return isPremium ? 5 : 2;
}

export function getDefaultStreakProgress(): StreakProgress {
  return {
    currentStreak: 0,
    longestStreak: 0,
    lastCompletedDate: null,
    restoreMonth: getMonthKey(),
    restoresUsedThisMonth: 0,
    monthlyRestoreLimit: 2,
    isPremium: false,
    rescueDecision: null,
    hasUsedStreakRestore: false,
  };
}

function parseStreakProgress(raw: unknown): StreakProgress | null {
  if (!raw || typeof raw !== "object") return null;

  const data = raw as Partial<StreakProgress>;

  if (
    typeof data.currentStreak !== "number" ||
    typeof data.longestStreak !== "number" ||
    typeof data.restoreMonth !== "string" ||
    typeof data.restoresUsedThisMonth !== "number" ||
    typeof data.monthlyRestoreLimit !== "number" ||
    typeof data.isPremium !== "boolean"
  ) {
    return null;
  }

  const lastCompletedDate =
    data.lastCompletedDate === null || typeof data.lastCompletedDate === "string"
      ? data.lastCompletedDate
      : null;

  const rescueDecision: RescueDecision =
    data.rescueDecision === "restored" ||
    data.rescueDecision === "new_streak" ||
    data.rescueDecision === "reset"
      ? data.rescueDecision
      : null;

  return {
    currentStreak: Math.max(0, data.currentStreak),
    longestStreak: Math.max(0, data.longestStreak),
    lastCompletedDate,
    restoreMonth: data.restoreMonth,
    restoresUsedThisMonth: Math.max(0, data.restoresUsedThisMonth),
    monthlyRestoreLimit: Math.max(0, data.monthlyRestoreLimit),
    isPremium: data.isPremium,
    rescueDecision,
    hasUsedStreakRestore:
      typeof data.hasUsedStreakRestore === "boolean"
        ? data.hasUsedStreakRestore
        : data.restoresUsedThisMonth > 0,
  };
}

export function syncMonth(progress: StreakProgress): StreakProgress {
  const currentMonth = getMonthKey();
  if (progress.restoreMonth === currentMonth) return progress;

  return {
    ...progress,
    restoreMonth: currentMonth,
    restoresUsedThisMonth: 0,
    monthlyRestoreLimit: getMonthlyRestoreLimit(progress.isPremium),
  };
}

export function getStreakProgress(): StreakProgress {
  if (typeof window === "undefined") return getDefaultStreakProgress();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultStreakProgress();

    const parsed = parseStreakProgress(JSON.parse(raw));
    if (!parsed) return getDefaultStreakProgress();

    const synced = syncMonth(parsed);
    if (
      synced.restoreMonth !== parsed.restoreMonth ||
      synced.restoresUsedThisMonth !== parsed.restoresUsedThisMonth ||
      synced.monthlyRestoreLimit !== parsed.monthlyRestoreLimit
    ) {
      saveStreakProgress(synced);
    }
    return synced;
  } catch {
    return getDefaultStreakProgress();
  }
}

export function saveStreakProgress(progress: StreakProgress): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // localStorage kullanılamıyorsa sessizce geç
  }
}

export function hasCompletedToday(progress: StreakProgress): boolean {
  return progress.lastCompletedDate === getTodayKey();
}

export function isStreakAtRisk(progress: StreakProgress): boolean {
  return (
    progress.lastCompletedDate === getYesterdayKey() && !hasCompletedToday(progress)
  );
}

export function getMissedDaysCount(progress: StreakProgress): number {
  if (!progress.lastCompletedDate) return 0;

  const yesterday = getYesterdayKey();
  if (progress.lastCompletedDate >= yesterday) return 0;

  return daysBetween(progress.lastCompletedDate, yesterday);
}

export function getRemainingRestores(progress: StreakProgress): number {
  return Math.max(
    0,
    progress.monthlyRestoreLimit - progress.restoresUsedThisMonth,
  );
}

export function shouldRedirectToRescue(progress: StreakProgress): boolean {
  return (
    getMissedDaysCount(progress) > 0 &&
    getRemainingRestores(progress) > 0 &&
    progress.rescueDecision === null
  );
}

export function getStreakLabel(currentStreak: number): string {
  if (currentStreak <= 0) return "Yeni seri başlat";
  return `${currentStreak} gün seri`;
}

export function updateStreakOnLessonComplete(): StreakProgress {
  let progress = getStreakProgress();
  const today = getTodayKey();
  const yesterday = getYesterdayKey();

  if (hasCompletedToday(progress)) {
    saveStreakProgress(progress);
    return progress;
  }

  if (!progress.lastCompletedDate) {
    progress = {
      ...progress,
      currentStreak: 1,
      longestStreak: Math.max(progress.longestStreak, 1),
      lastCompletedDate: today,
      rescueDecision: null,
    };
    saveStreakProgress(progress);
    return progress;
  }

  if (progress.lastCompletedDate === yesterday) {
    const newStreak = progress.currentStreak + 1;
    progress = {
      ...progress,
      currentStreak: newStreak,
      longestStreak: Math.max(progress.longestStreak, newStreak),
      lastCompletedDate: today,
      rescueDecision: null,
    };
    saveStreakProgress(progress);
    return progress;
  }

  const missedDays = getMissedDaysCount(progress);
  if (missedDays > 0 && progress.rescueDecision === "restored") {
    const newStreak = progress.currentStreak + 1;
    progress = {
      ...progress,
      currentStreak: newStreak,
      longestStreak: Math.max(progress.longestStreak, newStreak),
      lastCompletedDate: today,
      rescueDecision: null,
    };
    saveStreakProgress(progress);
    return progress;
  }

  progress = {
    ...progress,
    currentStreak: 1,
    longestStreak: Math.max(progress.longestStreak, 1),
    lastCompletedDate: today,
    rescueDecision: null,
  };
  saveStreakProgress(progress);
  return progress;
}

export function restoreStreak(): StreakProgress {
  const progress = getStreakProgress();

  const updated: StreakProgress = {
    ...progress,
    restoresUsedThisMonth: progress.restoresUsedThisMonth + 1,
    lastCompletedDate: getYesterdayKey(),
    rescueDecision: "restored",
    hasUsedStreakRestore: true,
  };

  saveStreakProgress(updated);
  return updated;
}

export function startNewStreak(): StreakProgress {
  const progress = getStreakProgress();

  const updated: StreakProgress = {
    ...progress,
    currentStreak: 0,
    lastCompletedDate: null,
    rescueDecision: "new_streak",
  };

  saveStreakProgress(updated);
  return updated;
}

export function resetStreakWithoutRestore(): StreakProgress {
  const progress = getStreakProgress();
  const missedDays = getMissedDaysCount(progress);

  if (missedDays === 0 || progress.currentStreak === 0) {
    return progress;
  }

  const updated: StreakProgress = {
    ...progress,
    currentStreak: 0,
    rescueDecision: "reset",
  };

  saveStreakProgress(updated);
  return updated;
}

export function hasActiveStreak(progress: StreakProgress): boolean {
  return progress.currentStreak > 0;
}

export function isStreakDimmed(progress: StreakProgress): boolean {
  return progress.currentStreak > 0 && !hasCompletedToday(progress);
}

export type StreakStatusMessageKey =
  | "completed_today"
  | "at_risk"
  | "restored"
  | "new_streak"
  | "reset";

export function getStreakStatusMessageKey(
  progress: StreakProgress,
): StreakStatusMessageKey | null {
  if (progress.rescueDecision === "restored" && !hasCompletedToday(progress)) {
    return "restored";
  }

  if (hasCompletedToday(progress) && progress.currentStreak > 0) {
    return "completed_today";
  }

  if (progress.currentStreak > 0 && !hasCompletedToday(progress)) {
    return "at_risk";
  }

  if (!hasCompletedToday(progress)) {
    if (progress.rescueDecision === "reset") return "reset";
    if (progress.rescueDecision === "new_streak") return "new_streak";
  }

  return null;
}

export const STREAK_STATUS_MESSAGES: Record<StreakStatusMessageKey, string> = {
  completed_today: "Bugünkü serin korundu.",
  at_risk: "Bugün bir ders tamamla, serin yeniden alevlensin.",
  restored:
    "Serin kurtarıldı. Bugün bir ders tamamlayarak alevi yeniden yak.",
  new_streak: "Yeni bir başlangıç yapabilirsin. Bugün ilk dersini tamamla.",
  reset: "Serin sıfırlandı, ama bugün yeni bir başlangıç yapabilirsin.",
};
