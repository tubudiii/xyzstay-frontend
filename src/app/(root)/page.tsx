"use client";
import React from "react";

import CardIndicator from "@/components/molecules/card/card-indicator";
import { Button } from "@/components/atomics/button";
import { Input } from "@/components/atomics/input";
import { Separator } from "@/components/atomics/separator";
import Title from "@/components/atomics/title";
import { useGetAllCitiesQuery } from "@/services/city.service";
import { City } from "@/interfaces/city";
import CardBenefit from "@/components/molecules/card/card-benefit";
import CardPurpose from "@/components/molecules/card/card-purpose";
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/atomics/carousel";
import CardReview from "@/components/molecules/card/card-review";
import BoardingHouseShowcase from "@/components/molecules/listing/boarding-house-showcase";
import { Testimonial } from "@/interfaces/testimonial";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useGetAllTestimonialsQuery } from "@/services/testimonial.service";
import { useGetAllCategoriesQuery } from "@/services/categories.service";

function Home() {
  const { data: session } = useSession();

  const {
    data: testimonials = [],
    isLoading,
    isError,
  } = useGetAllTestimonialsQuery(null);

  const {
    data: citiesData,
    isLoading: loadingCities,
    isError: errorCities,
  } = useGetAllCitiesQuery(null);

  const cities = citiesData?.data || [];
  const router = useRouter();

  const patchedTestimonials: Testimonial[] = testimonials.map(
    (item: Testimonial) => {
      if (session?.user && item.user_id === session.user.id) {
        return {
          ...item,
          name: session.user.name, // pakai nama terbaru dari session
        };
      }
      return item;
    }
  );

  // State untuk input search
  const [search, setSearch] = React.useState("");

  // Ambil data kategori
  const {
    data: categoriesData,
    isLoading: loadingCategories,
    isError: errorCategories,
  } = useGetAllCategoriesQuery(null);
  const categories = categoriesData?.data || [];

  // Ambil data boarding house dari semua city dan category, pastikan unik
  const allBoardingHouses = [
    ...cities.flatMap((city: City) => city.boarding_houses || []),
    ...categories.flatMap((cat: any) => cat.boarding_houses || []),
  ];
  // Filter agar hanya boarding house dengan id unik
  const boardingHouses = allBoardingHouses.filter(
    (bh, idx, arr) =>
      bh?.id && arr.findIndex((item) => item?.id === bh?.id) === idx
  );

  // Fungsi handle search
  const handleSearch = () => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return;

    // Cari city
    const foundCity = cities.find((city: City) =>
      city.name.toLowerCase().includes(keyword)
    );
    if (foundCity) {
      router.push(`/boardinghouse/catalog?city=${foundCity.id}`);
      return;
    }

    // Cari category
    const foundCategory = categories.find((cat: any) =>
      cat.name.toLowerCase().includes(keyword)
    );
    if (foundCategory) {
      router.push(`/boardinghouse/catalog?category=${foundCategory.id}`);
      return;
    }

    // Cari boarding house
    const foundBH = boardingHouses.find((bh: any) =>
      bh.name?.toLowerCase().includes(keyword)
    );
    if (foundBH) {
      router.push(`/boardinghouse/catalog?boardinghouse=${foundBH.id}`);
      return;
    }

    // Jika tidak ditemukan, redirect ke katalog dengan query search
    router.push(`/boardinghouse/catalog?search=${encodeURIComponent(search)}`);
  };

  return (
    <main>
      {/* HERO */}
      <section
        id="hero-section"
        className={`bg-primary-foreground bg-cover lg:bg-contain bg-right bg-no-repeat bg-[url('/images/avatar-3d.png')] min-h-[750px] max-h-[750px] xl:max-h-[850px]`}
      >
        <div className="pt-[226px] container mx-auto">
          <div className="max-w-[555px]">
            <Title
              title="Find Glorious Living And Loving Space"
              subtitle="Discover comfortable, affordable boarding houses for every lifestyle. Your new home is just a search away."
              section="hero"
            />
            <div className="pt-[50px] flex items-center">
              <div className="grow">
                <Input
                  placeholder="Search by city, category, or boarding house..."
                  variant="hero"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                />
              </div>
              <Button variant="default" size="hero" onClick={handleSearch}>
                Explore
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* INDICATORS */}
      <section
        id="indicator-section"
        className="px-10 xl:container xl:mx-auto -mt-16 pb-9"
      >
        <div className="h-[128px] flex justify-center xl:justify-between items-center space-x-6 xl:space-x-12 bg-white shadow-indicator rounded-[20px] px-9 py-5 xl:px-[50px] xl:py-[29px]">
          {/* Boarding House Indicator */}
          <CardIndicator
            icon="/icons/house-2.svg"
            title={
              boardingHouses.length
                ? boardingHouses.length.toLocaleString()
                : "0"
            }
            subtitle="Boarding Houses Available"
            variant="indicator"
          />
          <Separator orientation="vertical" className="bg-separator" />
          {/* Customer Satisfaction Indicator */}
          <CardIndicator
            icon="/icons/people-2.svg"
            title={
              patchedTestimonials.length
                ? (
                    patchedTestimonials.reduce(
                      (acc, cur) => acc + (cur.rating || 0),
                      0
                    ) / patchedTestimonials.length
                  ).toFixed(1)
                : "-"
            }
            subtitle="Customer Satisfaction"
            variant="indicator"
          />
          <Separator orientation="vertical" className="bg-separator" />
          {/* Security Indicator (tetap hardcoded jika tidak ada data) */}
          <CardIndicator
            icon="/icons/security-user.svg"
            title="100%"
            subtitle="High Security"
            variant="indicator"
          />
        </div>
      </section>

      {/* BOARDING HOUSE SHOWCASE */}
      <BoardingHouseShowcase
        id="deals-section"
        title="Our Latest Deals"
        subtitle="Explore the beauty of architecture and living love"
      />

      {/* CITIES */}
      <section id="cities-section" className="bg-gray-light">
        <div className="px-10 xl:container xl:mx-auto py-[50px]">
          <div className="flex items-center justify-between">
            <Title
              title="Cities"
              subtitle="List of cities with boarding houses"
            />
          </div>

          <div className="mt-[30px] grid grid-cols-3 xl:grid-cols-4 gap-[30px]">
            {loadingCities ? (
              <div className="col-span-3 xl:col-span-4 text-center text-gray-400">
                Loading...
              </div>
            ) : errorCities ? (
              <div className="col-span-3 xl:col-span-4 text-center text-red-400">
                Failed to load cities.
              </div>
            ) : cities.length === 0 ? (
              <div className="col-span-3 xl:col-span-4 text-center text-gray-400">
                No cities yet.
              </div>
            ) : (
              cities.map((city: City) => {
                const backendUrl =
                  process.env.NEXT_PUBLIC_STORAGE_BASE_URL || "";
                let imageSrc = city.image;
                if (imageSrc && !imageSrc.startsWith("http")) {
                  if (imageSrc.startsWith("/")) {
                    imageSrc = imageSrc.substring(1);
                  }
                  if (
                    imageSrc.startsWith("storage/") ||
                    imageSrc.startsWith("cities/")
                  ) {
                    imageSrc = `${backendUrl.replace(/\/$/, "")}/${imageSrc}`;
                  } else {
                    imageSrc = `${backendUrl.replace(
                      /\/$/,
                      ""
                    )}/storage/${imageSrc}`;
                  }
                }
                return (
                  <div
                    key={city.id}
                    className="cursor-pointer"
                    onClick={() =>
                      router.push(`/boardinghouse/catalog?city=${city.id}`)
                    }
                  >
                    <CardIndicator
                      icon={imageSrc}
                      title={city.name}
                      subtitle={`${city.boarding_houses.length} boarding houses`}
                      section="categories"
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* BENEFITS & CATEGORIES */}
      <section
        id="benefits-section"
        className="px-10 xl:container xl:mx-auto mt-[100px]"
      >
        <div className="flex justify-between gap-4 items-stretch">
          <div className="max-w-[320px] xl:max-w-[383px] h-full flex flex-col justify-between">
            <div>
              <h1 className="font-bold text-[28px] leading-[42px] max-w-[350px]">
                Huge Benefits That Make You Feel Happier
              </h1>
              <ul className="mt-[30px] space-y-5">
                <CardBenefit benefit="Checking faster without depositing" />
                <CardBenefit benefit="24/7 security guarding your place" />
                <CardBenefit benefit="Fast-internet access without lagging" />
                <CardBenefit benefit="High standard of layout of houses" />
                <CardBenefit benefit="All other benefits, we promise" />
              </ul>
            </div>
          </div>
          <div className="max-w-[650px] h-full flex items-center">
            {loadingCategories ? (
              <div className="w-full text-center text-gray-400">Loading...</div>
            ) : errorCategories ? (
              <div className="w-full text-center text-red-400">
                Failed to load categories.
              </div>
            ) : categories.length === 0 ? (
              <div className="w-full text-center text-gray-400">
                No categories yet.
              </div>
            ) : (
              <Carousel className="w-full">
                <CarouselContent>
                  {categories.map((cat: any) => {
                    const backendUrl = process.env.NEXT_PUBLIC_STORAGE_BASE_URL;
                    let imageSrc = Array.isArray(cat.image)
                      ? cat.image[0]
                      : cat.image;
                    if (imageSrc && !imageSrc.startsWith("http")) {
                      if (
                        imageSrc.startsWith("storage/") ||
                        imageSrc.startsWith("cities/")
                      ) {
                        imageSrc = `${backendUrl}/${imageSrc}`;
                      } else {
                        imageSrc = `${backendUrl}/storage/${imageSrc}`;
                      }
                    }
                    return (
                      <div
                        key={cat.id}
                        className="cursor-pointer"
                        onClick={() =>
                          router.push(
                            `/boardinghouse/catalog?category=${cat.id}`
                          )
                        }
                      >
                        <CardPurpose
                          image={imageSrc}
                          title={cat.name}
                          purpose={
                            cat.boarding_houses?.length
                              ? cat.boarding_houses.length.toLocaleString()
                              : "0"
                          }
                        />
                      </div>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            )}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="review-section" className="container mx-auto my-[100px]">
        <div className="flex justify-center text-center">
          <Title
            title="Happy Customers"
            subtitle={`We’d love to come back again soon`}
          />
        </div>
        <div className="mt-[30px] grid grid-cols-3 gap-[30px]">
          {isLoading ? (
            <div className="col-span-3 text-center text-gray-400">
              Loading...
            </div>
          ) : isError ? (
            <div className="col-span-3 text-center text-red-400">
              Failed to load testimonials.
            </div>
          ) : patchedTestimonials.length === 0 ? (
            <div className="col-span-3 text-center text-gray-400">
              No testimonials yet.
            </div>
          ) : (
            patchedTestimonials.map((item: Testimonial) => (
              <CardReview
                key={item.id}
                rating={item.rating}
                review={item.content}
                avatar={item.photo_url || "/images/avatar.webp"}
                username={item.name}
                jobdesk={"Customer"}
              />
            ))
          )}
        </div>
      </section>
    </main>
  );
}

export default Home;
