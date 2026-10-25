/**
 * Riwayat rilis ApeironKit — satu sumber untuk /docs/changelog dan bagian "Pembaruan" di landing page.
 * Rilis baru cukup ditambahkan di paling atas array `releases`.
 *
 * Isi 1.5.5 diambil dari commit plugin (87eb2d8, e431849). 1.0.5 sampai 1.3.5 disusun dari git log plugin
 * (commit bump versi dan commit fitur di antaranya). 1.0.6 dan 1.0.7 hanya menaikkan nomor versi, jadi tidak dicatat.
 */
import type { IconName } from './icons'

export type ChangeType = 'baru' | 'peningkatan' | 'perbaikan' | 'performa'

export const changeTypes: Record<ChangeType, { label: string; icon: IconName }> = {
  baru: { label: 'Widget & fitur baru', icon: 'plus' },
  peningkatan: { label: 'Peningkatan', icon: 'zap' },
  perbaikan: { label: 'Perbaikan', icon: 'wrench' },
  performa: { label: 'Performa', icon: 'refresh' },
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
    // [GANTI] 1.6.5 masih menunggu rilis resmi plugin (header plugin masih 1.5.5).
    version: '1.6.5',
    highlights: [['layers', 'Widget baru Paralaks 2.5D'], ['play', 'Kamera 3D sinematik yang mengikuti scroll']],
    date: '2026-10-25',
    title: 'Paralaks 2.5D',
    summary: 'Widget ke-14: adegan scroll sinematik dengan kamera 3D yang menembus layer gambar, video, dan teks berkedalaman.',
    changes: [
      { type: 'baru', text: 'Widget Paralaks 2.5D: bingkai menempel di layar sementara kamera 3D berpindah adegan mengikuti scroll.', widget: 'paralaks-2-5d' },
      { type: 'baru', text: 'Enam jenis layer: Gambar, Video, Teks Langsung, Template Elementor, Bentuk / Gradasi, dan Container Elementor, masing-masing dengan kedalaman Z sendiri.', widget: 'paralaks-2-5d' },
      { type: 'baru', text: 'Animasi Layer per adegan (geser, skala, rotasi, opasitas, blur) dan teks yang muncul per baris, kata, atau huruf.', widget: 'paralaks-2-5d' },
      { type: 'baru', text: 'Gerak berulang, goyang tertiup angin saat scroll, efek partikel, serta kamera yang ikut kursor dan kemiringan HP.', widget: 'paralaks-2-5d' },
      { type: 'peningkatan', text: 'Paralaks bisa langsung memainkan adegan pertama saat Sampul dibuka, dan tombol #ds-next ikut memulai Tombol Audio.', widget: 'sampul' },
    ],
  },
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
    version: '1.3.5',
    highlights: [['mail', 'Form Order menyimpan draft secara otomatis'], ['clock', 'Masa simpan draft bisa 1 sampai 30 hari']],
    date: '2026-10-06',
    title: 'Draft otomatis Form Order',
    summary: 'Isian Form Order kini tersimpan otomatis di browser, jadi calon klien bisa melanjutkan pesanan tanpa mengisi ulang.',
    changes: [
      { type: 'peningkatan', text: 'Draft otomatis di Form Order: isian dan step terakhir tersimpan per form, lalu dipulihkan setelah halaman dimuat ulang.', widget: 'form-order' },
      { type: 'peningkatan', text: 'Masa penyimpanan draft bisa dipilih 1, 3, 7, 14, atau 30 hari, dan draft bisa dihapus otomatis setelah pesanan terkirim.', widget: 'form-order' },
      { type: 'peningkatan', text: 'Notifikasi opsional saat draft dipulihkan, tanggal dalam format Indonesia, dan indikator memuat yang lebih jelas di HP.', widget: 'form-order' },
      { type: 'peningkatan', text: 'Informasi pembaruan plugin di dashboard WordPress kini mengarah ke situs Apeiron.' },
    ],
  },
  {
    version: '1.2.5',
    highlights: [['mail', 'Widget baru Form Order untuk jasa undangan'], ['music', 'Musik mengalah saat video bersuara diputar']],
    date: '2026-10-03',
    title: 'Form Order dan sinkronisasi video',
    summary: 'Widget ke-11 untuk menerima pesanan jasa undangan, dan Tombol Audio yang menyesuaikan diri saat tamu memutar video.',
    changes: [
      { type: 'baru', text: 'Widget Form Order: form pesanan bertahap yang disusun lewat Step / Section Builder, dengan label, tipe, opsi, wajib diisi, dan lebar tiap field.', widget: 'form-order' },
      { type: 'baru', text: 'Ringkasan konfirmasi sebelum kirim, tombol Kembali dan Lanjut, serta pesan validasi yang bisa diubah.', widget: 'form-order' },
      { type: 'baru', text: 'Tab Form Order di dashboard ApeironKit untuk mengatur tujuan pengiriman pesanan dan Secret Key.', widget: 'form-order' },
      { type: 'peningkatan', text: 'Sinkronisasi Video di Tombol Audio: musik dijeda atau volumenya diturunkan saat video bersuara diputar. Video latar dan video tanpa suara diabaikan.', widget: 'tombol-audio' },
      { type: 'peningkatan', text: 'File Audio di Tombol Audio bisa diisi lewat Dynamic Tag; bila kosong atau tidak valid, file bawaan tetap dipakai.', widget: 'tombol-audio' },
    ],
  },
  {
    version: '1.1.5',
    highlights: [['refresh', 'Update plugin langsung dari dashboard WordPress'], ['chat', 'Popup Ucapan Tamu bisa di tengah atau bawah']],
    date: '2026-09-27',
    title: 'Pembaruan otomatis dan popup yang lebih luwes',
    summary: 'ApeironKit kini bisa diperbarui dari dashboard WordPress, popup Ucapan Tamu lebih mudah diatur, dan Sampul tampil tanpa kedipan.',
    changes: [
      { type: 'peningkatan', text: 'Versi baru ApeironKit kini muncul di halaman Plugin WordPress dan bisa dipasang seperti plugin lainnya.' },
      { type: 'peningkatan', text: 'Popup stiker serta popup balas dan edit di Ucapan Tamu bisa ditempatkan di tengah atau bawah layar.', widget: 'ucapan-tamu' },
      { type: 'peningkatan', text: 'Pilih apakah halaman tetap bisa digulir saat popup Ucapan Tamu terbuka, dan area mana yang ikut bergulir.', widget: 'ucapan-tamu' },
      { type: 'peningkatan', text: 'Opsi Interaksi Pengguna di Gulir Otomatis: tetap berjalan atau berhenti saat tamu menyentuh layar.', widget: 'gulir-otomatis' },
      { type: 'perbaikan', text: 'Sampul langsung menutupi halaman sejak awal dimuat, jadi isi undangan tidak sempat terlihat sebelum Sampul muncul.', widget: 'sampul' },
      { type: 'perbaikan', text: 'Status lisensi tetap terbaca saat server lisensi sedang tidak bisa dihubungi.' },
    ],
  },
  {
    version: '1.0.5',
    highlights: [['sparkle', 'Rilis perdana ApeironKit'], ['layers', '10 widget Elementor untuk undangan digital']],
    date: '2026-09-05',
    title: 'Rilis perdana',
    summary: 'Versi pertama ApeironKit: sepuluh widget Elementor untuk membuat undangan pernikahan digital, dari pembuka sampai ucapan tamu.',
    changes: [
      { type: 'baru', text: 'Widget pembuka: Sampul, Pemuat Halaman, Tombol Audio, dan Gulir Otomatis.' },
      { type: 'baru', text: 'Widget acara dan tamu: Hitung Mundur, Ucapan Tamu, Form WhatsApp, Manajemen Tamu, dan Aktivitas.' },
      { type: 'baru', text: 'Tombol Salin untuk nomor rekening atau alamat kirim hadiah.', widget: 'tombol-salin' },
      { type: 'baru', text: 'Dashboard ApeironKit untuk aktivasi lisensi dan menyalakan atau mematikan widget.' },
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
