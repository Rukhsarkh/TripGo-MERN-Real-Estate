import { useState } from "react";
import MainScreen from "../components/MainScreen";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
const LoginScreen = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth(); // Add this

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
        "http://localhost:5000/user/login",
        formData,
        {
          withCredentials: true,
        }
      );
      setIsLoggedIn(true); // Add this
      setFormData({ email: "", password: "" });

      // Get saved path immediately after successful login
      const savedPath = localStorage.getItem("returnTo");
      console.log("Saved path:", savedPath); // Debug log

      // Clear it right after getting it
      localStorage.removeItem("returnTo");

      // Alert before navigation
      console.log(response.data.message);

      // Navigate directly here instead of separate function
      if (savedPath) {
        navigate(savedPath); // Use lowercase 'navigate'
      } else {
        navigate("/"); // Use lowercase 'navigate'
      }
    } catch (error) {
      console.error(error);
      setMessages(error.response?.data?.message || "Login failed! Try again");
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden">
      <div className="max-container mx-auto px-4">
        <MainScreen title={"Login"}>
          {messages && (
            <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
              {messages}
            </div>
          )}

          <div className="flex flex-row justify-between items-center relative">
            <form
              className="flex flex-col gap-6 mt-8 border-4 rounded-3xl  p-4 w-1/2 z-10"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col gap-4">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="yusuf@gmail.com"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border-b-2 p-2 text-xl"
                />
              </div>

              <div className="flex flex-col gap-4">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter password"
                  required
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="border-b-2 p-2 text-xl"
                />
              </div>

              <div className="flex flex-col gap-4 justify-center items-center">
                <button className="btn-essential" type="submit">
                  Login
                </button>
                <p>
                  Not a member yet ?{"  "}
                  <a
                    className="leading-5 text-md text-primary hover:underline cursor-default"
                    onClick={() => {
                      navigate("/Sign-up");
                    }}
                  >
                    SignUp
                  </a>
                </p>
              </div>
            </form>

            <div>
              <img
                src="../Login.svg"
                className="p-2 absolute -top-36 -right-80 h-[770px] w-full"
              />
            </div>
          </div>
        </MainScreen>
      </div>
    </div>
  );
};

export default LoginScreen;
