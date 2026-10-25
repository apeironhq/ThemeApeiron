/**
 * Isi dokumentasi /docs untuk setiap widget ApeironKit.
 *
 * Nama kontrol, pilihan, dan grup Gaya diambil dari kode plugin (Registers*Controls.php),
 * jadi istilah di sini sama persis dengan yang tampil di panel Elementor.
 * Penjelasannya diringkas agar mudah dibaca.
 */

export type DocCategory = 'pembuka' | 'acara' | 'tamu' | 'hadiah'

export const categories: { key: DocCategory | 'semua'; label: string }[] = [
  { key: 'semua', label: 'Semua' },
  { key: 'pembuka', label: 'Pembuka & Suasana' },
  { key: 'acara', label: 'Info Acara' },
  { key: 'tamu', label: 'Interaksi Tamu' },
  { key: 'hadiah', label: 'Hadiah & Pesanan' },
]

/** [nama kontrol, penjelasan, jenis] */
export type DocControl = [string, string, string]

export interface DocKnob {
  key: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'toggle' | 'range' | 'datetime'
  value: string | number | boolean
  options?: string[]
  min?: number
  max?: number
  step?: number
  unit?: string
}

export interface DocWidget {
  slug: string
  key: string // ikon di data/widgets.ts
  cat: DocCategory
  title: string
  tagline: string
  intro: string
  dest?: string
  mdundig?: boolean
  perks: { icon: string; title: string; text: string }[]
  steps: { title: string; text: string; focus: string }[]
  knobs: DocKnob[] // nilai awal pratinjau di panggung "cara pakai"
  content: { title: string; items: DocControl[] }[]
  style: string[]
  tips: { q: string; a: string }[]
  checklist: string[]
  features?: { icon: string; title: string; text: string }[]
  limits?: string[]
}

/** Label jenis kontrol Elementor, ditampilkan sebagai badge kecil. */
export const controlTypes: Record<string, string> = {
  text: 'Teks', area: 'Paragraf', select: 'Pilihan', switch: 'Saklar', slider: 'Slider', number: 'Angka',
  media: 'Gambar', gallery: 'Galeri', icon: 'Ikon', color: 'Warna', url: 'Link', date: 'Tanggal',
  choose: 'Perataan', repeater: 'Daftar',
}

export const docs: DocWidget[] = [
  /* ------------------------------------------------------------------ Sampul */
  {
    slug: 'sampul', key: 'cover', cat: 'pembuka', title: 'Sampul',
    tagline: 'Pembuka undangan bergaya gatefold dengan pita, segel, dan nama tamu.',
    intro: 'Sampul menutupi layar saat undangan pertama kali dibuka. Dua panel membuka ke samping seperti kartu cetak, pita turun, lalu tamu masuk ke isi undangan.',
    perks: [
      { icon: 'layers', title: 'Gatefold dua panel', text: 'Panel kiri dan kanan membuka seperti kartu undangan cetak, lengkap dengan pita dan lingkaran segel di tengah.' },
      { icon: 'users', title: 'Nama tamu otomatis', text: 'Membaca nama dari link ?to=Nama atau /to/Nama, lalu menampilkannya di kartu penerima.' },
      { icon: 'music', title: 'Membuka jalan untuk musik', text: 'Tombol Buka menjadi sentuhan pertama tamu, sehingga Tombol Audio boleh langsung berputar.' },
      { icon: 'zap', title: 'Aksi setelah terbuka', text: 'Bisa mengirim event JS, mengklik elemen tertentu, atau menggulir ke section pilihan.' },
    ],
    steps: [
      { title: 'Letakkan di paling atas', text: 'Cari "Sampul" di panel Elementor dan seret ke section pertama. Widget menutupi layar sampai tamu menekan tombol buka.', focus: 'frame' },
      { title: 'Isi teks mempelai', text: 'Di Konten › Teks, isi Label Acara, Nama Pertama, Pemisah Nama, Nama Kedua, dan Tanggal Acara.', focus: 'names' },
      { title: 'Aktifkan kartu penerima', text: 'Nyalakan Ambil Nama dari URL. Link ?to=Budi%20Santoso akan menampilkan "Budi Santoso" di kartu penerima.', focus: 'guest' },
      { title: 'Atur cara membuka', text: 'Di Animasi dan Interaksi, pilih Animasi Panel dan Transisi Akhir, lalu sesuaikan durasinya.', focus: 'open' },
    ],
    knobs: [
      { key: 'first', label: 'Nama Pertama', type: 'text', value: 'Raka' },
      { key: 'second', label: 'Nama Kedua', type: 'text', value: 'Nadia' },
      { key: 'guest', label: 'Nama tamu (?to=)', type: 'text', value: 'Budi Santoso' },
      { key: 'anim', label: 'Animasi Panel', type: 'select', value: 'Bergeser ke Samping', options: ['Bergeser ke Samping', 'Menyusut ke Samping'] },
    ],
    content: [
      { title: 'Aset Cover', items: [
        ['Tipe Sampul', 'Pilih desain sampul. Pilihan ini hanya berlaku untuk undangan ini.', 'select'],
        ['Pattern Panel', 'Gambar motif untuk kedua panel yang membuka.', 'media'],
        ['Background Belakang', 'Opsional. Jika kosong, pattern panel dipakai sebagai latar.', 'media'],
        ['Tampilkan Ornamen Atas', 'Ornamen dekoratif di bagian atas panel, dengan gambar sendiri.', 'switch'],
        ['Tampilkan Foto Cover', 'Foto mempelai di dalam sampul.', 'switch'],
      ] },
      { title: 'Teks', items: [
        ['Label Acara', 'Teks kecil di atas nama, misalnya "The Wedding of".', 'text'],
        ['Nama Pertama · Pemisah Nama · Nama Kedua', 'Nama kedua mempelai dan pemisahnya, misalnya "&".', 'text'],
        ['Tanggal Acara', 'Tanggal yang tampil di bawah nama.', 'text'],
        ['Teks / Logo Lingkaran Tengah', 'Isi segel di tengah. Teks dipakai jika Logo Lingkaran dimatikan.', 'text'],
        ['Tombol Buka', 'Teks tombol untuk membuka undangan.', 'text'],
        ['Teks Nama di Pita', 'Kosongkan untuk menyembunyikan. Token: {primary}, {secondary}, {separator}, {names}.', 'text'],
        ['Strip Tengah', 'Teks vertikal atas dan bawah di strip tengah, memakai token yang sama.', 'switch'],
      ] },
      { title: 'Kartu Penerima', items: [
        ['Tampilkan Kartu Penerima', 'Kartu berisi nama tamu yang diundang.', 'switch'],
        ['Ambil Nama dari URL', 'Membaca nama tamu dari link undangan.', 'switch'],
        ['Parameter Tamu', 'Nama parameter di link. Contoh: ?to=Nama%20Tamu. Format /to/Nama%20Tamu juga dibaca.', 'text'],
        ['Nama Penerima / Fallback', 'Nama yang tampil jika link tidak membawa nama tamu.', 'text'],
      ] },
      { title: 'Animasi dan Interaksi', items: [
        ['Animasi Panel', 'Bergeser ke Samping atau Menyusut ke Samping. Saat Strip Tengah aktif, otomatis bergeser.', 'select'],
        ['Transisi Akhir', 'Modal Turun, Modal Naik, Fade Out, atau Tanpa Transisi.', 'select'],
        ['Durasi Pita Turun · Panel Terbuka · Transisi Akhir', 'Atur tempo tiap tahap animasi pembuka.', 'slider'],
        ['Kunci Scroll Saat Cover Aktif', 'Tamu tidak bisa menggulir sebelum sampul dibuka.', 'switch'],
        ['Tampil Sekali per Pengunjung', 'Sampul hanya muncul di kunjungan pertama (disimpan di LocalStorage).', 'switch'],
        ['Nama Event JS · Klik Selector · Scroll ke Selector', 'Aksi opsional setelah sampul selesai terbuka.', 'text'],
      ] },
    ],
    style: ['Layer dan Background', 'Layer Welcome', 'Panel Cover', 'Pita', 'Lingkaran Tengah', 'Tombol Buka', 'Kartu Penerima'],
    tips: [
      { q: 'Nama tamu tidak muncul di kartu', a: 'Pastikan Ambil Nama dari URL aktif dan link memakai parameter yang sama dengan isian Parameter Tamu (bawaan: to). Pakai Manajemen Tamu agar link dibuat otomatis.' },
      { q: 'Sampul muncul lagi setiap halaman dibuka', a: 'Itu perilaku bawaan. Aktifkan Tampil Sekali per Pengunjung jika sampul cukup muncul di kunjungan pertama.' },
    ],
    checklist: ['Widget ada di section paling atas', 'Nama mempelai dan tanggal sudah diisi', 'Pattern panel sudah dipilih', 'Link dengan ?to=Nama sudah dicoba', 'Sudah dicek di HP'],
  },

  /* ----------------------------------------------------------- Hitung Mundur */
  {
    slug: 'hitung-mundur', key: 'countdown', cat: 'acara', title: 'Hitung Mundur',
    tagline: 'Hari, jam, menit, dan detik menuju acara, berjalan real-time.',
    intro: 'Hitung Mundur menghitung sisa waktu menuju acara secara langsung di browser tamu, lalu menampilkan pesan pilihan Anda saat waktunya tiba.',
    perks: [
      { icon: 'clock', title: 'Real-time sampai detik', text: 'Angka berganti setiap detik dengan transisi halus yang bisa diatur durasi dan easing-nya.' },
      { icon: 'calendar', title: 'Ikut zona waktu situs', text: 'Waktu target mengikuti timezone WordPress di Settings › General, jadi tidak meleset.' },
      { icon: 'layout', title: 'Horizontal atau vertikal', text: 'Pilih arah tampilan, sembunyikan unit yang tidak perlu, dan tambahkan pemisah seperti ":".' },
      { icon: 'sparkle', title: 'Pesan saat selesai', text: 'Saat waktu habis, timer berganti menjadi pesan, misalnya "Acara sedang berlangsung".' },
    ],
    steps: [
      { title: 'Tambahkan widget', text: 'Cari "Hitung Mundur" dan letakkan di dekat informasi acara.', focus: 'frame' },
      { title: 'Tentukan waktu acara', text: 'Isi Tanggal dan Waktu Selesai di Konten › Waktu Target.', focus: 'date' },
      { title: 'Pilih unit yang tampil', text: 'Di Unit Waktu, nyalakan atau matikan Hari, Jam, Menit, dan Detik, lalu ganti labelnya bila perlu.', focus: 'units' },
      { title: 'Rapikan tampilannya', text: 'Atur Arah Tampilan dan Kotak Angka di tab Gaya. Aktifkan Pemisah jika ingin ada ":" di antara angka.', focus: 'style' },
    ],
    knobs: [
      { key: 'date', label: 'Tanggal dan Waktu Selesai', type: 'datetime', value: '' },
      { key: 'seconds', label: 'Tampilkan Detik', type: 'toggle', value: true },
      { key: 'sep', label: 'Gunakan Pemisah', type: 'toggle', value: false },
      { key: 'dir', label: 'Arah Tampilan', type: 'select', value: 'Horizontal', options: ['Horizontal', 'Vertikal'] },
    ],
    content: [
      { title: 'Waktu Target', items: [
        ['Tanggal dan Waktu Selesai', 'Mengikuti timezone WordPress di Settings › General. Mendukung Dynamic Tags.', 'date'],
        ['Pesan Setelah Waktu Habis', 'Kosongkan jika tidak ingin menampilkan pesan setelah timer selesai.', 'text'],
        ['Jumlah Digit Angka', '2 digit (00), 3 digit (000), atau 4 digit (0000). Naikkan jika lebih dari 99 hari.', 'select'],
      ] },
      { title: 'Unit Waktu', items: [
        ['Hari · Jam · Menit · Detik', 'Tampilkan atau sembunyikan tiap unit.', 'switch'],
        ['Teks Label', 'Ganti label tiap unit, misalnya "Days" atau "Hari".', 'text'],
      ] },
      { title: 'Pemisah Angka', items: [
        ['Gunakan Pemisah', 'Tampilkan karakter di antara kotak angka.', 'switch'],
        ['Karakter Pemisah', 'Bawaan ":".', 'text'],
      ] },
    ],
    style: ['Layout', 'Container Timer', 'Kotak Angka', 'Teks dan Warna', 'Pemisah', 'Pesan Waktu Habis'],
    tips: [
      { q: 'Waktunya meleset beberapa jam', a: 'Periksa timezone di Settings › General WordPress. Pilih kota (misalnya Jakarta), bukan UTC+0.' },
      { q: 'Angka hari terpotong', a: 'Jika acara lebih dari 99 hari lagi, ubah Jumlah Digit Angka menjadi 3 digit.' },
    ],
    checklist: ['Tanggal dan jam acara benar', 'Timezone WordPress sudah sesuai', 'Pesan setelah waktu habis diisi', 'Sudah dicek di HP'],
  },

  /* ------------------------------------------------------------ Tombol Audio */
  {
    slug: 'tombol-audio', key: 'audio', cat: 'pembuka', title: 'Tombol Audio',
    tagline: 'Lagu latar dari Media Library, URL, atau YouTube dengan tombol putar dan jeda.',
    intro: 'Tombol Audio memutar musik latar undangan. Musik bisa mulai saat tamu menekan tombol buka di Sampul, dan tamu bisa menjeda kapan saja.',
    perks: [
      { icon: 'music', title: 'Tiga sumber audio', text: 'File dari Media Library, URL audio, atau video YouTube.' },
      { icon: 'play', title: 'Mulai bersama Sampul', text: 'Pilih Buka Undangan Diklik atau Sampul Selesai Terbuka sebagai pemicu musik.' },
      { icon: 'refresh', title: 'Potong dan ulangi', text: 'Mulai dari detik tertentu, berhenti di detik tertentu, lalu ulangi.' },
      { icon: 'zap', title: 'Sinkron dengan video', text: 'Musik otomatis dijeda atau dipelankan saat video bersuara di halaman diputar.' },
    ],
    steps: [
      { title: 'Tambahkan widget', text: 'Cari "Tombol Audio". Di tab Gaya › Penempatan, pilih Tombol Mengambang agar tombol tetap terlihat saat menggulir.', focus: 'frame' },
      { title: 'Pilih sumber audio', text: 'Di Sumber Audio, pilih File Audio, URL Audio, atau Video YouTube, lalu isi sumbernya.', focus: 'source' },
      { title: 'Atur kapan musik mulai', text: 'Di Pemutaran, pilih Mulai Musik Saat: Buka Undangan Diklik atau Sampul Selesai Terbuka.', focus: 'play' },
      { title: 'Beri efek saat berputar', text: 'Di Gaya › Efek Saat Diputar, pilih Cincin Berputar, Denyut Cincin, Ketukan, atau Cahaya Halus.', focus: 'effect' },
    ],
    knobs: [
      { key: 'playing', label: 'Sedang diputar', type: 'toggle', value: true },
      { key: 'effect', label: 'Jenis Efek', type: 'select', value: 'Cincin Berputar', options: ['Tanpa Efek', 'Cincin Berputar', 'Denyut Cincin', 'Ketukan', 'Cahaya Halus'] },
      { key: 'side', label: 'Posisi tombol', type: 'select', value: 'Kanan', options: ['Kanan', 'Kiri'] },
    ],
    content: [
      { title: 'Sumber Audio', items: [
        ['Jenis Sumber', 'File Audio, URL Audio, atau Video YouTube.', 'select'],
        ['File Audio', 'Pilih MP3 dari Media Library.', 'media'],
        ['URL Audio Dinamis', 'Opsional. Dynamic Tag yang valid menggantikan File Audio; jika kosong, File Audio tetap dipakai.', 'url'],
        ['Video YouTube', 'Link atau ID video YouTube.', 'text'],
      ] },
      { title: 'Pemutaran', items: [
        ['Mulai dari · Berhenti di (detik)', 'Putar potongan lagu saja. Berhenti di harus lebih besar dari Mulai dari.', 'number'],
        ['Putar Otomatis', 'Browser bisa memblokir putar otomatis sampai pengunjung menekan tombol.', 'switch'],
        ['Ulangi Audio', 'Putar ulang dari awal setelah selesai.', 'switch'],
        ['Mulai Musik Saat', 'Buka Undangan Diklik atau Sampul Selesai Terbuka.', 'select'],
        ['Jeda Saat Tab Disembunyikan', 'Matikan jika audio boleh tetap berjalan saat tamu pindah tab.', 'switch'],
        ['Sinkronisasi Video', 'Pause Musik Otomatis atau Turunkan Volume Musik saat video bersuara diputar.', 'switch'],
      ] },
      { title: 'Ikon', items: [['Ikon Putar · Ikon Jeda', 'Ganti ikon tombol sesuai tema undangan.', 'icon']] },
      { title: 'Pesan Status', items: [['Audio Kosong · Memuat · Gagal · Rentang Waktu Salah', 'Pesan singkat yang muncul di tombol saat ada kendala.', 'text']] },
    ],
    style: ['Penempatan', 'Efek Saat Diputar', 'Ikon', 'Tombol', 'Status'],
    tips: [
      { q: 'Musik tidak langsung berbunyi di iPhone', a: 'Browser butuh satu sentuhan dari tamu sebelum memutar suara. Pasang Sampul dan pilih Mulai Musik Saat: Buka Undangan Diklik.' },
      { q: 'Musik berhenti saat tamu pindah aplikasi', a: 'Itu karena Jeda Saat Tab Disembunyikan aktif. Matikan jika musik boleh tetap berjalan.' },
    ],
    checklist: ['Sumber audio terisi dan bisa diputar', 'Pemicu musik sesuai Sampul', 'Tombol tidak menutupi konten penting', 'Sudah dicek di iPhone dan Android'],
  },

  /* ----------------------------------------------------------- Form WhatsApp */
  {
    slug: 'form-whatsapp', key: 'form', cat: 'tamu', title: 'Form WhatsApp',
    tagline: 'RSVP yang menyusun nama, kehadiran, dan ucapan menjadi pesan WhatsApp rapi.',
    intro: 'Tamu mengisi form, lalu WhatsApp terbuka dengan pesan yang sudah tersusun ke nomor mempelai. Tidak ada data yang disimpan di server.',
    dest: 'Masuk ke WhatsApp mempelai',
    perks: [
      { icon: 'send', title: 'Langsung ke WhatsApp', text: 'Pesan terkirim ke nomor mempelai, tanpa database dan tanpa pihak ketiga.' },
      { icon: 'layout', title: 'Field sesuka Anda', text: 'Teks, Email, Telepon, Angka, URL, Tanggal, atau Paragraf, dengan opsi wajib diisi.' },
      { icon: 'code', title: 'Format pesan bertoken', text: 'Susun isi pesan dengan token seperti [nama] dan [konfirmasi].' },
      { icon: 'users', title: 'Pilihan kehadiran', text: 'Tambahkan pilihan seperti Hadir atau Tidak Hadir yang ikut masuk ke pesan.' },
    ],
    steps: [
      { title: 'Isi nomor tujuan', text: 'Di Konten Form, isi Nomor Tujuan WhatsApp dengan kode negara, contoh 628123456789.', focus: 'number' },
      { title: 'Susun field form', text: 'Tambah atau ubah field di Field Form. Token dibuat otomatis dari label, misalnya "Nama Tamu" menjadi [nama_tamu].', focus: 'fields' },
      { title: 'Tambahkan kehadiran', text: 'Nyalakan Tambahkan Pilihan Kehadiran dan isi opsinya di Konfirmasi Kehadiran.', focus: 'attend' },
      { title: 'Tulis format pesan', text: 'Di Format Pesan WhatsApp, gunakan token field, misalnya [nama], dan [konfirmasi] untuk kehadiran.', focus: 'message' },
    ],
    knobs: [
      { key: 'name', label: 'Nama', type: 'text', value: 'Budi Santoso' },
      { key: 'attend', label: 'Konfirmasi', type: 'select', value: 'Hadir', options: ['Hadir', 'Tidak Hadir', 'Masih Ragu'] },
      { key: 'guests', label: 'Jumlah Tamu', type: 'range', value: 2, min: 1, max: 5, step: 1 },
      { key: 'template', label: 'Format Pesan WhatsApp', type: 'textarea', value: 'Halo, saya [nama] konfirmasi [konfirmasi] bersama [jumlah] orang. Selamat menempuh hidup baru!' },
    ],
    content: [
      { title: 'Konten Form', items: [
        ['Nomor Tujuan WhatsApp', 'Nomor dengan kode negara, contoh 628123456789.', 'text'],
        ['Judul Form', 'Judul di atas form.', 'text'],
      ] },
      { title: 'Field Form', items: [
        ['Label', 'Nama field yang dilihat tamu.', 'text'],
        ['Token Pesan (Opsional)', 'Jika dikosongkan, dibuat otomatis dari label. "Nama Tamu" menjadi [nama_tamu].', 'text'],
        ['Tipe Input', 'Teks, Email, Telepon, Angka, URL, Tanggal, atau Paragraf.', 'select'],
        ['Angka Minimal · Maksimal · Kelipatan', 'Batas isian untuk tipe Angka, misalnya jumlah tamu 1–5.', 'number'],
        ['Wajib Diisi', 'Form tidak bisa dikirim sebelum field ini terisi.', 'switch'],
        ['Format Pesan WhatsApp', 'Isi pesan memakai token field, misalnya [nama]. Untuk kehadiran gunakan [konfirmasi].', 'area'],
      ] },
      { title: 'Konfirmasi Kehadiran', items: [
        ['Tambahkan Pilihan Kehadiran', 'Tampilkan pilihan kehadiran di form.', 'switch'],
        ['Label Konfirmasi · Opsi Konfirmasi', 'Judul pilihan dan daftar opsinya.', 'repeater'],
      ] },
      { title: 'Pesan dan Validasi', items: [
        ['Pesan Setelah Klik Kirim · Field Belum Lengkap · Token Tidak Cocok · Nomor Tidak Valid', 'Pesan yang tampil sesuai kondisi.', 'text'],
      ] },
    ],
    style: ['Wrapper', 'Label', 'Kolom Input', 'Ucapan (Textarea)', 'Tombol', 'Konfirmasi Kehadiran', 'State dan Interaksi'],
    tips: [
      { q: 'Pesan masih berisi [nama] mentah', a: 'Token di format pesan tidak cocok dengan token field. Samakan dengan isian Token Pesan, atau kosongkan Token Pesan agar dibuat dari label.' },
      { q: 'WhatsApp tidak terbuka ke nomor yang benar', a: 'Tulis nomor diawali kode negara tanpa tanda + atau angka 0, misalnya 628123456789.' },
    ],
    checklist: ['Nomor WhatsApp diawali 62', 'Semua token di format pesan cocok', 'Pilihan kehadiran sudah diisi', 'Sudah dicoba kirim dari HP'],
  },

  /* ------------------------------------------------------------- Ucapan Tamu */
  {
    slug: 'ucapan-tamu', key: 'comment', cat: 'tamu', title: 'Ucapan Tamu',
    tagline: 'Doa dan ucapan tamu lengkap dengan stiker, kehadiran, dan balasan.',
    intro: 'Tamu menulis ucapan dan doa langsung di undangan. Semua ucapan tersimpan di WordPress Anda dan bisa dibalas, diedit, atau dihapus sesuai izin yang Anda atur.',
    dest: 'Tersimpan di WordPress Anda',
    perks: [
      { icon: 'chat', title: 'Tersimpan di situs Anda', text: 'Data ucapan disimpan di database WordPress, bukan di layanan luar.' },
      { icon: 'heart', title: 'Stiker gambar & video', text: 'Tamu bisa menyisipkan stiker lewat popup atau langsung di form.' },
      { icon: 'users', title: 'Status kehadiran', text: 'Badge kehadiran di tiap ucapan, plus ringkasan total per pilihan.' },
      { icon: 'refresh', title: 'Balas, edit, hapus', text: 'Atur apakah pengunjung boleh membalas, dan pemilik boleh mengedit atau menghapus.' },
    ],
    steps: [
      { title: 'Tambahkan widget', text: 'Cari "Ucapan Tamu" dan letakkan di bagian akhir undangan.', focus: 'form' },
      { title: 'Kunci ke link tamu', text: 'Nyalakan Kunci ke Link Tamu agar hanya tamu dengan link ?to=NamaTamu yang bisa mengirim ucapan.', focus: 'lock' },
      { title: 'Aktifkan stiker', text: 'Di Stiker, nyalakan Aktifkan Stiker dan pilih Cara Pilih Stiker: Tombol Popup atau Langsung Tampil di Form.', focus: 'sticker' },
      { title: 'Tampilkan kehadiran', text: 'Di Kehadiran, nyalakan Status Kehadiran untuk menampilkan ringkasan jumlah tamu per pilihan.', focus: 'list' },
    ],
    knobs: [
      { key: 'name', label: 'Nama', type: 'text', value: 'Sinta' },
      { key: 'message', label: 'Ucapan', type: 'textarea', value: 'Selamat ya! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.' },
      { key: 'attend', label: 'Kehadiran', type: 'select', value: 'Hadir', options: ['Hadir', 'Tidak Hadir', 'Masih Ragu'] },
      { key: 'sticker', label: 'Sertakan stiker', type: 'toggle', value: true },
    ],
    content: [
      { title: 'Form', items: [
        ['Label · Placeholder Nama dan Ucapan', 'Teks pada kolom isian.', 'text'],
        ['Kunci ke Link Tamu', 'Jika aktif, tamu hanya bisa mengirim dari link dengan ?to=NamaTamu.', 'switch'],
        ['Teks Catatan Tamu', 'Tampil saat link tidak membawa nama tamu.', 'area'],
        ['Teks Tombol · Pesan Berhasil · Teks Gagal', 'Teks tombol kirim dan pesan setelah mengirim.', 'text'],
      ] },
      { title: 'Stiker', items: [
        ['Aktifkan Stiker', 'Tamu bisa menambahkan stiker ke ucapan.', 'switch'],
        ['Cara Pilih Stiker', 'Tombol Popup atau Langsung Tampil di Form.', 'select'],
        ['Jenis Stiker', 'Gambar & Video, Gambar saja, atau Video saja.', 'select'],
        ['Posisi di Komentar', 'Ganti avatar, di atas komentar, atas teks, bawah teks, atau samping teks.', 'select'],
      ] },
      { title: 'Kehadiran', items: [
        ['Tampilkan Kehadiran', 'Tambahkan pilihan kehadiran di form.', 'switch'],
        ['Status Kehadiran', 'Ringkasan total ucapan berdasarkan pilihan kehadiran.', 'switch'],
        ['Pilihan Kehadiran', 'Daftar opsi, lengkap dengan ikon dan kode.', 'repeater'],
        ['Tampilan Status di Komentar', 'Ikon saja, atau ikon dan teks.', 'select'],
      ] },
      { title: 'Komentar Tampil', items: [
        ['Mode Tampilan', 'Otomatis saat penuh, Scroll tetap, atau Paginasi.', 'select'],
        ['Format Waktu', 'Relatif (1 menit yang lalu), tanggal lengkap, atau bawaan WordPress.', 'select'],
      ] },
      { title: 'Izin Pengunjung', items: [
        ['Izinkan Balas Komentar', 'Semua pengunjung boleh membalas ucapan.', 'switch'],
        ['Izinkan Edit · Hapus Komentar', 'Pemilik ucapan bisa mengedit atau menghapus ucapannya sendiri.', 'switch'],
      ] },
    ],
    style: ['Layout', 'Container', 'Judul', 'Form', 'Field Form', 'Tombol Kirim', 'Daftar Komentar', 'Kartu Komentar', 'Avatar', 'Nama Author', 'Isi Ucapan', 'Metadata dan Aksi', 'Ringkasan Kehadiran', 'Badge Kehadiran', 'Stiker', 'Popup Stiker', 'Pesan Notifikasi', 'Popup Balasan dan Edit', 'Form Balasan Inline', 'Navigasi Komentar', 'Tombol Muat Lebih Banyak'],
    tips: [
      { q: 'Tamu tidak bisa mengirim ucapan', a: 'Jika Kunci ke Link Tamu aktif, tamu harus membuka undangan dari link yang membawa ?to=NamaTamu.' },
      { q: 'Di mana ucapan tersimpan?', a: 'Di database WordPress situs Anda. Ucapan tidak dikirim ke MDUNDIG.' },
    ],
    checklist: ['Pilihan kehadiran sudah sesuai', 'Izin balas, edit, dan hapus sudah diatur', 'Stiker dicoba kirim', 'Sudah dicek di HP'],
  },

  /* ----------------------------------------------------------- Daftar Hadiah */
  {
    slug: 'daftar-hadiah', key: 'registry', cat: 'hadiah', title: 'Daftar Hadiah',
    tagline: 'Wishlist hadiah yang bisa direservasi tamu, tercatat di dashboard MDUNDIG.',
    intro: 'Tamu memilih hadiah, mengisi formulir singkat, lalu reservasinya tercatat di MDUNDIG. Saat koneksi online aktif, kapasitas berkurang otomatis agar tidak ada hadiah ganda.',
    dest: 'Tercatat di dashboard MDUNDIG',
    mdundig: true,
    perks: [
      { icon: 'gift', title: 'Tanpa hadiah ganda', text: 'Reservasi terkonfirmasi mengurangi kapasitas, dan hadiah penuh otomatis tidak bisa dipilih.' },
      { icon: 'layout', title: 'Card yang fleksibel', text: 'Layout vertikal atau horizontal, jumlah kolom bebas, dan mode swipe di HP.' },
      { icon: 'badge', title: 'Galeri per hadiah', text: 'Foto utama jadi sampul card, foto tambahan tampil sebagai galeri di popup.' },
      { icon: 'plug', title: 'Terhubung ke MDUNDIG', text: 'Cukup tempel token website dan jalankan Uji Koneksi.' },
    ],
    steps: [
      { title: 'Hubungkan ke MDUNDIG', text: 'Di dashboard WordPress buka ApeironKit › Daftar Hadiah, tempel Token website dari dashboard MDUNDIG, simpan, lalu klik Uji Koneksi.', focus: 'connect' },
      { title: 'Isi daftar hadiah', text: 'Di Konten › Daftar Hadiah, tambahkan item: nama, kategori, foto, dan jumlah awal.', focus: 'items' },
      { title: 'Atur tampilan grid', text: 'Di Tampilan Grid, pilih Layout Card, Jumlah Kolom, dan Tampilan Card Mobile.', focus: 'grid' },
      { title: 'Tamu mereservasi', text: 'Tamu memilih hadiah dan mengisi formulir. Reservasi masuk ke MDUNDIG dan kapasitas berkurang.', focus: 'reserve' },
    ],
    knobs: [
      { key: 'cols', label: 'Jumlah Kolom', type: 'select', value: '2', options: ['1', '2'] },
      { key: 'layout', label: 'Layout Card', type: 'select', value: 'Vertikal', options: ['Vertikal', 'Horizontal'] },
    ],
    content: [
      { title: 'Hadiah Pernikahan', items: [['Judul · Deskripsi Pembuka', 'Teks pembuka di atas daftar hadiah.', 'text']] },
      { title: 'Daftar Hadiah', items: [
        ['Nama Hadiah · Kategori', 'Nama barang dan kelompoknya, misalnya "Dapur".', 'text'],
        ['Foto Hadiah', 'JPG, PNG, atau WebP dari Media Library. Menjadi sampul card.', 'media'],
        ['Foto Tambahan', 'Ditampilkan sebagai galeri dengan thumbnail di popup.', 'gallery'],
        ['Jumlah Awal', 'Kapasitas yang Anda tentukan. Nilai 0 menonaktifkan pemilihan.', 'number'],
        ['Jumlah Tersedia (Manual)', 'Kosongkan untuk mengikuti jumlah awal. Saat online, reservasi terkonfirmasi dikurangi dari nilai ini.', 'number'],
        ['Ketersediaan Manual', 'Tersedia atau Tidak Tersedia.', 'select'],
        ['Link Pembelian · Link Toko', 'Opsional. Tautan ke toko online beserta teksnya.', 'url'],
      ] },
      { title: 'Tampilan Grid', items: [
        ['Layout Card', 'Vertikal (foto di atas) atau Horizontal (foto di samping).', 'select'],
        ['Jumlah Kolom', 'Jumlah card per baris.', 'select'],
        ['Jumlah Item Ditampilkan', '0 menampilkan semua hadiah sesuai urutan.', 'number'],
        ['Tampilan Card Mobile', 'Swipe ke Samping atau Grid / Daftar.', 'select'],
        ['Navigasi Swipe Card', 'Dot, Panah, Dot & Panah, atau Tanpa Navigasi.', 'select'],
      ] },
    ],
    style: ['Layout & Spacing', 'Navigasi Swipe Card', 'Card Hadiah', 'Foto Hadiah', 'Status', 'Tombol', 'Popup', 'Formulir', 'Empty State'],
    tips: [
      { q: 'Kapasitas tidak berkurang setelah reservasi', a: 'Koneksi online belum aktif. Buka ApeironKit › Daftar Hadiah, simpan token, lalu jalankan Uji Koneksi sampai berhasil.' },
      { q: 'Hadiah tidak bisa dipilih', a: 'Periksa Jumlah Awal (0 menonaktifkan) dan Ketersediaan Manual. Hadiah juga terkunci saat kapasitasnya penuh.' },
    ],
    checklist: ['Token MDUNDIG tersimpan', 'Uji Koneksi berhasil', 'Semua hadiah punya foto dan jumlah', 'Reservasi uji muncul di MDUNDIG'],
  },

  /* ---------------------------------------------------------- Manajemen Tamu */
  {
    slug: 'manajemen-tamu', key: 'manager', cat: 'tamu', title: 'Manajemen Tamu',
    tagline: 'Buat link undangan khusus per tamu beserta pesan siap kirim.',
    intro: 'Masukkan link undangan dan daftar nama, lalu widget membuat link pribadi untuk tiap tamu dan pesan WhatsApp dari template ucapan.',
    perks: [
      { icon: 'users', title: 'Link pribadi per tamu', text: 'Setiap nama mendapat link ?to=Nama, sehingga namanya tampil di Sampul.' },
      { icon: 'mail', title: 'Template ucapan', text: 'Template Formal dan Muslim siap pakai dengan token [nama] dan [link-undangan].' },
      { icon: 'layers', title: 'Impor dari Excel', text: 'Unggah daftar tamu dari file Excel, tambahkan atau ganti daftar yang ada.' },
      { icon: 'send', title: 'Bagikan sekali klik', text: 'Salin atau kirim pesan undangan langsung dari tabel hasil.' },
    ],
    steps: [
      { title: 'Siapkan halaman khusus', text: 'Taruh widget di halaman terpisah untuk mempelai, misalnya /kirim-undangan, bukan di undangan untuk tamu.', focus: 'form' },
      { title: 'Atur template ucapan', text: 'Di Template Ucapan, ubah atau tambah template. Gunakan [nama] dan [link-undangan].', focus: 'template' },
      { title: 'Masukkan nama tamu', text: 'Ketik satu nama per baris, atau aktifkan Impor Tamu untuk mengunggah file Excel.', focus: 'names' },
      { title: 'Bagikan link', text: 'Klik Buat Daftar. Setiap tamu mendapat link dan pesan yang siap dikirim.', focus: 'share' },
    ],
    knobs: [
      { key: 'link', label: 'Link Undangan', type: 'text', value: 'https://undangan.id/raka-nadia' },
      { key: 'names', label: 'Nama Tamu (satu per baris)', type: 'textarea', value: 'Budi Santoso\nSinta Dewi\nKeluarga Pak Hasan' },
      { key: 'tpl', label: 'Template', type: 'select', value: 'Formal', options: ['Formal', 'Muslim'] },
    ],
    content: [
      { title: 'Umum', items: [
        ['Tampilkan Judul · Ikon · Judul · Deskripsi', 'Bagian pembuka widget.', 'switch'],
        ['Tampilkan Hasil', 'Tampilkan tabel hasil dan tombol bagikan setelah daftar dibuat.', 'switch'],
      ] },
      { title: 'Template Ucapan', items: [
        ['Nama Template', 'Nama yang muncul di pilihan template, misalnya "Formal".', 'text'],
        ['Template Ucapan', 'Isi pesan. Token [nama] diganti nama tamu, [link-undangan] diganti link pribadinya.', 'area'],
      ] },
      { title: 'Impor Tamu', items: [
        ['Aktifkan Impor', 'Izinkan unggah file Excel untuk mengisi nama tamu.', 'switch'],
        ['Mode Impor', 'Tambahkan ke daftar atau Ganti daftar saat ini.', 'select'],
        ['Lewati Baris Judul', 'Abaikan baris pertama berisi judul kolom.', 'switch'],
        ['Link Template', 'URL file template Excel yang bisa diunduh pengguna.', 'url'],
      ] },
      { title: 'Teks', items: [['Label formulir dan tabel', 'Semua label, bantuan, dan contoh isian bisa diganti.', 'text']] },
    ],
    style: ['Jarak Cepat', 'Kontainer', 'Konten Atas', 'Input', 'Label dan Bantuan', 'Tabel Tamu', 'Tombol'],
    tips: [
      { q: 'Nama dengan spasi membuat link rusak?', a: 'Tidak. Spasi otomatis diubah menjadi %20, dan Sampul membacanya kembali sebagai spasi.' },
      { q: 'Apakah tamu bisa melihat widget ini?', a: 'Hanya jika diletakkan di halaman undangan. Taruh di halaman terpisah yang tidak Anda bagikan.' },
    ],
    checklist: ['Widget ada di halaman terpisah', 'Link undangan benar', 'Template berisi [nama] dan [link-undangan]', 'Satu link sudah dicoba dibuka'],
  },

  /* ------------------------------------------------------------ Tombol Salin */
  {
    slug: 'tombol-salin', key: 'copy', cat: 'hadiah', title: 'Tombol Salin',
    tagline: 'Tamu menyalin nomor rekening atau alamat dengan satu ketukan.',
    intro: 'Tombol Salin menyalin teks ke clipboard tamu, lalu menampilkan pesan berhasil di tombol. Cocok untuk nomor rekening, alamat, atau link.',
    perks: [
      { icon: 'copy', title: 'Satu ketukan', text: 'Tamu tidak perlu menekan lama dan memilih teks secara manual.' },
      { icon: 'tag', title: 'Empat sumber salinan', text: 'Teks Manual, URL Halaman Ini, URL Kustom, atau Hasil Shortcode.' },
      { icon: 'sparkle', title: 'Umpan balik jelas', text: 'Label tombol berganti menjadi pesan berhasil selama durasi yang Anda atur.' },
      { icon: 'shield', title: 'Pesan saat bermasalah', text: 'Pesan khusus saat isi kosong, URL tidak valid, atau penyalinan gagal.' },
    ],
    steps: [
      { title: 'Pilih jenis salinan', text: 'Di Isi Salinan, pilih Teks Manual, URL Halaman Ini, URL Kustom, atau Hasil Shortcode.', focus: 'source' },
      { title: 'Isi yang akan disalin', text: 'Tulis nomor rekening, kode, atau pesan yang ingin disalin tamu.', focus: 'value' },
      { title: 'Atur tombol', text: 'Di Tombol, isi Label Tombol, pilih ikon dan posisinya.', focus: 'button' },
      { title: 'Tulis pesan feedback', text: 'Di Feedback, isi Pesan Berhasil dan atur Durasi Feedback.', focus: 'feedback' },
    ],
    knobs: [
      { key: 'value', label: 'Isi yang Akan Disalin', type: 'text', value: '1234 5678 90' },
      { key: 'label', label: 'Label Tombol', type: 'text', value: 'Salin Nomor' },
      { key: 'done', label: 'Pesan Berhasil', type: 'text', value: 'Tersalin!' },
    ],
    content: [
      { title: 'Isi Salinan', items: [
        ['Jenis Salinan', 'Teks Manual, URL Halaman Ini, URL Kustom, atau Hasil Shortcode.', 'select'],
        ['Isi yang Akan Disalin', 'Teks biasa, nomor rekening, kode, atau pesan.', 'area'],
        ['URL yang Akan Disalin', 'Link lengkap untuk jenis URL Kustom.', 'url'],
        ['Shortcode', 'Hasil shortcode diproses lalu disalin sebagai teks biasa.', 'area'],
      ] },
      { title: 'Tombol', items: [
        ['Label Tombol', 'Teks tombol, misalnya "Salin Nomor".', 'text'],
        ['Posisi Tombol', 'Kiri, Tengah, atau Kanan.', 'choose'],
        ['Ikon Tombol · Posisi Ikon', 'Ikon di awal atau akhir label.', 'icon'],
      ] },
      { title: 'Feedback', items: [
        ['Pesan Berhasil · Kosong · URL Tidak Valid · Gagal', 'Pesan yang tampil di tombol sesuai hasil.', 'text'],
        ['Durasi Feedback', 'Lama pesan tampil sebelum tombol kembali seperti semula.', 'slider'],
      ] },
    ],
    style: ['Tombol', 'Ikon'],
    tips: [
      { q: 'Tombol tidak menyalin apa pun', a: 'Periksa Jenis Salinan dan isinya. Jika kosong atau URL tidak valid, tombol menampilkan pesan yang Anda atur di Feedback.' },
      { q: 'Spasi di nomor rekening ikut tersalin', a: 'Tulis nomor tanpa spasi di Isi yang Akan Disalin. Spasi untuk tampilan cukup di teks section.' },
    ],
    checklist: ['Isi salinan sudah benar', 'Jenis Salinan sesuai', 'Pesan berhasil sudah diisi', 'Dicoba tempel di aplikasi bank'],
  },

  /* ------------------------------------------------------------ Cerita Cinta */
  {
    slug: 'cerita-cinta', key: 'story', cat: 'acara', title: 'Cerita Cinta',
    tagline: 'Perjalanan cinta mempelai dalam timeline scrapbook bergerak.',
    intro: 'Cerita Cinta menyusun momen-momen mempelai menjadi timeline bergaya scrapbook, lengkap dengan foto, dekorasi, dan penanda yang bergerak saat digulir.',
    perks: [
      { icon: 'book', title: 'Dua skin scrapbook', text: 'Scrapbook Story sebagai timeline, atau Scrapbook Collage sebagai kolase.' },
      { icon: 'heart', title: 'Timeline bergerak', text: 'Doodle Path, Ribbon Trail, atau Journey Icon dengan penanda yang ikut bergerak.' },
      { icon: 'layers', title: 'Slideshow per cerita', text: 'Satu foto atau slideshow beberapa foto, dengan efek transisi dan durasi sendiri.' },
      { icon: 'palette', title: 'Gaya per cerita', text: 'Warna card, border, dan dekorasi tape bisa dibedakan untuk tiap cerita.' },
    ],
    steps: [
      { title: 'Pilih skin', text: 'Di Konten › Cerita Cinta, pilih Skin: Scrapbook Story atau Scrapbook Collage.', focus: 'skin' },
      { title: 'Tambahkan cerita', text: 'Di Daftar Cerita, isi Judul, Tanggal / Tahun, dan Deskripsi untuk tiap momen.', focus: 'stories' },
      { title: 'Pasang foto dan dekorasi', text: 'Pilih Tampilan Foto: satu foto atau slideshow. Tambahkan dekorasi sudut atau tape.', focus: 'photo' },
      { title: 'Pilih gaya timeline', text: 'Atur Gaya Timeline dan Animasi Masuk Card agar cerita muncul satu per satu.', focus: 'timeline' },
    ],
    knobs: [
      { key: 'line', label: 'Gaya Timeline', type: 'select', value: 'Doodle Path', options: ['Doodle Path', 'Ribbon Trail', 'Journey Icon'] },
      { key: 'anim', label: 'Animasi Masuk Card', type: 'select', value: 'Slide Up', options: ['Tanpa Animasi', 'Fade In', 'Slide Up', 'Slide Alternating', 'Zoom In'] },
    ],
    content: [
      { title: 'Cerita Cinta', items: [
        ['Skin', 'Scrapbook Story atau Scrapbook Collage.', 'select'],
        ['Judul Widget · Deskripsi', 'Judul dan subjudul di atas timeline.', 'text'],
        ['Gaya Timeline', 'Doodle Path, Ribbon Trail, atau Journey Icon.', 'select'],
        ['Penanda Bergerak', 'Ikon atau gambar yang bergerak mengikuti timeline.', 'select'],
        ['Animasi Masuk Card', 'Tanpa Animasi, Fade In, Slide Up, Slide Alternating, atau Zoom In.', 'select'],
        ['Style Per Cerita', 'Aktifkan agar tiap cerita bisa punya warna dan border sendiri.', 'switch'],
      ] },
      { title: 'Daftar Cerita', items: [
        ['Judul · Tanggal / Tahun · Deskripsi', 'Isi tiap momen, misalnya "Pertama Bertemu · 2019".', 'text'],
        ['Tampilan Foto', 'Satu foto atau slideshow.', 'select'],
        ['Foto Slideshow', 'Pilih beberapa foto. Mendukung Dynamic Tags.', 'gallery'],
        ['Efek Transisi · Durasi Tampil · Kecepatan Transisi', 'Tempo pergantian foto slideshow.', 'number'],
        ['Posisi Foto X · Y', 'Geser titik fokus foto tanpa mengubah file aslinya.', 'slider'],
        ['Dekorasi Sudut Foto · Dekorasi Tape', 'Ikon, gambar PNG/WebP, atau tanpa dekorasi.', 'select'],
      ] },
    ],
    style: ['Area Widget', 'Heading', 'Story Card', 'Style Per Cerita', 'Photo', 'Ornamen', 'Timeline', 'Icon', 'Teks Cerita', 'Spacing', 'Scrapbook Collage'],
    tips: [
      { q: 'Foto terpotong di bagian wajah', a: 'Gunakan Posisi Foto X dan Y pada cerita itu untuk menggeser titik fokus.' },
      { q: 'Terlalu banyak cerita membuat halaman panjang', a: 'Cukup 3–5 momen penting. Gabungkan foto pendukung ke slideshow.' },
    ],
    checklist: ['Skin sudah dipilih', 'Tiap cerita punya judul dan tanggal', 'Foto tidak terpotong', 'Animasi dicek di HP'],
  },

  /* -------------------------------------------------------------- Form Order */
  {
    slug: 'form-order', key: 'order', cat: 'hadiah', title: 'Form Order',
    tagline: 'Form pesanan bertahap untuk jasa undangan, tercatat di MDUNDIG.',
    intro: 'Form Order dipakai di situs jasa undangan Anda. Calon klien mengisi data mempelai, acara, dan paket langkah demi langkah, lalu pesanannya tercatat di MDUNDIG.',
    dest: 'Tercatat di dashboard MDUNDIG',
    mdundig: true,
    perks: [
      { icon: 'layers', title: 'Form bertahap', text: 'Susun step sendiri dengan Step / Section Builder agar form panjang terasa ringan.' },
      { icon: 'wrench', title: 'Field bebas', text: 'Atur label, tipe, opsi, wajib diisi, dan lebar tiap field.' },
      { icon: 'refresh', title: 'Draft otomatis', text: 'Isian tersimpan di browser, jadi klien bisa melanjutkan nanti.' },
      { icon: 'plug', title: 'Aman masuk MDUNDIG', text: 'Pesanan yang gagal terkirim masuk antrean dan dikirim ulang otomatis.' },
    ],
    steps: [
      { title: 'Hubungkan ke MDUNDIG', text: 'Di dashboard WordPress buka ApeironKit › Form Order, simpan konfigurasi, lalu jalankan Uji Koneksi.', focus: 'connect' },
      { title: 'Susun step', text: 'Di Steps, tambahkan step seperti Data Mempelai, Acara, dan Paket. Tiap step punya ID sendiri.', focus: 'steps' },
      { title: 'Tambahkan field', text: 'Di Fields, isi Label, Tipe, dan ID Step Tujuan agar field masuk ke step yang benar.', focus: 'fields' },
      { title: 'Kirim pesanan', text: 'Klien menekan Kirim di step terakhir. Pesanan tercatat di MDUNDIG dan draft dibersihkan.', focus: 'submit' },
    ],
    knobs: [
      { key: 'draft', label: 'Simpan Draft Otomatis', type: 'toggle', value: true },
      { key: 'sticky', label: 'Tombol menempel di HP', type: 'toggle', value: true },
    ],
    content: [
      { title: 'Steps', items: [
        ['Nama Step · ID Step', 'Judul tahap dan ID uniknya.', 'text'],
        ['Jenis Step · Tampilkan Step', 'Jenis tahap dan apakah tahap itu ditampilkan.', 'select'],
      ] },
      { title: 'Fields', items: [
        ['ID Step Tujuan', 'Step tempat field ini berada. Field baru mengikuti step terakhir.', 'text'],
        ['Label · Tipe · Placeholder', 'Isi dasar tiap field.', 'text'],
        ['Internal Field ID', 'Kosongkan agar otomatis. ID bawaan jangan diubah bila integrasi sudah berjalan.', 'text'],
        ['Opsi (nilai|label)', 'Satu opsi per baris untuk select, radio, atau checkbox.', 'area'],
        ['Wajib · Tampilkan · Lebar Field', 'Validasi, visibilitas, dan lebar field.', 'switch'],
      ] },
      { title: 'Navigasi dan Kirim', items: [
        ['Tombol Lanjut · Tombol Kembali', 'Teks tombol antar-step.', 'text'],
        ['Posisi Tombol di Mobile', 'Mode tetap menjaga tombol terlihat saat form di-scroll.', 'select'],
        ['Teks Tombol Kirim · Teks Konfirmasi', 'Teks di step terakhir dan setelah terkirim.', 'text'],
        ['Petunjuk Pengiriman', '{submit} mengikuti teks tombol Kirim. Kosongkan untuk menyembunyikan.', 'area'],
      ] },
      { title: 'Draft / Auto Save', items: [
        ['Simpan Draft Otomatis', 'Simpan isian di browser klien.', 'switch'],
        ['Masa Penyimpanan Draft', 'Berapa lama draft disimpan.', 'select'],
      ] },
    ],
    style: ['Section', 'Label', 'Input', 'Textarea', 'Select', 'Radio / Checkbox', 'Tombol', 'Navigation Button', 'Submit Button', 'Status', 'Ringkasan', 'Notifikasi Draft', 'Interaksi dan Tata Letak', 'Navigasi Menempel (Mobile)'],
    tips: [
      { q: 'Pesanan tidak langsung muncul di MDUNDIG', a: 'Pesanan masuk antrean dan dikirim ulang otomatis. Status antrean terlihat di ApeironKit › Form Order.' },
      { q: 'Field pindah ke step yang salah', a: 'Periksa ID Step Tujuan pada field. Nilainya harus sama persis dengan ID Step.' },
    ],
    checklist: ['Uji Koneksi berhasil', 'Setiap field punya ID Step Tujuan yang benar', 'Pesanan uji muncul di MDUNDIG', 'Navigasi dicek di HP'],
  },

  /* --------------------------------------------------------------- Aktivitas */
  {
    slug: 'aktivitas', key: 'activity', cat: 'tamu', title: 'Aktivitas',
    tagline: 'Popup bukti sosial: "Nama baru saja memesan Produk".',
    intro: 'Aktivitas menampilkan popup kecil berisi pesanan terbaru di situs jasa undangan Anda, sehingga calon klien melihat bahwa layanan Anda ramai dipakai.',
    perks: [
      { icon: 'zap', title: 'Bukti sosial', text: 'Popup bergantian menampilkan nama pelanggan dan produk yang dipesan.' },
      { icon: 'wrench', title: 'Data dari dashboard', text: 'Aktivitas dikelola di ApeironKit › Aktivitas, widget tinggal menampilkannya.' },
      { icon: 'code', title: 'Format pesan khusus', text: 'Ubah kalimatnya per halaman dengan token {name} dan {product}.' },
      { icon: 'layout', title: 'Empat sudut layar', text: 'Atas Kanan, Atas Kiri, Bawah Kanan, atau Bawah Kiri.' },
    ],
    steps: [
      { title: 'Isi data aktivitas', text: 'Di dashboard WordPress buka ApeironKit › Aktivitas dan tambahkan aktivitas pelanggan.', focus: 'data' },
      { title: 'Tambahkan widget', text: 'Cari "Aktivitas" dan letakkan di halaman penjualan. Popup tampil mengambang di sudut layar.', focus: 'popup' },
      { title: 'Ubah format pesan', text: 'Nyalakan Gunakan Format Pesan Khusus, lalu tulis kalimat dengan {name} dan {product}.', focus: 'format' },
      { title: 'Pilih posisi', text: 'Nyalakan Gunakan Posisi Khusus dan pilih sudut popup.', focus: 'pos' },
    ],
    knobs: [
      { key: 'format', label: 'Format Pesan', type: 'text', value: '{name} baru saja memesan {product}' },
      { key: 'pos', label: 'Posisi Popup', type: 'select', value: 'Bawah Kiri', options: ['Atas Kanan', 'Atas Kiri', 'Bawah Kanan', 'Bawah Kiri'] },
    ],
    content: [
      { title: 'Pengaturan', items: [
        ['Aktifkan Popup', 'Tampilkan popup aktivitas di halaman ini.', 'switch'],
        ['Gunakan Format Pesan Khusus', 'Aktifkan jika kalimat di halaman ini perlu berbeda dari pengaturan dashboard.', 'switch'],
        ['Format Pesan', 'Gunakan {name} untuk nama pelanggan dan {product} untuk produk.', 'area'],
        ['Gunakan Posisi Khusus', 'Aktifkan jika posisi popup di halaman ini perlu berbeda dari dashboard.', 'switch'],
        ['Posisi Popup', 'Atas Kanan, Atas Kiri, Bawah Kanan, atau Bawah Kiri.', 'select'],
      ] },
    ],
    style: ['Layout', 'Container Popup', 'Tombol Tutup', 'Foto Pelanggan', 'Teks'],
    tips: [
      { q: 'Popup tidak muncul', a: 'Pastikan Aktifkan Popup menyala dan sudah ada aktivitas tersimpan di ApeironKit › Aktivitas.' },
      { q: 'Apakah dipakai di undangan pernikahan?', a: 'Tidak perlu. Widget ini dibuat untuk halaman penjualan jasa undangan Anda.' },
    ],
    checklist: ['Aktivitas tersimpan di dashboard', 'Format pesan memakai {name} dan {product}', 'Popup tidak menutupi tombol penting'],
  },

  /* ---------------------------------------------------------- Gulir Otomatis */
  {
    slug: 'gulir-otomatis', key: 'scroll', cat: 'pembuka', title: 'Gulir Otomatis',
    tagline: 'Undangan bergulir sendiri dengan kecepatan yang bisa diatur tamu.',
    intro: 'Gulir Otomatis menggulir undangan secara halus seperti presentasi. Tamu bisa menjeda, mempercepat, atau memperlambat lewat tombol mengambang.',
    perks: [
      { icon: 'cursor', title: 'Dua gaya gerak', text: 'Halus Berkelanjutan untuk aliran lembut, atau Scroll per Bagian untuk ritme presentasi.' },
      { icon: 'zap', title: 'Hingga 120Hz', text: 'Mode Native Refresh mengikuti refresh rate layar untuk gerakan paling mulus.' },
      { icon: 'refresh', title: 'Mengerti tamu', text: 'Melambat saat tamu menggulir sendiri, lalu lanjut lagi setelah diam.' },
      { icon: 'layout', title: 'Panel kecepatan', text: 'Tombol + dan − yang bisa digeser, plus indikator progres dan kembali ke atas.' },
    ],
    steps: [
      { title: 'Pilih skin tombol', text: 'Di Quick Setup, pilih Skin: Default atau Simple Capsule.', focus: 'button' },
      { title: 'Atur gerak dan kecepatan', text: 'Pilih Gaya Gerakan dan Mode Scroll, lalu atur Kecepatan Scroll (1–100%).', focus: 'speed' },
      { title: 'Atur reaksi terhadap tamu', text: 'Nyalakan Pause Saat Interaksi dan Resume Setelah Idle agar tamu tetap memegang kendali.', focus: 'behavior' },
      { title: 'Tampilkan progres', text: 'Di Indikator dan Pesan, tampilkan progres melingkar atau garis, dan tombol kembali ke atas.', focus: 'progress' },
    ],
    knobs: [
      { key: 'run', label: 'Jalankan', type: 'toggle', value: true },
      { key: 'speed', label: 'Kecepatan Scroll', type: 'range', value: 40, min: 5, max: 100, step: 5, unit: '%' },
      { key: 'mode', label: 'Gaya Gerakan', type: 'select', value: 'Halus Berkelanjutan', options: ['Halus Berkelanjutan', 'Scroll per Bagian'] },
    ],
    content: [
      { title: 'Quick Setup', items: [
        ['Skin', 'Default atau Simple Capsule.', 'select'],
        ['Gaya Gerakan', 'Halus Berkelanjutan, atau Scroll per Bagian untuk gerakan ritmis.', 'select'],
        ['Mode Scroll', 'Otomatis, Tekan & Tahan, atau Otomatis + Manual.', 'select'],
        ['Kecepatan Scroll (%)', 'Kecepatan utama 1–100%.', 'slider'],
        ['Mulai Otomatis · Delay Mulai', 'Mulai menggulir saat halaman dimuat, dengan jeda opsional.', 'switch'],
        ['Pause Saat Interaksi · Resume Setelah Idle', 'Melambat saat tamu menggulir, lanjut lagi setelah diam.', 'switch'],
        ['Loop ke Atas', 'Kembali ke atas setelah sampai bawah.', 'switch'],
      ] },
      { title: 'Kontrol Kecepatan', items: [
        ['Jarak · Jeda · Durasi Gerak Langkah', 'Ritme untuk mode Scroll per Bagian.', 'slider'],
        ['Kualitas Gerakan', 'Native Refresh (hingga 120Hz), Balanced (60fps), atau Hemat Performa (45fps).', 'select'],
        ['Tampilkan Panel Kecepatan', 'Tombol + dan − untuk tamu. Bisa digeser bila Bisa Digeser aktif.', 'switch'],
      ] },
      { title: 'Tombol dan Posisi', items: [
        ['Icon Mulai · Icon Berhenti', 'Ikon tombol utama.', 'icon'],
        ['Posisi Tombol', 'Kanan Bawah, Kiri Bawah, Tengah Bawah, Kanan Tengah, atau Kiri Tengah.', 'select'],
        ['Animasi Muncul', 'Fade, Slide, Scale, Bounce, Zoom, Flip, atau Elastic.', 'select'],
      ] },
      { title: 'Indikator dan Pesan', items: [
        ['Tampilkan Progress · Tipe', 'Progres melingkar atau garis.', 'switch'],
        ['Tampilkan Tombol Kembali', 'Tombol ke atas yang muncul setelah tamu menggulir sekian persen.', 'switch'],
      ] },
    ],
    style: ['Container Lanjutan', 'Tombol Utama', 'Kapsul', 'Ukuran Kapsul', 'Lingkaran Angka Progres', 'Indikator Progress', 'Panel Kecepatan', 'Kembali ke Atas'],
    tips: [
      { q: 'Gerakan terasa patah-patah di HP lama', a: 'Ubah Kualitas Gerakan menjadi Balanced atau Hemat Performa.' },
      { q: 'Bermasalah di iPhone', a: 'Aktifkan Nonaktifkan di iOS jika gerakan tidak optimal di Safari.' },
    ],
    checklist: ['Kecepatan nyaman dibaca', 'Pause saat interaksi aktif', 'Tombol tidak bertumpuk dengan Tombol Audio', 'Sudah dicek di HP'],
  },

  /* ---------------------------------------------------------- Pemuat Halaman */
  {
    slug: 'pemuat-halaman', key: 'loader', cat: 'pembuka', title: 'Pemuat Halaman',
    tagline: 'Layar pembuka beranimasi selama undangan dimuat.',
    intro: 'Pemuat Halaman menutupi layar dengan animasi dan teks nama mempelai sampai halaman siap, lalu menghilang dengan animasi keluar pilihan Anda.',
    perks: [
      { icon: 'sparkle', title: 'Tiga gaya loader', text: 'Default, Coffee, atau Water, dengan teks intro, utama, dan nama.' },
      { icon: 'clock', title: 'Progres sungguhan', text: 'Persentase mengikuti status pemuatan dokumen, bukan angka palsu.' },
      { icon: 'shield', title: 'Tidak pernah macet', text: 'Maximum Timeout selalu melepas loader meski ada resource yang gagal dimuat.' },
      { icon: 'refresh', title: 'Sekali per pengunjung', text: 'First Visit Only menyimpan status di LocalStorage.' },
    ],
    steps: [
      { title: 'Pilih gaya loader', text: 'Di Loader, pilih Loader Style: Default, Coffee, atau Water.', focus: 'style' },
      { title: 'Isi teksnya', text: 'Isi Intro Text, Main Text, Loading Text, dan Secondary / Name Text, misalnya nama mempelai.', focus: 'text' },
      { title: 'Atur waktunya', text: 'Minimum Display Time menjaga animasi selesai, Maximum Timeout memastikan loader selalu hilang.', focus: 'timing' },
      { title: 'Pilih animasi keluar', text: 'Di Behavior, pilih Entrance dan Exit Animation, serta perangkat yang menampilkan loader.', focus: 'exit' },
    ],
    knobs: [
      { key: 'style', label: 'Loader Style', type: 'select', value: 'Default', options: ['Default', 'Coffee', 'Water'] },
      { key: 'pct', label: 'Show Percentage', type: 'toggle', value: true },
      { key: 'name', label: 'Secondary / Name Text', type: 'text', value: 'Raka & Nadia' },
    ],
    content: [
      { title: 'Loader', items: [
        ['Loader Style', 'Default, Coffee, atau Water.', 'select'],
        ['Intro · Main · Loading · Secondary Text', 'Teks yang tampil berurutan selama memuat.', 'text'],
        ['Show Percentage', 'Tampilkan angka persentase.', 'switch'],
        ['Progress Based Loading', 'Progres mengikuti status dokumen lalu selesai saat halaman siap.', 'switch'],
        ['Minimum Display Time', 'Durasi minimum agar animasi teks selesai.', 'slider'],
        ['Maximum Timeout', 'Batas aman: loader selalu dilepas setelah waktu ini.', 'slider'],
      ] },
      { title: 'Behavior', items: [
        ['First Visit Only', 'Loader hanya muncul di kunjungan pertama (LocalStorage).', 'switch'],
        ['Entrance Animation', 'None, Fade, Fade Scale, Slide Up, atau Soft Blur.', 'select'],
        ['Exit Animation', 'None, Fade, Fade Scale, Slide Up, Curtain Lift, atau Soft Blur.', 'select'],
        ['Glassmorphism · Blur Background', 'Efek kaca buram di belakang loader.', 'switch'],
        ['Desktop · Tablet · Mobile', 'Perangkat yang menampilkan loader.', 'switch'],
      ] },
    ],
    style: ['Background', 'Container', 'Loader', 'Text'],
    tips: [
      { q: 'Loader terasa terlalu lama', a: 'Turunkan Minimum Display Time. Loader tetap selesai begitu halaman siap dan waktu minimum tercapai.' },
      { q: 'Dipakai bersama Sampul?', a: 'Bisa. Loader tampil lebih dulu selama memuat, lalu Sampul menunggu tamu menekan tombol buka.' },
    ],
    checklist: ['Gaya loader sesuai tema', 'Nama mempelai sudah diisi', 'Maximum Timeout tidak terlalu lama', 'Sudah dicek di HP'],
  },
  /* ----------------------------------------------------------- Paralaks 2.5D */
  {
    slug: 'paralaks-2-5d', key: 'parallax', cat: 'pembuka', title: 'Paralaks 2.5D',
    tagline: 'Adegan scroll sinematik dengan kamera 3D yang menembus layer berkedalaman.',
    intro: 'Paralaks 2.5D menahan satu bingkai di layar sementara tamu menggulir. Kamera bergerak dari adegan ke adegan, dan setiap layer (gambar, video, teks, atau container) bergeser sesuai kedalamannya sehingga undangan terasa seperti film pendek.',
    perks: [
      { icon: 'layers', title: 'Kedalaman sungguhan', text: 'Tiap layer punya posisi Z sendiri, dari latar jauh sampai bunga di depan kamera.' },
      { icon: 'play', title: 'Kamera per adegan', text: 'Atur geser, zoom, miring, dan putaran kamera di akhir setiap adegan.' },
      { icon: 'sparkle', title: 'Animasi per layer', text: 'Geser, skala, rotasi, opasitas, dan blur pada adegan tertentu, plus teks yang muncul per kata.' },
      { icon: 'cursor', title: 'Ikut gerak tamu', text: 'Kamera bisa mengikuti kursor di desktop dan kemiringan HP.' },
    ],
    steps: [
      { title: 'Letakkan di awal halaman', text: 'Cari "Paralaks 2.5D" di panel Elementor dan seret ke section paling atas, tepat setelah Sampul. Bingkai akan menempel di layar selama adegan berjalan.', focus: 'frame' },
      { title: 'Susun layer dan kedalaman', text: 'Di Layer dan Konten, tambahkan layer (Gambar, Video, Teks, Template, Bentuk, atau Container) dengan ID Layer unik, lalu isi Kedalaman (Z): -800 latar jauh, 0 subjek, 200 bunga di depan.', focus: 'depth' },
      { title: 'Buat adegan kamera', text: 'Di Adegan dan Kamera, atur Kamera Awal lalu tambahkan adegan. Tiap adegan punya Panjang Scroll, Pola Gerakan Kamera, dan posisi kamera di akhir adegan.', focus: 'camera' },
      { title: 'Hidupkan layer', text: 'Di Animasi Layer, pilih ID Layer Tujuan dan Nomor Adegan, lalu isi target seperti Geser Y atau Opasitas. Nyalakan Animasi Muncul Teks untuk judul.', focus: 'text' },
    ],
    knobs: [
      { key: 'persp', label: 'Perspektif Kamera', type: 'range', value: 1000, min: 600, max: 2000, step: 100, unit: 'px' },
      { key: 'idle', label: 'Aktifkan Gerakan Berulang', type: 'toggle', value: true },
      { key: 'split', label: 'Pembagian Teks', type: 'select', value: 'Kata', options: ['Baris', 'Kata', 'Huruf'] },
      { key: 'particles', label: 'Jumlah Partikel', type: 'range', value: 0, min: 0, max: 30, step: 5 },
    ],
    content: [
      { title: 'Layer dan Konten', items: [
        ['Jenis Layer', 'Gambar, Video, Teks Langsung, Template Elementor, Bentuk / Gradasi, atau Container Elementor (bila fitur Container aktif).', 'select'],
        ['ID Layer', 'Nama unik untuk menghubungkan layer dengan Animasi Layer, misalnya bunga-depan.', 'text'],
        ['File Video · Ulangi (Loop)', 'Video diputar tanpa suara saat layer terlihat dan dijeda saat tersembunyi.', 'media'],
        ['Teks di Atas Judul · Judul · Subjudul · Isi Teks', 'Isi layer Teks Langsung.', 'text'],
        ['Teks Tombol · Tautan Tombol', 'Isi #ds-next agar tombol meluncurkan kamera ke adegan berikutnya.', 'url'],
        ['Ruang Layer', 'Otomatis, Ikut kamera 3D, atau Tetap di layar. Otomatis membuat teks, bentuk, dan container tetap terbaca.', 'select'],
        ['Kedalaman (Z)', '-800 latar jauh, 0 subjek, 200 bunga depan.', 'slider'],
        ['Posisi Horizontal · Vertikal · Titik Jangkar · Lebar', 'Letak dan ukuran layer di dalam bingkai.', 'slider'],
        ['Ruang Lebih (Overscan)', 'Mencegah tepi gambar terlihat saat kamera bergeser.', 'slider'],
        ['Jenis Gerakan', 'Gerak berulang: Mengambang, Bergoyang, Bernapas (zoom), atau Melayang ke samping.', 'select'],
        ['Bergoyang Saat Scroll', 'Layer melengkung seperti tertiup angin sesuai kecepatan scroll, cocok untuk bunga dan daun.', 'switch'],
        ['Pembagian Teks · Efek Muncul', 'Teks dipecah per Baris, Kata, atau Huruf, lalu muncul dari bawah, perlahan, atau dari buram ke tajam.', 'select'],
      ] },
      { title: 'Adegan dan Kamera', items: [
        ['Kamera Awal', 'Posisi kamera sebelum adegan pertama.', 'number'],
        ['Nama Adegan · Panjang Scroll', '100 = satu layar penuh. Makin panjang, makin pelan adegannya.', 'slider'],
        ['Pola Gerakan Kamera', 'Linear, Sine, Power 1–4, Expo, Circ, Back, dan lainnya.', 'select'],
        ['Kamera di Akhir Adegan', 'Geser Kamera X/Y, Zoom Kamera Z, Miring Atas/Bawah, Putar Kiri/Kanan, Rotasi Bidang.', 'number'],
      ] },
      { title: 'Animasi Layer', items: [
        ['ID Layer Tujuan · Nomor Adegan', 'Layer yang dianimasikan dan adegan tempat animasinya berjalan.', 'text'],
        ['Mulai dalam Adegan · Durasi Animasi · Pola Gerakan', 'Kapan animasi dimulai dan berapa lama.', 'slider'],
        ['Target Animasi', 'Geser X, Geser Y, Skala, Rotasi, Opasitas, dan Blur. Kosongkan yang ingin tetap.', 'number'],
        ['Animasi Muncul Teks', 'Huruf, kata, atau baris muncul berurutan selama gerakan ini.', 'switch'],
      ] },
      { title: 'Pengaturan Animasi', items: [
        ['Kehalusan Scroll', 'Waktu animasi mengejar scroll. 0 = langsung, 1–1,5 = sinematik.', 'slider'],
        ['Berhenti di Tiap Adegan · Pola Berhenti', 'Setelah tamu berhenti menggulir, kamera meluncur ke adegan terdekat.', 'switch'],
        ['Tetap di Belakang Konten Berikutnya', 'Bingkai diam sebagai latar, konten di bawahnya bergulir di atasnya.', 'switch'],
        ['Mainkan Adegan 1 Setelah Sampul Dibuka', 'Kamera langsung meluncur saat Sampul dibuka.', 'switch'],
        ['Perspektif Kamera', 'Makin kecil, efek 3D makin kuat.', 'slider'],
        ['Jaga Ukuran Asli Layer', 'Layer jauh tidak mengecil; kedalaman hanya memengaruhi parallax.', 'switch'],
        ['Aktifkan Gerakan Berulang · Kekuatan Goyangan Scroll', 'Saklar utama gerak halus dan seberapa jauh layer bergoyang.', 'switch'],
        ['Gerakan Halus Kamera', 'Kamera "bernapas" agar adegan tidak terasa beku saat diam.', 'slider'],
        ['Kamera Ikut Kursor · Kamera Ikut Kemiringan HP · Kekuatan Kemiringan', 'Kamera bereaksi pada kursor dan sensor HP.', 'switch'],
        ['Mode Pratinjau Editor', 'Interaktif untuk menguji scroll, atau tahan di adegan tertentu. Hanya di editor.', 'select'],
      ] },
      { title: 'Efek Partikel dan Petunjuk Gulir', items: [
        ['Jumlah Partikel · Bentuk · Warna · Ukuran', 'Serbuk cahaya, kelopak bunga, atau bokeh di berbagai kedalaman. 0 = mati.', 'slider'],
        ['Tampilkan Petunjuk · Waktu Tampil · Teks Petunjuk', 'Ajakan menggulir di bagian bawah bingkai.', 'switch'],
      ] },
    ],
    style: ['Bingkai', 'Lapisan Warna', 'Teks', 'Panel', 'Tombol', 'Petunjuk Gulir'],
    tips: [
      { q: 'Tepi gambar terlihat saat kamera bergeser', a: 'Naikkan Ruang Lebih (Overscan) pada layer itu, atau kurangi geser kamera di adegan tersebut.' },
      { q: 'Animasi layer tidak berjalan', a: 'Pastikan ID Layer Tujuan di Animasi Layer sama persis dengan ID Layer di Layer dan Konten, dan Nomor Adegan sesuai.' },
      { q: 'Terasa berat di HP', a: 'Matikan Efek Partikel dan Gerakan Halus Kamera, kurangi jumlah layer video, dan pakai gambar yang sudah dikompres.' },
      { q: 'Kemiringan HP tidak bekerja di iPhone', a: 'iPhone meminta izin sensor. Izin diminta saat tamu membuka Sampul atau mengetuk bingkai.' },
    ],
    checklist: ['Tiap layer punya ID Layer unik', 'Kedalaman latar, subjek, dan depan sudah dibedakan', 'Teks tetap terbaca di setiap adegan', 'Gambar sudah dikompres', 'Sudah dicek di HP'],
  },
]

/**
 * Fitur lengkap dan batasan tiap widget. Ditulis dari kontrol yang terdaftar dan dari
 * perilaku skrip front-end plugin (assets/js/widgets/*.js), bukan klaim pemasaran.
 */
const featureSets: Record<string, Pick<DocWidget, 'features' | 'limits'>> = {
  'sampul': {
    features: [
      { icon: 'layers', title: 'Gatefold, pita, dan segel', text: 'Dua panel membuka, pita turun, lingkaran segel berisi teks atau logo.' },
      { icon: 'users', title: 'Kartu penerima', text: 'Nama tamu dari ?to= atau /to/, dengan nama cadangan.' },
      { icon: 'tag', title: 'Token nama', text: '{primary}, {secondary}, {separator}, {names} untuk pita dan strip tengah.' },
      { icon: 'refresh', title: '2 animasi panel, 4 transisi', text: 'Bergeser atau Menyusut; Modal Turun, Modal Naik, Fade Out, Tanpa Transisi.' },
      { icon: 'shield', title: 'Kunci scroll dan Escape', text: 'Halaman terkunci sampai dibuka; tombol Esc bisa membuka sampul.' },
      { icon: 'zap', title: 'Aksi setelah terbuka', text: 'Kirim event JS, klik selector, atau gulir ke section tertentu.' },
      { icon: 'clock', title: 'Sekali per pengunjung', text: 'Status tersimpan di LocalStorage dengan key yang bisa diatur.' },
      { icon: 'globe', title: 'Tampil per perangkat', text: 'Pilih perangkat yang menampilkan sampul.' },
    ],
    limits: [
      'Nama tamu hanya terbaca dari link (?to= atau /to/). Link tanpa nama menampilkan nama cadangan.',
      'Saat Strip Tengah aktif, panel selalu memakai animasi bergeser.',
      'Tanpa Tampil Sekali per Pengunjung, sampul muncul setiap halaman dibuka.',
    ],
  },
  'hitung-mundur': {
    features: [
      { icon: 'clock', title: 'Sinkron jam server', text: 'Memakai selisih waktu server, jadi tetap tepat walau jam HP tamu salah.' },
      { icon: 'calendar', title: 'Zona waktu WordPress', text: 'Waktu target mengikuti Settings › General.' },
      { icon: 'layers', title: 'Unit fleksibel', text: 'Hari, jam, menit, detik bisa disembunyikan dan diganti labelnya.' },
      { icon: 'code', title: '2 sampai 4 digit', text: 'Tetap rapi untuk acara yang masih ratusan hari lagi.' },
      { icon: 'layout', title: 'Horizontal atau vertikal', text: 'Dengan pemisah opsional seperti ":".' },
      { icon: 'sparkle', title: 'Transisi angka', text: 'Durasi dan easing: Linear, Ease, Ease In, Ease Out, Ease In Out.' },
      { icon: 'tag', title: 'Dynamic Tags', text: 'Tanggal dan teks bisa diambil dari Dynamic Tags Elementor.' },
      { icon: 'badge', title: 'Pesan saat selesai', text: 'Plus opacity kotak setelah waktu habis.' },
    ],
    limits: [
      'Satu widget menghitung ke satu waktu. Untuk akad dan resepsi, pasang dua widget.',
      'Kotak angka tetap tampil setelah selesai; atur pesan atau opacity kotaknya.',
    ],
  },
  'tombol-audio': {
    features: [
      { icon: 'music', title: '3 sumber audio', text: 'File Media Library, URL audio, atau video YouTube.' },
      { icon: 'tag', title: 'URL dinamis', text: 'Dynamic Tag yang valid menggantikan file, dengan file sebagai cadangan.' },
      { icon: 'play', title: 'Mulai bersama Sampul', text: 'Saat Buka Undangan diklik atau setelah sampul selesai terbuka.' },
      { icon: 'refresh', title: 'Potong dan ulangi', text: 'Mulai dan berhenti di detik tertentu, lalu ulangi.' },
      { icon: 'zap', title: 'Sinkron video', text: 'Pause musik atau turunkan volume sampai batas persen saat video bersuara diputar.' },
      { icon: 'shield', title: 'Jeda saat pindah tab', text: 'Musik berhenti saat tamu meninggalkan tab; bisa dimatikan.' },
      { icon: 'sparkle', title: '5 efek saat diputar', text: 'Cincin Berputar, Denyut Cincin, Putar + Denyut, Ketukan, Cahaya Halus.' },
      { icon: 'layout', title: 'Normal atau mengambang', text: 'Tombol di alur halaman atau melayang di sudut layar.' },
    ],
    limits: [
      'Browser bisa memblokir putar otomatis sampai tamu menyentuh layar.',
      'Sinkron dengan embed YouTube/Vimeo butuh status pemutaran dari API player-nya.',
      'Video latar dan video tanpa suara diabaikan saat sinkronisasi.',
    ],
  },
  'form-whatsapp': {
    features: [
      { icon: 'send', title: 'Langsung ke WhatsApp', text: 'Pesan tersusun rapi dan terbuka ke nomor mempelai.' },
      { icon: 'layout', title: '7 tipe field', text: 'Teks, Email, Telepon, Angka, URL, Tanggal, Paragraf.' },
      { icon: 'code', title: 'Token otomatis', text: 'Label "Nama Tamu" otomatis menjadi token [nama_tamu].' },
      { icon: 'users', title: 'Pilihan kehadiran', text: 'Opsi sendiri, masuk ke pesan lewat [konfirmasi].' },
      { icon: 'wrench', title: 'Batas angka', text: 'Minimal, maksimal, dan kelipatan, misalnya jumlah tamu 1–5.' },
      { icon: 'shield', title: 'Validasi lengkap', text: 'Pesan untuk field kosong, token tidak cocok, dan nomor tidak valid.' },
      { icon: 'badge', title: 'Wajib per field', text: 'Tentukan field mana yang harus diisi.' },
      { icon: 'palette', title: '7 grup gaya', text: 'Wrapper, label, input, textarea, tombol, kehadiran, dan state.' },
    ],
    limits: [
      'Tidak menyimpan data di server; rekap RSVP dari chat WhatsApp mempelai.',
      'Tamu perlu WhatsApp (aplikasi atau WhatsApp Web) untuk mengirim.',
      'Satu nomor tujuan per widget.',
    ],
  },
  'ucapan-tamu': {
    features: [
      { icon: 'chat', title: 'Tersimpan di WordPress', text: 'Data ucapan ada di database situs Anda sendiri.' },
      { icon: 'heart', title: 'Stiker gambar dan video', text: 'Lewat popup atau langsung di form, dengan 5 posisi di komentar.' },
      { icon: 'users', title: 'Kehadiran dan ringkasan', text: 'Badge di tiap ucapan dan total per pilihan.' },
      { icon: 'refresh', title: 'Balas, edit, hapus', text: 'Izin terpisah untuk komentar dan balasan.' },
      { icon: 'shield', title: 'Kunci ke link tamu', text: 'Hanya tamu dengan link ?to= yang bisa mengirim.' },
      { icon: 'layout', title: '3 mode daftar', text: 'Otomatis saat penuh, Scroll tetap, atau Paginasi.' },
      { icon: 'clock', title: '3 format waktu', text: 'Relatif, tanggal lengkap, atau bawaan WordPress.' },
      { icon: 'palette', title: '21 grup gaya', text: 'Dari form, kartu komentar, stiker, sampai popup balasan.' },
    ],
    limits: [
      'Ucapan tidak dikirim ke MDUNDIG; datanya ikut database dan backup WordPress.',
      'Dengan Kunci ke Link Tamu, tamu tanpa link ?to= tidak bisa mengirim.',
    ],
  },
  'daftar-hadiah': {
    features: [
      { icon: 'gift', title: 'Reservasi anti-ganda', text: 'Reservasi terkonfirmasi mengurangi kapasitas secara otomatis.' },
      { icon: 'plug', title: 'Terhubung ke MDUNDIG', text: 'Cukup token website dan Uji Koneksi.' },
      { icon: 'badge', title: 'Galeri per hadiah', text: 'Foto utama sebagai sampul, foto tambahan di popup bergaleri.' },
      { icon: 'layout', title: '2 layout + swipe', text: 'Card vertikal atau horizontal, swipe atau grid di HP.' },
      { icon: 'tag', title: 'Link toko', text: 'Tautan pembelian per hadiah dengan teks sendiri.' },
      { icon: 'wrench', title: 'Ketersediaan manual', text: 'Matikan hadiah tertentu kapan saja.' },
      { icon: 'layers', title: 'Batas item tampil', text: 'Tampilkan sebagian atau semua hadiah.' },
      { icon: 'palette', title: '9 grup gaya', text: 'Card, foto, status, tombol, popup, formulir, dan lainnya.' },
    ],
    limits: [
      'Kapasitas berkurang otomatis hanya saat koneksi online ke MDUNDIG aktif; tanpa itu jumlahnya manual.',
      'Rekap reservasi dikelola di dashboard MDUNDIG, bukan di WordPress.',
    ],
  },
  'manajemen-tamu': {
    features: [
      { icon: 'users', title: 'Link pribadi per tamu', text: 'Setiap nama mendapat link ?to=, spasi otomatis aman.' },
      { icon: 'mail', title: 'Template ucapan', text: 'Formal dan Muslim siap pakai, bisa ditambah sendiri.' },
      { icon: 'tag', title: 'Token pesan', text: '[nama] dan [link-undangan] terisi otomatis.' },
      { icon: 'layers', title: 'Impor Excel', text: 'Tambahkan atau ganti daftar, bisa melewati baris judul.' },
      { icon: 'copy', title: 'Salin dan kirim', text: 'Langsung dari tabel hasil.' },
      { icon: 'refresh', title: 'Draft otomatis', text: 'Isian tersimpan di browser, aman saat halaman dimuat ulang.' },
      { icon: 'book', title: 'Template unduhan', text: 'Tautkan file Excel contoh untuk diunduh.' },
      { icon: 'wrench', title: 'Semua label bisa diganti', text: 'Teks form, tabel, dan tombol.' },
    ],
    limits: [
      'Draft tersimpan di browser yang dipakai, tidak tersinkron ke perangkat lain.',
      'Widget tidak dikunci otomatis; taruh di halaman yang tidak dibagikan ke tamu.',
    ],
  },
  'tombol-salin': {
    features: [
      { icon: 'copy', title: 'Satu ketukan', text: 'Tanpa tekan lama dan memilih teks.' },
      { icon: 'tag', title: '4 sumber salinan', text: 'Teks manual, URL halaman ini, URL kustom, atau hasil shortcode.' },
      { icon: 'shield', title: 'Jalan di browser lama', text: 'Ada cara cadangan jika Clipboard API tidak tersedia.' },
      { icon: 'sparkle', title: 'Feedback di tombol', text: 'Label berganti pesan berhasil selama durasi yang diatur.' },
      { icon: 'headset', title: '4 pesan status', text: 'Berhasil, kosong, URL tidak valid, dan gagal.' },
      { icon: 'layout', title: 'Ikon dan posisi', text: 'Ikon di awal atau akhir, tombol kiri, tengah, atau kanan.' },
    ],
    limits: [
      'Satu tombol menyalin satu isi. Untuk beberapa rekening, pasang beberapa tombol.',
    ],
  },
  'cerita-cinta': {
    features: [
      { icon: 'book', title: '2 skin scrapbook', text: 'Scrapbook Story (timeline) atau Scrapbook Collage.' },
      { icon: 'heart', title: '3 gaya timeline', text: 'Doodle Path, Ribbon Trail, Journey Icon, dengan penanda bergerak.' },
      { icon: 'layers', title: 'Slideshow per cerita', text: 'Efek transisi, durasi tampil, dan kecepatan sendiri.' },
      { icon: 'cursor', title: 'Titik fokus foto', text: 'Geser posisi X dan Y tanpa mengubah file.' },
      { icon: 'tag', title: 'Dekorasi tape dan sudut', text: 'Ikon atau gambar PNG/WebP.' },
      { icon: 'sparkle', title: '5 animasi masuk', text: 'Tanpa, Fade In, Slide Up, Slide Alternating, Zoom In.' },
      { icon: 'palette', title: 'Gaya per cerita', text: 'Warna, border, dan bayangan berbeda tiap cerita.' },
    ],
    limits: [
      'Banyak foto slideshow menambah berat halaman; kompres foto sebelum diunggah.',
    ],
  },
  'form-order': {
    features: [
      { icon: 'layers', title: 'Step builder', text: 'Susun tahap form sendiri, tiap tahap dengan ID.' },
      { icon: 'wrench', title: 'Field bebas', text: 'Tipe, opsi nilai|label, wajib, tampil, dan lebar field.' },
      { icon: 'refresh', title: 'Draft otomatis', text: 'Isian tersimpan di browser dengan masa simpan yang diatur.' },
      { icon: 'plug', title: 'Masuk MDUNDIG', text: 'Pesanan tercatat di dashboard MDUNDIG.' },
      { icon: 'shield', title: 'Antrean kirim ulang', text: 'Pesanan yang gagal terkirim dicoba lagi otomatis.' },
      { icon: 'layout', title: 'Navigasi menempel di HP', text: 'Tombol Kembali, Lanjut, Kirim tetap terlihat.' },
      { icon: 'badge', title: 'Ringkasan sebelum kirim', text: 'Petunjuk pengiriman dengan token {submit}.' },
      { icon: 'palette', title: '17 grup gaya', text: 'Dari input, radio, ringkasan, sampai notifikasi draft.' },
    ],
    limits: [
      'Butuh koneksi Form Order API yang sudah diuji di ApeironKit › Form Order.',
      'ID field bawaan jangan diubah setelah integrasi berjalan.',
    ],
  },
  'aktivitas': {
    features: [
      { icon: 'zap', title: 'Popup bukti sosial', text: 'Bergantian menampilkan nama dan produk yang dipesan.' },
      { icon: 'wrench', title: 'Data dari dashboard', text: 'Dikelola di ApeironKit › Aktivitas.' },
      { icon: 'code', title: 'Format per halaman', text: 'Kalimat sendiri dengan {name} dan {product}.' },
      { icon: 'layout', title: '4 sudut layar', text: 'Atas atau bawah, kiri atau kanan.' },
      { icon: 'badge', title: 'Foto pelanggan', text: 'Tampil di samping teks popup.' },
    ],
    limits: [
      'Hanya menampilkan aktivitas yang tersimpan di ApeironKit › Aktivitas.',
      'Dibuat untuk halaman penjualan, bukan undangan pernikahan.',
    ],
  },
  'gulir-otomatis': {
    features: [
      { icon: 'cursor', title: '2 gaya gerak', text: 'Halus Berkelanjutan atau Scroll per Bagian.' },
      { icon: 'zap', title: 'Hingga 120Hz', text: 'Native Refresh, Balanced 60fps, atau Hemat 45fps.' },
      { icon: 'refresh', title: 'Paham interaksi tamu', text: 'Melambat saat tamu menggulir, lanjut setelah diam.' },
      { icon: 'layout', title: 'Panel kecepatan', text: 'Tombol + dan − yang bisa digeser.' },
      { icon: 'clock', title: '3 mode scroll', text: 'Otomatis, Tekan & Tahan, atau Otomatis + Manual.' },
      { icon: 'badge', title: 'Progres dan kembali ke atas', text: 'Lingkaran atau garis, tombol muncul setelah sekian persen.' },
      { icon: 'shield', title: 'Ramah aksesibilitas', text: 'Mengikuti pengaturan kurangi animasi dan berhenti saat tab disembunyikan.' },
      { icon: 'sparkle', title: '7 animasi muncul', text: 'Fade, Slide, Scale, Bounce, Zoom, Flip, Elastic.' },
    ],
    limits: [
      'Gerakan bisa kurang optimal di iOS; tersedia opsi Nonaktifkan di iOS.',
      'Panjang halaman memengaruhi lama gulir; atur kecepatan sesuai isi.',
    ],
  },
  'pemuat-halaman': {
    features: [
      { icon: 'sparkle', title: '3 gaya loader', text: 'Default, Coffee, atau Water.' },
      { icon: 'clock', title: 'Progres sungguhan', text: 'Persentase mengikuti status pemuatan dokumen.' },
      { icon: 'shield', title: 'Tidak pernah macet', text: 'Maximum Timeout selalu melepas loader.' },
      { icon: 'refresh', title: 'Sekali per pengunjung', text: 'Lewat LocalStorage.' },
      { icon: 'layers', title: '5 animasi masuk, 6 keluar', text: 'Termasuk Curtain Lift dan Soft Blur.' },
      { icon: 'globe', title: 'Per perangkat', text: 'Atur tampil di desktop, tablet, atau HP.' },
    ],
    limits: [
      'Minimum Display Time menambah waktu tunggu walau halaman sudah siap.',
    ],
  },
  'paralaks-2-5d': {
    features: [
      { icon: 'layers', title: '6 jenis layer', text: 'Gambar, Video, Teks Langsung, Template, Bentuk / Gradasi, dan Container Elementor.' },
      { icon: 'play', title: 'Kamera 3D per adegan', text: 'Geser X/Y, zoom Z, miring, putar, dan rotasi, dengan pola gerakan sendiri.' },
      { icon: 'sparkle', title: 'Animasi layer per adegan', text: 'Geser, skala, rotasi, opasitas, dan blur pada waktu tertentu dalam adegan.' },
      { icon: 'tag', title: 'Teks muncul berurutan', text: 'Per baris, kata, atau huruf, dengan efek naik, pudar, atau buram ke tajam.' },
      { icon: 'refresh', title: 'Gerak berulang dan angin', text: 'Mengambang, bergoyang, bernapas, melayang, plus goyang mengikuti kecepatan scroll.' },
      { icon: 'cursor', title: 'Kursor dan kemiringan HP', text: 'Kamera ikut kursor di desktop dan sensor HP, termasuk izin sensor iPhone.' },
      { icon: 'zap', title: 'Terhubung ke Sampul', text: 'Adegan 1 bisa langsung berjalan saat Sampul dibuka; tombol #ds-next ikut memulai Tombol Audio.' },
      { icon: 'shield', title: 'Hemat dan aman gerak', text: 'Video dijeda saat tidak terlihat, dan gerak dibuat tenang bila perangkat meminta gerak dikurangi.' },
    ],
    limits: [
      'Efek terbaik saat widget diletakkan di awal halaman; bingkai menempel di layar selama semua adegan berjalan.',
      'Layer video selalu tanpa suara. Untuk musik, pakai Tombol Audio.',
      'Kamera ikut kursor hanya di perangkat dengan mouse; kemiringan HP butuh izin sensor di iPhone.',
      'Banyak layer video, partikel, dan gambar besar membuat HP lama bekerja lebih berat.',
      'Container Elementor sebagai layer hanya tersedia bila fitur Container di Elementor aktif.',
    ],
  },
}
for (const d of docs) Object.assign(d, featureSets[d.slug])

export const docBySlug = (slug: string) => docs.find((d) => d.slug === slug)
