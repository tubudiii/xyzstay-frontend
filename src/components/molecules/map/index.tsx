"use client";
import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { CiLocationOn } from "react-icons/ci";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { divIcon } from "leaflet";

import axios from "axios";

interface MyMapProps {
  address: string;
}

// function MyMap({ address }: MyMapProps) {
//   const [windowReady, setWindowReady] = useState(false);
//   const [geoData, setGeoData] = useState<{
//     lat: number | null;
//     lng: number | null;
//   }>({ lat: null, lng: null });

//   useEffect(() => {
//     setWindowReady(true);
//     console.log("Address yang dikirim ke MyMap:", address);
//   }, [address]);

//   useEffect(() => {
//     if (!address) return;
//     const fetchGeoData = async () => {
//       try {
//         const response = await axios.get(
//           `https://nominatim.openstreetmap.org/search`,
//           {
//             params: {
//               q: address,
//               format: "json",
//               addressdetails: 1,
//               limit: 1,
//             },
//             headers: {
//               "Accept-Language": "en",
//             },
//           }
//         );
//         console.log("Response geocoding:", response.data);
//         if (response.data && response.data.length > 0) {
//           setGeoData({
//             lat: parseFloat(response.data[0].lat),
//             lng: parseFloat(response.data[0].lon),
//           });
//         }
//       } catch (error) {
//         console.error("Geocoding error:", error);
//         setGeoData({ lat: null, lng: null });
//       }
//     };
//     fetchGeoData();
//   }, [address]);

//   if (!windowReady || geoData.lat === null || geoData.lng === null) {
//     return <div>Loading map...</div>;
//   }

//   return (
//     <MapContainer
//       center={[geoData.lat, geoData.lng]}
//       zoom={12}
//       className="h-[250px] w-full rounded-[20px]"
//     >
//       <TileLayer
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />
//       <Marker
//         position={[geoData.lat, geoData.lng]}
//         icon={divIcon({
//           iconSize: [24, 24],
//           iconAnchor: [24 / 2, 24 + 9],
//           className: "mymarker",
//           html: `<div><img src='/icons/location-dark.svg' alt='location-dark' style='width:24px;height:24px;'/></div>`,
//         })}
//       />
//     </MapContainer>
//   );
// }
// export default MyMap;
