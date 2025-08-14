"use client";

import CardIndicator from "@/components/molecules/card/card-indicator";
import { Button } from "@/components/atomics/button";
import { Input } from "@/components/atomics/input";
import { Separator } from "@/components/atomics/separator";
import Title from "@/components/atomics/title";
import { useGetAllCitiesQuery } from "@/services/city.service";
import { City } from "@/interfaces/city";
import Image from "next/image";
import CardBenefit from "@/components/molecules/card/card-benefit";
import CardPurpose from "@/components/molecules/card/card-purpose";
import { useGetAllCategoriesQuery } from "@/services/categories.service";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/atomics/carousel";
import CardReview from "@/components/molecules/card/card-review";
import BoardingHouseShowcase from "@/components/molecules/listing/boarding-house-showcase";
import { Testimonial } from "@/interfaces/testimonial";

import { useGetAllTestimonialsQuery } from "@/services/testimonial.service";

function Home() {
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

  return (
    <main>
      <section
        id="hero-section"
        className={`bg-primary-foreground bg-cover lg:bg-contain bg-right bg-no-repeat bg-[url('/images/bg-image.svg')] min-h-[750px] max-h-[750px] xl:max-h-[850px]`}
      >
        <div className="pt-[226px] container mx-auto">
          <div className="max-w-[555px]">
            <Title
              title="Find Glorious Living And Loving Space"
              subtitle="Dolor house comfortable si amet with cheap price that also lorem when you need grow."
              section="hero"
            />
            <div className="pt-[50px] flex items-center">
              <div className="grow">
                <Input
                  placeholder="Search by city or categories..."
                  variant="hero"
                />
              </div>
              <Button variant="default" size="hero">
                Explore
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section
        id="indicator-section"
        className="px-10 xl:container xl:mx-auto -mt-16 pb-9"
      >
        <div className="h-[128px] flex justify-center xl:justify-between items-center space-x-6 xl:space-x-12 bg-white shadow-indicator rounded-[20px] px-9 py-5 xl:px-[50px] xl:py-[29px]">
          <CardIndicator
            icon="/icons/house-2.svg"
            title="382M"
            subtitle="Kos Available"
            variant="indicator"
          />
          <Separator orientation="vertical" className="bg-separator" />
          <CardIndicator
            icon="/icons/people-2.svg"
            title="9/10"
            subtitle="People Happy"
            variant="indicator"
          />
          <Separator orientation="vertical" className="bg-separator" />
          <CardIndicator
            icon="/icons/security-user.svg"
            title="100%"
            subtitle="High Security"
            variant="indicator"
          />
          <Separator orientation="vertical" className="bg-separator" />
          <CardIndicator
            icon="/icons/global.svg"
            title="183"
            subtitle="Countries"
            variant="indicator"
          />
        </div>
      </section>

      <BoardingHouseShowcase
        id="deals-section"
        title="Our Latest Deals"
        subtitle="Explore the beauty of architecture and living love"
      />

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
                Gagal memuat data kota.
              </div>
            ) : cities.length === 0 ? (
              <div className="col-span-3 xl:col-span-4 text-center text-gray-400">
                Belum ada data kota.
              </div>
            ) : (
              cities.map((city: City) => {
                // Gambar city dari backend
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
                  <CardIndicator
                    key={city.id}
                    icon={imageSrc}
                    title={city.name}
                    subtitle={`${city.boarding_houses.length} boarding houses`}
                    section="categories"
                  />
                );
              })
            )}
          </div>
        </div>
      </section>

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
            <div className="mt-[30px] flex items-center space-x-3 xl:space-x-[14px]">
              <Button
                variant="default"
                size="header"
                className="flex items-center"
              >
                <Image
                  src="/icons/message-notif.svg"
                  alt="message-notif"
                  height={0}
                  width={0}
                  className="h-5 w-5 mr-2.5"
                />
                Call Sales
              </Button>
              <Button variant="third" size="header">
                All Benefits
              </Button>
            </div>
          </div>
          <div className="max-w-[650px] h-full flex items-center">
            {/* Carousel untuk CardPurpose dari kategori */}
            {(() => {
              const {
                data: categoriesData,
                isLoading: loadingCategories,
                isError: errorCategories,
              } = useGetAllCategoriesQuery(null);
              const categories = categoriesData?.data || [];
              if (loadingCategories) {
                return (
                  <div className="w-full text-center text-gray-400">
                    Loading...
                  </div>
                );
              }
              if (errorCategories) {
                return (
                  <div className="w-full text-center text-red-400">
                    Gagal memuat data kategori.
                  </div>
                );
              }
              if (categories.length === 0) {
                return (
                  <div className="w-full text-center text-gray-400">
                    Belum ada data kategori.
                  </div>
                );
              }
              console.log("🚀 ~ categories:", categories);
              return (
                <Carousel className="w-full">
                  <CarouselContent>
                    {categories.map((cat: any) => {
                      // Gambar kategori dari backend
                      const backendUrl =
                        process.env.NEXT_PUBLIC_STORAGE_BASE_URL;
                      let imageSrc = Array.isArray(cat.image)
                        ? cat.image[0]
                        : cat.image;
                      if (imageSrc && !imageSrc.startsWith("http")) {
                        // Jika path sudah mengandung 'storage/' atau 'cities/'
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
                        <CardPurpose
                          key={cat.id}
                          image={imageSrc}
                          title={cat.name}
                          purpose={
                            cat.boarding_houses?.length
                              ? cat.boarding_houses.length.toLocaleString()
                              : "0"
                          }
                        />
                      );
                    })}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              );
            })()}
          </div>
        </div>
      </section>

      <section id="review-section" className="container mx-auto my-[100px]">
        <div className="flex justify-center text-center">
          <Title
            title="Happy Customers"
            subtitle={`We’d love to come back again soon`}
            section=""
          />
        </div>
        <div className="mt-[30px] grid grid-cols-3 gap-[30px]">
          {isLoading ? (
            <div className="col-span-3 text-center text-gray-400">
              Loading...
            </div>
          ) : isError ? (
            <div className="col-span-3 text-center text-red-400">
              Gagal memuat testimonial.
            </div>
          ) : testimonials.length === 0 ? (
            <div className="col-span-3 text-center text-gray-400">
              Belum ada testimonial.
            </div>
          ) : (
            testimonials.map((item: Testimonial) => (
              <CardReview
                key={item.id}
                rating={item.rating}
                review={item.content}
                avatar={item.photo_url || "/images/avatar-review.svg"}
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
