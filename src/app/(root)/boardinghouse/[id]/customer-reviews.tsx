import CardReview from "@/components/molecules/card/card-review";
import React from "react";
import { useGetAllTestimonialsQuery } from "@/services/testimonial.service";
import { useSession } from "next-auth/react";
import { Testimonial } from "@/interfaces/testimonial";

interface CustomerReviewsProps {
  boardingHouseId: number;
}

const CustomerReviews: React.FC<CustomerReviewsProps> = ({
  boardingHouseId,
}) => {
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
    <div>
      <h1 className="font-bold text-lg leading-[27px] text-secondary">
        From Happy Customers
      </h1>
      <div className="mt-2.5 grid grid-cols-2 gap-5">
        {isLoading && <div>Loading...</div>}
        {isError && <div>Failed to load testimonials.</div>}
        {patchedTestimonials.length > 0 &&
          patchedTestimonials.map((testimonial: Testimonial) => (
            <CardReview
              key={testimonial.id}
              rating={testimonial.rating}
              review={testimonial.content}
              avatar={testimonial.photo_url || "/images/avatar-review.svg"}
              username={testimonial.name}
              jobdesk={"Customer"}
            />
          ))}
        {!isLoading && !isError && patchedTestimonials.length === 0 && (
          <div>No testimonials found.</div>
        )}
      </div>
    </div>
  );
};

export default CustomerReviews;
