"use client";

import { useEffect } from "react";
import { subscribeAppStateRefresh } from "@/lib/appStateEvents";

export function useAppStateRefresh(onRefresh: () => void): void {
  useEffect(() => subscribeAppStateRefresh(onRefresh), [onRefresh]);
}
