import Title from "@/components/atomics/title";
import CardReview from "@/components/molecules/card/card-review";
import React from "react";
import { Testimonial } from "@/interfaces/testimonial";
import { useSession } from "next-auth/react";
import { useGetAllTestimonialsQuery } from "@/services/testimonial.service";
import { useParams } from "next/navigation";

interface ReviewProps {
  boardingHouseId: number;
}

const Review: React.FC<ReviewProps> = ({ boardingHouseId }) => {
  const { data: session } = useSession();
  const { data, isLoading, isError } = useGetAllTestimonialsQuery({});

  // Filter testimonial sesuai boardingHouseId
  const testimonials = (data || []).filter(
    (testimonial: Testimonial) =>
      testimonial.boarding_house_id === boardingHouseId
  );

  // Patch testimonial supaya kalau user login, testimonial dia ikut update
  const patchedTestimonials = testimonials.map((testimonial: Testimonial) => {
    if (session?.user && testimonial.user_id === session.user.id) {
      return {
        ...testimonial,
        name: session.user.name || testimonial.name,
        photo_url: session.user.image || testimonial.photo_url,
      };
    }
    return testimonial;
  });

  return (
    <section id="review-section" className="container mx-auto my-[100px]">
      <div className="flex justify-center text-center">
        <Title
          title="Happy Customers"
          subtitle={`We’d love to come back again soon`}
        />
      </div>
      <div className="mt-[30px] grid grid-cols-3 gap-[30px]">
        {isLoading ? (
          <div className="col-span-3 text-center text-gray-400">Loading...</div>
        ) : isError ? (
          <div className="col-span-3 text-center text-red-400">
            Gagal memuat testimonial.
          </div>
        ) : patchedTestimonials.length === 0 ? (
          <div className="col-span-3 text-center text-gray-400">
            Belum ada testimonial.
          </div>
        ) : (
          patchedTestimonials.map((item: Testimonial) => (
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
  );
};

export default Review;
