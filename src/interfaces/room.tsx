// src/interfaces/room.ts
export interface RoomImage {
  id: number;
  room_id: number;
  image: string; // path atau URL gambar
  created_at?: string;
  updated_at?: string;
}

export interface City {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface BoardingHouse {
  id: number;
  name: string;
  slug: string;
  address: string;
  city_id: number;
  category_id: number;
  city?: City;
  category?: Category;
  created_at?: string;
  updated_at?: string;
}

export interface Room {
  id: number;
  boarding_house_id: number;
  name: string;
  slug: string;
  price: number;
  capacity: number;
  is_available: boolean;
  boardingHouse?: BoardingHouse; // relasi ke BoardingHouse
  images?: RoomImage[]; // relasi ke RoomImage[]
  created_at?: string;
  updated_at?: string;
}
