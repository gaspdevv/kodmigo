# Production Test Checklist

Deploy öncesi ve sonrası manuel kontrol listesi.

## Vercel ve ortam

- [ ] Vercel Environment Variables içine `NEXT_PUBLIC_SUPABASE_URL` eklendi
- [ ] Vercel Environment Variables içine `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` eklendi
- [ ] `.env.local` GitHub'a gönderilmedi
- [ ] OpenAI API key gerekmez — AI chat sistemi kaldırıldı
- [ ] Production deploy başarılı

## Supabase Auth — URL Configuration

Supabase Dashboard → **Authentication** → **URL Configuration**

- [ ] **Site URL:** production Vercel URL (ör. `https://your-vercel-domain.vercel.app`)
- [ ] **Redirect URLs** — localhost geliştirme:
  - `http://localhost:3000`
  - `http://localhost:3000/**`
- [ ] **Redirect URLs** — production:
  - `https://your-vercel-domain.vercel.app`
  - `https://your-vercel-domain.vercel.app/**`

> Gerçek production domain bilinmiyorsa placeholder kullanın; kod içine sabit domain yazmayın.

## Auth ve sayfalar

- [ ] Landing (`/`) açılıyor
- [ ] Sign-up (`/auth/sign-up`) çalışıyor
- [ ] E-posta doğrulama yönlendirmesi çalışıyor (e-posta onayı açıksa)
- [ ] Sign-in (`/auth/sign-in`) çalışıyor
- [ ] Dashboard (`/dashboard`) açılıyor

## Veri ve ilerleme

- [ ] Bir ders tamamlanınca XP / progress / streak güncelleniyor
- [ ] Profil avatar ve username çalışıyor
- [ ] `localStorage.clear()` sonrası tekrar girişte veriler Supabase'den geri geliyor
- [ ] Aynı ders tekrarında XP tekrar verilmiyor

## Mobil kısa kontrol

- [ ] `/dashboard` — taşma yok, alt navigation çakışmıyor
- [ ] `/learn/python` — taşma yok
- [ ] `/lesson/[lessonId]` — taşma yok
- [ ] `/profile` — taşma yok

## Güvenlik ve kalıntı

- [ ] OpenAI / API billing hatası görünmüyor
- [ ] `SUPABASE_SERVICE_ROLE_KEY` veya `SUPABASE_SECRET_KEY` frontend'de yok
- [ ] `app/api/ai-chat` ve `app/api/ai-hint` route'ları yok

## Korunması gereken sistemler

Aşağıdakiler deploy sonrası da çalışmalı:

- `/`, `/onboarding`, `/auth/sign-in`, `/auth/sign-up`
- `/dashboard`, `/learn/python`, `/lesson/[lessonId]`, `/profile`, `/settings`, `/streak-rescue`
- Supabase Auth, `user_app_state` sync, XP, streak, streak rescue
- Profil fotoğrafı, username, rozet sistemi
- Stage theme, ses efektleri, alt navigation, auth guard
- Migo mini projesi (Tanışma Kartı)
- OpenAI / AI chat sistemi geri gelmemiş olmalı
