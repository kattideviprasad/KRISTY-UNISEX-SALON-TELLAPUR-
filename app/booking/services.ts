export type SalonService = {
  id: string;
  name: string;
  price_inr: number | null;
  duration_minutes: number | null;
  category: string;
};

export const SALON_SERVICES: SalonService[] = [
  // Face & Skin Care
  { id: 'facial', name: 'Facial', price_inr: null, duration_minutes: 45, category: 'Face & Skin Care' },
  { id: 'anti-acne-facial', name: 'Anti Acne Facial', price_inr: null, duration_minutes: 60, category: 'Face & Skin Care' },
  { id: 'skin-treatment', name: 'Skin Treatment', price_inr: null, duration_minutes: 60, category: 'Face & Skin Care' },
  { id: 'skin-treatment-anti-acne', name: 'Skin Treatment – Anti Acne', price_inr: null, duration_minutes: 60, category: 'Face & Skin Care' },
  { id: 'd-tan-pack-face', name: 'D-Tan Pack – Face', price_inr: null, duration_minutes: 30, category: 'Face & Skin Care' },
  { id: 'tan-pack-face', name: 'Tan Pack – Face', price_inr: null, duration_minutes: 30, category: 'Face & Skin Care' },
  { id: 'chemical-peel', name: 'Chemical Peel Treatment', price_inr: null, duration_minutes: 45, category: 'Face & Skin Care' },
  { id: 'facial-wrinkles', name: 'Facial Wrinkles', price_inr: null, duration_minutes: 60, category: 'Face & Skin Care' },
  { id: 'radiance-cocoa-facial', name: 'Radiance Rejuvenating Cocoa Facial', price_inr: null, duration_minutes: 60, category: 'Face & Skin Care' },
  { id: 'facial-glow', name: 'Facial Glow', price_inr: null, duration_minutes: 45, category: 'Face & Skin Care' },
  { id: 'pimple-treatment', name: 'Pimple Treatment', price_inr: null, duration_minutes: 45, category: 'Face & Skin Care' },
  { id: 'vital-peel-facial', name: 'Vital Peel Facial', price_inr: null, duration_minutes: 60, category: 'Face & Skin Care' },
  { id: 'thermo-herb-facial', name: 'Thermo Herb Facial', price_inr: null, duration_minutes: 60, category: 'Face & Skin Care' },

  // Hair
  { id: 'hair-cut', name: 'Hair Cut', price_inr: null, duration_minutes: 30, category: 'Hair' },
  { id: 'advance-hair-cut', name: 'Advance Hair Cut', price_inr: null, duration_minutes: 45, category: 'Hair' },
  { id: 'hair-styling', name: 'Hair Styling', price_inr: null, duration_minutes: 45, category: 'Hair' },
  { id: 'hair-extension', name: 'Hair Extension', price_inr: null, duration_minutes: 90, category: 'Hair' },
  { id: 'shaving', name: 'Shaving', price_inr: null, duration_minutes: 20, category: 'Hair' },

  // Bridal & Makeup
  { id: 'basic-makeup', name: 'Basic Makeup', price_inr: null, duration_minutes: 60, category: 'Bridal & Makeup' },
  { id: 'bridal-package', name: 'Bridal Package', price_inr: null, duration_minutes: 180, category: 'Bridal & Makeup' },
  { id: 'basic-mehandi', name: 'Basic Mehandi', price_inr: null, duration_minutes: 60, category: 'Bridal & Makeup' },
  { id: 'bridal-mehandi', name: 'Bridal Mehandi', price_inr: null, duration_minutes: 120, category: 'Bridal & Makeup' },

  // Threading
  { id: 'threading-eyebrows', name: 'Threading – Eyebrows', price_inr: null, duration_minutes: 15, category: 'Threading' },

  // Nails
  { id: 'premium-manicure', name: 'Premium Manicure', price_inr: null, duration_minutes: 45, category: 'Nails' },
];
