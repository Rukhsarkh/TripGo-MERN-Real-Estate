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
    <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleStarClick(star)}
          onMouseEnter={() => setHover(star)}
          className="focus:outline-none"
        >
          <Star
            size={24}
            className={`transition-colors ${
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
        setMessage("need to login first !");
      }
    } catch (error) {
      setMessage("Review Publishing Error");
      console.error(error);
    }
  };

  return (
    <div>
      {message && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
          {message}
        </div>
      )}

      <form className="flex flex-col gap-4 mt-5" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <label htmlFor="rating">Rating</label>
          <StarRating rating={reviewData.rating} onChange={handleChange} />
        </div>

        <div className="flex flex-col gap-4">
          <label htmlFor="title">Comment</label>
          <textarea
            type="text"
            id="comment"
            name="comment"
            value={reviewData.comment}
            onChange={handleChange}
            placeholder="Have you ever been here ? Share experience .  .  ."
            rows="5"
            className="border-2 rounded-lg p-2 w-2/3 border-primary"
          />
        </div>

        <button
          type="submit"
          className="rounded-3xl p-2 bg-primary text-white text-lg h-10 w-20"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default LeaveReview;
