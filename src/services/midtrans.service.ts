import { apiSlice } from "./base-query";

export const testimonialApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    update: builder.mutation({
      query: (data) => ({
        url: `/payment/${data.id}`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const { useUpdateMutation } = testimonialApi;
