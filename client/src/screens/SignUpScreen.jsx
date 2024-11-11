import { useState } from "react";
import MainScreen from "../components/MainScreen";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const SignUpScreen = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessages] = useState("");
  const Navigate = useNavigate();
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
        "http://localhost:5000/user/sign-up",
        formData
      );
      setFormData({ username: "", email: "", password: "" });

      if (response.data.success) {
        setMessages("Sign up successful! Please verify your email.");
        Navigate("/verify", { state: { email: formData.email } });
      }
      console.log(response);
    } catch (error) {
      console.error(error);
      setMessages(error.response?.data?.message || "Error signing up");
    }
  };
  return (
    <div className="h-screen w-screen overflow-hidden">
      <div className="max-container mx-auto px-4">
        <MainScreen title={"SignUp"}>
          {message && (
            <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
              {message}
            </div>
          )}

          <div className="flex flex-row justify-between items-center relative">
            <form
              className="flex flex-col gap-6 mt-8 border-4 rounded-3xl p-4 w-1/2 z-50"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col gap-4">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  placeholder="Yusuf Shah"
                  required
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="border-b-2 p-2 text-xl"
                />
              </div>

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
                  Signup
                </button>
                <p>
                  Already have an account ?{"  "}
                  <a
                    className="leading-5 text-md text-primary hover:underline cursor-default"
                    onClick={() => {
                      Navigate("/login");
                    }}
                  >
                    Login
                  </a>
                </p>
              </div>
            </form>
            <div>
              <img
                src="../Signup.svg"
                className="p-2 absolute -top-28 -right-96 h-[700px] w-full"
              />
            </div>
          </div>
        </MainScreen>
      </div>
    </div>
  );
};

export default SignUpScreen;
