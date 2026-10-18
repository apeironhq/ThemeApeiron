/**
 * Testimoni asli pelanggan ApeironKit (dengan izin pelanggan).
 * Selama array kosong, section Testimoni tidak ditampilkan
 * (agar tidak ada testimoni fiktif di website).
 */
export interface Testimonial {
  quote: string
  name: string
  role: string
}

export const testimonials: Testimonial[] = []
