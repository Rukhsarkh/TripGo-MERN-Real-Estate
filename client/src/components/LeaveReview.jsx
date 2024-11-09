import axios from "axios";
import { useState } from "react";

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:5000/api/${listingId}/create`,
        reviewData
      );
      setMessage("Review published successfully");
      setReviewData({
        rating: "0",
        comment: "",
      });
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
          <input
            type="Number"
            id="rating"
            name="rating"
            value={reviewData.rating}
            onChange={handleChange}
            className="border-2 rounded-lg p-2 w-2/3 border-primary"
          />
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
