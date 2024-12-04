import axios from "axios";
import {
  StarIcon,
  EditIcon,
  SaveIcon,
  XIcon,
  Trash2Icon,
  CheckCircle2Icon,
} from "lucide-react";
import { useEffect, useState } from "react";
import SentimentAnalysis from "./SentimentAnalysis";
import { useAuth } from "../context/AuthContext";
import config from "../config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllReviews = ({ listingId }) => {
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { checkAuthStatus } = useAuth();
  const [userId, setUserId] = useState(null);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editedReview, setEditedReview] = useState({
    comment: "",
    rating: 0,
  });
  const [isDeleteBoxOpen, setIsDeleteBoxOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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

      setIsDeleteBoxOpen(false);
      setIsDeleting(false);
      toast.success(`Review Deleted Successfully !`, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progressStyle: {
          background: "#32de84",
        },
        style: {
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          padding: "12px 20px",
          margin: "30px",
          fontSize: "0.95rem",
          color: "#32de84",
        },
        icon: () => <CheckCircle2Icon color="#32de84" size={20} />, // Custom icon with react-icons
      });

      setTimeout(() => {
        window.location.reload();
      }, 4000);

      fetchReviews();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditReview = (review) => {
    setEditingReviewId(review._id);
    setEditedReview({
      comment: review.comment,
      rating: parseInt(review.rating),
    });
  };

  const handleSaveReview = async () => {
    try {
      const response = await axios.put(
        `${config.API_URL}/api/${listingId}/${editingReviewId}/review-edit`,
        {
          comment: editedReview.comment,
          rating: editedReview.rating,
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        toast.success("Review Updated Successfully!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          style: {
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            padding: "12px 20px",
            margin: "30px",
            fontSize: "0.95rem",
            color: "#32de84",
          },
          icon: () => <CheckCircle2Icon color="#32de84" size={20} />,
        });

        fetchReviews();
        setEditingReviewId(null);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update review", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
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
                    <div className="flex gap-2">
                      {editingReviewId === item._id ? (
                        <>
                          <button
                            className="px-4 py-2 text-sm md:text-base bg-green-50 text-green-600 rounded-lg 
                              hover:bg-green-100 transition-all active:translate-y-0.5 duration-100 ease-in flex items-center gap-2"
                            onClick={handleSaveReview}
                          >
                            <SaveIcon size={16} /> Save
                          </button>
                          <button
                            className="px-4 py-2 text-sm md:text-base bg-red-50 text-red-600 rounded-lg 
                              hover:bg-red-100transition-all active:translate-y-0.5 duration-100 ease-in flex items-center gap-2"
                            onClick={handleCancelEdit}
                          >
                            <XIcon size={16} /> Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="px-4 py-2 text-sm md:text-base bg-blue-50 text-blue-600 rounded-lg 
                              hover:bg-blue-100 transition-all active:translate-y-0.5 duration-100 ease-in flex items-center gap-2"
                            onClick={() => handleEditReview(item)}
                          >
                            <EditIcon size={16} /> Edit
                          </button>
                          <button
                            className="px-4 py-2 text-sm md:text-base bg-red-50 text-red-600 rounded-lg 
                              hover:bg-red-100 transition-all active:translate-y-0.5 duration-100 ease-in flex items-center gap-2"
                            onClick={() => setIsDeleteBoxOpen(true)}
                          >
                            <Trash2Icon size={18} /> Delete
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {isDeleteBoxOpen && (
                  <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm"
                    onClick={() => setIsDeleteBoxOpen(false)}
                  >
                    <div
                      className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Confirm Deletion
                      </h2>
                      <p className="text-gray-600 mb-6">
                        Are you sure you want to delete this list? This action
                        cannot be undone.
                      </p>

                      <div className="flex justify-end space-x-4">
                        <button
                          onClick={() => setIsDeleteBoxOpen(false)}
                          disabled={isDeleting}
                          className="px-4 py-2 rounded-md border border-gray-300 
                hover:bg-gray-100 transition-colors 
                disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleReviewDelete(item._id)}
                          disabled={isDeleting}
                          className="px-4 py-2 rounded-md bg-red-500 text-white 
                hover:bg-red-600 transition-colors 
                disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <hr className="my-2" />

                {editingReviewId === item._id ? (
                  <>
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          size={20}
                          className={`cursor-pointer ${
                            star <= editedReview.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-200 text-gray-200"
                          }`}
                          onClick={() =>
                            setEditedReview((prev) => ({
                              ...prev,
                              rating: star,
                            }))
                          }
                        />
                      ))}
                    </div>
                    <textarea
                      className="w-full border rounded-lg p-2 text-sm md:text-base"
                      rows={3}
                      value={editedReview.comment}
                      onChange={(e) =>
                        setEditedReview((prev) => ({
                          ...prev,
                          comment: e.target.value,
                        }))
                      }
                    />
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sentiment Analysis Section */}
        <div className="w-full lg:w-1/2">
          <div className="sticky top-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h2 className="text-xl md:text-2xl font-bold mb-4 text-center p-2 bg-primary text-white rounded-t-xl">
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
