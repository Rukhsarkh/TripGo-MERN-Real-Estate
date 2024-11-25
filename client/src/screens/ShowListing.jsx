import axios from "axios";
import { useParams } from "react-router-dom";
import MainScreen from "../components/MainScreen";
import { useEffect, useState } from "react";
import { ArrowRightCircle } from "lucide-react";
import LeaveReview from "../components/LeaveReview";
import AllReviews from "../components/AllReviews";
import { useAuth } from "../context/AuthContext";

const ShowListing = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const { checkAuthStatus } = useAuth();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await checkAuthStatus();
      setUserId(id);
    };

    fetchUserId();
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/listings/posts/${id}`,
          { withCredentials: true }
        );
        console.log(response.data);
        setListing(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetails();
    }
  }, [id]);

  const handleDeleteList = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/listings/deleteList/${id}`,
        { withCredentials: true }
      );
      alert(response.data.message);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <MainScreen title="Loading ...."></MainScreen>;
  }

  if (!listing) {
    return (
      <div className="min-h-screen w-full overflow-hidden px-4">
        <MainScreen title="Not Found">
          <div className="text-3xl sm:text-4xl md:text-6xl text-gray-300 font-thin mt-5 flex flex-col items-center">
            <p className="text-center">
              The requested Listing could not be found
            </p>
            <img
              src="../ListNotFoundError.svg"
              className="w-full max-w-md h-auto mt-4"
              alt="Not Found"
            />
          </div>
        </MainScreen>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto max-sm:mt-56 sm:mt-48 md:mt-56 lg:mt-28">
      <div className="flex flex-col items-start justify-center">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold">
          {listing.title}
        </h1>
        <p className="text-xl sm:text-2xl mb-4">
          Listed by: {listing.author?.username || "unknown"}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-12">
        {/* Main Image and Actions Section */}
        <div className="flex-1 space-y-4">
          <div className="relative w-full rounded-3xl overflow-hidden aspect-[4/3] bg-gray-100">
            <img
              src={listing.image?.url}
              alt={listing.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          {listing.author?._id === userId && (
            <div className="flex flex-row gap-4">
              <button
                onClick={handleDeleteList}
                className="rounded-xl px-4 py-2 bg-primary text-white text-base sm:text-lg hover:bg-primary/90 transition-colors"
              >
                Delete
              </button>
              <button className="rounded-xl px-4 py-2 bg-black text-white text-base sm:text-lg hover:bg-black/90 transition-colors">
                Edit
              </button>
            </div>
          )}
        </div>

        {/* More Images Button - Only visible on larger screens */}
        <div className="hidden lg:flex items-center justify-center">
          <button className="text-gray-400 text-xl sm:text-2xl inline-flex items-center gap-3 hover:scale-105 transition-transform duration-300 border-2 border-black p-4 rounded-lg">
            <span>More images</span>
            <ArrowRightCircle className="w-8 h-8 sm:w-12 sm:h-12" />
          </button>
        </div>
      </div>

      {/* Mobile More Images Button */}
      <div className="lg:hidden mt-6 flex justify-center">
        <button className="text-gray-400 text-xl inline-flex items-center gap-2 hover:scale-105 transition-transform duration-300 border-2 border-black p-3 rounded-lg">
          <span>More images</span>
          <ArrowRightCircle className="w-6 h-6" />
        </button>
      </div>

      <hr className="my-8 h-0.5 bg-black" />

      {/* Reviews Section */}
      <div className="space-y-8">
        <div className="bg-white rounded-lg p-4 sm:p-6">
          <h1 className="text-xl sm:text-3xl font-bold mb-4">Leave Review</h1>
          <LeaveReview listingId={listing._id} />
        </div>

        <hr className="h-0.5 bg-black" />

        <div className="bg-white rounded-lg p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl font-bold mb-4">
            All Reviews ({listing.reviews.length})
          </h1>
          <AllReviews listingId={listing._id} />
        </div>
      </div>
    </div>
  );
};

export default ShowListing;
