import { Suspense } from "react";
import ConfirmedPageClient from "@/components/auth/ConfirmedPageClient";

export default function AuthConfirmedPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-background">
          <p className="text-sm text-slate-500">Yükleniyor...</p>
        </main>
      }
    >
      <ConfirmedPageClient />
    </Suspense>
  );
}
