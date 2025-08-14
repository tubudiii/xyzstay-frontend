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

import Title from "@/components/atomics/title";
import { signOut, useSession } from "next-auth/react";

function Header() {
  const { data: session } = useSession();
  const { data, isLoading, isError } = useGetAllCategoriesQuery({});

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  return (
    <header className="container mx-auto fixed inset-x-0 top-[30px] z-20">
      <div className="p-[30px] rounded-[30px] bg-white flex justify-between items-center">
        <Link href="/">
          <Image src="/images/logo.svg" alt="nidejia" height={36} width={133} />
        </Link>

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
                  ) : data &&
                    Array.isArray(data.data) &&
                    data.data.length > 0 ? (
                    data.data.map((cat: Datum) => (
                      <li
                        key={cat.id}
                        className={`px-4 py-2 cursor-pointer ${
                          selectedCategory === cat.id
                            ? "text-primary font-bold"
                            : "text-black"
                        } hover:bg-gray-100`}
                        onClick={() => setSelectedCategory(cat.id)}
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
            <li className="cursor-pointer font-semibold leading-6 hover:text-primary">
              <span
                onClick={() => {
                  const section = document.getElementById("cities-section");
                  if (section) {
                    section.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    const section = document.getElementById("cities-section");
                    if (section) {
                      section.scrollIntoView({ behavior: "smooth" });
                    }
                  }
                }}
                className="outline-none"
              >
                Cities
              </span>
            </li>
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
            <li className="cursor-pointer font-semibold leading-6 hover:text-primary">
              About
            </li>
          </ul>
        </nav>

        <div
          data-login={!!session?.user}
          className="data-[login=true]:hidden data-[login=false]:flex items-center space-x-3"
        >
          <Button variant="secondary" size="header">
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button variant="default" size="header" className="shadow-button">
            <Link href="/sign-up">Sign Up</Link>
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            data-login={!!session?.user}
            className="data-[login=false]:hidden outline-none"
          >
            <div className="flex items-center space-x-2">
              <Title
                title={session?.user.name}
                subtitle="Howdy"
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
            <DropdownMenuItem>
              <Link href={"/dashboard/my-listings"}>My Listings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>My Rentals</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut()}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default Header;
