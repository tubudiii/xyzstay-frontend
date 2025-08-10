"use client";
import React from "react";
import Title from "@/components/atomics/title";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/atomics/carousel";
import CardDeals from "@/components/molecules/card/card-deals";
import { useGetAllBoardingHouseQuery } from "@/services/boardinghouse.service";

interface BoardingHouseShowcaseProps {
  id: string;
  title: string;
  subtitle: string;
}

function BoardingHouseShowcase({
  id,
  title,
  subtitle,
}: BoardingHouseShowcaseProps) {
  const { data } = useGetAllBoardingHouseQuery({});
  const boardingHouses = data?.data?.data || [];

  // console.log("🚀 BoardingHouse:", boardingHouses);

  return (
    <section id={id} className="px-10 xl:container xl:mx-auto pt-16 pb-[100px]">
      <div className="flex justify-center text-center">
        <Title title={title} subtitle={subtitle} />
      </div>
      <Carousel className="w-full mt-[30px]">
        <CarouselContent>
          {boardingHouses.map((house: any, index: number) => {
            // Filter hanya room yang available
            const availableRooms = (house.rooms || []).filter(
              (room: any) => room.is_available === 1
            );

            // Ambil room dengan harga terendah
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
    </section>
  );
}

export default BoardingHouseShowcase;
