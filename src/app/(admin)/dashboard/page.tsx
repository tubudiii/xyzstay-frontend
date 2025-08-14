"use client";
import CardOverview from "@/components/molecules/card/card-overview";
import { Button } from "@/components/atomics/button";
import Title from "@/components/atomics/title";
import { useSession } from "next-auth/react";
import { useGetTransactionQuery } from "@/services/transaction.service";
import { Transaction } from "@/interfaces/transaction";

function Dashboard() {
  const { data: session } = useSession();
  const user = session?.user;
  const { data: transactions } = useGetTransactionQuery({});
  // Filter transaksi milik user
  const userTransactions =
    transactions?.data?.data?.filter(
      (trx: Transaction) => trx.user_id === user?.id
    ) || [];
  const userTransactionCount = userTransactions.length;

  return (
    <main>
      <div className="flex items-center justify-between">
        <Title
          section="admin"
          title="Overview"
          subtitle="You’ve made huge progres"
        />
        <Button size="button">Export Report</Button>
      </div>

      {/* User Info Card - Simple Large Card */}
      <div className="mt-8 flex justify-center">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-10 flex items-center gap-10 border border-gray-200">
          <div className="flex-shrink-0">
            <img
              src={user?.image || "/images/avatar.webp"}
              alt="User Avatar"
              className="w-32 h-32 rounded-full border-4 border-blue-300 shadow object-cover"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-extrabold text-gray-800 flex items-center gap-3 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 text-blue-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 1115 0v.75a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75v-.75z"
                />
              </svg>
              {user?.name || "-"}
            </h2>
            <div className="mt-3 text-lg text-gray-600 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-blue-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5A2.25 2.25 0 002.25 6.75m19.5 0v.75a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75v-.75"
                />
              </svg>
              {user?.email || "-"}
            </div>
            <div className="mt-3 text-lg text-gray-600 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-blue-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 7.5l8.954 7.163a2.25 2.25 0 002.592 0l8.954-7.163M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75v10.5A2.25 2.25 0 004.5 19.5z"
                />
              </svg>
              {user?.phone_number || "-"}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-[40px]">
        <h1 className="font-bold text-lg leading-[27px] text-secondary">
          Statistics
        </h1>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-[30px] mt-3.5">
          <CardOverview
            image="/icons/buildings.svg"
            title="27,492"
            subtitle="Listings"
          />
          <CardOverview
            image="/icons/building.svg"
            title="6,482"
            subtitle="Rentals"
          />
          <CardOverview
            image="/icons/profile-2user-fill.svg"
            title="84,209,199"
            subtitle="Customers"
          />
          <CardOverview
            image="/icons/card.svg"
            title={userTransactionCount.toLocaleString()}
            subtitle="Transactions"
          />
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
