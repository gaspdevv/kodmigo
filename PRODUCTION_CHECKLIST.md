# Production Test Checklist

Deploy öncesi ve sonrası manuel kontrol listesi.

**Production URL:** https://kodmigo.vercel.app

## Vercel ve ortam

- [ ] Vercel Environment Variables içine `NEXT_PUBLIC_SUPABASE_URL` eklendi
- [ ] Vercel Environment Variables içine `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` eklendi
- [ ] `.env.local` GitHub'a gönderilmedi
- [ ] OpenAI API key gerekmez — AI chat sistemi kaldırıldı
- [ ] Production deploy başarılı

## Supabase Auth — URL Configuration

Supabase Dashboard → **Authentication** → **URL Configuration**

- [ ] **Site URL:** `https://kodmigo.vercel.app`
- [ ] **Redirect URLs** — localhost geliştirme:
  - `http://localhost:3000`
  - `http://localhost:3000/**`
- [ ] **Redirect URLs** — production:
  - `https://kodmigo.vercel.app`
  - `https://kodmigo.vercel.app/**`
- [ ] Supabase Auth redirect ayarları production URL ile kontrol edildi

## Supabase E-posta doğrulama (MVP — Custom SMTP yok)

- [ ] Email template özelleştirmesi yapılmıyor (Custom SMTP gerekir; MVP'de kullanılmıyor)
- [ ] Varsayılan Supabase confirmation e-postası kullanılıyor
- [ ] Kayıtta `emailRedirectTo` → `/auth/confirmed` ayarlı
- [ ] **Site URL** production domain (`https://kodmigo.vercel.app`)
- [ ] **Redirect URLs** içinde production ve localhost URL'leri var
- [ ] Doğrulama linki tıklanınca `/auth/confirmed` başarı ekranı açılıyor (ana sayfaya değil)

## Auth ve onboarding akışı

- [ ] Landing CTA → `/auth/start`
- [ ] Var olan kullanıcı `/auth/start` → giriş → dashboard (onboarding atlanır)
- [ ] Yeni kullanıcı `/auth/start` → onboarding → sign-up
- [ ] Onboarding tamamlanmadan `/auth/sign-up` formu açılmıyor

## Auth ve sayfalar

- [ ] Landing (`/`) açılıyor
- [ ] Sign-up (`/auth/sign-up`) çalışıyor
- [ ] Kayıt sonrası e-posta doğrulama mesajı net görünüyor
- [ ] Doğrulama sonrası `/auth/confirmed` ekranı görünüyor
- [ ] Sign-in (`/auth/sign-in`) çalışıyor
- [ ] Dashboard (`/dashboard`) açılıyor

## Veri ve ilerleme

- [ ] Bir ders tamamlanınca XP / progress / streak güncelleniyor
- [ ] Profil avatar ve username çalışıyor
- [ ] `localStorage.clear()` sonrası tekrar girişte veriler Supabase'den geri geliyor
- [ ] Aynı ders tekrarında XP tekrar verilmiyor
- [ ] Hesap karışması bug fix test edildi (farklı hesaplar birbirinin verisini almıyor)

## Mobil kısa kontrol

- [ ] `/dashboard` — taşma yok, alt navigation çakışmıyor
- [ ] `/learn/python` — taşma yok
- [ ] `/lesson/[lessonId]` — taşma yok
- [ ] `/profile` — taşma yok
- [ ] Mobil bottom navigation yazıları kontrol edildi (Ana Sayfa, Yol, Profil)

## İlk kullanıcı testi

- [ ] İlk kullanıcı testi için [`USER_TEST_CHECKLIST.md`](./USER_TEST_CHECKLIST.md) kullanılacak

## Güvenlik ve kalıntı

- [ ] OpenAI / API billing hatası görünmüyor
- [ ] `SUPABASE_SERVICE_ROLE_KEY` veya `SUPABASE_SECRET_KEY` frontend'de yok
- [ ] `app/api/ai-chat` ve `app/api/ai-hint` route'ları yok

## Korunması gereken sistemler

Aşağıdakiler deploy sonrası da çalışmalı:

- `/`, `/auth/start`, `/onboarding`, `/auth/sign-in`, `/auth/sign-up`, `/auth/confirmed`
- `/dashboard`, `/learn/python`, `/lesson/[lessonId]`, `/profile`, `/settings`, `/streak-rescue`
- Supabase Auth, `user_app_state` sync, XP, streak, streak rescue
- Profil fotoğrafı, username, rozet sistemi
- Stage theme, ses efektleri, alt navigation, auth guard
- Migo mini projesi (Tanışma Kartı)
- OpenAI / AI chat sistemi geri gelmemiş olmalı
