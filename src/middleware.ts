export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/boardinghouse/:id/checkout",
    "/booking-success/:path*",
    "/dashboard/:path*",
  ],
};
