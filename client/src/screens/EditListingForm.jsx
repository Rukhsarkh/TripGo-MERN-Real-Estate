import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import MainScreen from "../components/MainScreen";
import config from "../config";
import { useAuth } from "../context/AuthContext";
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
    <div className="min-h-screen bg-gray-50 pt-14 sm:pt-8 md:pt-0">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <MainScreen title={"Edit Your Property Listing"}>
          <div className="bg-white rounded-xl shadow-2xl shadow-gray-500 p-6 sm:p-8 mt-4">
            <Formik
              initialValues={initialFormData}
              validationSchema={ListingValidationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ setFieldValue, isSubmitting, values }) => (
                <Form className="space-y-6">
                  {/* Title Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Title
                    </label>
                    <Field
                      type="text"
                      id="title"
                      name="title"
                      placeholder="Enter title"
                      className="w-full border-2 rounded-lg p-2 focus:ring-primary focus:border-primary"
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Description Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Description
                    </label>
                    <Field
                      as="textarea"
                      id="description"
                      name="description"
                      placeholder="Enter description"
                      rows="4"
                      className="w-full border-2 rounded-lg p-2 focus:ring-primary focus:border-primary"
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Image Upload */}
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
                      name="image"
                      accept="image/*"
                      onChange={(event) =>
                        handleImageUpload(setFieldValue, event)
                      }
                      className="w-full border-2 rounded-lg p-2 focus:ring-primary focus:border-primary"
                    />
                    <ErrorMessage
                      name="image"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                    {imagePreview && (
                      <div className="mt-2">
                        <img
                          src={imagePreview}
                          alt="Current listing"
                          className="w-full h-auto rounded-lg object-cover max-h-60"
                        />
                      </div>
                    )}
                  </div>

                  {/* Price and Country Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="price"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Price
                      </label>
                      <Field
                        type="number"
                        id="price"
                        name="price"
                        placeholder="Enter price"
                        className="w-full border-2 rounded-lg p-2 focus:ring-primary focus:border-primary"
                      />
                      <ErrorMessage
                        name="price"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Country
                      </label>
                      <Field
                        type="text"
                        id="country"
                        name="country"
                        placeholder="Enter country"
                        className="w-full border-2 rounded-lg p-2 focus:ring-primary focus:border-primary"
                      />
                      <ErrorMessage
                        name="country"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  </div>

                  {/* Location Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Location
                    </label>
                    <Field
                      type="text"
                      id="location"
                      name="location"
                      placeholder="Enter location (City or State)"
                      className="w-full border-2 rounded-lg p-2 focus:ring-primary focus:border-primary"
                    />
                    <ErrorMessage
                      name="location"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Submit Button */}
                  <div>
                    <button
                      className="btn-essential flex items-center justify-center"
                      type="submit"
                      disabled={isSubmitting || isLoading}
                    >
                      {isSubmitting || isLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      ) : (
                        "Update Listing"
                      )}
                    </button>
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
