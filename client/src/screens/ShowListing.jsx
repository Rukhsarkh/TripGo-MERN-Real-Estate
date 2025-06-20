import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import MainScreen from "../components/MainScreen";
import { useEffect, useState } from "react";
import { ArrowRightCircle, EditIcon, Trash2Icon } from "lucide-react";
import LeaveReview from "../components/LeaveReview";
import AllReviews from "../components/AllReviews";
import { useAuth } from "../hooks/useAuth";
import ShowMap from "../components/ShowMap";
import config from "../config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CheckCircle2Icon } from "lucide-react";

const ShowListing = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const { checkAuthStatus } = useAuth();
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const [isDeleteBoxOpen, setIsDeleteBoxOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
          `${config.API_URL}/api/listings/posts/${id}`,
          { withCredentials: true }
        );
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

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await axios.delete(
        `${config.API_URL}/api/listings/deleteList/${id}`,
        { withCredentials: true }
      );

      setIsDeleteBoxOpen(false);
      setIsDeleting(false);

      toast.success(`Listing-Deleted Successfully !`, {
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
      navigate("/explore");
    } catch (error) {
      console.error(error);
      setIsDeleting(false);
    } finally {
      setIsDeleteBoxOpen(false);
      setIsDeleting(false);
    }
  };

  const handleEditClick = async () => {
    navigate(`/edit-list/${listing._id}`, { state: { listing } });
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
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto max-sm:mt-64 sm:mt-48 md:mt-56 lg:mt-28">
      <div className="flex flex-col items-start justify-center">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold">
          {listing.title}
        </h1>

        <p className="text-xl sm:text-2xl my-5 mx-1">
          Listed by: {listing.author?.username || "unknown"}
        </p>
      </div>
      <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-12">
        <div className="flex-1 space-y-4">
          <div className="relative w-full rounded-3xl overflow-hidden aspect-[4/3] bg-gray-100">
            <img
              src={listing.image?.url}
              alt={listing.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          {listing.author?._id === userId && (
            <div className="flex flex-row gap-4 justify-center">
              <button
                onClick={() => setIsDeleteBoxOpen(true)}
                className="rounded-xl px-6 py-3 
          bg-red-500 text-white text-base sm:text-lg 
          hover:bg-red-600 transition-all duration-300 ease-out
          flex items-center justify-center gap-2
          shadow-md hover:shadow-lg activate:translate-y-0.5"
              >
                <span className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-10 transition-opacity"></span>
                <Trash2Icon className="mr-2" size={20} />
                Delete
              </button>

              {isDeleteBoxOpen && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center 
          bg-black bg-opacity-50 backdrop-blur-sm"
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
                        onClick={handleConfirmDelete}
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

              <button
                onClick={handleEditClick}
                className="rounded-xl px-6 py-3 
          bg-primary text-white text-base sm:text-lg 
          hover:bg-primary/90 transition-all duration-500 ease-out
          flex items-center justify-center gap-2
          shadow-md hover:shadow-lg active:translate-y-0.5"
              >
                <span className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-10 transition-opacity"></span>
                <EditIcon className="mr-2" size={20} />
                Edit
              </button>
            </div>
          )}
        </div>

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
      <div className="bg-white rounded-lg p-4 sm:p-6">
        <h1 className="text-2xl md:text-3xl font-bold max-lg:text-center text-gray-800 mb-4">
          Where you'll be
        </h1>
        <ShowMap
          locationCoordinates={listing.geometry.coordinates}
          locationName={listing.title}
          locationImage={listing.image.url}
        />
      </div>
      <hr className="h-0.5 bg-black" />
      {/* Reviews Section */}
      <div className="space-y-8">
        <div className="bg-white rounded-lg p-4 sm:p-6">
          <LeaveReview listingId={listing._id} />
        </div>

        <hr className="h-0.5 bg-black" />

        <div className="bg-white rounded-lg p-4 sm:p-6">
          <h1 className="text-2xl md:text-3xl font-bold max-lg:text-center text-gray-800 mb-4">
            All Reviews ({listing.reviews.length})
          </h1>
          <AllReviews listingId={listing._id} />
        </div>
      </div>
    </div>
  );
};

export default ShowListing;
