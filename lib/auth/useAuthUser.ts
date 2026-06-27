"use client";

import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getAuthUsername } from "@/lib/username";

type AuthState = {
  user: User | null;
  username: string | null;
  loading: boolean;
  isConfigured: boolean;
};

export function useAuthUser(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const isConfigured = supabase !== null;

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const syncUser = (nextUser: User | null) => {
      if (!isMounted) return;
      setUser(nextUser);
      setLoading(false);
    };

    void supabase.auth.getSession().then(({ data: { session } }) => {
      syncUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      syncUser(session?.user ?? null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  return {
    user,
    username: getAuthUsername(user?.user_metadata),
    loading,
    isConfigured,
  };
}
