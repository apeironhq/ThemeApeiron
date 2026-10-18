export const hero = {
  eyebrow: 'Plugin Elementor untuk undangan digital',
  title: 'Undangan digital yang dikenang, dibuat dalam hitungan menit.',
  lead: 'ApeironKit memberi jasa undangan dan agency WordPress 13 widget siap pakai, dari sampul pembuka, RSVP, musik, sampai buku tamu. Semua diatur langsung dari Elementor, tanpa satu baris kode.'
}

export const marquee = [
  'Sampul Pembuka',
  'Hitung Mundur',
  'Cerita Cinta',
  'RSVP',
  'Buku Tamu',
  'Musik Latar',
  'Amplop Digital',
  'Daftar Hadiah',
  'Manajemen Tamu',
  'Auto Scroll',
  'Social Proof',
  'Page Loader',
  'Form Order'
]

export const story = [
  'Klien ingin undangan yang berbeda dari yang lain.',
  'Tenggat selalu mepet, revisi tak ada habisnya.',
  'ApeironKit menjadikannya semudah menggeser slider.'
]

export type JourneyKey = 'cover' | 'countdown' | 'music' | 'rsvp' | 'comment' | 'registry'

export const journey: {
  key: JourneyKey
  label: string
  title: string
  text: string
  control: string
  value: string
}[] = [
  {
    key: 'cover',
    label: 'Sampul',
    title: 'Kesan pertama yang membuat tamu berhenti menggulir.',
    text: 'Cover Classic: kertas lipat, pita, segel medali, dan label nama tamu yang terbuka seperti undangan sungguhan.',
    control: 'Gaya Sampul',
    value: 'Classic · Pita & Segel'
  },
  {
    key: 'countdown',
    label: 'Hitung Mundur',
    title: 'Setiap detik menuju hari bahagia, terasa hidup.',
    text: 'Countdown real-time dengan tipografi dan tata letak yang bisa diatur penuh.',
    control: 'Tanggal Acara',
    value: '12 Des 2026 · 09.00'
  },
  {
    key: 'music',
    label: 'Musik',
    title: 'Suasana yang terdengar, bukan hanya terlihat.',
    text: 'Soundscape Player memutar lagu pilihan dengan kontrol yang elegan dan ringan.',
    control: 'Lagu',
    value: 'Akad · Instrumental'
  },
  {
    key: 'rsvp',
    label: 'RSVP',
    title: 'Konfirmasi kehadiran langsung ke WhatsApp.',
    text: 'Signal Form mengirim nama dan jumlah tamu ke WhatsApp mempelai dengan format pesan yang rapi.',
    control: 'Nomor Tujuan WhatsApp',
    value: '0812 3456 7890'
  },
  {
    key: 'comment',
    label: 'Ucapan & Stiker',
    title: 'Ucapan yang hidup, lengkap dengan stiker.',
    text: 'Comment Dock menampilkan doa tamu dengan label kehadiran, stiker lucu, dan balasan mempelai.',
    control: 'Pustaka Stiker',
    value: 'Panda · 18 stiker'
  },
  {
    key: 'registry',
    label: 'Daftar Hadiah',
    title: 'Wedding registry tanpa hadiah kembar.',
    text: 'Tamu memilih hadiah, stok berkurang otomatis, dan semuanya tercatat di dashboard.',
    control: 'Daftar Hadiah',
    value: 'Rumah Baru · 12 item'
  }
]

export const audience = [
  {
    tag: 'Untuk jasa undangan',
    title: 'Terima lebih banyak order tanpa menambah tim.',
    points: [
      { icon: 'Copy', text: 'Satu template untuk puluhan klien, cukup ganti teks dan warna' },
      { icon: 'Tag', text: 'Nama tamu personal otomatis lewat link undangan' },
      { icon: 'Inbox', text: 'Form order bawaan untuk menerima pesanan baru' }
    ]
  },
  {
    tag: 'Untuk agency WordPress',
    title: 'Tambahkan layanan undangan ke portofolio Anda.',
    points: [
      { icon: 'LayoutTemplate', text: 'Native Elementor, tim Anda langsung paham' },
      { icon: 'Code', text: 'Kode rapi dan ringan untuk banyak situs' },
      { icon: 'RefreshCw', text: 'Pembaruan rutin untuk setiap widget' }
    ]
  }
]

export const stats = [
  { value: 13, suffix: '', label: 'Widget siap pakai' },
  { value: 0, suffix: '', label: 'Baris kode yang perlu ditulis' },
  { value: 100, suffix: '%', label: 'Diatur dari Elementor' }
]

export const steps = [
  {
    icon: 'Plug',
    title: 'Pasang plugin',
    text: 'Unggah ApeironKit ke WordPress. Masukkan API Key, lalu aktifkan License Key, dan widget langsung muncul di Elementor.'
  },
  {
    icon: 'Palette',
    title: 'Rancang di Elementor',
    text: 'Seret widget, atur warna, font, dan konten. Setiap perubahan terlihat saat itu juga.'
  },
  {
    icon: 'Send',
    title: 'Bagikan ke tamu',
    text: 'Kirim link personal ke setiap tamu, lalu pantau RSVP dan ucapan yang masuk.'
  }
]

export const faq = [
  {
    q: 'Apakah wajib memakai Elementor?',
    a: 'Ya. ApeironKit adalah ekstensi Elementor, jadi Elementor (versi gratis sudah cukup) harus terpasang.'
  },
  {
    q: 'Apakah perlu bisa coding?',
    a: 'Tidak. Semua widget diatur lewat panel Elementor: warna, font, teks, dan animasi.'
  },
  {
    q: 'Bagaimana cara nama tamu tampil personal?',
    a: 'Guest Invitation Manager membuat link khusus per tamu, dan nama tamu otomatis tampil di sampul undangan.'
  },
  {
    q: 'Bagaimana cara mengaktifkan lisensi?',
    a: 'Masukkan API Key terlebih dahulu. Setelah API Key tersambung, baru aktifkan License Key. Lisensi tidak akan aktif jika API Key belum terhubung.'
  },
  {
    q: 'Bagaimana cara mendapatkan lisensi?',
    a: 'Daftar dan checkout di portal-apeiron.web.id dengan email yang sama. Sertakan screenshot bukti transaksi agar validasi lebih cepat. Jika masih menunggu, hubungi admin lewat WhatsApp atau Telegram.'
  }
]

export const cta = {
  title: 'Giliran klien Anda yang terkesan.',
  lead: 'Mulai buat undangan digital yang dikenang hari ini, atau minta demo dan lihat sendiri.'
}
