import { apiSlice } from "./base-query";

export const testimonialApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllTestimonials: builder.query({
      query: () => ({
        url: "/testimonial", // Sesuaikan dengan route Laravel
        method: "GET",
      }),
      transformResponse: (response: any) => response.data || [],
    }),
    getDetailTestimonial: builder.query({
      query: (slug: string) => ({
        url: `/testimonial/${slug}`,
        method: "GET",
      }),
    }),
    postTestimonial: builder.mutation({
      query: (payload: any) => {
        const formData = new FormData();
        formData.append("boarding_house_id", String(payload.boarding_house_id));
        formData.append("name", payload.name);
        formData.append("content", payload.content);
        formData.append("rating", String(payload.rating));
        if (payload.photo) {
          formData.append("photo", payload.photo);
        }
        // user_id tidak perlu dikirim jika backend ambil dari auth
        return {
          url: "/testimonial",
          method: "POST",
          body: formData,
        };
      },
    }),
    updateTestimonial: builder.mutation({
      query: ({ id, ...payload }: any) => {
        const formData = new FormData();
        formData.append("_method", "PUT"); // tambahkan ini!
        formData.append("boarding_house_id", String(payload.boarding_house_id));
        formData.append("name", payload.name);
        formData.append("content", payload.content);
        formData.append("rating", String(payload.rating));
        if (payload.photo) {
          formData.append("photo", payload.photo);
        }
        return {
          url: `/testimonial/${id}`,
          method: "POST", // ubah dari PUT ke POST
          body: formData,
        };
      },
    }),
  }),
});

export const {
  useGetAllTestimonialsQuery,
  useGetDetailTestimonialQuery,
  usePostTestimonialMutation,
  useUpdateTestimonialMutation,
} = testimonialApi;
