import axios from "axios";
import { useParams } from "react-router-dom";
import MainScreen from "../components/MainScreen";
import { useEffect, useState } from "react";
import { ArrowRightCircle, StarIcon } from "lucide-react";
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
      <div className="h-screen w-screen overflow-hidden">
        <MainScreen title="Not Found">
          <div className="text-6xl text-gray-300 font-thin mt-5">
            The requested Listing could not be found
            <img src="../ListNotFoundError.svg" className="w-[70vh] h-[70vh]" />
          </div>
        </MainScreen>
      </div>
    );
  }

  return (
    <MainScreen title={listing.title}>
      <p className="text-2xl">
        Listed by : {listing.author?.username || "unknown"}
      </p>
      <div className="mt-4 flex items-center gap-40">
        <div className="flex flex-col gap-2">
          <img
            src={listing.image?.url || image.url}
            className="w-[800px] h-[500px] rounded-3xl"
          />
          {listing.author?._id === userId && (
            <div className="flex flex-row gap-4">
              <button
                onClick={handleDeleteList}
                className="rounded-xl p-2 bg-primary text-white text-lg h-10 w-20 btn-essential"
              >
                Delete
              </button>
              <button className="rounded-xl p-2 bg-black text-white text-lg h-10 w-20 btn-essential">
                Edit
              </button>
            </div>
          )}
        </div>
        <div className="text-gray-400 text-3xl inline-flex items-center gap-3 hover:scale-110 hover:cursor-pointer transition-transform duration-800 border-2 border-black p-4">
          <p>More images</p>
          <ArrowRightCircle size={48} />
        </div>
      </div>
      <hr className="mt-5 h-0.5 bg-black" />

      <div className="mt-5">
        <h1 className="text-2xl font-bold mb-4">Leave Review</h1>
        <LeaveReview listingId={listing._id} />
      </div>
      <hr className="mt-5 h-0.5 bg-black" />
      <div className="mt-5">
        <h1 className="text-2xl font-bold mb-4">
          All Reviews ({listing.reviews.length})
        </h1>
        <AllReviews listingId={listing._id} />
      </div>
    </MainScreen>
  );
};

export default ShowListing;
