# Kodmigo Security Checklist

Yayın öncesi güvenlik kontrol listesi. Kod tarafında yapılanlar ve Supabase/Vercel panelinde manuel doğrulanması gerekenler.

## Kod tarafında yapılan güvenlik değişiklikleri

### Auth rate limit ve cooldown (UX)

- **Sign-in:** `lib/auth/login-attempts.ts` — normalized email başına localStorage (`kodmigo_login_attempts_${email}`). 5 başarısız denemeden sonra 5 dakika kilit. Kilitliyken Supabase `signInWithPassword` çağrılmaz. Başarılı girişte kayıt temizlenir.
- **Sign-up:** `lib/auth/signup-cooldown.ts` — başarılı kayıt sonrası 60 saniye cooldown (`kodmigo_signup_cooldown_${email}`). Cooldown süresince tekrar `signUp` gönderilmez.
- **Not:** Client-side cooldown UX korumasıdır; gerçek koruma Supabase Auth rate limit + CAPTCHA ile sağlanmalıdır.

### Form validation

- `lib/auth/validation.ts` — email normalize/validate, password kuralları (kayıt: min 8, max 72, boşluk-only yok).
- `lib/username.ts` — username 3–24 karakter, güvenli karakter seti, HTML/script riskli karakterler reddedilir.
- `components/auth/SignInForm.tsx`, `SignUpForm.tsx` — `isSubmitting`, çift submit engeli, normalized email.

### Auth hata mesajları

- `lib/auth/actions.ts` — `mapAuthError()` ile Türkçe, bilgi sızdırmayan mesajlar. Raw Supabase mesajları kullanıcıya gösterilmez (production).

### Kullanıcı girdisi render güvenliği

- Projede `dangerouslySetInnerHTML` kullanımı yok.
- Username text node olarak render edilir; `sanitizeDisplayUsername()` ile normalize edilir.
- Avatar data URL: sadece `image/jpeg|jpg|png|webp|gif` base64 kabul edilir (`lib/avatar.ts`).

### Security headers

- `next.config.ts` — X-Content-Type-Options, Referrer-Policy, X-Frame-Options, Permissions-Policy, CSP, production HSTS.

### CAPTCHA / hCaptcha hazırlığı

- `components/auth/HCaptchaWidget.tsx` — `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` varsa görünür hCaptcha widget'ı (`@hcaptcha/react-hcaptcha`) render edilir; yoksa auth akışı normal çalışır.
- Sign-in / sign-up Supabase çağrılarına `captchaToken` desteği eklendi.

### RLS (SQL referans)

- `supabase/user_app_state.sql` — RLS enabled, `auth.uid() = user_id` SELECT/INSERT/UPDATE/DELETE policies.

### Hesap izolasyonu

- `lib/userAppState.ts` — merge/sync mantığı hesap değişiminde eski veriyi taşımaz.
- `lib/appStateStorage.ts` — logout'ta `clearAllKodmigoLocalState()`.
- `upsertRemoteAppState` session user id ile eşleşme kontrolü.

---

## Supabase panelinde manuel kontrol

### Auth rate limits

1. **Authentication → Rate Limits** bölümünü aç.
2. Sign-in, sign-up ve email gönderim limitlerini gözden geçir.
3. Production trafiğine uygun değerler kullan.

### CAPTCHA / Bot protection

1. [hCaptcha](https://dashboard.hcaptcha.com/) — site oluştur, **site key** (public) ve **secret key** al.
2. **Supabase → Authentication → Bot and Abuse Protection → CAPTCHA** — hCaptcha etkinleştir, secret key gir.
3. Vercel env (Production): `NEXT_PUBLIC_HCAPTCHA_SITE_KEY=<site-key>`
4. `NEXT_PUBLIC_*` değişkenleri build zamanında inline edilir; env ekledikten sonra **yeni bir build** tetikle (mevcut build'i "redeploy" etmek yetmez).
5. CAPTCHA'yı Supabase'te açmadan önce frontend env'in deploy edildiğinden emin ol; aksi halde auth başarısız olur.

### RLS — user_app_state

SQL Editor'da çalıştır:

```sql
-- RLS açık mı?
select relname, relrowsecurity
from pg_class
where relname = 'user_app_state';

-- Policy listesi
select policyname, cmd, qual, with_check
from pg_policies
where tablename = 'user_app_state';
```

Beklenen:

- `relrowsecurity = true`
- SELECT / INSERT / UPDATE / DELETE policies: `auth.uid() = user_id`

Gerekirse `supabase/user_app_state.sql` dosyasını tekrar çalıştır.

### Redirect URLs

**Authentication → URL Configuration → Redirect URLs** şunları içermeli:

- `https://kodmigo.com/**`
- `https://www.kodmigo.com/**`
- `https://kodmigo.vercel.app/**`
- `http://localhost:3000/**` (geliştirme)

**Site URL:** `https://kodmigo.com`

### Service role key

- `service_role` key **asla** frontend'e, Vercel public env'e veya git'e eklenmemeli.
- Sadece güvenli backend/Edge Function ortamında kullanılmalı (Kodmigo MVP'de frontend-only).

### Custom SMTP (sonra)

- Supabase varsayılan email limitleri production için yetersiz olabilir.
- Resend / SendGrid / custom SMTP sonradan eklenecek.

---

## Vercel env kontrolü

Production ve Preview ortamlarında:

| Değişken | Public? | Zorunlu |
|----------|---------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Evet | Evet |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Evet | Evet |
| `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` | Evet | CAPTCHA açılınca |

**Olmaması gerekenler:** `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, herhangi bir secret/private key.

---

## Domain / DNS güvenlik notları

- Primary domain: `https://kodmigo.com`
- `www` → apex redirect tutarlı olmalı.
- Vercel SSL otomatik; HSTS header production'da aktif (`next.config.ts`).
- Eski `kodmigo.vercel.app` yedek olarak kalabilir; Supabase redirect listesinde tutulur.

---

## Environment / secret audit (kod taraması)

- Frontend'de `service_role`, `OPENAI`, `sk-` pattern bulunmadı.
- `process.env` kullanımı: yalnızca `NEXT_PUBLIC_SUPABASE_*` ve opsiyonel `NEXT_PUBLIC_HCAPTCHA_SITE_KEY`.
- `.env.example` gerçek secret içermiyor.
- `.env.local` gitignore'da olmalı (commitlenmemeli).

**Rotasyon:** Eğer geçmişte secret commitlendiyse veya sızdıysa ilgili key'leri rotate edin.

---

## Yayın öncesi smoke test

- [ ] Sign-in: yanlış şifre → genel hata mesajı
- [ ] Sign-in: 5 yanlış deneme → kilit mesajı, Supabase isteği yok
- [ ] Sign-in: başarılı → attempts temizlenir
- [ ] Sign-up: validation (email, username, password)
- [ ] Sign-up: cooldown / 429 → kullanıcı dostu mesaj
- [ ] Sign-up: mevcut email → giriş linki
- [ ] Logout → `/dashboard` → sign-in redirect
- [ ] Hesap A → logout → hesap B → veri karışmıyor
- [ ] Security headers production response'ta görünüyor
- [ ] `npm run validate:lessons` başarılı
- [ ] `npm run build` başarılı

---

## npm audit

Periyodik olarak:

```bash
npm audit --omit=dev
```

Breaking change riski olan otomatik major upgrade yapmayın; raporlayıp planlayın.
