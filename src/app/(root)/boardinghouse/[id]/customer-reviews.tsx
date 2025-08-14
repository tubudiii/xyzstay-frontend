import CardReview from "@/components/molecules/card/card-review";
import React from "react";
import { useGetAllTestimonialsQuery } from "@/services/testimonial.service";

interface CustomerReviewsProps {
  boardingHouseId: number;
}

const CustomerReviews: React.FC<CustomerReviewsProps> = ({
  boardingHouseId,
}) => {
  const { data, isLoading, isError } = useGetAllTestimonialsQuery({});
  const testimonials = (data || []).filter(
    (testimonial: any) => testimonial.boarding_house_id === boardingHouseId
  );

  return (
    <div>
      <h1 className="font-bold text-lg leading-[27px] text-secondary">
        From Happy Customers
      </h1>
      <div className="mt-2.5 grid grid-cols-2 gap-5">
        {isLoading && <div>Loading...</div>}
        {isError && <div>Failed to load testimonials.</div>}
        {testimonials.length > 0 &&
          testimonials.map((testimonial: any) => (
            <CardReview
              key={testimonial.id}
              rating={testimonial.rating}
              review={testimonial.content}
              avatar={testimonial.photo_url || "/images/avatar-review.svg"}
              username={testimonial.name}
              jobdesk={testimonial.jobdesk || "Customer"}
            />
          ))}
        {!isLoading && !isError && testimonials.length === 0 && (
          <div>No testimonials found.</div>
        )}
      </div>
    </div>
  );
};

export default CustomerReviews;
