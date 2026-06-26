# Kodmigo

**Kodmigo**, Türkçe konuşan sıfır seviye kullanıcılar için geliştirilen, oyunlaştırılmış bir Python öğrenme web uygulamasıdır.

Amaç; kullanıcıların uzun ve karmaşık kaynaklar arasında kaybolmadan, kısa görevler ve sade açıklamalarla Python öğrenmeye başlamasını sağlamaktır.

## Proje Durumu

Kodmigo şu anda MVP geliştirme aşamasındadır.

## İlk Kullanıcı Testi

- Kodmigo şu an MVP/beta aşamasındadır.
- Test amacı: onboarding, auth, ders akışı, XP/progress/streak, profil ve mobil deneyimi doğrulamak.
- Detaylı test listesi için [`USER_TEST_CHECKLIST.md`](./USER_TEST_CHECKLIST.md) dosyasına bakılabilir.

Tamamlanan ilk aşama:

- Mobil uyumlu landing page
- Ürün mesajı ve temel sayfa yapısı
- Vercel deployment

## Canlı Demo

Canlı demo linki:

```text
https://kodmigo.vercel.app/

```

## Ürün Vizyonu

Kodmigo, kullanıcıların Python öğrenmesini daha ulaşılabilir ve eğlenceli hale getirmeyi hedefler.

Planlanan temel özellikler:

- Kısa günlük Python dersleri
- Mini görevler ve pratik egzersizler
- XP ve seri sistemi
- Kullanıcı ilerleme takibi
- Migo adlı tilki maskot ile rehberlik
- Mini projelerle öğrenilenleri uygulama

## Kullanılan Teknolojiler

Bu aşamada kullanılan teknolojiler:

- Next.js
- TypeScript
- Tailwind CSS
- React
- Vercel

Henüz eklenmeyen ama ileride planlanan teknolojiler:

- Pyodide veya benzeri tarayıcı içi Python çalıştırma çözümü

## Ortam Değişkenleri

Yerel geliştirme için proje kökünde `.env.local` oluşturun (şablon: `.env.example`):

| Değişken | Açıklama |
|----------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase proje URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable (anon) key |

**Gerekmez / kullanılmaz:**

- `OPENAI_API_KEY`, `OPENAI_MODEL`, `NEXT_PUBLIC_OPENAI_API_KEY` — AI chat kaldırıldı
- `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_SECRET_KEY` — frontend'e eklenmemeli

`.env.local` dosyasını Git'e commit etmeyin (`.gitignore` ile hariç tutulur).

## Production Deploy Notları

### Vercel Environment Variables

Vercel proje ayarları → **Settings** → **Environment Variables**:

1. `NEXT_PUBLIC_SUPABASE_URL` — Supabase Dashboard → Project Settings → API
2. `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — aynı sayfadaki publishable key

Production, Preview ve Development ortamlarına ekleyin. Deploy sonrası yeniden build gerekir.

### Güvenlik

- `.env.local` GitHub'a gönderilmemeli.
- OpenAI API key gerekmez; ücretli AI chat sistemi kaldırıldı.
- Service role / secret key yalnızca güvenli sunucu ortamında kullanılmalı; bu projede frontend'de kullanılmaz.

### Supabase Auth — redirect checklist

Supabase Dashboard → **Authentication** → **URL Configuration**:

| Ayar | Değer |
|------|-------|
| **Site URL** | Production Vercel URL (ör. `https://your-vercel-domain.vercel.app`) |
| **Redirect URLs** | `http://localhost:3000`, `http://localhost:3000/**` |
| **Redirect URLs** | `https://your-vercel-domain.vercel.app`, `https://your-vercel-domain.vercel.app/**` |

Production domain henüz bilinmiyorsa placeholder kullanın; kod içine sabit domain yazmayın.

### Build komutu

```bash
npm run build
```

Başarılı build sonrası Vercel otomatik deploy edebilir veya `npm run start` ile yerelde production modunu test edebilirsiniz.

### Deploy sonrası test

Detaylı manuel test listesi: [`PRODUCTION_CHECKLIST.md`](./PRODUCTION_CHECKLIST.md)

## Proje Yapısı

```text
kodmigo/
├── app/
├── components/
├── public/
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md

```

## Not

Bu proje aktif geliştirme aşamasındadır. İlk hedef, yalnızca Python öğrenmeye odaklanan çalışan bir MVP oluşturmaktır.