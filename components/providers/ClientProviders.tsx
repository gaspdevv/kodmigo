"use client";

import { AppStateSyncProvider } from "@/components/providers/AppStateSyncProvider";
import type { ReactNode } from "react";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return <AppStateSyncProvider>{children}</AppStateSyncProvider>;
}
