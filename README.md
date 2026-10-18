# Apeiron — Landing Page

Landing page resmi ApeironKit (widget undangan digital untuk Elementor), dibuat dengan
Nuxt 4, Tailwind CSS v4, dan GSAP. Versi ringan dari landing page di tema WordPress
ApeironTheme, siap di-deploy ke Vercel.

## Menjalankan di lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Build produksi

```bash
npm run build
node .output/server/index.mjs
```

## Deploy ke Vercel

1. Di Vercel, pilih **Add New → Project** lalu impor repo ini.
2. Framework terdeteksi otomatis sebagai **Nuxt**. Biarkan pengaturan bawaan
   (build command `nuxt build`, output `.output`).
3. Klik **Deploy**. Setiap push ke `main` akan ter-deploy ulang otomatis.

## Mengubah isi

- Teks, menu, FAQ, dan langkah: `app/data/content.ts`
- Nomor WhatsApp dan link: `app/data/site.ts`
- Daftar widget: `app/data/widgets.ts`
- Testimoni dan harga: `app/data/testimonials.ts`, `app/data/pricing.ts`.
  Selama array-nya kosong, section tersebut tidak ditampilkan, jadi isi hanya dengan
  data asli.

## Pengujian

```bash
npm run test:e2e
```
