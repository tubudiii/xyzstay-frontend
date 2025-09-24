"use client";
import Breadcrumbs from "@/components/molecules/breadcrumbs";
import CardFacility from "@/components/molecules/card/card-facility";
import CardStar from "@/components/molecules/card/card-star";
import { Badge } from "@/components/atomics/badge";
import { Button } from "@/components/atomics/button";
import Title from "@/components/atomics/title";
import Image from "next/image";
// import MyMap from "@/components/molecules/map";
import ListingShowcase from "@/components/molecules/listing/boarding-house-showcase";
import PhotoGallery from "./photo-gallery";
import BookingSection from "./booking-section";
import { useState } from "react";
import CustomerReviews from "./customer-reviews";
import { useGetDetailBoardingHouseQuery } from "@/services/boardinghouse.service";
import { BoardingHouse } from "@/interfaces/boarding-house";
import { useMemo } from "react";

function Detail({ params }: { params: { id: string } }) {
  const { data } = useGetDetailBoardingHouseQuery(params.id);
  const BoardingHouse: BoardingHouse | undefined = useMemo(
    () => data?.data,
    [data]
  );

  // State untuk room yang dipilih
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const selectedRoom =
    BoardingHouse?.rooms.find((room) => room.id === selectedRoomId) ?? null;

  // Ambil semua room_images dari room yang dipilih, jika tidak ada room yang dipilih
  // tampilkan semua room_images dari semua room, jika tidak ada tampilkan thumbnail boarding house
  let galleryImages: string[] = [];
  if (selectedRoomId && selectedRoom && selectedRoom.images?.length > 0) {
    galleryImages = selectedRoom.images.map((img) => img.image);
  } else if (BoardingHouse?.thumbnail) {
    galleryImages = Array.isArray(BoardingHouse.thumbnail)
      ? BoardingHouse.thumbnail
      : [BoardingHouse.thumbnail];
  }

  return (
    <main>
      <section
        id="overview-section"
        className="bg-gray-light pt-[170px] pb-[50px]"
      >
        <div className="px-10 xl:container xl:mx-auto">
          <Breadcrumbs />

          <PhotoGallery photos={galleryImages} />

          <div className="mt-[30px] grid grid-cols-3 xl:grid-cols-4 gap-x-5">
            <div className="col-span-2 xl:col-span-3 space-y-5 pr-[50px]">
              <Badge>Featured</Badge>
              <h1 className="font-bold text-[32px] leading-[48px] text-secondary max-w-[300px]">
                {BoardingHouse?.name}
              </h1>
              <div className="flex items-center space-x-4">
                <span className="font-semibold text-secondary">
                  <div className="flex items-center font-semibold leading-6">
                    <Image
                      src="/icons/boardinghouse_category.svg"
                      alt="location-dark"
                      height={0}
                      width={0}
                      className="w-5 h-5 mr-1"
                    />
                    {BoardingHouse?.category?.name}
                  </div>
                </span>
              </div>
              <div className="flex items-center space-x-[30px] mt-2">
                <div className="flex items-center font-semibold leading-6">
                  <Image
                    src="/icons/location-dark.svg"
                    alt="location-dark"
                    height={0}
                    width={0}
                    className="w-5 h-5 mr-1"
                  />
                  {BoardingHouse?.address}
                </div>
                {selectedRoomId !== null && selectedRoom && (
                  <>
                    <div className="flex items-center font-semibold leading-6">
                      <Image
                        src="/icons/format-square-dark.svg"
                        alt="format-square-dark"
                        height={0}
                        width={0}
                        className="w-5 h-5 mr-1"
                      />
                      {selectedRoom.square_feet} sqft
                    </div>
                    <div className="flex items-center font-semibold leading-6">
                      <Image
                        src="/icons/profile-2user-dark.svg"
                        alt="profile-2user-dark"
                        height={0}
                        width={0}
                        className="w-5 h-5 mr-1"
                      />
                      {selectedRoom.capacity} people
                    </div>
                  </>
                )}
              </div>
              {/* ...existing code... */}
            </div>
            {/* ...existing code... */}
          </div>
        </div>
      </section>

      <section
        id="about-booking-section"
        className="px-10 xl:container xl:mx-auto py-[50px] flex space-x-8 xl:space-x-[80px]"
      >
        <div className="w-full max-w-[600px] xl:max-w-[650px] space-y-[30px]">
          <Title
            section="detail"
            title="About House"
            subtitle={BoardingHouse?.description}
          />

          <div className="grid grid-cols-2 gap-5">
            <CardFacility
              icon="/icons/room.svg"
              title="Room Type"
              subtitle={
                selectedRoomId !== null && selectedRoom
                  ? selectedRoom.room_type
                  : "Select a room to see details"
              }
            />
            <CardFacility
              icon="/icons/location-pin.svg"
              title="City"
              subtitle={BoardingHouse?.city?.name ?? "Unknown"}
            />
          </div>
          {/* <MyMap address={BoardingHouse?.address ?? ""} /> */}
          {BoardingHouse?.id && (
            <CustomerReviews boardingHouseId={BoardingHouse.id} />
          )}
        </div>
        {BoardingHouse && (
          <BookingSection
            boardingHouseId={BoardingHouse.id}
            rooms={BoardingHouse.rooms.map((room) => ({
              id: room.id,
              name: room.name,
              slug: room.slug,
              price_per_day: room.price_per_day,
              is_available: room.is_available ? 1 : 0,
            }))}
            selectedRoomId={selectedRoomId}
            setSelectedRoomId={setSelectedRoomId}
          />
        )}
      </section>

      <ListingShowcase
        id="deals-section"
        title="Similar Places"
        subtitle="Beauty in comparison of models"
      />
    </main>
  );
}

export default Detail;
