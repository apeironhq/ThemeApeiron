/**
 * Semua teks, link, dan harga landing page ada di sini.
 * Cukup ubah nilai di objek ini — markup dan animasi tidak perlu disentuh.
 *
 * Item bertanda [GANTI] masih contoh/placeholder.
 */
import type { IconName } from './icons'
import { widgets } from './widgets'

type IconItem = [IconName, string]

const waNumber = '6285189865707' // nomor WhatsApp, format 62xxx tanpa + atau spasi
const waText = encodeURIComponent('Halo Apeiron, saya ingin minta demo ApeironKit.')

export const content = {
  links: {
    buy: '#harga', // [GANTI] link checkout
    demo: `https://wa.me/${waNumber}?text=${waText}`,
    live: '#', // [GANTI] link contoh undangan live
    docs: '/docs', // dokumentasi widget (app/pages/docs)
  },

  nav: [
    { label: 'Fitur', href: '#fitur' },
    { label: 'Cara Kerja', href: '#cara-kerja' },
    { label: 'Pembaruan', href: '#pembaruan' },
    { label: 'Harga', href: '#harga' },
    { label: 'FAQ', href: '#faq' },
  ],

  hero: {
    title: 'ApeironKit, plugin untuk kebutuhan undangan digital.',
    lead: 'Buat, kelola, dan bagikan undangan digital langsung dari Elementor di WordPress. Dibuat untuk jasa undangan dan agency yang ingin mengerjakan undangan klien lebih cepat, tanpa coding.',
    couple: 'Raka & Nadia',
    initials: 'R & N',
    date: 'Sabtu, 12 Desember 2026',
    guest: 'Bapak Andi Pratama',
  },

  marquee: [
    // Nama sesuai judul widget di panel Elementor.
    'Sampul', 'Hitung Mundur', 'Tombol Audio', 'Form WhatsApp', 'Ucapan Tamu',
    'Daftar Hadiah', 'Manajemen Tamu', 'Tombol Salin', 'Cerita Cinta',
    'Form Order', 'Aktivitas', 'Gulir Otomatis', 'Pemuat Halaman',
  ],

  story: [
    'Membuat undangan digital dari nol itu lama.',
    'Klien ingin sampul cantik, musik, RSVP, dan nama tamu.',
    'ApeironKit menyiapkan semuanya sebagai widget Elementor.',
  ],

  // Babak "perjalanan undangan" — panel Elementor (kiri) + layar HP (kanan).
  journey: [
    {
      key: 'cover',
      label: 'Sampul',
      title: 'Kesan pertama yang membuat tamu berhenti menggulir.',
      text: 'Widget Sampul: kertas lipat, pita, segel medali, dan label nama tamu yang terbuka seperti undangan sungguhan.',
      control: 'Gaya Sampul',
      value: 'Classic · Pita & Segel',
    },
    {
      key: 'countdown',
      label: 'Hitung Mundur',
      title: 'Setiap detik menuju hari bahagia, terasa hidup.',
      text: 'Widget Hitung Mundur menampilkan hari, jam, menit, dan detik secara real-time dengan tata letak yang bisa diatur penuh.',
      control: 'Tanggal Acara',
      value: '12 Des 2026 · 09.00',
    },
    {
      key: 'music',
      label: 'Tombol Audio',
      title: 'Suasana yang terdengar, bukan hanya terlihat.',
      text: 'Tombol Audio memutar lagu latar pilihan dengan kontrol putar dan jeda yang elegan dan ringan.',
      control: 'Lagu',
      value: 'Akad · Instrumental',
    },
    {
      key: 'rsvp',
      label: 'Form WhatsApp',
      title: 'Konfirmasi kehadiran langsung ke WhatsApp mempelai.',
      text: 'Form WhatsApp menyusun nama, jumlah tamu, dan ucapan menjadi pesan yang rapi, lalu membukanya di WhatsApp mempelai.',
      control: 'Nomor Tujuan WhatsApp',
      value: '0812 3456 7890',
      dest: { icon: 'chat', text: 'Masuk ke WhatsApp mempelai' },
    },
    {
      key: 'comment',
      label: 'Ucapan Tamu',
      title: 'Ucapan yang hidup, lengkap dengan stiker.',
      text: 'Ucapan Tamu menampilkan doa tamu dengan label kehadiran, stiker, dan balasan mempelai.',
      control: 'Pustaka Stiker',
      value: 'Panda · 18 stiker',
      dest: { icon: 'layout', text: 'Tersimpan di WordPress Anda' },
    },
    {
      key: 'registry',
      label: 'Daftar Hadiah',
      title: 'Wedding registry tanpa hadiah kembar.',
      text: 'Tamu memilih hadiah dan stok berkurang otomatis, jadi tidak ada hadiah kembar. Setiap reservasi tercatat di dashboard MDUNDIG.',
      control: 'Koneksi MDUNDIG',
      value: 'Terhubung · Token aktif',
      dest: { icon: 'gift', text: 'Tercatat di dashboard MDUNDIG' },
    },
  ],

  dashboard: {
    title: 'MDUNDIG, dashboard untuk mengelola hadiah dan pesanan.',
    lead: 'MDUNDIG adalah dashboard pendamping ApeironKit. Setiap reservasi dari widget Daftar Hadiah dan setiap pesanan dari Form Order otomatis tercatat di sana, lengkap dengan status, ekspor PDF atau CSV, dan akses untuk klien Anda.',
    // Ke mana data tiap widget pergi. Hanya Daftar Hadiah & Form Order yang masuk MDUNDIG.
    flow: [
      { icon: 'chat', widget: 'Form WhatsApp', what: 'Konfirmasi kehadiran', to: 'WhatsApp mempelai', toIcon: 'send' },
      { icon: 'heart', widget: 'Ucapan Tamu', what: 'Doa, stiker & kehadiran', to: 'WordPress Anda', toIcon: 'layout' },
      { icon: 'gift', widget: 'Daftar Hadiah & Form Order', what: 'Reservasi hadiah & pesanan', to: 'Dashboard MDUNDIG', toIcon: 'book', mdundig: true },
    ] as { icon: IconName; widget: string; what: string; to: string; toIcon: IconName; mdundig?: boolean }[],
  },

  bento: {
    title: 'Satu plugin untuk seluruh isi undangan.',
    lead: 'Tidak perlu memasang banyak plugin terpisah. Widget ApeironKit dibuat untuk alur kerja jasa undangan: cepat dibuat, mudah direvisi, dan ringan dibuka di HP tamu.',
    // Urutan fitur di jalur animasi. "art" menentukan ilustrasi yang tampil.
    features: [
      { art: 'all', title: 'Satu plugin, semua widget undangan', text: 'Semua widget undangan dalam satu plugin yang saling melengkapi, tanpa menumpuk banyak plugin berbeda.' },
      { art: 'wish', title: 'Ucapan & kehadiran, di situs Anda', text: 'Ucapan Tamu merangkum doa, stiker, dan label kehadiran tamu. Datanya tersimpan di WordPress Anda sendiri.' },
      { art: 'guest', title: 'Nama tamu personal', text: 'Manajemen Tamu membuat link khusus untuk setiap tamu, dan namanya tampil otomatis di sampul.' },
      { art: 'rsvp', title: 'RSVP langsung ke WhatsApp', text: 'Tamu mengisi Form WhatsApp, pesan tersusun rapi, lalu terkirim ke WhatsApp mempelai tanpa langkah tambahan.' },
      { art: 'license', title: 'Lisensi & pembaruan aman', text: 'Aktivasi lisensi resmi, lalu pembaruan rutin datang langsung dari dashboard WordPress.' },
    ],
  },

  audience: [
    {
      tag: 'Jasa Undangan Digital',
      title: 'Buat undangan klien lebih cepat, terima lebih banyak order.',
      points: [
        ['copy', 'Simpan satu desain, pakai ulang untuk banyak klien'],
        ['tag', 'Link nama tamu otomatis untuk setiap undangan'],
        ['mail', 'Form Order dan Aktivitas untuk halaman jualan Anda'],
      ] as IconItem[],
    },
    {
      tag: 'Agency & Freelancer WordPress',
      title: 'Tambahkan layanan undangan digital untuk klien Anda.',
      points: [
        ['layout', 'Native Elementor, tidak perlu belajar builder baru'],
        ['code', 'Kode rapi, ringan, dan aman untuk banyak situs'],
        ['globe', 'Lisensi multi-situs dengan pembaruan rutin'],
      ] as IconItem[],
    },
  ],

  steps: [
    { icon: 'plug', title: 'Pasang plugin', text: 'Unggah ApeironKit, aktifkan lisensi, dan widget langsung muncul di Elementor.' },
    { icon: 'palette', title: 'Rancang di Elementor', text: 'Seret widget, atur warna, font, dan konten. Semua terlihat langsung.' },
    { icon: 'send', title: 'Bagikan ke tamu', text: 'Kirim link personal ke setiap tamu. Konfirmasi kehadiran masuk langsung ke WhatsApp mempelai.' },
  ],

  stats: [
    // Jumlah widget dihitung dari data/widgets.ts, jadi ikut bertambah saat ada widget baru.
    { value: widgets.length, suffix: '', label: 'Widget siap pakai' },
    { value: 0, suffix: '', label: 'Baris kode yang perlu ditulis' },
    { value: 100, suffix: '%', label: 'Diatur dari Elementor' },
  ],

  // [GANTI] isi dengan changelog asli setiap rilis. Format item: [ikon, teks].
  updates: [
    { version: '1.5.5', date: 'Okt 2026', items: [['wrench', 'Kontrol Typography Elementor kini benar-benar mengatur font yang tampil'], ['refresh', 'Nilai bawaan kontrol widget disetel ulang agar lebih rapi']] as IconItem[] },
    { version: '1.5.0', date: 'Sep 2026', items: [['gift', 'Widget Cerita Cinta dan Daftar Hadiah'], ['zap', 'Performa CSS lebih ringan']] as IconItem[] },
    { version: '1.4.0', date: 'Agu 2026', items: [['users', 'Manajemen Tamu untuk nama tamu personal'], ['mail', 'Form Order untuk jasa undangan']] as IconItem[] },
    { version: '1.3.0', date: 'Jul 2026', items: [['music', 'Tombol Audio dengan kontrol yang lebih halus'], ['chat', 'Ucapan Tamu kini mendukung stiker']] as IconItem[] },
    { version: '1.2.0', date: 'Jun 2026', items: [['layers', 'Sampul: pita, segel, dan label tamu'], ['clock', 'Hitung Mundur dengan tata letak baru']] as IconItem[] },
  ],

  // [GANTI] testimoni contoh — ganti dengan testimoni asli pelanggan.
  testimonials: [
    { quote: 'Dulu satu undangan butuh dua hari. Sekarang pagi pesan, sore sudah dikirim ke klien.', name: 'Nama Pelanggan', role: 'Jasa Undangan · Bandung' },
    { quote: 'Widget sampulnya paling sering bikin klien bilang "wah". Itu yang menjual.', name: 'Nama Pelanggan', role: 'Studio Undangan · Yogyakarta' },
    { quote: 'Tim kami langsung bisa pakai karena semuanya native Elementor.', name: 'Nama Pelanggan', role: 'Agency WordPress · Jakarta' },
    { quote: 'Konfirmasi tamu langsung masuk WhatsApp, ucapan tampil rapi di undangan. Revisi jauh berkurang.', name: 'Nama Pelanggan', role: 'Wedding Organizer · Surabaya' },
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
    { q: 'Apa itu ApeironKit?', a: 'ApeironKit adalah plugin untuk kebutuhan undangan digital. Plugin ini menambahkan widget khusus undangan ke Elementor di WordPress, jadi Anda cukup menyusun undangan dengan seret dan atur, lalu membagikan link-nya ke tamu.' },
    { q: 'Siapa yang cocok memakai ApeironKit?', a: 'Jasa undangan digital, agency, dan freelancer WordPress yang membuat undangan untuk klien. Pasangan yang membuat undangannya sendiri di WordPress juga bisa memakainya.' },
    { q: 'Apakah wajib memakai Elementor?', a: 'Ya. ApeironKit adalah ekstensi Elementor, jadi Elementor (versi gratis sudah cukup) harus terpasang.' },
    { q: 'Apakah perlu bisa coding?', a: 'Tidak. Semua widget diatur lewat panel Elementor: warna, font, teks, dan animasi.' },
    { q: 'Bagaimana cara nama tamu tampil personal?', a: 'Widget Manajemen Tamu membuat link khusus per tamu, dan nama tamu otomatis tampil di sampul undangan.' },
    { q: 'Data apa saja yang masuk ke MDUNDIG?', a: 'Hanya data widget Daftar Hadiah dan Form Order. Konfirmasi RSVP dikirim ke WhatsApp mempelai, sedangkan Ucapan Tamu tersimpan di WordPress Anda.' },
    { q: 'Apa yang terjadi jika lisensi habis?', a: 'Plugin tetap berjalan di situs Anda. Perpanjang lisensi untuk terus mendapat pembaruan dan dukungan.' },
    { q: 'Bisakah saya minta demo dulu?', a: 'Tentu. Klik tombol "Tanya via WhatsApp" di bawah, tim kami akan membalas dan menyiapkan demo untuk Anda.' },
  ],

  cta: {
    title: 'Mulai buat undangan lebih cepat.',
    lead: 'Pasang ApeironKit di WordPress Anda hari ini, atau baca dokumentasi untuk melihat cara kerja setiap widget.',
  },
}

export type Content = typeof content
