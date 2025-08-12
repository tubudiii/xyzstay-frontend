import { BoardingHouse, Room } from "./boarding-house";

export interface Transaction {
  id: number;
  user_id: number;
  code: string;
  boarding_house_id: number;
  room_id: number;
  name: string;
  email: string;
  phone_number: null;
  start_date: Date;
  end_date: Date;
  price_per_day: number;
  total_days: number;
  fee: number;
  total_price: number;
  payment_method: string;
  payment_status: string;
  transaction_date: null;
  deleted_at: null;
  created_at: Date;
  updated_at: Date;
  boarding_house: BoardingHouse;
  room: Room;
}
