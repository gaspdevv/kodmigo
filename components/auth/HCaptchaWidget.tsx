"use client";

import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useEffect, useRef } from "react";
import {
  CAPTCHA_EXPIRED_MESSAGE,
  CAPTCHA_WIDGET_FAILED_MESSAGE,
} from "@/lib/auth/actions";

export type HCaptchaFailureReason = "error" | "expired";

type HCaptchaWidgetProps = {
  onTokenChange: (token: string | null) => void;
  onVerified?: () => void;
  onFailure?: (reason: HCaptchaFailureReason, message: string) => void;
};

/**
 * NEXT_PUBLIC_* değişkenleri client bundle'a build zamanında inline edilir.
 * Anahtarı doğrudan client component içinde okumak, Vercel production'da
 * en güvenilir yoldur (server prop zinciri gerektirmez).
 */
export function getHCaptchaSiteKey(): string | null {
  const key = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY?.trim();
  return key ? key : null;
}

export function isHCaptchaEnabled(): boolean {
  return Boolean(getHCaptchaSiteKey());
}

export default function HCaptchaWidget({
  onTokenChange,
  onVerified,
  onFailure,
}: HCaptchaWidgetProps) {
  const siteKey = getHCaptchaSiteKey();
  const captchaRef = useRef<HCaptcha>(null);

  useEffect(() => {
    if (siteKey) return;

    // Anahtar eksikse widget sessizce kaybolmasın; konsola sızıntısız uyarı bırak.
    console.warn(
      "[hCaptcha] NEXT_PUBLIC_HCAPTCHA_SITE_KEY tanımlı değil; güvenlik doğrulaması render edilmiyor.",
    );
  }, [siteKey]);

  if (!siteKey) {
    return null;
  }

  return (
    <div className="flex min-h-[78px] justify-center">
      <HCaptcha
        ref={captchaRef}
        sitekey={siteKey}
        theme="light"
        onVerify={(token) => {
          onTokenChange(token);
          onVerified?.();
        }}
        onExpire={() => {
          onTokenChange(null);
          onFailure?.("expired", CAPTCHA_EXPIRED_MESSAGE);
          captchaRef.current?.resetCaptcha();
        }}
        onError={() => {
          onTokenChange(null);
          onFailure?.("error", CAPTCHA_WIDGET_FAILED_MESSAGE);
          captchaRef.current?.resetCaptcha();
        }}
      />
    </div>
  );
}
