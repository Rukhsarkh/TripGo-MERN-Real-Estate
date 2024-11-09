import { useState } from "react";
import MainScreen from "../components/MainScreen";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("country", formData.country);
    formDataToSend.append("image", formData.image); // Append the file

    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/listings/create",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage("Listing successfully created !");
      setFormData({
        title: "",
        description: "",
        price: "",
        location: "",
        country: "",
      });
      navigate("/");
    } catch (error) {
      console.log(error);
      setMessage("Error Creating Listing, Please try again !");
    }
  };

  return (
    <div className="max-container ml-96">
      <MainScreen title={"List Your Property"}>
        {message && (
          <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
            {message}
          </div>
        )}

        <form className="flex flex-col gap-4 mt-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              placeholder="title"
              required
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="border-2 rounded-lg p-2 w-2/3"
            />
          </div>

          <div className="flex flex-col gap-4">
            <label htmlFor="description">Description</label>
            <textarea
              type="text"
              id="description"
              placeholder="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="border-2 rounded-lg p-2 w-2/3"
            />
          </div>

          <div className="flex flex-col gap-4">
            <label htmlFor="image">Image</label>
            <input
              type="file"
              id="image"
              placeholder="image url"
              required
              name="image"
              onChange={(e) => {
                setFormData({
                  ...formData,
                  image: e.target.files[0],
                });
              }}
              accept="image/*"
              className="border-2 rounded-lg p-2 w-2/3"
            />
          </div>

          <div className="grid grid-cols-3 mr-96 gap-2">
            <div className="col-span-1 grid items-center gap-4">
              <label>Price</label>
              <input
                type="Number"
                id="price"
                placeholder="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="border-2 rounded-lg p-2"
              />
            </div>
            <div className="col-span-2 grid items-center gap-4">
              <label>Country</label>
              <input
                type="text"
                id="country"
                placeholder="enter country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="border-2 rounded-lg p-2 w-full"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              placeholder="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="border-2 rounded-lg p-2 w-2/3"
            />
          </div>

          <div>
            <button
              className="bg-primary mt-4 rounded-lg p-2 font-bold w-20 text-white"
              type="submit"
            >
              Add
            </button>
          </div>
        </form>
      </MainScreen>
    </div>
  );
};

export default NewListingForm;
