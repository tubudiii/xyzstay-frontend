"use client";

import React, { useState } from "react";
import { useToast } from "@/components/atomics/use-toast";
import { useSession } from "next-auth/react";
import TestimonialModal from "@/components/molecules/modal/TestimonialModal";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "@/components/atomics/button";
import Title from "@/components/atomics/title";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/atomics/pagination";
import CardTransaction from "@/components/molecules/card/card-transaction";
import CardEmpty from "@/components/molecules/card/card-empty";
import { useGetTransactionQuery } from "@/services/transaction.service";
import { Transaction } from "@/interfaces/transaction";
import { useSearchParams } from "next/navigation";

export default function ClientMyTransactions() {
  const { toast } = useToast();
  const { data: transactions, refetch } = useGetTransactionQuery({});
  const { data: session } = useSession();
  const user = session?.user;

  const searchParams = useSearchParams();
  const search = (searchParams.get("search") || "").toLowerCase();

  const allTransactions: Transaction[] = transactions?.data?.data ?? [];
  const filteredTransactions = !search
    ? allTransactions
    : allTransactions.filter((t) => {
        const p = t.payments?.[0];
        const haystacks = [
          t.code,
          t.transactions_status,
          t.room?.name,
          t.boarding_house?.name,
          t.boarding_house?.address,
          p?.id,
          p?.payment_status,
        ]
          .filter(Boolean)
          .map((x) => String(x).toLowerCase());
        return haystacks.some((h) => h.includes(search));
      });

  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [testimonialTransaction, setTestimonialTransaction] =
    useState<Transaction | null>(null);

  // Modal Invoice State
  const [showInvoice, setShowInvoice] = React.useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    React.useState<Transaction | null>(null);

  const InvoiceModal = ({
    transaction,
    onClose,
  }: {
    transaction: Transaction;
    onClose: () => void;
  }) => {
    const p = transaction.payments?.[0];
    const invoiceRef = React.useRef<HTMLDivElement>(null);

    const handleDownloadPDF = async () => {
      if (!invoiceRef.current) return;
      const canvas = await html2canvas(invoiceRef.current);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice-${transaction.id}.pdf`);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl p-0 w-full max-w-lg relative">
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-xl"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
          <div className="px-10 pt-10 pb-6 border-b flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-wide text-gray-800">
              INVOICE
            </h2>
          </div>
          <div ref={invoiceRef} className="px-10 py-8 bg-white">
            <div className="mb-6 flex flex-col gap-1">
              <span className="text-sm text-gray-500">
                Date:{" "}
                {new Date(
                  transaction.created_at ?? Date.now()
                ).toLocaleDateString()}
              </span>
              <span className="text-sm text-gray-500">
                Transaction Code:{" "}
                <span className="font-semibold text-blue-700">
                  {transaction.code ?? "-"}
                </span>
              </span>
              <span className="text-sm text-gray-500">
                Transaction ID:{" "}
                <span className="font-semibold">{transaction.id}</span>
              </span>
            </div>
            <div className="mb-6">
              <div className="font-semibold text-lg text-gray-700 mb-2">
                Accommodation Details
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">Accommodation Name:</div>
                <div className="font-medium">
                  {transaction.boarding_house.name}
                </div>
                <div className="text-gray-600">Address:</div>
                <div className="font-medium">
                  {transaction.boarding_house.address}
                </div>
                <div className="text-gray-600">Room Name:</div>
                <div className="font-medium">{transaction.room.name}</div>
                <div className="text-gray-600">Length of Stay:</div>
                <div className="font-medium">{transaction.total_days} days</div>
              </div>
            </div>
            <div className="mb-6">
              <div className="font-semibold text-lg text-gray-700 mb-2">
                Payment Details
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">Price:</div>
                <div className="font-medium">
                  Rp{transaction.total_price.toLocaleString()}
                </div>
                <div className="text-gray-600">Payment Status:</div>
                <div className="font-medium capitalize">
                  {p?.payment_status ?? "-"}
                </div>
                <div className="text-gray-600">Payment ID:</div>
                <div className="font-medium">{p?.id ?? "-"}</div>
              </div>
            </div>
            <div className="border-t pt-4 flex flex-col gap-1">
              <span className="text-xs text-gray-400">
                Thank you for making a transaction at XYZStay. This invoice can
                be used as valid proof of payment.
              </span>
            </div>
          </div>
          <div className="flex gap-2 px-10 pb-8">
            <Button variant="outline" onClick={handleDownloadPDF}>
              Download PDF
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main>
      <div className="flex items-center justify-between">
        <Title
          section="admin"
          title="My Transactions"
          subtitle={
            search
              ? `Showing results for "${search}"`
              : "Manage your house and get money"
          }
        />
      </div>

      <div className="mt-[30px] space-y-5">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map(
            (transaction: Transaction, index: number) => {
              const p = transaction.payments?.[0];
              const isSuccess = p?.payment_status === "success";
              const userTestimonial =
                transaction.boarding_house?.testimonials?.find(
                  (t) => t.user_id === user?.id
                );
              return (
                <div key={index} className="relative">
                  <CardTransaction
                    id_payment={p?.id ?? null}
                    status_payment={transaction.payments?.[0]?.payment_status}
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
                  {isSuccess && (
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedTransaction(transaction);
                          setShowInvoice(true);
                        }}
                      >
                        Print Invoice
                      </Button>
                      <Button
                        variant={userTestimonial ? "outline" : "default"}
                        onClick={() => {
                          setTestimonialTransaction(transaction);
                          setShowTestimonialModal(true);
                        }}
                      >
                        {userTestimonial
                          ? "Edit Testimonial"
                          : "Give Testimonial"}
                      </Button>
                    </div>
                  )}
                </div>
              );
            }
          )
        ) : (
          <CardEmpty />
        )}
      </div>

      {showInvoice && selectedTransaction && (
        <InvoiceModal
          transaction={selectedTransaction}
          onClose={() => setShowInvoice(false)}
        />
      )}
      {showTestimonialModal && testimonialTransaction && (
        <TestimonialModal
          transaction={testimonialTransaction}
          userId={user?.id}
          userName={user?.name}
          onClose={async (action) => {
            if (action === "refetch") {
              await refetch();
              const latestTransaction = (transactions?.data?.data ?? []).find(
                (t: Transaction) => t.id === testimonialTransaction.id
              );
              if (latestTransaction)
                setTestimonialTransaction(latestTransaction);
            } else {
              setShowTestimonialModal(false);
              setTestimonialTransaction(null);
              await refetch();
            }
          }}
        />
      )}

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
