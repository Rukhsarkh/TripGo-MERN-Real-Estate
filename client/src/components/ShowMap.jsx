import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";
import "../popup.css";

const ShowMap = ({ locationCoordinates, locationName, locationImage }) => {
  const mapContainerRef = useRef();
  const mapRef = useRef();
  const location = [locationCoordinates[0], locationCoordinates[1]];

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: location,
      zoom: 10,
    });

    const popupHTML = `
      <div class="p-2 max-w-xs lg:max-w-sm text-base bg-green-200">
        <h2 class="font-bold text-gray-800 mb-2">${locationName}</h2>
          <a class="text-blue-600 hover:underline cursor-pointer">Learn More</a>
      </div>
    `;

    const popup = new mapboxgl.Popup({
      offset: 50,
      className: "custom-popup",
    }).setHTML(popupHTML);

    new mapboxgl.Marker({ color: "red", anchor: "bottom" })
      .setLngLat(location)
      .addTo(mapRef.current)
      .setPopup(popup);
  });

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-[60vh] lg:rounded-3xl shadow-lg shadow-gray-500 p-2"
    />
  );
};

export default ShowMap;
