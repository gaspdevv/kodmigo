import {
  APP_STATE_SYNCED_EVENT,
} from "@/lib/appStateEvents";
import { getAuthUsername } from "@/lib/username";
import {
  getLocalAppState,
  syncRemoteToLocal,
  upsertRemoteAppState,
} from "@/lib/userAppState";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

let persistTimer: ReturnType<typeof setTimeout> | null = null;
let persistInFlight: Promise<void> | null = null;
let cachedUserId: string | null = null;
let lastSyncedLoginUserId: string | null = null;

export function wasLoginSyncCompleted(userId: string): boolean {
  return lastSyncedLoginUserId === userId;
}

export function resetLoginSyncState(): void {
  lastSyncedLoginUserId = null;
  cachedUserId = null;
}

export function dispatchAppStateSynced(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(APP_STATE_SYNCED_EVENT));
}

export function schedulePersistAppState(delayMs = 300): void {
  if (typeof window === "undefined") return;

  if (persistTimer) {
    clearTimeout(persistTimer);
  }

  persistTimer = setTimeout(() => {
    persistTimer = null;
    void persistAppStateIfAuthed(true);
  }, delayMs);
}

export async function persistAppStateIfAuthed(
  immediate = false,
): Promise<void> {
  if (typeof window === "undefined") return;

  if (!immediate && persistInFlight) {
    return persistInFlight;
  }

  const run = async () => {
    const supabase = createClient();
    if (!supabase) return;

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user?.id) {
      return;
    }

    cachedUserId = session.user.id;
    const state = getLocalAppState();
    const error = await upsertRemoteAppState(session.user.id, state);

    if (error && process.env.NODE_ENV !== "production") {
      console.error("[Kodmigo] persistAppStateIfAuthed başarısız:", error);
    }
  };

  persistInFlight = run().finally(() => {
    persistInFlight = null;
  });

  return persistInFlight;
}

export async function syncAppStateAfterLogin(
  user: User,
): Promise<void> {
  const authUsername = getAuthUsername(user.user_metadata);
  cachedUserId = user.id;
  await syncRemoteToLocal(user.id, authUsername);
  lastSyncedLoginUserId = user.id;
  dispatchAppStateSynced();
}

export async function syncAppStateOnLogin(
  userId: string,
  authUsername?: string | null,
): Promise<void> {
  cachedUserId = userId;
  await syncRemoteToLocal(userId, authUsername);
  lastSyncedLoginUserId = userId;
  dispatchAppStateSynced();
}

export function getCachedAuthUserId(): string | null {
  return cachedUserId;
}
