"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/atomics/dropdown-menu";
import { Input } from "@/components/atomics/input";
import { useEffect, useRef, useState, useCallback } from "react";

import Title from "@/components/atomics/title";
import { signOut, useSession } from "next-auth/react"; // ⬅️ pakai session
import { useUser } from "@/context/UserContext";
import Image from "next/image";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

function TopMenu() {
  const { data: session, status } = useSession(); // "loading" | "authenticated" | "unauthenticated"
  const { user: ctxUser } = useUser();
  const user = ctxUser ?? (session?.user as any); // ⬅️ fallback ke session

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const isMyTransactions = pathname?.startsWith("/dashboard/my-transactions");

  const initial = (searchParams.get("search") ?? "").trim();
  const [q, setQ] = useState(initial);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const replaceSearch = useCallback(
    (term: string) => {
      const params = new URLSearchParams(window.location.search);
      if (term.trim()) params.set("search", term.trim());
      else params.delete("search");
      const qs = params.toString();
      router.replace(`/dashboard/my-transactions${qs ? `?${qs}` : ""}`);
    },
    [router]
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQ(val);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => replaceSearch(val), 300);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (timer.current) clearTimeout(timer.current);
      replaceSearch(q);
    }
    if (e.key === "Escape") {
      setQ("");
      if (timer.current) clearTimeout(timer.current);
      replaceSearch("");
    }
  };

  useEffect(() => {
    if (!isMyTransactions) return;
    const current = (searchParams.get("search") ?? "").trim();
    setQ(current);
  }, [searchParams, isMyTransactions]);

  useEffect(() => {
    if (!isMyTransactions) {
      if (timer.current) clearTimeout(timer.current);
      setQ("");
    }
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [isMyTransactions]);

  // Skeleton saat session masih "loading"
  const isLoadingUser = status === "loading" && !user;

  return (
    <header className="w-full p-[30px] rounded-[30px] bg-white flex justify-between items-center">
      {isMyTransactions ? (
        <div>
          <Input
            icon="/icons/search.svg"
            variant="auth"
            placeholder="Search transactions..."
            className="w-[400px]"
            value={q}
            onChange={onChange}
            onKeyDown={onKeyDown}
          />
        </div>
      ) : (
        <div />
      )}

      <DropdownMenu>
        <DropdownMenuTrigger
          data-login={!!user || isLoadingUser} // ⬅️ jangan sembunyikan saat loading
          className="data-[login=false]:hidden outline-none"
        >
          <div className="flex items-center space-x-2">
            {isLoadingUser ? (
              // ⬅️ Skeleton elegan saat refresh
              <div className="flex items-center gap-3">
                <div className="h-5 w-32 rounded bg-gray-100 animate-pulse" />
                <div className="h-12 w-12 rounded-full bg-gray-100 animate-pulse" />
              </div>
            ) : (
              <>
                <Title title={user?.name ?? "—"} section="header" />
                <Image
                  src={user?.avatar || "/images/avatar.webp"}
                  alt="avatar"
                  height={48}
                  width={48}
                  className="rounded-full"
                />
              </>
            )}
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
