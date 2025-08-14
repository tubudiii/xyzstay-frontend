import { apiSlice } from "./base-query";

export const cityApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCities: builder.query({
      query: () => ({
        url: "/cities",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAllCitiesQuery } = cityApi;
