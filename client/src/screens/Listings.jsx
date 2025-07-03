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
import { ListPlus } from "lucide-react";
import ListingCardSkeleton from "../components/ListingCardSkeleton";

const Listings = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
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
  const [isOpenFilterHamburger, setIsOpenFilterHamburger] = useState(false);

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
        if (data.length >= 9) {
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
      const sortValue = e.target.value;
      // console.log("Selected sort value:", sortValue);

      // Parse the sort field and order
      const parts = sortValue.split("_"); //-> [createdAt, asc]
      const sort = parts[0] || "createdAt";
      const order = parts[1] || "asc";

      // console.log("Parsed sort:", sort, "order:", order);

      setSidebarValues({
        ...sidebarValues,
        sort_order: sort,
        order: order,
      });
    }
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    // console.log(numberOfListings);
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await axios.get(
      `${config.API_URL}/api/listings/search?${searchQuery}`
    );
    const data = res.data;
    // console.log("Show more Click data:", data);
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_50%_120%,rgba(239,68,68,0.1),rgba(156,163,175,0.1))] relative">
      <section className="max-container px-4 py-4 min-h-screen">
        <MainScreen
          title={isLoggedIn ? `` : `Welcome To TripGo ! Login Please`}
        >
          <>
            <CategoryIconHeader />
            <div className="flex flex-col md:flex-row">
              <div className="w-full lg:w-1/4 border-b-2 md:border-r-2 md:min-h-screen">
                <div className="block md:hidden sticky top-0 bg-white shadow-md py-3 mt-3">
                  <div className="flex justify-between items-center px-4">
                    <p className="text-lg font-semibold">Filters</p>
                    <button
                      onClick={() => setIsOpenFilterHamburger((prev) => !prev)}
                    >
                      <ListPlus size={24} />
                    </button>
                  </div>
                </div>

                {isOpenFilterHamburger && (
                  <div
                    className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
                    onClick={() => setIsOpenFilterHamburger(false)}
                  />
                )}

                <div
                  className={`fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white z-50 md:z-0 transform ${
                    isOpenFilterHamburger
                      ? "translate-x-0"
                      : "-translate-x-full"
                  } transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:w-full md:max-w-none md:bg-transparent md:h-auto`}
                >
                  <div
                    className={`${
                      isOpenFilterHamburger ? "block" : "hidden"
                    } md:block p-7 transition-all duration-300`}
                  >
                    <SearchForm
                      handleOnChange={handleOnChange}
                      sidebarValues={sidebarValues}
                      handleSubmit={(e) => {
                        handleSubmit(e);
                        setIsOpenFilterHamburger(false);
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="w-full">
                {isLoading ? (
                  // <div className="lg:fixed lg:inset-0 flex items-center justify-center h-[60vh] lg:h-screen">
                  //   <div className="text-2xl md:text-4xl text-gray-400 font-thin animate-pulse">
                  //     Loading...
                  //   </div>
                  // </div>
                  <ListingCardSkeleton />
                ) : !isLoading && listings.length === 0 ? (
                  <ShowError />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 items-start gap-6 mt-7 md:pl-4 lg:pl-8 gap-y-16">
                    {listings.map((listing) => (
                      <ListingCard listing={listing} key={listing._id} />
                      //key is set inside the parent component
                    ))}
                  </div>
                )}
                {showMore && (
                  <button
                    onClick={onShowMoreClick}
                    className="text-primary hover:underline p-7 text-center w-full"
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
