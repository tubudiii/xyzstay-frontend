"use client";
import { Button } from "@/components/atomics/button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useGetAllCategoriesQuery } from "@/services/categories.service";
import { Datum } from "@/interfaces/categories";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/atomics/dropdown-menu";
import { useGetAllCitiesQuery } from "@/services/city.service";
import { City } from "@/interfaces/city";
import { useRouter } from "next/navigation";

import Title from "@/components/atomics/title";
import { signOut, useSession } from "next-auth/react";

function Header() {
  // ✅ Ambil session dari NextAuth
  const { data: session } = useSession();
  const user = session?.user; // langsung ambil user dari session
  console.log(user);
  const { data, isLoading, isError } = useGetAllCategoriesQuery({});
  const {
    data: citiesData,
    isLoading: isLoadingCities,
    isError: isErrorCities,
  } = useGetAllCitiesQuery({});
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<number | null>(null);

  return (
    <header className="container mx-auto fixed inset-x-0 top-[30px] z-20">
      <div className="p-[30px] rounded-[30px] bg-white flex justify-between items-center">
        <Link href="/">
          <Image
            src="/images/logo xyz.png"
            alt="xyzstay"
            height={36}
            width={133}
          />
        </Link>

        {/* === NAVIGATION === */}
        <nav>
          <ul className="flex items-center space-x-[30px]">
            <li className="cursor-pointer font-semibold leading-6 hover:text-primary">
              Featured
            </li>

            <li
              className="relative cursor-pointer font-semibold leading-6 hover:text-primary"
              onMouseEnter={() => setIsDropdownOpen(true)}
            >
              <span>Categories</span>
              <div
                className={`absolute left-0 top-full mt-4 w-64 bg-white shadow-lg rounded-lg transition-opacity duration-200 z-30 ${
                  isDropdownOpen
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                }`}
                onMouseLeave={() => {
                  setIsDropdownOpen(false);
                  setSelectedCategory(null);
                }}
              >
                <ul className="py-2">
                  {isLoading ? (
                    <li className="px-4 py-2 text-gray-400">Loading...</li>
                  ) : isError ? (
                    <li className="px-4 py-2 text-red-400">
                      Error loading categories
                    </li>
                  ) : data?.data?.length > 0 ? (
                    data.data.map((cat: Datum) => (
                      <li
                        key={cat.id}
                        className={`px-4 py-2 cursor-pointer ${
                          selectedCategory === cat.id
                            ? "text-primary font-bold"
                            : "text-black"
                        } hover:bg-gray-100`}
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setIsDropdownOpen(false);
                          router.push(
                            `/boardinghouse/catalog?category=${cat.id}`
                          );
                        }}
                      >
                        {cat.name}
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-gray-400">
                      No categories found
                    </li>
                  )}
                </ul>
              </div>
            </li>
            <li
              className="relative cursor-pointer font-semibold leading-6 hover:text-primary"
              onMouseEnter={() => setIsCityDropdownOpen(true)}
            >
              <span>Cities</span>
              <div
                className={`absolute left-0 top-full mt-4 w-64 bg-white shadow-lg rounded-lg transition-opacity duration-200 z-30 ${
                  isCityDropdownOpen
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                }`}
                onMouseLeave={() => {
                  setIsCityDropdownOpen(false);
                  setSelectedCity(null);
                }}
              >
                <ul className="py-2">
                  {isLoadingCities ? (
                    <li className="px-4 py-2 text-gray-400">Loading...</li>
                  ) : isErrorCities ? (
                    <li className="px-4 py-2 text-red-400">
                      Error loading cities
                    </li>
                  ) : citiesData?.data?.length > 0 ? (
                    citiesData.data.map((city: City) => (
                      <li
                        key={city.id}
                        className={`px-4 py-2 cursor-pointer ${
                          selectedCity === city.id
                            ? "text-primary font-bold"
                            : "text-black"
                        } hover:bg-gray-100`}
                        onClick={() => {
                          setSelectedCity(city.id);
                          setIsCityDropdownOpen(false);
                          router.push(`/boardinghouse/catalog?city=${city.id}`);
                        }}
                        tabIndex={0}
                        role="button"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            setSelectedCity(city.id);
                            setIsCityDropdownOpen(false);
                            router.push(
                              `/boardinghouse/catalog?city=${city.id}`
                            );
                          }
                        }}
                      >
                        {city.name}
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-gray-400">No cities found</li>
                  )}
                </ul>
              </div>
            </li>
            {/* testimonials section */}
            <li className="cursor-pointer font-semibold leading-6 hover:text-primary">
              <span
                onClick={() => {
                  const section = document.getElementById("review-section");
                  if (section) {
                    section.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    const section = document.getElementById("review-section");
                    if (section) {
                      section.scrollIntoView({ behavior: "smooth" });
                    }
                  }
                }}
                className="outline-none"
              >
                Testimonials
              </span>
            </li>
            {/* about section */}
            <li className="cursor-pointer font-semibold leading-6 hover:text-primary">
              About
            </li>
          </ul>
        </nav>

        {/* === AUTH SECTION === */}
        {!user && (
          <div className="flex items-center space-x-3">
            <Button variant="secondary" size="header">
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button variant="default" size="header" className="shadow-button">
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </div>
        )}

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <div className="flex items-center space-x-2">
                <Title
                  title={user?.name ?? "User"}
                  subtitle="Customer"
                  section="header"
                />
                <Image
                  src="/images/avatar.webp"
                  alt="avatar"
                  height={48}
                  width={48}
                  className="rounded-full"
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[240px] mr-8 space-y-4">
              <DropdownMenuItem>
                <Link href={"/dashboard"}>Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  (window.location.href = "/dashboard/my-transactions")
                }
              >
                My Transactions
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => (window.location.href = "/dashboard/setting")}
              >
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut()}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}

export default Header;
