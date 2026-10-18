/**
 * Semua teks, link, dan harga landing page ada di sini.
 * Cukup ubah nilai di objek ini — markup dan animasi tidak perlu disentuh.
 *
 * Item bertanda [GANTI] masih contoh/placeholder.
 */
import type { IconName } from './icons'

type IconItem = [IconName, string]

const waNumber = '6285189865707' // nomor WhatsApp, format 62xxx tanpa + atau spasi
const waText = encodeURIComponent('Halo Apeiron, saya ingin minta demo ApeironKit.')

export const content = {
  links: {
    buy: '#harga', // [GANTI] link checkout
    demo: `https://wa.me/${waNumber}?text=${waText}`,
    live: '#', // [GANTI] link contoh undangan live
    docs: '#', // [GANTI] link dokumentasi (mis. https://domain-wordpress/doc/)
  },

  nav: [
    { label: 'Fitur', href: '#fitur' },
    { label: 'Cara Kerja', href: '#cara-kerja' },
    { label: 'Pembaruan', href: '#pembaruan' },
    { label: 'Harga', href: '#harga' },
    { label: 'FAQ', href: '#faq' },
  ],

  hero: {
    title: 'Undangan digital yang dikenang, dibuat dalam hitungan menit.',
    lead: 'ApeironKit memberi jasa undangan dan agency WordPress 13 widget siap pakai, dari sampul pembuka, RSVP, musik, sampai buku tamu. Semua diatur langsung dari Elementor, tanpa satu baris kode.',
    couple: 'Raka & Nadia',
    initials: 'R & N',
    date: 'Sabtu, 12 Desember 2026',
    guest: 'Bapak Andi Pratama',
  },

  marquee: [
    'Sampul Pembuka', 'Hitung Mundur', 'Cerita Cinta', 'RSVP', 'Buku Tamu',
    'Musik Latar', 'Amplop Digital', 'Daftar Hadiah', 'Manajemen Tamu',
    'Auto Scroll', 'Social Proof', 'Page Loader', 'Form Order',
  ],

  story: [
    'Klien ingin undangan yang berbeda dari yang lain.',
    'Tenggat selalu mepet, revisi tak ada habisnya.',
    'ApeironKit menjadikannya semudah menggeser slider.',
  ],

  // Babak "perjalanan undangan" — panel Elementor (kiri) + layar HP (kanan).
  journey: [
    {
      key: 'cover',
      label: 'Sampul',
      title: 'Kesan pertama yang membuat tamu berhenti menggulir.',
      text: 'Cover Classic: kertas lipat, pita, segel medali, dan label nama tamu yang terbuka seperti undangan sungguhan.',
      control: 'Gaya Sampul',
      value: 'Classic · Pita & Segel',
    },
    {
      key: 'countdown',
      label: 'Hitung Mundur',
      title: 'Setiap detik menuju hari bahagia, terasa hidup.',
      text: 'Countdown real-time dengan tipografi dan tata letak yang bisa diatur penuh.',
      control: 'Tanggal Acara',
      value: '12 Des 2026 · 09.00',
    },
    {
      key: 'music',
      label: 'Musik',
      title: 'Suasana yang terdengar, bukan hanya terlihat.',
      text: 'Soundscape Player memutar lagu pilihan dengan kontrol yang elegan dan ringan.',
      control: 'Lagu',
      value: 'Akad · Instrumental',
    },
    {
      key: 'rsvp',
      label: 'RSVP',
      title: 'Konfirmasi kehadiran langsung ke WhatsApp.',
      text: 'Signal Form mengirim nama dan jumlah tamu ke WhatsApp mempelai dengan format pesan yang rapi.',
      control: 'Nomor Tujuan WhatsApp',
      value: '0812 3456 7890',
    },
    {
      key: 'comment',
      label: 'Ucapan & Stiker',
      title: 'Ucapan yang hidup, lengkap dengan stiker.',
      text: 'Comment Dock menampilkan doa tamu dengan label kehadiran, stiker lucu, dan balasan mempelai.',
      control: 'Pustaka Stiker',
      value: 'Panda · 18 stiker',
    },
    {
      key: 'registry',
      label: 'Daftar Hadiah',
      title: 'Wedding registry tanpa hadiah kembar.',
      text: 'Tamu memilih hadiah, stok berkurang otomatis, dan semuanya tercatat di dashboard.',
      control: 'Daftar Hadiah',
      value: 'Rumah Baru · 12 item',
    },
  ],

  dashboard: {
    title: 'Wedding registry & order, tercatat rapi di satu dashboard.',
    lead: 'Setiap reservasi Daftar Hadiah dan pesanan dari widget Form Order otomatis masuk ke MDUNDIG, lengkap dengan tren, status, dan akses pelanggan.',
  },

  bento: {
    title: 'Semua yang dibutuhkan undangan modern, dalam satu plugin.',
    lead: 'Dirancang untuk alur kerja jasa undangan: cepat dibuat, mudah direvisi, dan memukau saat dibuka.',
  },

  audience: [
    {
      tag: 'Untuk Jasa Undangan',
      title: 'Terima lebih banyak order tanpa menambah tim.',
      points: [
        ['copy', 'Satu template untuk puluhan klien, cukup ganti teks dan warna'],
        ['tag', 'Nama tamu personal otomatis lewat link undangan'],
        ['mail', 'Form order bawaan untuk menerima pesanan baru'],
      ] as IconItem[],
    },
    {
      tag: 'Untuk Agency WordPress',
      title: 'Tambahkan layanan undangan ke portofolio Anda.',
      points: [
        ['layout', 'Native Elementor, tim Anda langsung paham'],
        ['code', 'Kode rapi, ringan, dan aman untuk banyak situs'],
        ['globe', 'Lisensi multi-situs dengan pembaruan rutin'],
      ] as IconItem[],
    },
  ],

  steps: [
    { icon: 'plug', title: 'Pasang plugin', text: 'Unggah ApeironKit, aktifkan lisensi, dan widget langsung muncul di Elementor.' },
    { icon: 'palette', title: 'Rancang di Elementor', text: 'Seret widget, atur warna, font, dan konten. Semua terlihat langsung.' },
    { icon: 'send', title: 'Bagikan ke tamu', text: 'Kirim link personal ke setiap tamu dan pantau RSVP yang masuk.' },
  ],

  stats: [
    { value: 13, suffix: '', label: 'Widget siap pakai' },
    { value: 0, suffix: '', label: 'Baris kode yang perlu ditulis' },
    { value: 100, suffix: '%', label: 'Diatur dari Elementor' },
  ],

  // [GANTI] isi dengan changelog asli setiap rilis. Format item: [ikon, teks].
  updates: [
    { version: '1.5.5', date: 'Okt 2026', items: [['wrench', 'Kontrol Typography Elementor kini benar-benar mengatur font yang tampil'], ['refresh', 'Nilai bawaan kontrol widget disetel ulang agar lebih rapi']] as IconItem[] },
    { version: '1.5.0', date: 'Sep 2026', items: [['gift', 'Widget Cerita Cinta dan Daftar Hadiah'], ['zap', 'Performa CSS lebih ringan']] as IconItem[] },
    { version: '1.4.0', date: 'Agu 2026', items: [['users', 'Guest Invitation Manager untuk nama tamu personal'], ['mail', 'Form Order untuk jasa undangan']] as IconItem[] },
    { version: '1.3.0', date: 'Jul 2026', items: [['music', 'Soundscape Player dengan kontrol yang lebih halus'], ['chat', 'Comment Dock kini mendukung stiker']] as IconItem[] },
    { version: '1.2.0', date: 'Jun 2026', items: [['layers', 'Cover Classic: pita, segel, dan label tamu'], ['clock', 'Countdown dengan tata letak baru']] as IconItem[] },
  ],

  // [GANTI] testimoni contoh — ganti dengan testimoni asli pelanggan.
  testimonials: [
    { quote: 'Dulu satu undangan butuh dua hari. Sekarang pagi pesan, sore sudah dikirim ke klien.', name: 'Nama Pelanggan', role: 'Jasa Undangan · Bandung' },
    { quote: 'Widget sampulnya paling sering bikin klien bilang "wah". Itu yang menjual.', name: 'Nama Pelanggan', role: 'Studio Undangan · Yogyakarta' },
    { quote: 'Tim kami langsung bisa pakai karena semuanya native Elementor.', name: 'Nama Pelanggan', role: 'Agency WordPress · Jakarta' },
    { quote: 'RSVP dan ucapan masuk rapi, klien bisa pantau sendiri. Revisi jauh berkurang.', name: 'Nama Pelanggan', role: 'Wedding Organizer · Surabaya' },
    { quote: 'Ringan dibuka di HP tamu, padahal animasinya banyak.', name: 'Nama Pelanggan', role: 'Jasa Undangan · Medan' },
    { quote: 'Update-nya rutin dan dokumentasinya jelas. Jarang sekali plugin lokal seperti ini.', name: 'Nama Pelanggan', role: 'Freelancer WordPress · Bali' },
  ],

  // [GANTI] harga dan isi paket.
  pricing: [
    {
      name: 'Personal',
      price: 'Rp 199rb',
      period: '/ tahun',
      desc: 'Untuk yang baru memulai jasa undangan.',
      features: [['globe', '1 situs'], ['layout', 'Semua widget'], ['refresh', 'Pembaruan 1 tahun'], ['mail', 'Dukungan via email']] as IconItem[],
      featured: false,
    },
    {
      name: 'Pro',
      price: 'Rp 499rb',
      period: '/ tahun',
      desc: 'Pilihan paling populer untuk jasa undangan.',
      features: [['globe', '5 situs'], ['layout', 'Semua widget'], ['refresh', 'Pembaruan 1 tahun'], ['chat', 'Dukungan prioritas WhatsApp']] as IconItem[],
      featured: true,
    },
    {
      name: 'Agency',
      price: 'Rp 999rb',
      period: '/ tahun',
      desc: 'Untuk agency dengan banyak klien.',
      features: [['infinity', 'Situs tanpa batas'], ['layout', 'Semua widget'], ['refresh', 'Pembaruan 1 tahun'], ['headset', 'Dukungan prioritas + onboarding']] as IconItem[],
      featured: false,
    },
  ],

  faq: [
    { q: 'Apakah wajib memakai Elementor?', a: 'Ya. ApeironKit adalah ekstensi Elementor, jadi Elementor (versi gratis sudah cukup) harus terpasang.' },
    { q: 'Apakah perlu bisa coding?', a: 'Tidak. Semua widget diatur lewat panel Elementor: warna, font, teks, dan animasi.' },
    { q: 'Bagaimana cara nama tamu tampil personal?', a: 'Guest Invitation Manager membuat link khusus per tamu, dan nama tamu otomatis tampil di sampul undangan.' },
    { q: 'Apa yang terjadi jika lisensi habis?', a: 'Plugin tetap berjalan di situs Anda. Perpanjang lisensi untuk terus mendapat pembaruan dan dukungan.' },
    { q: 'Bisakah saya minta demo dulu?', a: 'Tentu. Klik tombol "Minta Demo" dan tim kami akan menghubungi Anda lewat WhatsApp.' },
  ],

  cta: {
    title: 'Giliran klien Anda yang terkesan.',
    lead: 'Mulai buat undangan digital yang dikenang hari ini, atau minta demo dan lihat sendiri.',
  },
}

export type Content = typeof content
