import axios from "axios";
import { useParams } from "react-router-dom";
import MainScreen from "../components/MainScreen";
import { useEffect, useState } from "react";
import { ArrowRightCircle, StarIcon } from "lucide-react";
import LeaveReview from "../components/LeaveReview";
import AllReviews from "../components/AllReviews";

const ShowListing = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/listings/posts/${id}`
        );
        setListing(response.data);
        console.log(response.data);
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

  if (loading) {
    return <MainScreen title="Loading ...."></MainScreen>;
  }

  return (
    <MainScreen title={listing.title}>
      <div className="mt-4 flex items-center gap-40">
        <img
          src={listing.image?.url || image.url}
          className="w-[800px] h-[500px] rounded-3xl"
        />
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
