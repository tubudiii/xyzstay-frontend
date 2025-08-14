export interface Categories {
  success: boolean;
  data: Datum[];
}

export interface Datum {
  id: number;
  image: string;
  name: string;
  slug: string;
  deleted_at: null;
  created_at: Date;
  updated_at: Date;
  boarding_houses: BoardingHouse[];
}

export interface BoardingHouse {
  id: number;
  user_id: null;
  name: string;
  slug: string;
  thumbnail: string[] | string;
  city_id: number;
  category_id: number;
  description: string;
  address: string;
  deleted_at: null;
  created_at: Date;
  updated_at: Date;
}
