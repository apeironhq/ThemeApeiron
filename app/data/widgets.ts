export type WidgetCategory = 'pembuka' | 'cerita' | 'tamu' | 'hadiah' | 'suasana'

export interface ApeirionWidget {
  id: string
  name: string
  icon: string
  category: WidgetCategory
  description: string
}

export const widgetCategories: Record<WidgetCategory, string> = {
  pembuka: 'Pembuka',
  cerita: 'Cerita & Waktu',
  tamu: 'Tamu & Interaksi',
  hadiah: 'Hadiah & Rekening',
  suasana: 'Suasana'
}

export const widgets: ApeirionWidget[] = [
  {
    id: 'cover',
    name: 'Cover',
    icon: 'BookOpen',
    category: 'pembuka',
    description: 'Sampul pembuka yang elegan, lengkap dengan nama pasangan dan tanggal acara.'
  },
  {
    id: 'page-loader',
    name: 'Page Loader',
    icon: 'Loader',
    category: 'pembuka',
    description: 'Layar pemuat yang halus sebelum undangan tampil utuh.'
  },
  {
    id: 'cerita-cinta',
    name: 'Cerita Cinta',
    icon: 'Heart',
    category: 'cerita',
    description: 'Kisah pasangan dalam alur yang rapi, dari pertemuan pertama hingga hari ini.'
  },
  {
    id: 'countdown',
    name: 'Countdown',
    icon: 'Timer',
    category: 'cerita',
    description: 'Hitung mundur menuju hari H yang selalu terlihat jelas.'
  },
  {
    id: 'guest-invitation',
    name: 'Guest Invitation Manager',
    icon: 'Users',
    category: 'tamu',
    description: 'Kelola undangan dan daftar tamu agar lebih tertata.'
  },
  {
    id: 'signal-form',
    name: 'Signal Form',
    icon: 'CalendarCheck',
    category: 'tamu',
    description: 'Formulir konfirmasi kehadiran yang sederhana untuk tamu.'
  },
  {
    id: 'form-order',
    name: 'Form Order',
    icon: 'ClipboardList',
    category: 'tamu',
    description: 'Formulir pemesanan untuk layanan atau paket yang kamu tawarkan.'
  },
  {
    id: 'comment-dock',
    name: 'Comment Dock',
    icon: 'MessageSquareText',
    category: 'tamu',
    description: 'Kolom ucapan dan doa yang tampil rapi dan mudah dibaca.'
  },
  {
    id: 'social-proof',
    name: 'Social Proof',
    icon: 'BadgeCheck',
    category: 'tamu',
    description: 'Tampilkan jejak interaksi tamu agar undangan terasa hidup.'
  },
  {
    id: 'daftar-hadiah',
    name: 'Daftar Hadiah',
    icon: 'Gift',
    category: 'hadiah',
    description: 'Daftar hadiah yang memudahkan tamu memilih kado.'
  },
  {
    id: 'clipboard-tap',
    name: 'Clipboard Tap',
    icon: 'Copy',
    category: 'hadiah',
    description: 'Salin nomor rekening atau alamat hanya dengan satu ketukan.'
  },
  {
    id: 'soundscape-player',
    name: 'Soundscape Player',
    icon: 'Music',
    category: 'suasana',
    description: 'Musik latar dengan pemutar yang tenang dan mudah dikendalikan.'
  },
  {
    id: 'auto-scroll',
    name: 'Auto Scroll',
    icon: 'ChevronsDown',
    category: 'suasana',
    description: 'Gulir otomatis agar tamu bisa menikmati undangan tanpa repot.'
  }
]
