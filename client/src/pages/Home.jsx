

import { supabase } from "../config/supabase-config";
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Icon, divIcon, point } from "leaflet";

const customIcon = new Icon({
  iconUrl: require("../images/placeholder.png"),
  iconSize: [38, 38],
});

const createClusterCustomIcon = function (cluster) {
  return new divIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    className: "custom-marker-cluster",
    iconSize: point(33, 33, true),
  });
};

export default function App() {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    async function fetchDataFromSupabase() {
      try {
        const { data, error } = await supabase.from("location").select("*");

        if (error) {
          console.error("Error fetching data from Supabase:", error);
        } else {
          // Assuming your Supabase table has columns "lat", "lon", and "weedID"
          setMarkers(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchDataFromSupabase();
  }, []);

  return (
    <>
      <div className="flex">
        <Sidebar />

        <div className="w-[80%] flex flex-col mt-16">
          <div className="text-center">
            <h1 className="outfit-600 text-[28px]">Dashboard</h1>
            <p className="outfit-300">The Main Hotspot Weed locations are shown below..</p>
          </div>

          <div className="mt-8">
            <MapContainer center={[13.0827, 80.2707]} zoom={13}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MarkerClusterGroup chunkedLoading iconCreateFunction={createClusterCustomIcon}>
                {markers.map((marker) => (
                  <Marker position={[marker.lat, marker.lon]} icon={customIcon}>
                    <Popup>Weed ID: {marker.weedID}</Popup>
                  </Marker>
                ))}
              </MarkerClusterGroup>
            </MapContainer>
          </div>
        </div>
      </div>
    </>
  );
}
