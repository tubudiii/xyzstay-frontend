export interface MidtransURL {
  message: string;
  payment: Payment;
  payment_url: string;
}

export interface Payment {
  id: number;
  transaction_id: number;
  payment_method: null;
  payment_status: string;
  payment_date: null;
  expired_date: Date;
  total_price: number;
  token: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: null;
}
