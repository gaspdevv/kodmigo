# Kodmigo

**Kodmigo**, Türkçe konuşan sıfır seviye kullanıcılar için geliştirilen, oyunlaştırılmış bir Python öğrenme web uygulamasıdır.

Amaç; kullanıcıların uzun ve karmaşık kaynaklar arasında kaybolmadan, kısa görevler ve sade açıklamalarla Python öğrenmeye başlamasını sağlamaktır.

## Proje Durumu

Kodmigo şu anda MVP geliştirme aşamasındadır.

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

`.env.local` dosyasına aşağıdaki değerleri ekleyin (örnek için `.env.example` dosyasına bakın):

- `NEXT_PUBLIC_SUPABASE_URL` ve `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — Supabase auth ve veri senkronizasyonu

Deploy için Vercel Environment Variables içine de aynı değerleri ekleyin.

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