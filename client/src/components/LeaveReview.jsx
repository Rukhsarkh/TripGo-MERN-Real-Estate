import { useState } from "react";
import axios from "axios";
import {
  Star,
  SendIcon,
  AlertCircleIcon,
  CheckCircle2Icon,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import config from "../config";

const StarRating = ({ rating, onChange }) => {
  const [hover, setHover] = useState(0);

  const handleStarClick = (selectedRating) => {
    onChange({ target: { name: "rating", value: selectedRating.toString() } });
  };

  return (
    <div
      className="flex items-center gap-1 md:gap-2"
      onMouseLeave={() => setHover(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
          onClick={() => handleStarClick(star)}
          onMouseEnter={() => setHover(star)}
          className="group relative focus:outline-none transform hover:scale-110 transition-all duration-200 ease-in-out"
        >
          <Star
            size={28}
            className={`
              transition-all duration-300 ease-in-out
              ${
                (hover || parseInt(rating)) >= star
                  ? "fill-yellow-400 text-yellow-400 scale-110"
                  : "fill-gray-200 text-gray-200 group-hover:fill-yellow-200"
              }
            `}
          />
          {(hover || parseInt(rating)) >= star && (
            <span
              className="absolute -top-8 left-1/2 -translate-x-1/2 
                bg-black text-white text-xs px-2 py-1 rounded-md 
                opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              {star}
            </span>
          )}
        </button>
      ))}
      {parseInt(rating) > 0 && (
        <span className="ml-2 text-sm text-gray-600">{rating} / 5</span>
      )}
    </div>
  );
};

const LeaveReview = ({ listingId }) => {
  const [reviewData, setReviewData] = useState({
    rating: "0",
    comment: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setReviewData({
      ...reviewData,
      [e.target.name]: e.target.value,
    });
  };

  const { isLoggedIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setMessageType("");

    // Validation
    if (parseInt(reviewData.rating) === 0) {
      setMessage("Please select a rating");
      setMessageType("error");
      setIsLoading(false);
      return;
    }

    if (reviewData.comment.trim().length < 10) {
      setMessage("Comment must be at least 10 characters long");
      setMessageType("error");
      setIsLoading(false);
      return;
    }

    try {
      if (isLoggedIn) {
        const response = await axios.post(
          `${config.API_URL}/api/${listingId}/create`,
          reviewData,
          { withCredentials: true }
        );

        setMessage("Review published successfully");
        setMessageType("success");
        setReviewData({
          rating: "0",
          comment: "",
        });
        window.location.reload();
      } else {
        setMessage("Please log in to submit a review");
        setMessageType("error");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "An error occurred while publishing your review"
      );
      setMessageType("error");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl bg-white shadow-lg p-5 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold max-lg:text-center text-gray-800 mb-4">
        Leave Review
      </h2>

      {message && (
        <div
          className={`
            flex items-center gap-3 p-4 text-sm md:text-base 
            ${
              messageType === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }
          `}
        >
          {messageType === "success" ? (
            <CheckCircle2Icon className="text-green-500" />
          ) : (
            <AlertCircleIcon className="text-red-500" />
          )}
          {message}
        </div>
      )}

      <form className="space-y-2" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label
            htmlFor="rating"
            className="block text-sm md:text-base font-medium text-gray-700"
          >
            Your Rating
          </label>
          <StarRating rating={reviewData.rating} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="comment"
            className="block text-sm md:text-base font-medium text-gray-700"
          >
            Your Review
          </label>
          <textarea
            id="comment"
            name="comment"
            value={reviewData.comment}
            onChange={handleChange}
            placeholder="Tell us about your experience in detail..."
            rows="5"
            maxLength={500}
            className="
              w-full border-2 p-4 
              text-sm md:text-base 
              border-gray-300
              placeholder:text-gray-400
              outline-none
            "
          />
          <div className="text-right text-xs text-gray-500">
            {reviewData.comment.length}/500 characters
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className="
              flex items-center justify-center 
              px-6 py-3 
              bg-primary text-white 
              hover:bg-primary/90 
              active:translate-y-0.5 
              transition-all duration-300 ease-in-out
            "
          >
            <SendIcon className="mr-2 group-hover:animate-pulse" size={20} />
            {isLoading ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeaveReview;
