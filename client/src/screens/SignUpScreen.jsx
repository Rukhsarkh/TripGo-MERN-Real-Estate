import { useState } from "react";
import MainScreen from "../components/MainScreen";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../config";

const SignUpScreen = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessages] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${config.API_URL}/user/sign-up`,
        formData
      );
      setFormData({ username: "", email: "", password: "" });

      if (response.data.success) {
        setMessages("Sign up successful! Please verify your email.");
        navigate("/verify", { state: { email: formData.email } });
      }
      console.log(response);
    } catch (error) {
      console.error(error);
      setMessages(error.response?.data?.message || "Error signing up");
    }
  };

  return (
    <div className="lg:h-screen lg:w-screen lg:overflow-hidden flex items-center justify-center bg-[radial-gradient(circle_at_50%_120%,rgba(239,68,68,0.1),rgba(156,163,175,0.1))] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-between">
        <div className="w-full lg:w-1/2 max-w-md">
          <MainScreen title="Sign Up">
            <div className="bg-white rounded-xl shadow-2xl px-8 py-4 mt-2 shadow-gray-500">
              {message && (
                <div className="mb-6 p-4 rounded-md bg-green-100 text-green-700">
                  {message}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    placeholder="Enter your name"
                    required
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="mt-1 block w-full border-b-2 border-gray-300 py-2 text-gray-900 placeholder-gray-400 focus:border-primary focus:outline-none text-lg transition-colors duration-200"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="yusuf@example.com"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full border-b-2 border-gray-300 py-2 text-gray-900 placeholder-gray-400 focus:border-primary focus:outline-none text-lg transition-colors duration-200"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Create a password"
                    required
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="mt-1 block w-full border-b-2 border-gray-300 py-2 text-gray-900 placeholder-gray-400 focus:border-primary focus:outline-none text-lg transition-colors duration-200"
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
                  >
                    Sign Up
                  </button>

                  <p className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className="text-primary hover:text-primary/80 font-medium focus:outline-none transition-colors duration-200"
                    >
                      Log in
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </MainScreen>
        </div>

        <div className="hidden lg:block w-1/2 pl-12">
          <img
            src="../Signup.svg"
            alt="Signup Illustration"
            className="w-full lg:scale-125 max-w-lg mx-auto mt-20"
          />
        </div>
      </div>
    </div>
  );
};

export default SignUpScreen;
