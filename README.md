# ApeironKit — Landing Page

Landing page ApeironKit (plugin Elementor untuk undangan digital) versi Nuxt, siap
di-deploy ke Vercel. Ini port langsung dari landing page tema WordPress **ApeironTheme**:
markup, CSS (`app/assets/css/landing.css`), dan animasi GSAP (`app/assets/js/landing.js`)
sama persis, hanya tanpa WordPress sehingga jauh lebih ringan.

## Menjalankan di lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Build produksi

```bash
npm run build
npm run preview
```

Halaman `/` dirender jadi HTML statis saat build, lalu animasi GSAP dijalankan di browser.

## Deploy ke Vercel

1. Di Vercel, pilih **Add New → Project** lalu impor repo ini.
2. Framework terdeteksi otomatis sebagai **Nuxt**. Biarkan pengaturan bawaan.
3. Klik **Deploy**. Setiap push ke `main` akan ter-deploy ulang otomatis.

## Mengubah isi

Semua teks, link, nomor WhatsApp, changelog, testimoni, harga, dan FAQ ada di
`app/data/content.ts`. Item bertanda `[GANTI]` masih contoh:

- `links.buy` (link checkout), `links.live` (contoh undangan), `links.docs` (dokumentasi)
- `testimonials` dan `pricing` masih placeholder, ganti dengan data asli sebelum dipublikasikan.

## Struktur

- `app/pages/index.vue`: susunan section dan pemanggilan animasi
- `app/components/Landing*.vue`: satu file per section (hero, journey, dashboard, dst.)
- `app/data/icons.ts`: ikon garis yang sama dengan tema WordPress
- `public/img`: tekstur kertas dan stiker
