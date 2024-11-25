import React, { useState } from "react";
import axios from "axios";
import { Star } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const StarRating = ({ rating, onChange }) => {
  const [hover, setHover] = useState(0);

  const handleStarClick = (selectedRating) => {
    onChange({ target: { name: "rating", value: selectedRating.toString() } });
  };

  return (
    <div className="flex gap-2 md:gap-3" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleStarClick(star)}
          onMouseEnter={() => setHover(star)}
          className="focus:outline-none transform hover:scale-110 transition-transform"
        >
          <Star
            size={20}
            className={`transition-colors md:h-6 md:w-6 ${
              (hover || parseInt(rating)) >= star
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

const LeaveReview = ({ listingId }) => {
  const [reviewData, setReviewData] = useState({
    rating: "0",
    comment: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setReviewData({
      ...reviewData,
      [e.target.name]: e.target.value,
    });
  };

  const { isLoggedIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLoggedIn) {
        const response = await axios.post(
          `http://localhost:5000/api/${listingId}/create`,
          reviewData,
          { withCredentials: true }
        );
        console.log(response.data);
        setMessage("Review published successfully");
        setReviewData({
          rating: "0",
          comment: "",
        });
      } else {
        setMessage("Need to login first!");
      }
    } catch (error) {
      setMessage("Review Publishing Error");
      console.error(error);
    }
  };

  return (
    <div className="w-full max-w-5xl">
      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm md:text-base">
          {message}
        </div>
      )}

      <form className="flex flex-col gap-6 mt-5" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label htmlFor="rating" className="text-sm md:text-base font-medium">
            Rating
          </label>
          <StarRating rating={reviewData.rating} onChange={handleChange} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="comment" className="text-sm md:text-base font-medium">
            Comment
          </label>
          <textarea
            id="comment"
            name="comment"
            value={reviewData.comment}
            onChange={handleChange}
            placeholder="Have you ever been here? Share your experience..."
            rows="5"
            className="w-full md:w-3/4 lg:w-2/3 border-2 rounded-lg p-3 border-primary 
              text-sm md:text-base placeholder:text-gray-400 resize-none
              focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="rounded-xl bg-primary text-white text-sm md:text-base
            w-24 h-10 md:h-12 hover:bg-opacity-90 transition-colors
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default LeaveReview;
