"use client";

import Image from "next/image";
import Breadcrumbs from "@/components/molecules/breadcrumbs";
import CardBooking from "@/components/molecules/card/card-booking";
import { Button } from "@/components/atomics/button";
import { Separator } from "@/components/atomics/separator";
import { Checkbox } from "@/components/atomics/checkbox";
import { DatePickerDemo } from "@/components/molecules/date-picker";
import Link from "next/link";
import BoardingHouse from "./boarding-house";
import Review from "./review";
import { useGetRoomForCheckoutQuery } from "@/services/room.service";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import moment from "moment";
import { moneyFormat } from "@/lib/utils";
import { useTransactionMutation } from "@/services/transaction.service";
import { useToast } from "@/components/atomics/use-toast";

function Checkout({ params }: { params: { id: string } }) {
  const { data: room } = useGetRoomForCheckoutQuery(params.id);
  const [transaction, { isLoading }] = useTransactionMutation();

  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [startDate, setStartDate] = useState<Date | undefined>(
    moment(searchParams.get("start_date")).toDate()
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    moment(searchParams.get("end_date")).toDate()
  );
  const booking = useMemo(() => {
    let totalDays = 0,
      subTotal = 0,
      tax = 0,
      grandTotal = 0;

    if (startDate && endDate) {
      totalDays = moment(endDate).diff(startDate, "days");
      subTotal = totalDays * room?.data.price_per_day;
      tax = subTotal * 0.1;
      grandTotal = subTotal + tax;
    }
    return { totalDays, subTotal, tax, grandTotal };
  }, [startDate, endDate, room]);

  const handlePayment = async () => {
    //
    try {
      const data = {
        room_id: room.data.id,
        boarding_house_id: room.data.boarding_house_id,
        start_date: moment(startDate).format("YYYY-MM-DD"),
        end_date: moment(endDate).format("YYYY-MM-DD"),
        // total_price: booking.grandTotal,
      };

      const res = await transaction(data).unwrap();

      if (res.success) {
        router.push(`/booking-success/${res.data.id}/success`);
      }
    } catch (error: any) {
      toast({
        title: "Something went wrong",
        description: error.data.message,
        variant: "destructive",
      });
    }
  };

  return (
    <main>
      <section
        id="breadcrumb-section"
        className="bg-gray-light pt-[170px] pb-[178px]"
      >
        <div className="container mx-auto">
          <Breadcrumbs />
        </div>
      </section>

      <section
        id="booking-information-section"
        className="container mx-auto flex space-x-[50px] -mt-[148px]"
      >
        {room?.data && <BoardingHouse room={room.data} />}
        <div className="w-full max-w-[460px] pt-[50px]">
          <div>
            <h1 className="font-bold text-[22px] leading-[33px] text-secondary">
              Booking Informations
            </h1>
            <div className="rounded-[30px] mt-2.5 p-[30px] bg-white border border-border shadow-indicator space-y-5">
              <div className="space-y-5">
                <DatePickerDemo
                  disabled={true}
                  placeholder="Start Date"
                  date={startDate}
                  setDate={setStartDate}
                />
                <DatePickerDemo
                  disabled={true}
                  placeholder="End Date"
                  date={endDate}
                  setDate={setEndDate}
                />
              </div>
              <div className="space-y-5">
                <CardBooking
                  title="Total days"
                  value={`${booking.totalDays} days`}
                />
                <CardBooking
                  title="Sub total"
                  value={moneyFormat.format(booking.subTotal)}
                />
                <CardBooking
                  title="Tax (10%)"
                  value={moneyFormat.format(booking.tax)}
                />
                <CardBooking
                  title="Grand total price"
                  value={moneyFormat.format(booking.grandTotal)}
                />
                <Button
                  variant="default"
                  size="default"
                  className="mt-4"
                  onClick={handlePayment}
                  disabled={isLoading}
                >
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {room?.data && <Review boardingHouseId={room.data.boarding_house_id} />}
    </main>
  );
}

export default Checkout;
