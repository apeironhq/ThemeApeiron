/**
 * Riwayat rilis ApeironKit — satu sumber untuk /docs/changelog dan bagian "Pembaruan" di landing page.
 * Rilis baru cukup ditambahkan di paling atas array `releases`.
 *
 * Isi 1.5.5 diambil dari commit plugin (87eb2d8, e431849).
 * [GANTI] Rilis bertanda `draft: true` masih contoh lama dari landing page — ganti dengan catatan asli.
 */
import type { IconName } from './icons'

export type ChangeType = 'baru' | 'peningkatan' | 'perbaikan' | 'performa'

export const changeTypes: Record<ChangeType, { label: string; icon: IconName; tone: number }> = {
  baru: { label: 'Widget & fitur baru', icon: 'plus', tone: 0 },
  peningkatan: { label: 'Peningkatan', icon: 'zap', tone: 1 },
  perbaikan: { label: 'Perbaikan', icon: 'wrench', tone: 2 },
  performa: { label: 'Performa', icon: 'refresh', tone: 3 },
}

export interface Change { type: ChangeType; text: string; widget?: string } // widget = slug di /docs
export interface Release {
  version: string
  date: string // YYYY-MM-DD (perkiraan bila hanya bulan diketahui)
  title: string
  summary: string
  changes: Change[]
  highlights: [IconName, string][] // 2 poin ringkas untuk landing page
  draft?: boolean
}

export const releases: Release[] = [
  {
    version: '1.5.5',
    highlights: [['wrench', 'Kontrol Typography Elementor kini benar-benar mengatur font yang tampil'], ['refresh', 'Nilai bawaan kontrol widget disetel ulang agar lebih rapi']],
    date: '2026-08-24',
    title: 'Tipografi yang benar-benar bekerja',
    summary: 'Kontrol Typography Elementor kini mengubah font yang tampil di semua widget, nilai bawaan kontrol diseragamkan, dan beberapa perbaikan stabilitas.',
    changes: [
      { type: 'peningkatan', text: 'Pilihan Font Family di tab Gaya › Typography kini benar-benar mengubah font yang tampil, termasuk pada elemen di dalam widget.' },
      { type: 'peningkatan', text: 'Tombol Salin dan Aktivitas kini punya pilihan Font Family yang sebelumnya tersembunyi.', widget: 'tombol-salin' },
      { type: 'peningkatan', text: 'Kontrol tipografi baru untuk kartu penerima Sampul, angka kecepatan Gulir Otomatis, dan pesan status Tombol Audio.', widget: 'sampul' },
      { type: 'peningkatan', text: 'Nilai bawaan kontrol diseragamkan antar-widget: sudut 8px, ukuran dan bobot judul serta keterangan, warna garis tepi yang lebih terbaca.' },
      { type: 'peningkatan', text: 'Label kontrol memakai kata "dan" alih-alih simbol "&" agar lebih mudah dibaca.' },
      { type: 'perbaikan', text: 'Hitung Mundur tetap berjalan walau skrip dimuat tertunda oleh plugin optimasi.', widget: 'hitung-mundur' },
      { type: 'perbaikan', text: 'Ukuran dan bobot nama penerima di Sampul kini bisa diatur.', widget: 'sampul' },
      { type: 'perbaikan', text: 'Tombol tutup popup Aktivitas tidak lagi bulat sendiri, kini serasi dengan widget lain.', widget: 'aktivitas' },
      { type: 'performa', text: 'Pemuat Halaman tidak lagi memuat Google Fonts dari luar; font sudah disajikan dari situs Anda.', widget: 'pemuat-halaman' },
      { type: 'performa', text: 'Stylesheet Sampul dirampingkan sekitar 23% dengan membuang aturan yang tidak terpakai.', widget: 'sampul' },
    ],
  },
  {
    version: '1.5.0',
    highlights: [['gift', 'Widget Cerita Cinta dan Daftar Hadiah'], ['zap', 'Performa CSS lebih ringan']],
    date: '2026-07-01',
    title: 'Cerita Cinta dan Daftar Hadiah',
    summary: 'Dua widget baru untuk perjalanan cinta mempelai dan wishlist hadiah yang terhubung ke MDUNDIG.',
    draft: true,
    changes: [
      { type: 'baru', text: 'Widget Cerita Cinta: timeline scrapbook dengan foto dan penanda bergerak.', widget: 'cerita-cinta' },
      { type: 'baru', text: 'Widget Daftar Hadiah: reservasi hadiah tanpa hadiah kembar, tercatat di MDUNDIG.', widget: 'daftar-hadiah' },
      { type: 'performa', text: 'CSS widget lebih ringan.' },
    ],
  },
  {
    version: '1.4.0',
    highlights: [['users', 'Manajemen Tamu untuk nama tamu personal'], ['mail', 'Form Order untuk jasa undangan']],
    date: '2026-06-01',
    title: 'Manajemen Tamu dan Form Order',
    summary: 'Link undangan pribadi untuk tiap tamu, dan form pesanan bertahap untuk jasa undangan.',
    draft: true,
    changes: [
      { type: 'baru', text: 'Widget Manajemen Tamu untuk link dan nama tamu personal.', widget: 'manajemen-tamu' },
      { type: 'baru', text: 'Widget Form Order untuk menerima pesanan jasa undangan.', widget: 'form-order' },
    ],
  },
  {
    version: '1.3.0',
    highlights: [['music', 'Tombol Audio dengan kontrol yang lebih halus'], ['chat', 'Ucapan Tamu kini mendukung stiker']],
    date: '2026-05-01',
    title: 'Audio dan stiker ucapan',
    summary: 'Kontrol pemutar musik yang lebih halus dan stiker di Ucapan Tamu.',
    draft: true,
    changes: [
      { type: 'peningkatan', text: 'Tombol Audio dengan kontrol yang lebih halus.', widget: 'tombol-audio' },
      { type: 'baru', text: 'Ucapan Tamu kini mendukung stiker.', widget: 'ucapan-tamu' },
    ],
  },
  {
    version: '1.2.0',
    highlights: [['layers', 'Sampul: pita, segel, dan label tamu'], ['clock', 'Hitung Mundur dengan tata letak baru']],
    date: '2026-04-01',
    title: 'Sampul Classic',
    summary: 'Sampul dengan pita, segel, dan label tamu, serta tata letak baru Hitung Mundur.',
    draft: true,
    changes: [
      { type: 'baru', text: 'Sampul: pita, segel, dan label tamu.', widget: 'sampul' },
      { type: 'peningkatan', text: 'Hitung Mundur dengan tata letak baru.', widget: 'hitung-mundur' },
    ],
  },
]

export const latest = releases[0]!
export const releaseId = (v: string) => `v${v.replace(/\./g, '-')}`

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
export function releaseDate(iso: string, long = false) {
  const [y, m, d] = iso.split('-').map(Number)
  if (!long) return `${months[m! - 1]} ${y}`
  const full = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
  return `${d} ${full[m! - 1]} ${y}`
}
