"use client";

import type { User } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { syncAppStateAfterLogin, wasLoginSyncCompleted, resetLoginSyncState } from "@/lib/appStatePersist";
import { useAuthUser } from "@/lib/auth/useAuthUser";

type AppStateSyncContextValue = {
  syncing: boolean;
  syncedUserId: string | null;
};

const AppStateSyncContext = createContext<AppStateSyncContextValue>({
  syncing: false,
  syncedUserId: null,
});

export function useAppStateSync() {
  return useContext(AppStateSyncContext);
}

export function AppStateSyncProvider({ children }: { children: ReactNode }) {
  const { user, loading } = useAuthUser();
  const [syncing, setSyncing] = useState(false);
  const [syncedUserId, setSyncedUserId] = useState<string | null>(null);
  const syncPromiseRef = useRef<Promise<void> | null>(null);
  const lastSyncedUserRef = useRef<string | null>(null);

  const runSync = useCallback(async (authUser: User) => {
    if (syncPromiseRef.current) {
      await syncPromiseRef.current;
      return;
    }

    setSyncing(true);

    syncPromiseRef.current = (async () => {
      try {
        await syncAppStateAfterLogin(authUser);
        setSyncedUserId(authUser.id);
        lastSyncedUserRef.current = authUser.id;
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.error("[Kodmigo] App state sync başarısız:", error);
        }
      } finally {
        syncPromiseRef.current = null;
        setSyncing(false);
      }
    })();

    await syncPromiseRef.current;
  }, []);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      setSyncedUserId(null);
      lastSyncedUserRef.current = null;
      syncPromiseRef.current = null;
      setSyncing(false);
      resetLoginSyncState();
      return;
    }

    if (
      lastSyncedUserRef.current === user.id ||
      wasLoginSyncCompleted(user.id)
    ) {
      lastSyncedUserRef.current = user.id;
      setSyncedUserId(user.id);
      return;
    }

    void runSync(user);
  }, [user, loading, runSync]);

  const value = useMemo(
    () => ({
      syncing:
        syncing || (Boolean(user) && !loading && syncedUserId !== user?.id),
      syncedUserId,
    }),
    [syncing, syncedUserId, user, loading],
  );

  return (
    <AppStateSyncContext.Provider value={value}>
      {children}
    </AppStateSyncContext.Provider>
  );
}
