export interface BoardingHouse {
  id: number;
  user_id: number | null;
  name: string;
  slug: string;
  thumbnail: string | string[];
  city_id: number;
  category_id: number;
  description: string;
  address: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface City {
  id: number;
  image: string;
  name: string;
  slug: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  boarding_houses: BoardingHouse[];
}

export interface CitiesResponse {
  success: boolean;
  message: string;
  data: City[];
}
