/**
 * Paket harga resmi ApeironKit.
 * Isi dengan harga asli. Selama array kosong, section Harga tidak ditampilkan
 * (agar tidak ada harga fiktif di website).
 */
export interface PricingPlan {
  name: string
  price: string
  period: string
  description: string
  features: { icon: string; text: string }[]
  featured?: boolean
  ctaUrl: string
}

export const pricing: PricingPlan[] = []
