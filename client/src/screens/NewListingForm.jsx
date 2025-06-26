import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import MainScreen from "../components/MainScreen";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CheckCircle2Icon, XIcon } from "lucide-react";
import { useFormikContext } from "formik";

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title cannot exceed 100 characters"),
  description: Yup.string()
    .required("Description is required")
    .min(20, "Description must be at least 20 characters")
    .max(500, "Description cannot exceed 500 characters"),
  image: Yup.mixed()
    .required("Image is required")
    .test("fileSize", "Image must be less than 5MB", (value) => {
      return value && value.size <= 5 * 1024 * 1024;
    })
    .test("fileType", "Unsupported file type", (value) => {
      return (
        value &&
        ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
          value.type
        )
      );
    }),
  price: Yup.number()
    .required("Price is required")
    .positive("Price must be a positive number")
    .max(1000000, "Price cannot exceed 1,000,000"),
  location: Yup.string()
    .required("Location is required")
    .min(3, "Location must be at least 3 characters"),
  country: Yup.string()
    .required("Country is required")
    .min(2, "Country must be at least 2 characters"),
  type: Yup.string().required("Type is required, Select 1"),
});

const NewListingForm = () => {
  const navigate = useNavigate();

  const initialValues = {
    title: "",
    description: "",
    image: null,
    price: "",
    location: "",
    country: "",
    type: "",
    amenities: [],
  };

  const ImagePreview = () => {
    const { values } = useFormikContext();
    const [preview, setPreview] = useState();

    useEffect(() => {
      if (values.image) {
        const imageURL = URL.createObjectURL(values.image);
        setPreview(imageURL);

        return () => URL.revokeObjectURL(imageURL); //to avoid memory leaks
      }
    }, [values.image]);

    return preview ? (
      <img
        src={URL.createObjectURL(values.image)}
        alt="image-preview"
        className="preview-image"
      />
    ) : null;
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formDataToSend = new FormData();
    Object.keys(values).forEach((key) => {
      if (key === "amenities" && Array.isArray(values[key])) {
        values[key].forEach((el) => formDataToSend.append("amenities", el));
      } else {
        formDataToSend.append(key, values[key]);
      }
    });

    try {
      await axios.post(
        `${config.API_URL}/api/listings/create`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      toast.success(`Listing successfully Created !`, {
        position: "top-center",
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
          margin: "30px",
          fontSize: "0.95rem",
          color: "#32de84",
        },
        icon: () => <CheckCircle2Icon color="#32de84" size={20} />,
      });

      resetForm();
      navigate("/explore");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Listing Creation Failed. Please try again !",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progressStyle: { background: "#FF033E" },
          style: {
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            padding: "12px 20px",
            margin: "30px",
            fontSize: "0.95rem",
            color: "#FF033E",
          },
          icon: () => <XIcon color="#FF033E" size={20} />,
        }
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-14 sm:pt-8 md:pt-0">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <MainScreen title={"List Your Property"}>
          <div className="bg-white rounded-xl shadow-2xl shadow-gray-500 p-6 sm:p-8 mt-4">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, setFieldValue }) => (
                <Form className="space-y-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Title
                    </label>
                    <Field
                      type="text"
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

                  <div className="space-y-2">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Description
                    </label>
                    <Field
                      as="textarea"
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

                  <div className="space-y-2">
                    <label
                      htmlFor="image"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Image
                    </label>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={(e) => {
                        setFieldValue("image", e.target.files[0]);
                      }}
                      className="w-full border-2 rounded-lg p-2 focus:ring-primary focus:border-primary"
                    />
                    <ImagePreview />
                    <ErrorMessage
                      name="image"
                      component="div"
                      className="text-red-500 text-sm mt-1"
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
                      <Field
                        type="number"
                        name="price"
                        placeholder="Enter price ( in $ )"
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

                  <div className="space-y-2">
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Location
                    </label>
                    <Field
                      type="text"
                      name="location"
                      placeholder="Enter location ( City or State )"
                      className="w-full border-2 rounded-lg p-2 focus:ring-primary focus:border-primary"
                    />
                    <ErrorMessage
                      name="location"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Type
                      </label>
                      <div className="flex flex-col sm:flex-row gap-4">
                        {["Sale", "Rent"].map((option) => (
                          <label
                            key={option}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <Field
                              type="radio"
                              name="type"
                              value={option}
                              className="appearance-none w-4 h-4 border-2 border-gray-300 rounded-full checked:bg-primary checked:border-primary"
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                      <ErrorMessage
                        name="type"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Amenities
                      </label>
                      <div className="flex flex-col sm:flex-row gap-4">
                        {["Parking", "Furnished"].map((option) => (
                          <label
                            key={option}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <Field
                              type="checkbox"
                              name="amenities"
                              value={option}
                              className="appearance-none w-5 h-5 border-2 border-gray-300 rounded-sm checked:bg-primary checked:border-primary"
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                      <ErrorMessage
                        name="amenities"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      className="btn-essential flex items-center justify-center"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      ) : (
                        "Add Listing"
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

export default NewListingForm;
