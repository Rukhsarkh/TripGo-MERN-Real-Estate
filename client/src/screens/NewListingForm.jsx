import { useEffect, useState } from "react";
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
      <div className="mt-2">
        <img
          src={URL.createObjectURL(values.image)}
          alt="image-preview"
          className="w-full h-64 object-cover"
        />
      </div>
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
    <div className="min-h-screen bg-gray-50 pt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <MainScreen title={"List Your Property"}>
          <div className="bg-white shadow-2xl shadow-gray-500 p-4 sm:p-6 mt-2">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, setFieldValue }) => (
                <Form className="h-full">
                  {/* Grid layou , no scrollbar */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
                    {/* First Column: Title, Description (4 cols) */}
                    <div className="lg:col-span-4 space-y-4">
                      <div className="space-y-1">
                        <label
                          htmlFor="title"
                          className="block text-xs font-medium text-gray-700"
                        >
                          Title
                        </label>
                        <Field
                          type="text"
                          name="title"
                          placeholder="Enter title"
                          className="w-full border-2 p-2 text-sm outline-none"
                        />
                        <div className="h-4">
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
                          name="description"
                          placeholder="Enter description"
                          rows="8"
                          className="w-full border-2 p-2 text-sm resize-none outline-none"
                        />
                        <div className="h-4">
                          <ErrorMessage
                            name="description"
                            component="div"
                            className="text-red-500 text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Second Column: Form fields (4 cols) */}
                    <div className="lg:col-span-4 space-y-3">
                      <div className="space-y-1">
                        <label
                          htmlFor="price"
                          className="block text-xs font-medium text-gray-700"
                        >
                          Price
                        </label>
                        <Field
                          type="number"
                          name="price"
                          placeholder="Enter price ( in $ )"
                          className="w-full border-2 p-2 text-sm outline-none"
                        />
                        <div className="h-4">
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
                          name="country"
                          placeholder="Enter country"
                          className="w-full border-2 p-2 text-sm outline-none"
                        />
                        <div className="h-4">
                          <ErrorMessage
                            name="country"
                            component="div"
                            className="text-red-500 text-xs"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="location"
                          className="block text-xs font-medium text-gray-700"
                        >
                          Location
                        </label>
                        <Field
                          type="text"
                          name="location"
                          placeholder="Enter location ( City or State )"
                          className="w-full border-2 p-2 text-sm outline-none"
                        />
                        <div className="h-4">
                          <ErrorMessage
                            name="location"
                            component="div"
                            className="text-red-500 text-xs"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-gray-700">
                          Type
                        </label>
                        <div className="flex gap-4">
                          {["Sale", "Rent"].map((option) => (
                            <label
                              key={option}
                              className="flex items-center space-x-2 cursor-pointer"
                            >
                              <Field
                                type="radio"
                                name="type"
                                value={option}
                                className="appearance-none w-4 h-4 border-2 border-gray-300 rounded-full"
                              />
                              <span className="text-sm">{option}</span>
                            </label>
                          ))}
                        </div>
                        <div className="h-4">
                          <ErrorMessage
                            name="type"
                            component="div"
                            className="text-red-500 text-xs"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-gray-700">
                          Amenities
                        </label>
                        <div className="flex gap-4">
                          {["Parking", "Furnished"].map((option) => (
                            <label
                              key={option}
                              className="flex items-center space-x-2 cursor-pointer"
                            >
                              <Field
                                type="checkbox"
                                name="amenities"
                                value={option}
                                className="appearance-none w-4 h-4 border-2 border-gray-300 checked:bg-primary checked:border-primary"
                              />
                              <span className="text-sm">{option}</span>
                            </label>
                          ))}
                        </div>
                        <div className="h-4">
                          <ErrorMessage
                            name="amenities"
                            component="div"
                            className="text-red-500 text-xs"
                          />
                        </div>
                      </div>

                      <div className="pt-4">
                        <button
                          className="btn-essential flex items-center justify-center w-full py-2 text-sm"
                          type="submit"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                          ) : (
                            "Add Listing"
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Third Column: Image Upload and Preview (4 cols) */}
                    <div className="lg:col-span-4 space-y-1">
                      <label
                        htmlFor="image"
                        className="block text-xs font-medium text-gray-700"
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
                        className="w-full border-2 p-2 text-sm outline-none"
                      />
                      <div className="h-4">
                        <ErrorMessage
                          name="image"
                          component="div"
                          className="text-red-500 text-xs"
                        />
                      </div>
                      <ImagePreview />
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

export default NewListingForm;
