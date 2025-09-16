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
  id: string;
  title: string;
  subtitle: string;
  boardingHouses?: any[];
}

function BoardingHouseShowcase({
  id,
  title,
  subtitle,
  boardingHouses: propBoardingHouses,
}: BoardingHouseShowcaseProps) {
  const { data: session } = useSession();

  // Ambil semua testimonial
  const { data: testimonials = [] } = useGetAllTestimonialsQuery(null);

  // Cek apakah user sudah kasih testimonial
  const userHasTestimonial =
    session?.user &&
    testimonials.some((item: any) => item.user_id === session.user.id);

  // Ambil rekomendasi hanya jika user login dan sudah testimonial
  const {
    data: recommendations,
    isLoading: loadingRecommendations,
    isError: errorRecommendations,
  } = useGetRecommendationsQuery(
    userHasTestimonial && session?.user?.token ? session.user.token : "",
    { skip: !userHasTestimonial || !session?.user?.token }
  );

  // Ambil semua boarding house jika user belum testimonial atau tidak login
  const {
    data: allBHData,
    isLoading: loadingAllBH,
    isError: errorAllBH,
  } = useGetAllBoardingHouseQuery(null, {
    skip: userHasTestimonial && !!session?.user, // skip hanya jika user login dan sudah testimonial
  });

  // Tentukan data yang akan dipakai
  let boardingHouses: any[] = [];
  let isLoading = false;
  let isError = false;
  let isRecommendation = false;

  if (session?.user && userHasTestimonial) {
    boardingHouses = recommendations?.data || [];
    isLoading = loadingRecommendations;
    isError = errorRecommendations;
    isRecommendation = true;
  } else {
    boardingHouses =
      propBoardingHouses !== undefined
        ? propBoardingHouses
        : allBHData?.data?.data || [];
    isLoading = loadingAllBH;
    isError = errorAllBH;
    isRecommendation = false;
  }

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
            ? "Gagal memuat rekomendasi."
            : "Gagal memuat boarding house."}
        </div>
      ) : boardingHouses.length === 0 ? (
        <div className="text-center text-gray-400">
          {isRecommendation
            ? "Belum ada rekomendasi untuk Anda."
            : "Belum ada data boarding house."}
        </div>
      ) : (
        <Carousel className="w-full mt-[30px]">
          <CarouselContent>
            {boardingHouses.map((house: any, index: number) => {
              const availableRooms = (house.rooms || []).filter(
                (room: any) => room.is_available === 1
              );
              const cheapestRoom =
                availableRooms.sort(
                  (a: any, b: any) => a.price_per_day - b.price_per_day
                )[0] || {};
              return (
                <CarouselItem key={index} className="basis-1/4">
                  <CardDeals
                    image={house.thumbnail?.[0] || ""}
                    title={house.name}
                    slug={`/boardinghouse/${house.slug}`}
                    price={cheapestRoom.price_per_day}
                    wide={cheapestRoom.square_feet}
                    capacity={cheapestRoom.capacity}
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
