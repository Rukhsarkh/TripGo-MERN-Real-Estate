import { useState } from "react";
import MainScreen from "../components/MainScreen";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const LoginScreen = () => {
  const Navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [messages, setMessages] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.value]: e.target.name,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const repsonse = await axios.get("http://localhost:5000/user/login");
      setMessages("Login Successful");
    } catch (error) {
      console.error(error);
      setMessages(error.response?.data?.message || "Login failed! Try again");
    }
  };
  return (
    <div className="h-screen w-screen overflow-hidden">
      <div className="max-container mx-auto px-4">
        <MainScreen title={"Login"}>
          {/* {message && (
          <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
            {message}
          </div>
        )} */}

          <div className="flex flex-row justify-between items-center relative">
            <form className="flex flex-col gap-6 mt-8 border-4 rounded-3xl  p-4 w-1/2 z-10">
              <div className="flex flex-col gap-4">
                <label htmlFor="username">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="alina@gmail.com"
                  required
                  name="email"
                  // value={formData.password}
                  // onChange={handleChange}
                  className="border-2 rounded-lg p-2"
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
                  // value={formData.password}
                  // onChange={handleChange}
                  className="border-2 rounded-lg p-2"
                />
              </div>

              <div className="flex flex-col gap-4 justify-center items-center">
                <button
                  className="bg-primary mt-4 rounded-lg p-2 font-bold w-full text-white"
                  type="submit"
                >
                  Login
                </button>
                <p>
                  Not a member yet ?{"  "}
                  <a
                    className="leading-5 text-md text-primary hover:underline cursor-default"
                    onClick={() => {
                      Navigate("/Sign-up");
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
