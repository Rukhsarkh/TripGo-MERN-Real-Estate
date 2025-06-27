import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import MainScreen from "../components/MainScreen";
import config from "../config";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CheckCircle2Icon, XIcon } from "lucide-react";

// Validation Schema
const ListingValidationSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title cannot exceed 100 characters"),
  description: Yup.string()
    .required("Description is required")
    .min(20, "Description must be at least 20 characters")
    .max(500, "Description cannot exceed 500 characters"),
  price: Yup.number()
    .required("Price is required")
    .positive("Price must be a positive number")
    .max(1000000, "Price is too high"),
  location: Yup.string()
    .required("Location is required")
    .min(2, "Location must be at least 2 characters")
    .max(50, "Location cannot exceed 50 characters"),
  country: Yup.string()
    .required("Country is required")
    .min(2, "Country must be at least 2 characters")
    .max(50, "Country cannot exceed 50 characters"),
  image: Yup.mixed()
    .nullable() //for optional uploads
    .test("fileSize", "File is too large", (value) => {
      return !value || (value && value.size <= 5 * 1024 * 1024); // 5MB limit
    })
    .test("fileType", "Unsupported file format", (value) => {
      return (
        !value ||
        ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
          value.type
        )
      );
    }),
});

const EditListingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { checkAuthStatus } = useAuth();

  const [initialFormData, setInitialFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    country: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch listing details
  useEffect(() => {
    const fetchListingDetails = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${config.API_URL}/api/listings/posts/${id}`,
          { withCredentials: true }
        );

        const listingData = response.data;
        setInitialFormData({
          title: listingData.title || "",
          description: listingData.description || "",
          price: listingData.price || "",
          location: listingData.location || "",
          country: listingData.country || "",
          image: null,
        });
        setImagePreview(listingData.image?.url || null);
      } catch (err) {
        toast.error("Failed to fetch listing details");
      } finally {
        setIsLoading(false);
      }
    };

    const verifyUser = async () => {
      try {
        await checkAuthStatus();
      } catch (err) {
        navigate("/login");
      }
    };

    verifyUser();
    fetchListingDetails();
  }, [id, navigate]);

  // Handle image preview
  const handleImageUpload = (setFieldValue, event) => {
    const file = event.target.files[0];
    if (file) {
      setFieldValue("image", file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit handler
  const handleSubmit = async (values, { setSubmitting }) => {
    setIsLoading(true);
    const formDataToSend = new FormData();

    // Append all form fields
    Object.keys(values).forEach((key) => {
      if (values[key] !== null && values[key] !== undefined) {
        formDataToSend.append(key, values[key]);
      }
    });

    try {
      await axios.put(
        `${config.API_URL}/api/listings/updateList/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      navigate(`/show-list/${id}`);
      toast.success(`Listing Updated successfully !`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progressStyle: { background: "#32de84" },
        style: {
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          padding: "12px 20px",
          margin: "100px auto",
          fontSize: "0.95rem",
          color: "#32de84",
        },
        icon: () => <CheckCircle2Icon color="#32de84" size={20} />,
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error updating listing";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        icon: () => <XIcon color="#FF033E" size={20} />,
        style: {
          borderRadius: "12px",
          color: "#FF033E",
        },
      });
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen bg-gray-50 pt-4 xl:overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full">
        <MainScreen title={"Edit Your Property Listing"}>
          <div className="bg-white shadow-2xl shadow-gray-500 p-3 sm:p-4 mt-1">
            <Formik
              initialValues={initialFormData}
              validationSchema={ListingValidationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ setFieldValue, isSubmitting, values }) => (
                <Form className="h-full">
                  {/* Grid layout, No scrollbar */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                    {/* First Column: Title, Description (6 cols) */}
                    <div className="lg:col-span-6 space-y-3">
                      <div className="space-y-1">
                        <label
                          htmlFor="title"
                          className="block text-xs font-medium text-gray-700"
                        >
                          Title
                        </label>
                        <Field
                          type="text"
                          id="title"
                          name="title"
                          placeholder="Enter title"
                          className="w-full border-2 p-2 text-sm outline-none"
                        />
                        <div className="h-3">
                          <ErrorMessage
                            name="title"
                            component="div"
                            className="text-red-500 text-xs"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="description"
                          className="block text-xs font-medium text-gray-700"
                        >
                          Description
                        </label>
                        <Field
                          as="textarea"
                          id="description"
                          name="description"
                          placeholder="Enter description"
                          rows="6"
                          className="w-full border-2 p-2 text-sm resize-none outline-none"
                        />
                        <div className="h-3">
                          <ErrorMessage
                            name="description"
                            component="div"
                            className="text-red-500 text-xs"
                          />
                        </div>
                      </div>

                      {/* Location Field - moved to first column */}
                      <div className="space-y-1">
                        <label
                          htmlFor="location"
                          className="block text-xs font-medium text-gray-700"
                        >
                          Location
                        </label>
                        <Field
                          type="text"
                          id="location"
                          name="location"
                          placeholder="Enter location (City or State)"
                          className="w-full border-2 p-2 text-sm outline-none"
                        />
                        <div className="h-3">
                          <ErrorMessage
                            name="location"
                            component="div"
                            className="text-red-500 text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Second Column: Price, Country and Submit Button (6 cols) */}
                    <div className="lg:col-span-6 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label
                            htmlFor="price"
                            className="block text-xs font-medium text-gray-700"
                          >
                            Price
                          </label>
                          <Field
                            type="number"
                            id="price"
                            name="price"
                            placeholder="Enter price ( in $ )"
                            className="w-full border-2 p-2 text-sm outline-none"
                          />
                          <div className="h-3">
                            <ErrorMessage
                              name="price"
                              component="div"
                              className="text-red-500 text-xs"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label
                            htmlFor="country"
                            className="block text-xs font-medium text-gray-700"
                          >
                            Country
                          </label>
                          <Field
                            type="text"
                            id="country"
                            name="country"
                            placeholder="Enter country"
                            className="w-full border-2 p-2 text-sm outline-none"
                          />
                          <div className="h-3">
                            <ErrorMessage
                              name="country"
                              component="div"
                              className="text-red-500 text-xs"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Image Upload */}
                      <div className="space-y-1">
                        <label
                          htmlFor="image"
                          className="block text-xs font-medium text-gray-700"
                        >
                          Image
                        </label>
                        <input
                          type="file"
                          id="image"
                          name="image"
                          accept="image/*"
                          onChange={(event) =>
                            handleImageUpload(setFieldValue, event)
                          }
                          className="w-full border-2 p-2 text-sm outline-none"
                        />
                        <div className="h-3">
                          <ErrorMessage
                            name="image"
                            component="div"
                            className="text-red-500 text-xs"
                          />
                        </div>
                        {imagePreview && (
                          <div className="mt-1">
                            <img
                              src={imagePreview}
                              alt="Current listing"
                              className="w-full h-64 object-cover "
                            />
                          </div>
                        )}
                      </div>

                      {/* Submit Button */}
                      <div className="pt-2">
                        <button
                          className="btn-essential flex items-center justify-center w-full py-2 text-sm"
                          type="submit"
                          disabled={isSubmitting || isLoading}
                        >
                          {isSubmitting || isLoading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                          ) : (
                            "Update Listing"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </MainScreen>
      </div>
    </div>
  );
};

export default EditListingForm;
