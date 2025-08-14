// src/interfaces/city-transaction.tsx
export interface CityTransactionProps {
  id: number;
  id_payment: number; // Optional, if payment ID is needed
  room: {
    images: { image: string }[]; // Menambahkan informasi gambar kamar
  };
  boardinghouse_name: string;
  title: string;
  location: string;
  days: number;
  price: number;
  status: string;
  status_payment: string;
}
