// src/interfaces/boarding-house.tsx

export interface City {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface RoomImage {
  id: number;
  room_id: number;
  image: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface Room {
  id: number;
  boarding_house_id: number;
  name: string;
  slug: string;
  room_type: string;
  square_feet: number;
  capacity: number;
  price_per_day: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;

  images: RoomImage[];
}

export interface Testimonial {
  id: number;
  boarding_house_id: number;
  user_id: number;
  photo: string | null;
  name: string;
  content: string;
  rating: number;
  photo_url?: string;
}

export interface BoardingHouse {
  id: number;
  name: string;
  slug: string;
  thumbnail: string;
  city_id: number;
  category_id: number;
  description: string;
  address: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;

  // Relasi
  city: City;
  category: Category;
  rooms: Room[];
  testimonials: Testimonial[];

  // Data tambahan dari withCount
  transactions_count: number;
}

// ✅ Room yang otomatis include boarding house
export interface RoomWithBoardingHouse extends Room {
  boarding_house: BoardingHouse;
}

export interface BoardingHousePagination {
  current_page: number;
  data: BoardingHouse[];
  last_page: number;
  per_page: number;
  total: number;
}

export interface BoardingHouseApiResponse {
  success: boolean;
  message: string;
  data: BoardingHousePagination;
}
