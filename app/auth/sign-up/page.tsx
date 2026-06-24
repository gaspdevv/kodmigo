import SignUpForm from "@/components/auth/SignUpForm";
import { Suspense } from "react";

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-background">
          <p className="text-sm text-slate-500">Yükleniyor...</p>
        </main>
      }
    >
      <SignUpForm />
    </Suspense>
  );
}
