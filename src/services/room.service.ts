import { apiSlice } from "./base-query";

export const roomApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRoomForCheckout: builder.query<any, string>({
      query: (slug) => `room/${slug}/checkout`,
    }),
  }),
});

export const { useGetRoomForCheckoutQuery } = roomApi;
