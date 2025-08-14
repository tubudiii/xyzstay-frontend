import { Badge } from "@/components/atomics/badge";
import { Button } from "@/components/atomics/button";
import { CityTransactionProps } from "@/interfaces/city-transaction";
import Image from "next/image";
import Link from "next/link";
import { HiOutlineClock, HiOutlineCurrencyDollar } from "react-icons/hi";
import { useUpdateMutation } from "@/services/midtrans.service";
import { MidtransTrigger } from "@/components/MidtransLoader";
import { useState } from "react";

function CardTransaction({
  id,
  id_payment,
  room,
  title,
  boardinghouse_name,
  location,
  days,
  price,
  status,
  status_payment,
}: CityTransactionProps) {
  const [updatePayment, { isLoading }] = useUpdateMutation();
  const [snapToken, setSnapToken] = useState<string | null>(null);
  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";

  const handlePayNow = async () => {
    if (!id_payment) return;
    try {
      const res = await updatePayment({ id: id_payment }).unwrap();
      console.log("🚀 ~ handlePayNow ~ res:", res);
      setSnapToken(res.payment.token);
    } catch (err) {
      console.error("Update payment failed:", err);
    }
  };
  // Debug: cek value room dan url gambar
  const imageUrl = `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}/${
    room?.images?.[0]?.image || ""
  }`;
  return (
    <figure className="flex items-center justify-between bg-white rounded-3xl p-4 border border-border shadow-indicator">
      {snapToken && (
        <MidtransTrigger
          clientKey={clientKey}
          transactionToken={snapToken}
          onSuccess={(result) => {}}
          onPending={(result) => {}}
          onError={() => {}}
          onClose={() => {}}
        />
      )}
      <div className="flex items-center space-x-4">
        <Image
          src={imageUrl}
          alt={title}
          height={90}
          width={120}
          className="w-[120px] h-[90px] rounded-2xl"
          unoptimized
        />

        <div className="flex flex-col justify-between w-full">
          <div className="flex justify-between items-center">
            {/* Nama boarding house di kiri */}
            <h1 className="font-bold leading-8 text-secondary lg:text-base text-sm">
              {boardinghouse_name}
            </h1>

            {/* Status di kanan */}
            <div className="flex justify-end">
              {status === "waiting" && (
                <Badge variant={"waiting"}>{status}</Badge>
              )}
              {status === "approved" && (
                <Badge variant={"approved"}>{status}</Badge>
              )}
              {status === "canceled" && (
                <Badge variant={"canceled"}>{status}</Badge>
              )}
            </div>
          </div>

          {/* Title di bawah boarding house name */}
          <h2 className="font-normal leading-8 text-secondary lg:text-base text-sm mt-1">
            {title}
          </h2>

          <div className="flex gap-4 mt-4">
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2.5">
              <div className="flex items-center text-sm font-semibold leading-[21px]">
                <Image
                  src="/icons/location-dark.svg"
                  alt="location-dark"
                  height={0}
                  width={0}
                  className="w-5 h-5 mr-1"
                />
                {location}
              </div>
              <div className="flex items-center text-sm font-semibold leading-[21px]">
                <HiOutlineClock className="w-5 h-5 mr-1" />
                {days} days
              </div>
              <div className="flex items-center text-sm font-semibold leading-[21px]">
                <HiOutlineCurrencyDollar className="w-5 h-5 mr-1" />
                {price.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </div>
            </div>
            <div className="flex items-center space-x-3.5">
              <Link href={`/booking-success/${id}/success`}>
                <Button variant="third" size="header">
                  Preview
                </Button>
              </Link>{" "}
              {status === "approved" && status_payment !== "success" && (
                <Button
                  variant="third"
                  size="header"
                  disabled={!id_payment || isLoading}
                  onClick={handlePayNow}
                >
                  {isLoading ? "Processing..." : "Pay Now"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}
export default CardTransaction;
