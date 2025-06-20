import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import MainScreen from "../components/MainScreen";
import config from "../config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CheckCircle2Icon, XIcon } from "lucide-react";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const LoginScreen = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await axios.post(
        `${config.API_URL}/user/login`,
        values,
        { withCredentials: true }
      );

      toast.success(`Welcome back ! ${response.data.user.username}`, {
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

      setIsLoggedIn(true);

      const savedPath = localStorage.getItem("returnTo");
      localStorage.removeItem("returnTo");

      if (savedPath) {
        navigate(savedPath);
      } else {
        navigate("/explore");
      }
    } catch (error) {
      toast.error("Login failed! Try again", {
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
      });

      setErrors({
        submit: error.response?.data?.message || "Login failed! Try again",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex items-center justify-center bg-[radial-gradient(circle_at_50%_120%,rgba(239,68,68,0.1),rgba(156,163,175,0.1))] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-between">
        <div className="w-full lg:w-1/2 max-w-md">
          <MainScreen title="Login">
            <div className="bg-white rounded-xl shadow-2xl px-8 py-4 mt-2 shadow-gray-500">
              <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, errors }) => (
                  <Form className="space-y-6" noValidate>
                    {errors.submit && (
                      <div className="mb-6 p-4 rounded-md bg-red-100 text-red-700">
                        {errors.submit}
                      </div>
                    )}

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email
                      </label>
                      <Field
                        type="email"
                        name="email"
                        placeholder="yusuf@example.com"
                        className="mt-1 block w-full border-b-2 border-gray-300 py-2 text-gray-900 placeholder-gray-400 focus:border-primary focus:outline-none text-lg transition-colors duration-200"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Password
                      </label>
                      <Field
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        className="mt-1 block w-full border-b-2 border-gray-300 py-2 text-gray-900 placeholder-gray-400 focus:border-primary focus:outline-none text-lg transition-colors duration-200"
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div className="flex flex-col gap-4">
                      <button
                        type="submit"
                        className="btn-essential flex items-center justify-center"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <div className="animate-spin h-5 w-5 border-t-2 border-b-2 rounded-full border-white"></div>
                        ) : (
                          "Login"
                        )}
                      </button>

                      <p className="text-center text-sm text-gray-600">
                        Don't have an account?{" "}
                        <button
                          type="button"
                          onClick={() => navigate("/sign-up")}
                          className="text-primary hover:text-primary/80 font-medium focus:outline-none transition-colors duration-200"
                        >
                          Sign up
                        </button>
                      </p>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </MainScreen>
        </div>

        <div className="hidden lg:block w-1/2 pl-12">
          <img
            src="../Login.svg"
            alt="Login Illustration"
            className="w-full lg:scale-150 max-w-lg mx-auto mt-24"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
