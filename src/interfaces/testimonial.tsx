// src/interfaces/testimonial.ts
export interface Testimonial {
  id: number;
  boarding_house_id: number;
  user_id: number;
  photo: string | null;
  name: string;
  content: string;
  rating: number;
  photo_url?: string; // Ini opsional, untuk menyimpan URL foto yang bisa diakses
}
