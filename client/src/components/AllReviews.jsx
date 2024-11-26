import axios from "axios";
import { StarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import SentimentAnalysis from "./SentimentAnalysis";
import { useAuth } from "../context/AuthContext";
import config from "../config";

const AllReviews = ({ listingId }) => {
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { checkAuthStatus } = useAuth();
  const [userId, setUserId] = useState(null);

  // checkAuthStatus() is an async function that returns a Promise, so you can't
  // directly destructure the userId like that. Instead, you'll need to use await or .then() to resolve the Promise.
  useEffect(() => {
    const fetchUserId = async () => {
      const id = await checkAuthStatus();
      setUserId(id);
    };
    fetchUserId();
    fetchReviews();
  }, [listingId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${config.API_URL}/api/${listingId}/allreviews`,
        { withCredentials: true }
      );
      console.log(response.data);
      setAllReviews(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewDelete = async (reviewId) => {
    try {
      const response = await axios.delete(
        `${config.API_URL}/api/${listingId}/${reviewId}/review-delete`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        alert("Review deleted successfully");
      }
      fetchReviews();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-pulse text-lg md:text-xl text-gray-600">
          Loading...
        </div>
      </div>
    );
  }

  if (allReviews.length === 0) {
    return (
      <p className="text-xl md:text-2xl text-gray-400 font-thin mt-5 text-center px-4">
        No Reviews Available. Be the First to Leave a Review
      </p>
    );
  }

  return (
    <div className="w-full max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Reviews Section */}
        <div className="w-full lg:w-1/2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
            {allReviews.map((item) => (
              <div
                className="border-2 rounded-lg p-4 flex flex-col gap-2 shadow-sm hover:shadow-md transition-shadow"
                key={item._id}
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden">
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/9187/9187604.png"
                        alt="User avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm md:text-base font-medium">
                      @{item.author?.username || "Deleted User"}
                    </p>
                  </div>
                  {item.author?._id === userId && (
                    <button
                      className="px-4 py-2 text-sm md:text-base bg-red-50 text-red-600 rounded-lg 
                        hover:bg-red-100 transition-colors"
                      onClick={() => handleReviewDelete(item._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>

                <hr className="my-2" />

                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      size={16}
                      className={`${
                        star <= parseInt(item.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-sm md:text-base text-gray-700 break-words">
                  ❝ {item.comment} ❞
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Sentiment Analysis Section */}
        <div className="w-full lg:w-1/2">
          <div className="sticky top-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h2 className="text-xl md:text-2xl font-bold mb-4 text-center p-2 bg-primary text-white">
                Sentiment Analysis
              </h2>
              <SentimentAnalysis listingId={listingId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllReviews;
