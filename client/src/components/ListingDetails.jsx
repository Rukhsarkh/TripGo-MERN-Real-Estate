import {
  MapPin,
  Home,
  DollarSign,
  Calendar,
  ShieldCheck,
  Star,
  Car,
  Sofa,
} from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const ListingDetails = ({ listing }) => {
  if (!listing) return null;

  const createdAtFormatted = listing.createdAt
    ? format(new Date(listing.createdAt), "do MMMM yyyy")
    : "N/A";

  const navigate = useNavigate();

  return (
    <div className="w-full mt-6 p-6 shadow-lg bg-white">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">{listing.title}</h2>

      <div className="flex flex-col lg:flex-row justify-between gap-6 text-gray-700 text-base">
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gray-300" />
            <span>
              {listing.location}, {listing.country}
            </span>
            <span
              className="underline hover:cursor-pointer"
              onClick={() => navigate(`/show-map/${listing._id}`)}
            >
              show map
            </span>
          </div>

          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-gray-300" />
            <span>Price: ${listing.price?.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-2">
            <Home className="w-5 h-5 text-gray-300" />
            <span>Type: {listing.type}</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-300" />
            <span>Listed on: {createdAtFormatted}</span>
          </div>
        </div>

        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-gray-300" />
            <span>Amenities:</span>
            <ul className="flex flex-wrap gap-2 text-sm text-gray-600">
              {listing.amenities?.includes("Parking") && (
                <li className="flex items-center gap-1 px-2 py-1 bg-gray-100">
                  <Car className="w-4 h-4" /> Parking
                </li>
              )}
              {listing.amenities?.includes("Furnished") && (
                <li className="flex items-center gap-1 px-2 py-1 bg-gray-100">
                  <Sofa className="w-4 h-4" /> Furnished
                </li>
              )}
            </ul>
          </div>

          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-gray-300" />
            <span>
              {listing.reviews?.length > 0
                ? `${listing.reviews.length} review(s)`
                : "No reviews yet"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;
