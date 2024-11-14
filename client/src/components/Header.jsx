import { CompassIcon, Globe, MenuIcon, Search, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
const UserOptions = ({ navigate }) => {
  const { isLoggedIn, setIsLoggedIn, isLoading, setIsloading } = useAuth();

  const handleLogout = async () => {
    try {
      const response = await axios.get("http://localhost:5000/user/logout", {
        withCredentials: true,
      });
      if (response.status === 200) {
        console.log("Logged out successfully");
      }
      setIsLoggedIn(false);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="absolute right-0 top-12 bg-white shadow-lg rounded-lg p-4 w-60">
        <div className="flex justify-center items-center h-20">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute right-0 top-12 bg-white shadow-lg rounded-lg p-4 w-60">
      {isLoggedIn ? (
        <div>
          <div className="flex flex-col gap-2">
            <button className=" hover:bg-gray-100 py-2 px-4 rounded-md text-left transition-colors">
              Messages
            </button>
            <button className=" hover:bg-gray-100 py-2 px-4 rounded-md text-left transition-colors">
              Trips
            </button>
            <button className="hover:bg-gray-100 py-2 px-4 rounded-md text-left transition-colors">
              WishList
            </button>
          </div>
          <hr />
          <div className="flex flex-col gap-2">
            <button className="hover:bg-gray-100 py-2 px-4 rounded-md text-left transition-colors">
              Account
            </button>
            <button
              className=" hover:bg-gray-100 py-2 px-4 rounded-md text-left transition-colors"
              onClick={handleLogout}
            >
              LogOut
            </button>
          </div>
          <hr />
        </div>
      ) : (
        <div>
          <div className="flex flex-col gap-2">
            <button
              className="hover:bg-gray-100 py-2 px-4 rounded-md text-left transition-colors"
              onClick={() => {
                navigate("/sign-up");
              }}
            >
              Signup
            </button>
            <button
              className="hover:bg-gray-100 py-2 px-4 rounded-md text-left transition-colors"
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </button>
          </div>
          <hr />
          <div className="flex flex-col gap-2">
            <button className=" hover:bg-gray-100 py-2 px-4 rounded-md text-left transition-colors">
              Airbnb Your Home
            </button>
            <button className=" hover:bg-gray-100 py-2 px-4 rounded-md text-left transition-colors">
              Host Your Experience
            </button>
            <button className="hover:bg-gray-100 py-2 px-4 rounded-md text-left transition-colors">
              Help Center
            </button>
          </div>
          <hr />
        </div>
      )}
    </div>
  );
};

const Header = () => {
  const navigate = useNavigate();
  const [toggle, setToggle] = useState(false);
  const handleOnClick = () => {
    setToggle((prevToggle) => !prevToggle);
  };

  return (
    <header className="w-full fixed mx-auto top-0 left-0 right-0 min-h-[10vh] bg-gradient-to-b from-white to-gray-100 z-10">
      <div className="max-container flex flex-row justify-between items-center mt-2">
        <div
          className="inline-flex items-center gap-1 cursor-pointer"
          onClick={() => {
            navigate("/");
          }}
        >
          <CompassIcon className="text-primary cursor-pointer" />
          <p className="cursor-pointer font-thin text-xl">TripGO</p>
        </div>

        <div className="flex flex-row gap-2">
          <input
            type="text"
            placeholder="Search Destinations"
            className="rounded-3xl border-2 p-2 text-lg"
          />
          <div className="rounded-3xl py-2 px-4 bg-primary text-white text-lg gap-2 inline-flex">
            <Search />
            <p>Search</p>
          </div>
        </div>

        <div className="flex flex-row gap-5 text-lg text-thin">
          <div
            onClick={() => {
              navigate("/new-form");
            }}
            className="cursor-pointer inline-flex items-center gap-2"
          >
            <p>TripGo Your Home</p>
            <Globe />
          </div>

          <div className="relative">
            <div
              className="relative w-20 h-10 bg-white rounded-3xl inline-flex items-center gap-3 p-1 cursor-pointer shadow-lg shadow-gray-400 active:bg-gray-200 active:translate-y-0.5 active:shadow-inner transition-all duration-300"
              onClick={handleOnClick}
            >
              <MenuIcon />
              <User
                className="border-2 rounded-full bg-primary text-white"
                size={32}
              />
            </div>

            {toggle && <UserOptions navigate={navigate} />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
