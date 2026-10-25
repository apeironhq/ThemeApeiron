/**
 * Daftar widget ApeironKit, urut seperti di panel Elementor (kategori "Apeiron Kit").
 * Ikon = SVG asli plugin (assets/icon/*.svg dan eicon Elementor), dipecah per bagian
 * (kelas wi-*) agar tiap bagian bisa dianimasikan.
 */
export interface WidgetItem {
  key: string
  title: string
  desc: string
  dest?: string // ke mana datanya pergi (hanya widget yang menyimpan/mengirim data)
  icon: string // isi <svg viewBox="0 0 24 24">
}

export const widgets: WidgetItem[] = [
  {
    key: 'countdown',
    title: 'Hitung Mundur',
    desc: 'Hari, jam, menit, dan detik menuju acara, berjalan real-time.',
    icon: '<circle cx="12" cy="14" r="8"/><path class="wi-hand" d="M12 10v4l2 2"/><g class="wi-crown"><path d="M10 2h4"/><path d="M12 2v2"/></g><path d="M20.5 5.5l-1.5 1.5"/>',
  },
  {
    key: 'audio',
    title: 'Tombol Audio',
    desc: 'Lagu latar dari Media Library atau YouTube dengan tombol putar dan jeda yang elegan.',
    icon: '<circle class="wi-ring" cx="12" cy="12" r="10"/><polygon class="wi-play" points="10,8 16,12 10,16"/>',
  },
  {
    key: 'form',
    title: 'Form WhatsApp',
    desc: 'RSVP yang menyusun nama, jumlah tamu, dan ucapan menjadi pesan rapi.',
    dest: 'Masuk ke WhatsApp mempelai',
    icon: '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect class="wi-clip" x="8" y="2" width="8" height="4" rx="1"/><line class="wi-line" x1="9" y1="12" x2="15" y2="12"/><line class="wi-line" x1="9" y1="16" x2="13" y2="16"/>',
  },
  {
    key: 'order',
    title: 'Form Order',
    desc: 'Form pesanan bertahap untuk jasa undangan: data mempelai, acara, dan paket.',
    dest: 'Tercatat di dashboard MDUNDIG',
    icon: '<rect class="wi-win" x="3" y="4" width="18" height="11" rx="1.5"/><path class="wi-line" d="M6 8h12"/><path class="wi-line" d="M6 11.5h7"/><rect class="wi-btn" x="3" y="17.5" width="8" height="3.5" rx="1.75"/>',
  },
  {
    key: 'copy',
    title: 'Tombol Salin',
    desc: 'Tamu menyalin nomor rekening atau alamat dengan satu ketukan, lalu muncul tanda berhasil.',
    icon: '<path class="wi-back" d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/><rect class="wi-front" x="9" y="9" width="13" height="13" rx="2"/>',
  },
  {
    key: 'comment',
    title: 'Ucapan Tamu',
    desc: 'Doa dan ucapan tamu lengkap dengan stiker, label kehadiran, dan balasan mempelai.',
    dest: 'Tersimpan di WordPress Anda',
    icon: '<path class="wi-bubble" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line class="wi-line" x1="9" y1="10" x2="15" y2="10"/><line class="wi-line" x1="9" y1="14" x2="13" y2="14"/>',
  },
  {
    key: 'manager',
    title: 'Manajemen Tamu',
    desc: 'Link undangan khusus per tamu, sehingga nama tamu tampil otomatis di sampul.',
    icon: '<g class="wi-p1"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></g><g class="wi-p2"><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></g>',
  },
  {
    key: 'scroll',
    title: 'Gulir Otomatis',
    desc: 'Undangan bergulir sendiri dengan kecepatan yang bisa diatur tamu, enak dibaca santai.',
    icon: '<rect x="6" y="3" width="12" height="18" rx="6"/><line class="wi-wheel" x1="12" y1="7" x2="12" y2="10"/>',
  },
  {
    key: 'activity',
    title: 'Aktivitas',
    desc: 'Popup kecil seperti "Andi baru saja memesan" untuk meyakinkan calon klien.',
    icon: '<g class="wi-bell"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></g><circle class="wi-dot" cx="18" cy="4" r="3"/>',
  },
  {
    key: 'loader',
    title: 'Pemuat Halaman',
    desc: 'Animasi singkat selama undangan dimuat, agar tamu tidak melihat halaman setengah jadi.',
    icon: '<circle cx="12" cy="12" r="8.25" opacity=".28"/><path class="wi-arc" d="M20.25 12a8.25 8.25 0 0 0-8.25-8.25"/><path class="wi-check" d="M8.75 12.35 11 14.6l4.25-5.1"/>',
  },
  {
    key: 'cover',
    title: 'Sampul',
    desc: 'Kesan pertama: kertas lipat, pita, segel, dan nama tamu yang terbuka saat segel diklik.',
    icon: '<path d="M4 5.75c0-.97.78-1.75 1.75-1.75h12.5c.97 0 1.75.78 1.75 1.75v12.5c0 .97-.78 1.75-1.75 1.75H5.75C4.78 20 4 19.22 4 18.25V5.75Z"/><path class="wi-cross" d="M12 4v16M4 12h16"/><g class="wi-seal"><circle cx="12" cy="12" r="3.25" fill="currentColor"/><path d="M8.75 12h6.5" stroke="#fff" stroke-width="1.2"/></g>',
  },
  {
    key: 'story',
    title: 'Cerita Cinta',
    desc: 'Perjalanan mempelai dari awal bertemu hingga lamaran, dalam timeline foto.',
    icon: '<rect class="wi-node" x="1.5" y="10" width="4.5" height="4" rx="1"/><path class="wi-branch" d="M6 12h2.5M8.5 6v12M8.5 6h4M8.5 12h4M8.5 18h4"/><rect class="wi-node" x="12.5" y="4" width="8" height="4" rx="1"/><rect class="wi-node" x="12.5" y="10" width="8" height="4" rx="1"/><rect class="wi-node" x="12.5" y="16" width="8" height="4" rx="1"/>',
  },
  {
    key: 'registry',
    title: 'Daftar Hadiah',
    desc: 'Katalog hadiah dengan stok otomatis, jadi tidak ada hadiah kembar.',
    dest: 'Tercatat di dashboard MDUNDIG',
    icon: '<g class="wi-box"><rect x="3" y="3" width="8" height="8" rx="1"/><path d="M5.5 8.5 7 6.5l1.5 2"/></g><g class="wi-box"><rect x="13" y="3" width="8" height="8" rx="1"/><path d="M15.5 8.5 17 6.5l1.5 2"/></g><g class="wi-box"><rect x="3" y="13" width="8" height="8" rx="1"/><path d="M5.5 18.5 7 16.5l1.5 2"/></g><g class="wi-box"><rect x="13" y="13" width="8" height="8" rx="1"/><path d="M15.5 18.5 17 16.5l1.5 2"/></g>',
  },
  {
    key: 'parallax',
    title: 'Paralaks 2.5D',
    desc: 'Adegan scroll sinematik: kamera 3D bergerak menembus layer gambar, video, dan teks yang berkedalaman.',
    icon: '<path class="wi-l1" d="M12 3.5 21 8l-9 4.5L3 8l9-4.5Z"/><path class="wi-l2" d="m4.5 12 7.5 3.75L19.5 12"/><path class="wi-l3" d="m4.5 16 7.5 3.75L19.5 16" opacity=".55"/>',
  },
]
