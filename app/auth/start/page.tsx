import { redirect } from "next/navigation";
import { AUTH_SIGN_UP_PATH } from "@/lib/auth/routes";

export default function AuthStartPage() {
  redirect(AUTH_SIGN_UP_PATH);
}
