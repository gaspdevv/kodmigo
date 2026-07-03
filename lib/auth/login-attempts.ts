"use client";

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 5 * 60 * 1000;

export type LoginAttemptRecord = {
  count: number;
  lockedUntil: number;
};

export type LoginLockState = {
  isLocked: boolean;
  minutesRemaining: number;
};

export type LoginAttemptResult = {
  count: number;
  isLocked: boolean;
  minutesRemaining: number;
};

function getLoginAttemptKey(email: string): string {
  return `kodmigo_login_attempts_${encodeURIComponent(email.trim().toLowerCase())}`;
}

function getDefaultState(): LoginAttemptRecord {
  return { count: 0, lockedUntil: 0 };
}

function readLoginAttemptState(email: string): LoginAttemptRecord {
  if (typeof window === "undefined") {
    return getDefaultState();
  }

  try {
    const raw = localStorage.getItem(getLoginAttemptKey(email));
    if (!raw) {
      return getDefaultState();
    }

    const parsed = JSON.parse(raw) as Partial<LoginAttemptRecord>;
    return {
      count:
        typeof parsed.count === "number" && parsed.count >= 0 ? parsed.count : 0,
      lockedUntil:
        typeof parsed.lockedUntil === "number" && parsed.lockedUntil >= 0
          ? parsed.lockedUntil
          : 0,
    };
  } catch {
    return getDefaultState();
  }
}

function writeLoginAttemptState(email: string, state: LoginAttemptRecord): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(getLoginAttemptKey(email), JSON.stringify(state));
  } catch {
    // localStorage kullanılamıyorsa sessizce geç
  }
}

function computeMinutesRemaining(lockedUntil: number): number {
  const remainingMs = lockedUntil - Date.now();
  if (remainingMs <= 0) {
    return 0;
  }

  return Math.max(1, Math.ceil(remainingMs / 60_000));
}

export function getLoginAttemptState(email: string): LoginAttemptRecord {
  return readLoginAttemptState(email);
}

export function getLoginLockState(email: string): LoginLockState {
  const state = readLoginAttemptState(email);
  const now = Date.now();

  if (state.lockedUntil > 0 && state.lockedUntil <= now) {
    clearLoginAttempts(email);
    return { isLocked: false, minutesRemaining: 0 };
  }

  if (state.lockedUntil > now) {
    return {
      isLocked: true,
      minutesRemaining: computeMinutesRemaining(state.lockedUntil),
    };
  }

  return { isLocked: false, minutesRemaining: 0 };
}

export function formatLoginLockoutError(minutesRemaining: number): string {
  return `Çok fazla başarısız deneme yaptın. Lütfen birkaç dakika sonra tekrar dene. Yaklaşık ${minutesRemaining} dakika sonra tekrar deneyebilirsin.`;
}

export function recordFailedLoginAttempt(email: string): LoginAttemptResult {
  const now = Date.now();
  const current = readLoginAttemptState(email);

  if (current.lockedUntil > now) {
    return {
      count: current.count,
      isLocked: true,
      minutesRemaining: computeMinutesRemaining(current.lockedUntil),
    };
  }

  const nextCount = current.count + 1;
  const lockedUntil =
    nextCount >= MAX_FAILED_ATTEMPTS ? now + LOCK_DURATION_MS : current.lockedUntil;

  const nextState: LoginAttemptRecord = {
    count:
      nextCount >= MAX_FAILED_ATTEMPTS ? MAX_FAILED_ATTEMPTS : nextCount,
    lockedUntil,
  };

  writeLoginAttemptState(email, nextState);

  const isLocked = lockedUntil > now;
  return {
    count: nextState.count,
    isLocked,
    minutesRemaining: isLocked ? computeMinutesRemaining(lockedUntil) : 0,
  };
}

export function clearLoginAttempts(email: string): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(getLoginAttemptKey(email));
  } catch {
    // localStorage kullanılamıyorsa sessizce geç
  }
}

export const LOGIN_MAX_FAILED_ATTEMPTS = MAX_FAILED_ATTEMPTS;
export const LOGIN_LOCKOUT_MINUTES = LOCK_DURATION_MS / 60_000;
