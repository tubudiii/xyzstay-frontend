import { apiSlice } from "./base-query";

export const boardingHouseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllBoardingHouse: builder.query({
      query: () => ({
        url: "/boarding-house",
        method: "GET",
      }),
    }),
    getDetailBoardingHouse: builder.query({
      query: (slug: string) => ({
        url: `/boarding-house/${slug}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAllBoardingHouseQuery, useGetDetailBoardingHouseQuery } =
  boardingHouseApi;
