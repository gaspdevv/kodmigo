import UpdatePasswordForm from "@/components/auth/UpdatePasswordForm";
import { Suspense } from "react";

export default function UpdatePasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-background">
          <p className="text-sm text-slate-500">Yükleniyor...</p>
        </main>
      }
    >
      <UpdatePasswordForm />
    </Suspense>
  );
}
