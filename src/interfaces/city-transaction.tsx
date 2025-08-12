// src/interfaces/city-transaction.tsx
export interface CityTransactionProps {
  id: number;
  room: {
    images: { image: string }[]; // Menambahkan informasi gambar kamar
  };
  boardinghouse_name: string;
  title: string;
  location: string;
  days: number;
  price: number;
  status: string;
}
