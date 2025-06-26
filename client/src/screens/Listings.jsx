import { useEffect, useState } from "react";
import axios from "axios";
import MainScreen from "../components/MainScreen";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import config from "../config";
import CategoryIconHeader from "../components/CategoryIconHeader";
import ShowError from "../ErrorPages/ShowError";
import ListingCard from "../components/ListingCard";
import SearchForm from "../components/SearchForm";

const Listings = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [username, setUsername] = useState("");
  const { isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarValues, setSidebarValues] = useState({
    searchTerm: "",
    country: "",
    type: "all",
    parking: false,
    furnished: false,
    sort_order: "createdAt",
    order: "asc",
  });
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    // for (const [key, value] of urlParams.entries()) {
    //   console.log(key, value);
    // }

    const searchTermFromUrl = urlParams.get("searchTerm");
    const countryFromUrl = urlParams.get("country");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const sort_orderFromUrl = urlParams.get("sort_order");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      countryFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      sort_orderFromUrl ||
      orderFromUrl
    ) {
      setSidebarValues({
        searchTerm: searchTermFromUrl || "",
        country: countryFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl == true ? true : false,
        furnished: furnishedFromUrl === true ? true : false,
        sort_order: sort_orderFromUrl || "createdAt",
        order: orderFromUrl || "asc",
      });
    }

    const getfilteredListings = async () => {
      try {
        setIsLoading(true);
        const searchQuery = urlParams.toString();
        const res = await axios.get(
          `${config.API_URL}/api/listings/search?${searchQuery}`
        );
        const data = res.data;
        if (data.length > 8) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
        setListings(data);
        setIsLoading(false);
      } catch (error) {
        // console.log(error);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };

    getfilteredListings();
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarValues.searchTerm);
    urlParams.set("country", sidebarValues.country);
    urlParams.set("type", sidebarValues.type);
    urlParams.set("parking", sidebarValues.parking);
    urlParams.set("furnished", sidebarValues.furnished);
    urlParams.set("type", sidebarValues.type);
    urlParams.set("sort_order", sidebarValues.sort_order);
    urlParams.set("order", sidebarValues.order);
    const searchQuery = urlParams.toString();
    navigate(`/explore?${searchQuery}`);
  };

  const handleOnChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "Rent" ||
      e.target.id === "Sale"
    ) {
      setSidebarValues({ ...sidebarValues, type: e.target.id });
    }

    if (e.target.id === "searchTerm") {
      setSidebarValues({ ...sidebarValues, searchTerm: e.target.value });
    }

    if (e.target.id === "country") {
      setSidebarValues({ ...sidebarValues, country: e.target.value });
    }

    if (e.target.id === "parking" || e.target.id === "furnished") {
      setSidebarValues({ ...sidebarValues, [e.target.id]: e.target.checked });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "createdAt";
      const order = e.target.value.split("_")[1] || "asc";
      setSidebarValues({ ...sidebarValues, sort_order: sort, order: order });
    }
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    console.log(numberOfListings);
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await axios.get(
      `${config.API_URL}/api/listings/search?${searchQuery}`
    );
    const data = res.data;
    console.log("Show more Click data:", data);
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };

  useEffect(() => {
    // fetchListings();
    isLoggedIn ? fetchUserProfile() : "";
  }, [isLoggedIn]);

  // const fetchListings = async () => {
  //   try {
  //     setIsLoading(true);
  //     const response = await axios.get(`${config.API_URL}/api/listings/posts`, {
  //       withCredentials: true,
  //     });
  //     // console.log(response.data);
  //     setListings(response.data);
  //     setIsLoading(false);
  //   } catch (error) {
  //     // console.error("Error fetching Listings", error);
  //     setIsLoading(false);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${config.API_URL}/user/get-profile`, {
        withCredentials: true,
      });
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
            isLoggedIn
              ? `Welcome ${username} !`
              : `Welcome To TripGo ! Login Please`
          }
        >
          <>
            {/* <CategoryIconHeader /> */}
            <div className="flex flex-col md:flex-row">
              <div className="w-full lg:w-1/4 p-7 border-b-2 md:border-r-2 md:min-h-screen">
                <SearchForm
                  handleOnChange={handleOnChange}
                  handleSubmit={handleSubmit}
                  sidebarValues={sidebarValues}
                />
              </div>
              <div className="w-full">
                {isLoading ? (
                  <div className="lg:fixed lg:inset-0 flex items-center justify-center h-[60vh] lg:h-screen">
                    <div className="text-2xl md:text-4xl text-gray-400 font-thin animate-pulse">
                      Loading...
                    </div>
                  </div>
                ) : !isLoading && listings.length === 0 ? (
                  <ShowError />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 items-start gap-6 mt-7 md:pl-4 lg:pl-8 gap-y-20">
                    {listings.map((listing) => (
                      <ListingCard listing={listing} key={listing._id} />
                    ))}
                  </div>
                )}
                {showMore && (
                  <button
                    onClick={onShowMoreClick}
                    className="text-green-700 hover:underline p-7 text-center w-full"
                  >
                    Show more
                  </button>
                )}
              </div>
            </div>
          </>
        </MainScreen>
      </section>
    </div>
  );
};

export default Listings;
