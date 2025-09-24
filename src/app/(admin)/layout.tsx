import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "@/app/globals.css";
import TopMenu from "@/components/molecules/admin/top-menu";
import SideMenu from "@/components/molecules/admin/side-menu";
import { Toaster } from "@/components/atomics/toaster";
import ReduxProvider from "@/providers/redux";
import { UserProvider } from "@/context/UserContext";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "XYZ Stay",
  description: "Find Glorious Living And Loving Space",
  icons: {
    icon: "/favicon.svg",
  },
};

// root layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.className} min-h-dvh bg-gray-light`}>
        <ReduxProvider>
          <UserProvider>
            <div className="min-h-dvh">
              <div className="flex space-x-[30px] p-[30px] container mx-auto">
                <SideMenu />
                <div className="w-full">
                  <TopMenu />
                  <div className="py-[30px]">{children}</div>
                </div>
              </div>
            </div>
            <Toaster />
          </UserProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
