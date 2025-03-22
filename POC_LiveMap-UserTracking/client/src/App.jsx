import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./styles.css";

const socket = io("http://localhost:5000");

const App = () => {
  const mapRef = useRef(null); // Store reference to the map instance
  const markersRef = useRef({}); // Store markers in a ref to persist state

  useEffect(() => {
    if (!mapRef.current) {
      // Initialize map only if it's not already initialized
      mapRef.current = L.map("map").setView([0, 0], 2);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "OpenStreetMap",
      }).addTo(mapRef.current);
    }

    socket.on("receive-location", (data) => {
      const { id, latitude, longitude } = data;
      console.log(`User ${id}: Latitude: ${latitude}, Longitude: ${longitude}`);

      if (markersRef.current[id]) {
        markersRef.current[id].setLatLng([latitude, longitude]);
      } else {
        markersRef.current[id] = L.marker([latitude, longitude]).addTo(mapRef.current);
      }
    });

    socket.on("user-disconnected", (id) => {
      if (markersRef.current[id]) {
        mapRef.current.removeLayer(markersRef.current[id]);
        delete markersRef.current[id];
      }
    });

    return () => {
      socket.off("receive-location");
      socket.off("user-disconnected");
    };
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          socket.emit("send-location", { latitude, longitude });
        },
        (error) => {
          console.log(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    }
  }, []);

  return <div id="map" className="map-container"></div>;
};

export default App;
