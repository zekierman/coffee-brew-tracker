# Brew Log

Nitelikli kahve demleme günlüğü. Çekirdek künyesi, ekipman, öğütüm tıkı, su sıcaklığı,
demleme süresi ve tadım notlarını kaydedip geçmiş demlemeleri filtrelemek için.

## Yığın

Next.js (App Router) · Tailwind CSS · shadcn/ui · Drizzle ORM · PostgreSQL · Auth.js

## Lokal kurulum

```bash
npm install
cp .env.example .env        # AUTH_SECRET doldur: openssl rand -base64 32
docker compose up -d        # PostgreSQL (host portu 5434)
npx drizzle-kit migrate     # semayi uygula
npm run dev                 # http://localhost:3000
```

Postgres host portu 5432 yerine **5434**: geliştirme makinesinde 5432'yi native bir
PostgreSQL servisi, 5433'ü başka bir proje kullanıyor.

## Komutlar

| Komut | İş |
| --- | --- |
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Prodüksiyon derlemesi |
| `npm run db:generate` | Şema değişikliğinden SQL migration üret |
| `npx drizzle-kit migrate` | Migration'ları veritabanına uygula |
| `npm run db:studio` | Drizzle Studio |
| `npx tsx --test src/lib/*.test.ts` | Testler |

## Veri modeli

`users` · `equipment` (grinder/dripper/kettle/scale/filter/other) · `coffee_beans`
(ülke, bölge, çiftlik, varyete, işleme, kavurma tarihi, kavurucu) · `brews` (öğütüm
tıkı, su sıcaklığı, doz, su, süre, 1-5 puan) · `tasting_notes` (aroma, tat, asitlik,
gövde, tatlılık, aftertaste)

Her kayıt `user_id` ile kullanıcıya bağlı; sorgular bu alanla filtrelenir.
