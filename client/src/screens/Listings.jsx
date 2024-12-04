import { useEffect, useState } from "react";
import axios from "axios";
import MainScreen from "../components/MainScreen";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import config from "../config";
import CategoryIconHeader from "../components/CategoryIconHeader";
const Listings = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [username, setUsername] = useState("");
  const { isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchListings();
    fetchUserProfile();
  }, []);

  const fetchListings = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${config.API_URL}/api/listings/posts`, {
        withCredentials: true,
      });
      console.log(response.data);
      setListings(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching Listings", error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${config.API_URL}/user/get-profile`, {
        withCredentials: true,
      });
      console.log(response.data);
      setUsername(response.data.username);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_50%_120%,rgba(239,68,68,0.1),rgba(156,163,175,0.1))] relative">
      <section className="max-container px-4 py-4 min-h-screen">
        <MainScreen
          title={
            isLoggedIn ? `Welcome ${username} !` : "Welcome .... Please Login !"
          }
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-[60vh]">
              <div className="text-2xl md:text-4xl text-gray-400 font-thin animate-pulse">
                Loading...
              </div>
            </div>
          ) : listings.length === 0 ? (
            <div className="flex flex-col max-xl:items-center max-xl:justify-center h-[60vh] max-xl:text-center lg:mt-10 lg:ml-5">
              <div className="text-2xl md:text-4xl lg:text-5xl text-gray-300 font-thin mb-8">
                No Listings Available Yet ! Be the First To upload
              </div>
              <img
                src="../helloThere.svg"
                className="w-52 h-52 md:w-64 md:h-64 lg:w-80 lg:h-80 opacity-50"
                alt="No listings"
              />
            </div>
          ) : (
            <div>
              <CategoryIconHeader />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
                {listings.map((listing) => (
                  <div
                    key={listing._id}
                    className="bg-white rounded-3xl border border-gray-200 hover:border-primary transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 cursor-pointer overflow-hidden"
                    onClick={() => navigate(`/show-List/${listing._id}`)}
                  >
                    <div className="aspect-w-16 aspect-h-12 relative">
                      <img
                        src={listing.image?.url || listing.image}
                        alt={listing.title}
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <div className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <h2 className="font-semibold text-lg text-gray-800">
                          {listing.title}
                        </h2>
                      </div>

                      <p className="text-gray-600 text-sm">
                        {listing.description}
                      </p>

                      <div className="flex items-center text-gray-500 text-sm">
                        <span className="line-clamp-1">
                          {listing.location}, {listing.country}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="flex items-center text-primary font-semibold gap-1">
                          &#8377;
                          <span>{listing.price.toLocaleString("en-IN")}</span>
                          <span className="text-gray-500 font-normal ml-1">
                            /night
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </MainScreen>
      </section>
    </div>
  );
};

export default Listings;
