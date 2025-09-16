import { apiSlice } from "./base-query";

export const boardingHouseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllBoardingHouse: builder.query({
      query: (params) => {
        params = params || {};
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.append("page", params.page);
        if (params.per_page) searchParams.append("per_page", params.per_page);
        if (params.category) searchParams.append("category", params.category);
        if (params.city) searchParams.append("city", params.city);
        return {
          url: `/boarding-house${
            searchParams.toString() ? `?${searchParams.toString()}` : ""
          }`,
          method: "GET",
        };
      },
    }),
    getDetailBoardingHouse: builder.query({
      query: (slug: string) => ({
        url: `/boarding-house/${slug}`,
        method: "GET",
      }),
    }),
    getRecommendations: builder.query({
      query: (token: string) => ({
        url: "/recommendations",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
  }),
});

export const {
  useGetAllBoardingHouseQuery,
  useGetDetailBoardingHouseQuery,
  useGetRecommendationsQuery,
} = boardingHouseApi;
