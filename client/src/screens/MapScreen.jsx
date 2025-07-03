import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ShowMap from "../components/ShowMap";
import config from "../config";
import MainScreen from "../components/MainScreen";

const MapScreen = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${config.API_URL}/api/listings/posts/${id}`,
          { withCredentials: true }
        );
        console.log(response);
        setListing(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, []);

  if (loading || !listing) {
    return <MainScreen title="Loading ...."></MainScreen>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto max-sm:mt-64 sm:mt-48 md:mt-56 lg:mt-36">
      <h1 className="text-2xl md:text-3xl font-bold max-lg:text-center text-gray-800 mb-4">
        Where you'll be
      </h1>

      <ShowMap
        locationCoordinates={listing.geometry.coordinates}
        locationName={listing.title}
        locationImage={listing.image.url}
      />

      <i className="line-clamp-3 text-gray-400 mt-4" title="map">
        Location: {listing.location}, {listing.country} [ For now, only showing
        city and country ] <br />
        Coordinates: {listing.geometry.coordinates[0]} °E,{" "}
        {listing.geometry.coordinates[1]} °N
      </i>
    </div>
  );
};

export default MapScreen;
