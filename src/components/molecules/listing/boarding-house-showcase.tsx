"use client";
import React from "react";
import { Button } from "@/components/atomics/button";
import Title from "@/components/atomics/title";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/atomics/carousel";
import CardDeals from "@/components/molecules/card/card-deals";
import {
  useGetAllBoardingHouseQuery,
  useGetRecommendationsQuery,
} from "@/services/boardinghouse.service";
import { useGetAllTestimonialsQuery } from "@/services/testimonial.service";
import { useSession } from "next-auth/react";

interface BoardingHouseShowcaseProps {
  /**
   * Section id fallback when NOT showing recommendations.
   * When recommendations are shown, id will be forced to "recommendation-section".
   */
  id: string;
  title: string;
  subtitle: string;
  /**
   * Optional pre-fetched list (e.g., from server-side page) used when not in recommendation mode
   */
  boardingHouses?: any[];
  /**
   * Force showing recommendations (for debugging/testing)
   */
  forceRecommendation?: boolean;
}

function BoardingHouseShowcase({
  id,
  title,
  subtitle,
  boardingHouses: propBoardingHouses,
  forceRecommendation = false,
}: BoardingHouseShowcaseProps) {
  const { data: session } = useSession();

  // Ambil semua testimonial (untuk cek apakah user sudah pernah memberi rating/ulasan)
  const { data: testimonialsData } = useGetAllTestimonialsQuery(null);
  const testimonials: any[] = Array.isArray(testimonialsData)
    ? testimonialsData
    : testimonialsData?.data || [];

  // Cek apakah user sudah kasih testimonial
  const userHasTestimonial = Boolean(
    session?.user &&
      testimonials?.some((t: any) => t.user_id === session?.user?.id)
  );

  // Ambil rekomendasi hanya jika user login & sudah testimonial (atau dipaksa via prop)
  const shouldFetchRecommendations =
    (session?.user && userHasTestimonial) || forceRecommendation;

  const {
    data: recommendations,
    isLoading: loadingRecommendations,
    isError: errorRecommendations,
  } = useGetRecommendationsQuery(
    shouldFetchRecommendations && session?.user?.token
      ? session.user.token
      : "",
    { skip: !shouldFetchRecommendations || !session?.user?.token }
  );

  // Ambil semua boarding house jika user belum testimonial atau tidak login
  const {
    data: allBHData,
    isLoading: loadingAllBH,
    isError: errorAllBH,
  } = useGetAllBoardingHouseQuery(null, {
    skip: shouldFetchRecommendations, // skip bila sedang pakai rekomendasi
  });

  // Tentukan data yang akan dipakai
  let items: any[] = [];
  let isLoading = false;
  let isError = false;
  let isRecommendation = false;

  if (shouldFetchRecommendations) {
    items = recommendations?.data || [];
    isLoading = loadingRecommendations;
    isError = errorRecommendations;
    isRecommendation = true;
  } else {
    items =
      propBoardingHouses !== undefined
        ? propBoardingHouses
        : allBHData?.data?.data || [];
    isLoading = loadingAllBH;
    isError = errorAllBH;
    isRecommendation = false;
  }

  // Helper aman untuk ambil thumbnail (array/string/null)
  const getThumbnail = (thumb: any): string => {
    if (!thumb) return "";
    if (Array.isArray(thumb)) return thumb[0] || "";
    return String(thumb);
  };

  return (
    <section
      id={isRecommendation ? "recommendation-section" : id}
      className="container mx-auto my-[100px]"
    >
      <div className="flex justify-center text-center mb-8">
        <Title
          title={
            isRecommendation ? "Recommended Boarding Houses For You" : title
          }
          subtitle={
            isRecommendation
              ? "Personalized recommendations based on your testimonial"
              : subtitle
          }
        />
      </div>

      {isLoading ? (
        <div className="text-center text-gray-400">
          {isRecommendation
            ? "Loading recommendations..."
            : "Loading boarding houses..."}
        </div>
      ) : isError ? (
        <div className="text-center text-red-400">
          {isRecommendation
            ? "Failed to load recommendation."
            : "Failed to load boarding house."}
        </div>
      ) : !items || items.length === 0 ? (
        <div className="text-center text-gray-400">
          {isRecommendation
            ? "No recommendations available for you."
            : "No boarding house data available."}
        </div>
      ) : (
        <Carousel className="w-full mt-[30px]">
          <CarouselContent>
            {items.map((house: any, index: number) => {
              // Filter only available rooms (accept true/1)
              const availableRooms = (house.rooms || []).filter((room: any) =>
                Boolean(room?.is_available)
              );

              // Pick the cheapest room
              const cheapestRoom =
                [...availableRooms].sort(
                  (a: any, b: any) =>
                    (a?.price_per_day ?? Infinity) -
                    (b?.price_per_day ?? Infinity)
                )[0] || null;

              return (
                <CarouselItem key={house?.id ?? index} className="basis-1/4">
                  <CardDeals
                    image={getThumbnail(house?.thumbnail)}
                    title={house?.name || "Unnamed"}
                    slug={`/boardinghouse/${house?.slug ?? ""}`}
                    price={cheapestRoom ? cheapestRoom.price_per_day : "N/A"}
                    wide={cheapestRoom ? cheapestRoom.square_feet : "N/A"}
                    capacity={cheapestRoom ? cheapestRoom.capacity : "N/A"}
                    // Tampilkan skor prediksi bila response rekomendasi menyertakannya
                    rating={house?.predicted_score}
                    showRating={isRecommendation}
                  />
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}

      <div className="flex justify-center mt-2">
        <Button
          variant="default"
          size="header"
          onClick={() => {
            window.location.href = "/boardinghouse/catalog";
          }}
        >
          See More
        </Button>
      </div>
    </section>
  );
}

export default BoardingHouseShowcase;
