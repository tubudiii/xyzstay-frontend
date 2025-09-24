"use client";
import CardOverview from "@/components/molecules/card/card-overview";
import { Button } from "@/components/atomics/button";
import Title from "@/components/atomics/title";
import { useSession } from "next-auth/react";
import { useGetTransactionQuery } from "@/services/transaction.service";
import { Transaction } from "@/interfaces/transaction";
import Link from "next/link"; // ⬅️ tambah

function Dashboard() {
  const { data: session } = useSession();
  const user = session?.user;
  const { data: transactions } = useGetTransactionQuery({});

  const userTransactions: Transaction[] =
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
      </div>

      <div className="mt-[40px]">
        <h1 className="font-bold text-lg leading-[27px] text-secondary">
          Statistics
        </h1>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-[30px] mt-3.5">
          <Link
            href="/dashboard/my-transactions"
            className="block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 rounded-2xl"
            aria-label="Lihat semua transaksi"
          >
            <div className="transition hover:shadow-md hover:-translate-y-0.5 rounded-2xl">
              <CardOverview
                image="/icons/card.svg"
                title={userTransactionCount.toLocaleString()}
                subtitle="Transactions"
              />
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
