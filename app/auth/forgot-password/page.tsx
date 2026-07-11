import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { Suspense } from "react";

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-background">
          <p className="text-sm text-slate-500">Yükleniyor...</p>
        </main>
      }
    >
      <ForgotPasswordForm />
    </Suspense>
  );
}
