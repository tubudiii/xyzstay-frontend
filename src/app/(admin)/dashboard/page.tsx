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
