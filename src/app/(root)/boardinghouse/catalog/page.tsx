"use client";
import CardDeals from "@/components/molecules/card/card-deals";
import { useGetAllBoardingHouseQuery } from "@/services/boardinghouse.service";
import { useGetAllCategoriesQuery } from "@/services/categories.service";
import { useGetAllCitiesQuery } from "@/services/city.service";
import { BoardingHouse } from "@/interfaces/boarding-house";
import { Datum as Category } from "@/interfaces/categories";
import { City } from "@/interfaces/city";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function CatalogPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  // ...existing code...
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? Number(pageParam) : 1;

  // Gunakan query param sebagai state filter
  const categoryParam = searchParams.get("category");
  const cityParam = searchParams.get("city");
  const selectedCategory = categoryParam ? Number(categoryParam) : null;
  const selectedCity = cityParam ? Number(cityParam) : null;

  // Jika ada filter city/category, ambil semua data (per_page besar)
  const isFilterActive = !!selectedCategory || !!selectedCity;
  const perPage = isFilterActive ? 1000 : 16;
  const page = isFilterActive ? 1 : currentPage;
  const { data, isLoading, isError } = useGetAllBoardingHouseQuery({
    page,
    per_page: perPage,
    category: selectedCategory || undefined,
    city: selectedCity || undefined,
  });
  const { data: categoriesData } = useGetAllCategoriesQuery({});
  const { data: citiesData } = useGetAllCitiesQuery({});
  const boardingHouses: BoardingHouse[] = data?.data?.data || [];
  const lastPage: number = isFilterActive ? 1 : data?.data?.last_page || 1;
  const categories: Category[] = categoriesData?.data || [];
  const cities: City[] = citiesData?.data || [];

  // State untuk search
  const [searchTerm, setSearchTerm] = useState("");

  // Filter logic
  const filteredBoardingHouses = boardingHouses.filter((house) => {
    let match = true;
    if (selectedCategory)
      match = match && house.category_id === selectedCategory;
    if (selectedCity) match = match && house.city_id === selectedCity;
    // Filter by search term
    if (searchTerm.trim()) {
      match =
        match && house.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return match;
  });

  // Handler untuk update query param saat klik filter
  const handleCategoryClick = (catId: number | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (catId === null) {
      params.delete("category");
    } else {
      params.set("category", String(catId));
    }
    params.set("page", "1"); // Reset ke halaman 1 saat filter
    router.push(`/boardinghouse/catalog?${params.toString()}`);
  };
  const handleCityClick = (cityId: number | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cityId === null) {
      params.delete("city");
    } else {
      params.set("city", String(cityId));
    }
    params.set("page", "1"); // Reset ke halaman 1 saat filter
    router.push(`/boardinghouse/catalog?${params.toString()}`);
  };

  // Handler untuk pagination
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/boardinghouse/catalog?${params.toString()}`);
  };

  return (
    <main className="bg-gray-light pt-[170px] pb-[50px] min-h-screen">
      <div className="px-10 xl:container xl:mx-auto">
        <h1 className="font-bold text-3xl mb-8 text-secondary text-center">
          Catalog Boarding House
        </h1>

        {/* Search Bar */}
        <form
          className="flex w-full max-w-lg mx-auto mb-8 shadow-lg rounded-xl overflow-hidden bg-white border border-gray-200"
          onSubmit={(e) => {
            e.preventDefault();
            setSearchTerm(searchTerm.trim());
          }}
        >
          <input
            type="text"
            className="flex-1 px-5 py-3 text-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-secondary border-none outline-none"
            placeholder="🔍 Cari nama boarding house..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-secondary to-primary text-white font-semibold text-lg transition-all hover:from-primary hover:to-secondary focus:outline-none"
          >
            Search
          </button>
        </form>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div>
            <span className="font-semibold mr-2">Category:</span>
            <button
              className={`px-3 py-1 rounded border ${
                selectedCategory === null
                  ? "bg-secondary text-white"
                  : "bg-white text-secondary"
              }`}
              onClick={() => handleCategoryClick(null)}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`px-3 py-1 rounded border ml-2 ${
                  selectedCategory === cat.id
                    ? "bg-secondary text-white"
                    : "bg-white text-secondary"
                }`}
                onClick={() => handleCategoryClick(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
          <div>
            <span className="font-semibold mr-2">City:</span>
            <button
              className={`px-3 py-1 rounded border ${
                selectedCity === null
                  ? "bg-secondary text-white"
                  : "bg-white text-secondary"
              }`}
              onClick={() => handleCityClick(null)}
            >
              All
            </button>
            {cities.map((city) => (
              <button
                key={city.id}
                className={`px-3 py-1 rounded border ml-2 ${
                  selectedCity === city.id
                    ? "bg-secondary text-white"
                    : "bg-white text-secondary"
                }`}
                onClick={() => handleCityClick(city.id)}
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>

        {isLoading && <div className="text-center">Loading...</div>}
        {isError && (
          <div className="text-center text-red-500">Failed to load data.</div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredBoardingHouses.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 text-lg py-10">
              No catalog
            </div>
          ) : (
            filteredBoardingHouses.map((house) => {
              // Filter hanya room yang available
              const availableRooms = (house.rooms || []).filter(
                (room) => room.is_available
              );
              // Ambil room dengan harga terendah
              const cheapestRoom =
                availableRooms.sort(
                  (a, b) => a.price_per_day - b.price_per_day
                )[0] || {};
              return (
                <CardDeals
                  key={house.id}
                  image={
                    Array.isArray(house.thumbnail)
                      ? house.thumbnail[0]
                      : house.thumbnail
                  }
                  title={house.name}
                  slug={`/boardinghouse/${house.slug}`}
                  price={cheapestRoom.price_per_day}
                  wide={cheapestRoom.square_feet}
                  capacity={cheapestRoom.capacity}
                />
              );
            })
          )}
        </div>

        {/* Pagination */}
        {lastPage > 1 && (
          <div className="flex justify-center mt-10 gap-2">
            <button
              className={`px-3 py-1 rounded border ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-500"
                  : "bg-white text-secondary"
              }`}
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>
            {[...Array(lastPage)].map((_, idx) => (
              <button
                key={idx + 1}
                className={`px-3 py-1 rounded border ${
                  currentPage === idx + 1
                    ? "bg-secondary text-white"
                    : "bg-white text-secondary"
                }`}
                onClick={() => handlePageChange(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}
            <button
              className={`px-3 py-1 rounded border ${
                currentPage === lastPage
                  ? "bg-gray-300 text-gray-500"
                  : "bg-white text-secondary"
              }`}
              disabled={currentPage === lastPage}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
