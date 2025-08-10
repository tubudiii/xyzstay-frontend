"use client";
import Breadcrumbs from "@/components/molecules/breadcrumbs";
import CardFacility from "@/components/molecules/card/card-facility";
import CardStar from "@/components/molecules/card/card-star";
import { Badge } from "@/components/atomics/badge";
import { Button } from "@/components/atomics/button";
import Title from "@/components/atomics/title";
import Image from "next/image";
import Map from "@/components/molecules/map";
import ListingShowcase from "@/components/molecules/listing/boarding-house-showcase";
import PhotoGallery from "./photo-gallery";
import BookingSection from "./booking-section";
import CustomerReviews from "./customer-reviews";
import { useGetDetailBoardingHouseQuery } from "@/services/boardinghouse.service";
import { BoardingHouse } from "@/interfaces/boarding-house";
import { useMemo } from "react";

function Detail({ params }: { params: { id: string } }) {
  const { data } = useGetDetailBoardingHouseQuery(params.id);
  // console.log("🚀 ~ Detail ~ data:", data);

  const BoardingHouse: BoardingHouse | undefined = useMemo(
    () => data?.data,
    [data]
  );

  return (
    <main>
      <section
        id="overview-section"
        className="bg-gray-light pt-[170px] pb-[50px]"
      >
        <div className="px-10 xl:container xl:mx-auto">
          <Breadcrumbs />

          {BoardingHouse?.thumbnail && (
            <PhotoGallery
              photos={
                Array.isArray(BoardingHouse.thumbnail)
                  ? BoardingHouse.thumbnail
                  : [BoardingHouse.thumbnail]
              }
            />
          )}

          <div className="mt-[30px] grid grid-cols-3 xl:grid-cols-4 gap-x-5">
            <div className="col-span-2 xl:col-span-3 space-y-5 pr-[50px]">
              <Badge>Featured</Badge>

              <div className="flex items-center justify-between">
                <h1 className="font-bold text-[32px] leading-[48px] text-secondary max-w-[300px]">
                  {BoardingHouse?.name}
                </h1>

                <div className="flex flex-col items-end text-end">
                  <CardStar rating={4} variant="detail" />
                  <span className="mt-2 font-semibold leading-6 text-secondary">
                    4/5 (18,309)
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-[30px]">
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
                <div className="flex items-center font-semibold leading-6">
                  <Image
                    src="/icons/format-square-dark.svg"
                    alt="format-square-dark"
                    height={0}
                    width={0}
                    className="w-5 h-5 mr-1"
                  />
                  {BoardingHouse?.rooms[0]?.square_feet} sqft
                </div>
                <div className="flex items-center font-semibold leading-6">
                  <Image
                    src="/icons/profile-2user-dark.svg"
                    alt="profile-2user-dark"
                    height={0}
                    width={0}
                    className="w-5 h-5 mr-1"
                  />
                  {BoardingHouse?.rooms[0]?.capacity} people
                </div>
              </div>
            </div>
            <div className="bg-white rounded-[20px] px-5 py-4 space-y-5">
              <span className="font-bold text-lg leading-[27px]">Host</span>
              <div className="flex items-center space-x-3">
                <Image
                  src="/images/avatar-review.svg"
                  alt="avatar"
                  height={0}
                  width={0}
                  className="h-[50px] w-[50px] rounded-full"
                />
                <div>
                  <h1 className="font-bold text-secondary">Sari Puji</h1>
                  <div className="flex items-center text-sm leading-[21px] text-subtitle">
                    <Image
                      src="/icons/clock.svg"
                      alt="clock"
                      height={18}
                      width={18}
                      className="mr-[0.5px]"
                    />
                    3 mins response
                  </div>
                </div>
              </div>
              <Button variant="third">Send Message</Button>
            </div>
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
              icon="/icons/grey-skyline.svg"
              title="City"
              subtitle={BoardingHouse?.city?.name ?? "Unknown"}
            />
          </div>
          <Map />
          <CustomerReviews />
        </div>
        <BookingSection id={params?.id} />
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
