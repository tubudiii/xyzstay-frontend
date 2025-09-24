import { Button } from "@/components/atomics/button";
import Title from "@/components/atomics/title";
import { useToast } from "@/components/atomics/use-toast";
import CardBooking from "@/components/molecules/card/card-booking";
import { DatePickerDemo } from "@/components/molecules/date-picker";
import { moneyFormat } from "@/lib/utils";
import { useCheckAvailbilityMutation } from "@/services/transaction.service";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { FaRegHandshake } from "react-icons/fa";

interface BookingSectionProps {
  boardingHouseId: number;
  rooms: Array<{
    id: number;
    name: string;
    slug: string;
    price_per_day: number;
    is_available: number;
    square_feet?: number;
    capacity?: number;
    room_type?: string;
  }>;
  selectedRoomId: number | null;
  setSelectedRoomId: (id: number | null) => void;
}

function BookingSection({
  boardingHouseId,
  rooms,
  selectedRoomId,
  setSelectedRoomId,
}: BookingSectionProps) {
  const selectedRoom = rooms.find((room) => room.id === selectedRoomId);
  const [modalOpen, setModalOpen] = useState(false);
  const [agree, setAgree] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const { toast } = useToast();
  const router = useRouter();
  const [checkAvailability, { isLoading }] = useCheckAvailbilityMutation();

  const booking = useMemo(() => {
    let totalDays = 0,
      subTotal = 0,
      tax = 0,
      grandTotal = 0;

    if (startDate && endDate && selectedRoom) {
      totalDays = moment(endDate).diff(startDate, "days");
      subTotal = totalDays * selectedRoom.price_per_day;
      tax = subTotal * 0.1;
      grandTotal = subTotal + tax;
    }

    return { totalDays, subTotal, tax, grandTotal };
  }, [startDate, endDate, selectedRoom]);

  const handleBook = () => {
    if (!selectedRoom) return;
    setModalOpen(true);
  };

  const handleAgreeAndBook = async () => {
    if (!selectedRoom) return;
    setModalOpen(false);
    try {
      const data = {
        room_id: selectedRoom.id,
        boarding_house_id: boardingHouseId,
        start_date: moment(startDate).format("YYYY-MM-DD"),
        end_date: moment(endDate).format("YYYY-MM-DD"),
      };
      const res = await checkAvailability(data).unwrap();
      if (res.success) {
        router.push(
          `/boardinghouse/${selectedRoom.slug}/checkout?start_date=${data.start_date}&end_date=${data.end_date}`
        );
      }
      console.log("🚀 ~ handleBook ~ res:", res);
    } catch (error: any) {
      if (error.status === 401) {
        toast({
          title: "You need to login first",
          description: "Please login to continue with the booking.",
          variant: "destructive",
          action: (
            <Link href={`/sign-in?callbackUrl=${window.location.href}`}>
              Sign In
            </Link>
          ),
        });
      } else if (error.status === 400 || error.status === 422) {
        toast({
          title: "Booking Failed",
          description: error.data?.message || "Something went wrong",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <>
      <div className="w-full max-w-[360px] xl:max-w-[400px] h-fit space-y-5 bg-white border border-border rounded-[20px] p-[30px] shadow-indicator">
        <h1 className="font-bold text-lg leading-[27px] text-secondary">
          Start Booking
        </h1>
        {/* Dropdown Room */}
        <div className="mb-2">
          <label htmlFor="room-select" className="block mb-1 font-medium">
            Select Room
          </label>
          <select
            id="room-select"
            className="w-full border rounded px-3 py-2"
            value={selectedRoomId ?? ""}
            onChange={(e) => setSelectedRoomId(Number(e.target.value))}
          >
            <option value="" disabled>
              -- Choose a room --
            </option>
            {rooms
              .filter((room) => room.is_available === 1)
              .map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name} - {moneyFormat.format(room.price_per_day)}/day
                </option>
              ))}
          </select>
        </div>
        {/* Harga per hari dan detail kamar */}
        {selectedRoom && (
          <div className="space-y-2 mb-2">
            <span className="leading-6">
              <span className="font-bold text-4xl leading-[54px]">
                {moneyFormat.format(selectedRoom.price_per_day)}
              </span>
              /day
            </span>
            <div className="flex flex-col text-sm text-secondary">
              {selectedRoom.square_feet !== undefined && (
                <span>Square Feet: {selectedRoom.square_feet} sqft</span>
              )}
              {selectedRoom.capacity !== undefined && (
                <span>Capacity: {selectedRoom.capacity} people</span>
              )}
              {selectedRoom.room_type && (
                <span>Room Type: {selectedRoom.room_type}</span>
              )}
            </div>
          </div>
        )}
        <div className="space-y-5">
          <DatePickerDemo
            placeholder="Check in"
            date={startDate}
            setDate={setStartDate}
          />
          <DatePickerDemo
            placeholder="Check out"
            date={endDate}
            setDate={setEndDate}
          />
        </div>
        <div className="space-y-5">
          <CardBooking title="Total days" value={`${booking.totalDays} days`} />
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
        </div>
        <Button
          variant="default"
          className="mt-4"
          onClick={handleBook}
          disabled={!selectedRoom || !startDate || !endDate || isLoading}
        >
          Book Now
        </Button>
      </div>

      {/* Modal Terms & Condition */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/2 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-[90vw] sm:w-auto relative scale-100 animate-scaleIn">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
              onClick={() => {
                setModalOpen(false);
                setAgree(false);
              }}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="flex flex-col items-center gap-3">
              <FaRegHandshake className="text-blue-500 text-5xl mb-2" />
              <h2 className="text-xl font-bold mb-2 text-center">
                Terms & Conditions
              </h2>
              <p className="mb-4 text-gray-700 text-center">
                By proceeding with the booking, you{" "}
                <span className="font-semibold text-red-500">
                  agree that there is no reschedule and no refund
                </span>{" "}
                after payment is completed.
              </p>
              <label className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="accent-blue-600 w-5 h-5"
                />
                <span className="text-sm">
                  I agree to the terms and conditions above
                </span>
              </label>
              <div className="flex gap-2 w-full">
                <button
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                  onClick={() => {
                    setModalOpen(false);
                    setAgree(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                  onClick={handleAgreeAndBook}
                  disabled={!agree}
                >
                  Accepted
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BookingSection;
