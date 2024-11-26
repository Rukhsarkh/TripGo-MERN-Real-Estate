import { useState } from "react";
import MainScreen from "../components/MainScreen";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../config";

const NewListingForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
    price: "",
    location: "",
    country: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("country", formData.country);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      const response = await axios.post(
        `${config.API_URL}/api/listings/create`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      console.log("Created listing:", response.data);
      setMessage(
        `Listing successfully created by ${response.data.author.username}!`
      );
      setFormData({
        title: "",
        description: "",
        image: null,
        price: "",
        location: "",
        country: "",
      });
      navigate("/");
    } catch (error) {
      console.error("Error details:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        setError("Please log in to create a listing");
      } else {
        setError(
          error.response?.data?.message ||
            "Error creating listing. Please try again!"
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-14 sm:pt-8 md:pt-0">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <MainScreen title={"List Your Property"}>
          <div className="bg-white rounded-xl shadow-2xl shadow-gray-500 p-6 sm:p-8 mt-4">
            {message && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
                {message}
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  placeholder="Enter title"
                  required
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border-2 rounded-lg p-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  placeholder="Enter description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full border-2 rounded-lg p-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700"
                >
                  Image
                </label>
                <input
                  type="file"
                  id="image"
                  required
                  name="image"
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      image: e.target.files[0],
                    });
                  }}
                  accept="image/*"
                  className="w-full border-2 rounded-lg p-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Price
                  </label>
                  <input
                    type="number"
                    id="price"
                    placeholder="Enter price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full border-2 rounded-lg p-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    placeholder="Enter country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full border-2 rounded-lg p-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700"
                >
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  placeholder="Enter location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full border-2 rounded-lg p-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <button
                  className="w-full sm:w-auto px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
                  type="submit"
                >
                  Add Listing
                </button>
              </div>
            </form>
          </div>
        </MainScreen>
      </div>
    </div>
  );
};

export default NewListingForm;
