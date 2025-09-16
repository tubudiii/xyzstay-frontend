"use client";

import React, { useState } from "react";
import { useToast } from "@/components/atomics/use-toast";
import { useSession } from "next-auth/react";
import TestimonialModal from "@/components/molecules/modal/TestimonialModal";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
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
  const { toast } = useToast();
  const { data: transactions, refetch } = useGetTransactionQuery({});
  const { data: session } = useSession();
  const user = session?.user;
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [testimonialTransaction, setTestimonialTransaction] =
    useState<Transaction | null>(null);
  // Hapus state testimonial dari parent, pindahkan ke modal
  // Komponen Star Rating
  const StarRating = ({
    value,
    onChange,
  }: {
    value: number;
    onChange: (val: number) => void;
  }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`cursor-pointer text-2xl ${
            star <= value ? "text-yellow-400" : "text-gray-300"
          }`}
          onClick={() => onChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  );

  // Modal Invoice State
  const [showInvoice, setShowInvoice] = React.useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    React.useState<Transaction | null>(null);

  // Invoice Modal Component
  const InvoiceModal = ({
    transaction,
    onClose,
  }: {
    transaction: Transaction;
    onClose: () => void;
  }) => {
    const p = transaction.payments?.[0];
    // Ref untuk invoice
    const invoiceRef = React.useRef<HTMLDivElement>(null);

    // Fungsi download PDF
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
            <img src="/public/logo xyz.png" alt="Logo" className="h-10 w-10" />
            <h2 className="text-2xl font-bold tracking-wide text-gray-800">
              INVOICE
            </h2>
          </div>
          <div ref={invoiceRef} className="px-10 py-8 bg-white">
            <div className="mb-6 flex flex-col gap-1">
              <span className="text-sm text-gray-500">
                Tanggal:{" "}
                {new Date(
                  transaction.created_at ?? Date.now()
                ).toLocaleDateString()}
              </span>
              <span className="text-sm text-gray-500">
                Kode Transaksi:{" "}
                <span className="font-semibold text-blue-700">
                  {transaction.code ?? "-"}
                </span>
              </span>
              <span className="text-sm text-gray-500">
                ID Transaksi:{" "}
                <span className="font-semibold">{transaction.id}</span>
              </span>
            </div>
            <div className="mb-6">
              <div className="font-semibold text-lg text-gray-700 mb-2">
                Detail Penginapan
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">Nama Penginapan:</div>
                <div className="font-medium">
                  {transaction.boarding_house.name}
                </div>
                <div className="text-gray-600">Alamat:</div>
                <div className="font-medium">
                  {transaction.boarding_house.address}
                </div>
                <div className="text-gray-600">Nama Kamar:</div>
                <div className="font-medium">{transaction.room.name}</div>
                <div className="text-gray-600">Durasi:</div>
                <div className="font-medium">{transaction.total_days} hari</div>
              </div>
            </div>
            <div className="mb-6">
              <div className="font-semibold text-lg text-gray-700 mb-2">
                Detail Pembayaran
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">Harga:</div>
                <div className="font-medium">
                  Rp{transaction.total_price.toLocaleString()}
                </div>
                <div className="text-gray-600">Status Pembayaran:</div>
                <div className="font-medium capitalize">
                  {p?.payment_status ?? "-"}
                </div>
                <div className="text-gray-600">ID Pembayaran:</div>
                <div className="font-medium">{p?.id ?? "-"}</div>
              </div>
            </div>
            <div className="border-t pt-4 flex flex-col gap-1">
              <span className="text-xs text-gray-400">
                Terima kasih telah melakukan transaksi di XYZStay. Invoice ini
                dapat digunakan sebagai bukti pembayaran yang sah.
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
          subtitle="Manage your house and get money"
        />
      </div>

      <div className="mt-[30px] space-y-5">
        {transactions?.data?.total ? (
          transactions?.data?.data.map(
            (transaction: Transaction, index: number) => {
              const p = transaction.payments?.[0];
              const isSuccess = p?.payment_status === "success";
              // Cari testimonial user pada boarding house
              const userTestimonial =
                transaction.boarding_house?.testimonials?.find(
                  (t) => t.user_id === user?.id
                );
              return (
                <div key={index} className="relative">
                  <CardTransaction
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
                          : "Beri Testimonial"}
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
              // Cari transaksi terbaru dari hasil refetch
              const latestTransaction = transactions?.data?.data.find(
                (t: Transaction) => t.id === testimonialTransaction.id
              );
              if (latestTransaction) {
                setTestimonialTransaction(latestTransaction);
              }
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

export default MyTransactions;
