import { apiSlice } from "./base-query";

export const testimonialApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllTestimonials: builder.query({
      query: () => ({
        url: "/testimonials", // Endpoint API yang benar
        method: "GET",
      }),
      transformResponse: (response: any) => response.data || [], // Memastikan data diubah menjadi array
    }),
    getDetailTestimonial: builder.query({
      query: (slug: string) => ({
        url: `/testimonials/${slug}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAllTestimonialsQuery, useGetDetailTestimonialQuery } =
  testimonialApi;
