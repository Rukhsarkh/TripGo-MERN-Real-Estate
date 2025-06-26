import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ListingCard = ({ listing, key }) => {
  let navigate = useNavigate();
  return (
    <div
      key={key}
      className="bg-white border border-gray-200 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 cursor-pointer overflow-hidden"
      onClick={() => navigate(`/show-List/${listing._id}`)}
    >
      <div className="aspect-w-16 aspect-h-12 relative">
        <img
          src={listing.image?.url || listing.image}
          alt={listing.title}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-4 space-y-3 border-yellow-400">
        <div className="flex justify-between items-start">
          <h2 className="font-semibold text-lg text-gray-800">
            {listing.title}
          </h2>
          <div
            className={`px-4 py-2 text-sm md:text-base rounded-lg hover:cursor-default ${
              listing.type == "Sale"
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-600"
            }`}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {listing.type}
          </div>
        </div>

        <p className="text-gray-600 text-sm">{listing.description}</p>

        <div className="flex items-center text-gray-500 text-sm gap-1">
          <MapPin size={18} className="text-green-500" />
          <span className="line-clamp-1">
            {listing.location}, {listing.country}
          </span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center text-primary font-semibold">
            <span>&#36;{listing.price.toLocaleString("en-IN")}</span>
            <span className="text-gray-500 font-extralight ml-1">
              {listing.type == "Rent" ? "/night" : ""}
            </span>
          </div>
          <div className="flex lg:flex-wrap items-center gap-1">
            {listing.amenities.map((el) => {
              return (
                <div
                  className="px-2 md:px-4 py-2 text-sm md:font-semibold rounded-lg hover:cursor-default bg-blue-50 text-blue-400"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  key={el}
                >
                  {el}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
