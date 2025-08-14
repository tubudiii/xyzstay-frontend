import { apiSlice } from "./base-query";

export const cityApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategories: builder.query({
      query: () => ({
        url: "/categories",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAllCategoriesQuery } = cityApi;
