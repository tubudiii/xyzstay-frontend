import CardFacility from "@/components/molecules/card/card-facility";
// import { Room as RoomInterface } from "@/interfaces/room";
import { RoomWithBoardingHouse } from "@/interfaces/boarding-house";
import Image from "next/image";
import React from "react";

function BoardingHouse({ room }: { room: RoomWithBoardingHouse }) {
  return (
    <div className="w-full max-w-[460px] h-fit p-[30px] space-y-5 bg-white rounded-[30px] shadow-indicator border border-border">
      {room?.images?.[0] && (
        <Image
          src={`${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}/${room.images[0].image}`}
          alt="image-1"
          height={0}
          width={0}
          className="w-full h-[220px] rounded-[30px]"
          unoptimized
        />
      )}
      <h1 className="font-bold text-[22px] leading-[33px] text-secondary">
        {room?.boarding_house?.name}
      </h1>
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center font-semibold leading-6 max-w-[300x]">
            <Image
              src="/icons/location-dark.svg"
              alt="location-dark"
              height={0}
              width={0}
              className="w-5 h-5 mr-1"
            />
            {room?.boarding_house?.address}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center font-semibold leading-6">
            <Image
              src="/icons/profile-2user-dark.svg"
              alt="profile-2user-dark"
              height={0}
              width={0}
              className="w-5 h-5 mr-1"
            />
            {room?.capacity} people
          </div>
          <div className="flex items-center font-semibold leading-6">
            <Image
              src="/icons/format-square-dark.svg"
              alt="format-square-dark"
              height={0}
              width={0}
              className="w-5 h-5 mr-1"
            />
            {room?.square_feet} sqft
          </div>
        </div>
      </div>
      <CardFacility
        icon="/icons/weight.svg"
        title="Room Name"
        subtitle={room?.name ?? "Unknown"}
      />
      <CardFacility
        icon="/icons/grey-skyline.svg"
        title="City"
        subtitle={room?.boarding_house?.city?.name ?? "Unknown"}
      />{" "}
    </div>
  );
}

export default BoardingHouse;
