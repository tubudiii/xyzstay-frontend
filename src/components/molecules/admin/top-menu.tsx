"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/atomics/dropdown-menu";
import { Input } from "@/components/atomics/input";
import Title from "@/components/atomics/title";
import { signOut } from "next-auth/react";
import { useUser } from "@/context/UserContext";
import Image from "next/image";

function TopMenu() {
  const { user } = useUser();
  // Debug: log user setiap render
  console.log("TopMenu user:", user);
  return (
    <header className="w-full p-[30px] rounded-[30px] bg-white flex justify-between items-center">
      <div>
        <Input
          icon="/icons/search.svg"
          variant="auth"
          placeholder="Search transactions..."
          className="w-[400px]"
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger
          data-login={!!user}
          className="data-[login=false]:hidden outline-none"
        >
          <div className="flex items-center space-x-2">
            <Title
              title={user?.name}
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
          <DropdownMenuItem>Dashboard</DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              (window.location.href = "/dashboard/my-transactions")
            }
          >
            My Transactions
          </DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

export default TopMenu;
