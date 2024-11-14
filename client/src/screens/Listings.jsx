import { IndianRupee } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import MainScreen from "../components/MainScreen";
import { useNavigate } from "react-router-dom";

const Listings = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetchListings();
    fetchUserProfile();
  }, []);
  const fetchListings = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/listings/posts"
      );
      setListings(response.data);
    } catch (error) {
      console.error("Error fetching Listings", error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/user/get-profile",
        { withCredentials: true }
      );

      console.log(response.data);
      setUsername(response.data.username);
      setIsLoggedIn(true);
    } catch (error) {
      console.error(error);
      setUsername("");
      setIsLoggedIn(false);
    }
  };

  return (
    <section className="max-container">
      <MainScreen
        title={isLoggedIn ? `Welcome @${username}` : "Welcome........"}
      >
        <div className="flex flex-wrap">
          {listings.map((listing) => (
            <div
              key={listing._id}
              className="rounded-3xl p-2"
              onClick={() => {
                navigate(`/show-List/${listing._id}`);
              }}
              style={{ cursor: "pointer" }}
            >
              <img
                src={listing.image?.url || listing.image}
                alt={listing.title}
                className="w-96 h-80 rounded-3xl object-cover p-2 hover:opacity-80"
              />
              <div className="lg:w-80">
                <h1 className="font-bold">{listing.title}</h1>
                <p>{listing.description}</p>
                <p className="line-clamp-1">
                  {listing.location}, {listing.country}
                </p>
                <div className="inline-flex justify-center items-center">
                  <IndianRupee size={16} />
                  {listing.price} /night
                </div>
                <p></p>
              </div>
            </div>
          ))}
        </div>
      </MainScreen>
    </section>
  );
};

export default Listings;
