import axios from "axios";
import { StarIcon } from "lucide-react";
import { useEffect, useState } from "react";

const AllReviews = ({ listingId }) => {
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [listingId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/${listingId}/allreviews`
      );
      setAllReviews(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-row">
      <div className="flex flex-wrap gap-4 w-1/2">
        {allReviews.map((item) => (
          <div
            className="border-2 rounded-lg w-80 p-4 flex flex-col gap-2"
            key={item._id}
          >
            <div className="inline-flex items-center gap-2 h-10 w-10 rounded-full">
              <img src="https://cdn-icons-png.flaticon.com/512/9187/9187604.png" />
              <p className="whitespace-nowrap">Amrita jha</p>
            </div>
            <hr />
            <div className="inline-flex items-center gap-2 font-bold">
              {item.rating} <StarIcon />
            </div>
            <p className="break-words">❝ {item.comment} ❞</p>
          </div>
        ))}
      </div>
      <hr className="h-96 bg-black w-[0.1px]" />
      <div className="w-1/2 flex justify-center">
        <h1 className="font-bold text-3xl">Sentimental Summary</h1>
      </div>
    </div>
  );
};

export default AllReviews;
