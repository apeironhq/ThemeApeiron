const waText = encodeURIComponent('Halo Apeiron, saya ingin minta demo ApeironKit.')

export const site = {
  name: 'Apeiron',
  product: 'ApeironKit',
  tagline: 'Plugin Elementor untuk undangan digital',
  portalUrl: 'https://portal-apeiron.web.id/',
  whatsappUrl: 'https://wa.me/6285189865707',
  demoRequestUrl: `https://wa.me/6285189865707?text=${waText}`,
  telegramUrl: 'https://t.me/Apeiron_id',
  // Ganti dengan tautan contoh undangan WordPress yang sudah live.
  liveDemoUrl: '#fitur'
} as const

/** Data contoh untuk mockup undangan. */
export const sample = {
  couple: 'Raka & Nadia',
  initials: 'R & N',
  dateLabel: 'Sabtu, 12 Desember 2026',
  eventDate: '2026-12-12T09:00:00+07:00',
  guest: 'Bapak Andi Pratama',
  venue: 'Gedung Sasana, Bandung'
} as const
