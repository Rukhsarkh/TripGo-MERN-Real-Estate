import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import MainScreen from "../components/MainScreen";
import config from "../config";

const LoginScreen = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [messages, setMessages] = useState("");

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
        `${config.API_URL}/user/login`,
        formData,
        {
          withCredentials: true,
        }
      );
      setIsLoggedIn(true);
      setFormData({ email: "", password: "" });

      const savedPath = localStorage.getItem("returnTo");
      localStorage.removeItem("returnTo");
      console.log(response.data.message);

      if (savedPath) {
        navigate(savedPath);
      } else {
        navigate("/Explore");
      }
    } catch (error) {
      console.error(error);
      setMessages(error.response?.data?.message || "Login failed! Try again");
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex items-center justify-center bg-[radial-gradient(circle_at_50%_120%,rgba(239,68,68,0.1),rgba(156,163,175,0.1))] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-between">
        <div className="w-full lg:w-1/2 max-w-md">
          <MainScreen title="Login">
            <div className="bg-white rounded-xl shadow-2xl px-8 py-4 mt-2 shadow-gray-500">
              {messages && (
                <div className="mb-6 p-4 rounded-md bg-green-100 text-green-700">
                  {messages}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
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
                    placeholder="Enter your password"
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
                    Login
                  </button>

                  <p className="text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/Sign-up")}
                      className="text-primary hover:text-primary/80 font-medium focus:outline-none transition-colors duration-200"
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              </form>
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
