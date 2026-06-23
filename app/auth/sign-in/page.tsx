import SignInForm from "@/components/auth/SignInForm";
import { Suspense } from "react";

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-background">
          <p className="text-sm text-slate-500">Yükleniyor...</p>
        </main>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
