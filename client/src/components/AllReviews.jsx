import axios from "axios";
import { StarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import SentimentAnalysis from "./SentimentAnalysis";
import { useAuth } from "../context/AuthContext";
import { all } from "three/webgpu";
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
        `http://localhost:5000/api/${listingId}/allreviews`,
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
        `http://localhost:5000/api/${listingId}/${reviewId}/review-delete`,
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
    return <div className="animate-pulse">Loading...</div>;
  }

  if (allReviews.length === 0) {
    return (
      <p className="text-2xl text-gray-400 font-thin mt-5">
        No Reviews Available. Be the First to Leave a Review
      </p>
    );
  }

  return (
    <div className="flex flex-row">
      <div className="flex flex-wrap gap-4 w-1/2">
        {allReviews.map((item) => (
          <div
            className="border-2 rounded-lg w-80 p-4 flex flex-col gap-2"
            key={item._id}
          >
            <div className="flex flex-row items-center justify-between">
              <div className="inline-flex items-center gap-2 h-10 w-10 rounded-full">
                <img src="https://cdn-icons-png.flaticon.com/512/9187/9187604.png" />
                <p className="whitespace-nowrap">
                  @{item.author?.username || "Deleted User"}
                </p>
              </div>
              {item.author?._id === userId && (
                <button
                  className="btn-essential w-1/3"
                  onClick={() => {
                    handleReviewDelete(item._id);
                  }}
                >
                  Delete
                </button>
              )}
            </div>

            <hr />
            <div className="inline-flex items-center gap-2 font-bold">
              {/* {[...Array(parseInt(item.rating))].map((_, index) => (
                <StarIcon key={index} />
              ))} */}

              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className={`${
                    star <= parseInt(item.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-400 text-gray-400"
                  }`}
                />
              ))}
            </div>
            <p className="break-words">❝ {item.comment} ❞</p>
          </div>
        ))}
      </div>
      <div className="w-1/2 flex justify-center">
        <h1 className="font-bold text-3xl">
          <SentimentAnalysis listingId={listingId} />
        </h1>
      </div>
    </div>
  );
};

export default AllReviews;
