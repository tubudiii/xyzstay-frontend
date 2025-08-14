"use client";

import { Button } from "@/components/atomics/button";
import Title from "@/components/atomics/title";
import DataTransaction from "@/json/city-transaction.json";
import { CityCenterProps } from "@/interfaces/city-center";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/atomics/pagination";
import CardTransaction from "@/components/molecules/card/card-transaction";
import { CityTransactionProps } from "@/interfaces/city-transaction";
import CardEmpty from "@/components/molecules/card/card-empty";
import { useGetTransactionQuery } from "@/services/transaction.service";
import { Transaction } from "@/interfaces/transaction";

function MyTransactions() {
  const { data: transactions } = useGetTransactionQuery({});
  return (
    <main>
      <div className="flex items-center justify-between">
        <Title
          section="admin"
          title="My Transactions"
          subtitle="Manage your house and get money"
        />
      </div>

      <div className="mt-[30px] space-y-5">
        {transactions?.data?.total ? (
          transactions?.data?.data.map(
            (transaction: Transaction, index: number) => {
              const p = transaction.payments?.[0];
              console.log("🚀 ~ MyTransactions ~ transaction:", p?.id);
              return (
                <CardTransaction
                  key={index}
                  id_payment={p?.id ?? null}
                  status_payment={transaction.payments[0]?.payment_status}
                  id={transaction.id}
                  room={{
                    images: [
                      { image: transaction.room.images?.[0]?.image || "" },
                    ],
                  }}
                  title={transaction.room.name}
                  boardinghouse_name={transaction.boarding_house.name}
                  location={transaction.boarding_house.address}
                  days={transaction.total_days}
                  price={transaction.total_price}
                  status={transaction.transactions_status}
                />
              );
            }
          )
        ) : (
          <CardEmpty />
        )}
      </div>

      <Pagination className="mt-[30px]">
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">10</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </main>
  );
}

export default MyTransactions;
