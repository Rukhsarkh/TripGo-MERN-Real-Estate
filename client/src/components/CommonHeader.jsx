import { CompassIcon, Globe, MenuIcon, Search, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import UserOptions from "./UserOptions";
import { useWindowsize } from "../hooks/useWindowSize";
import config from "../config";
import axios from "axios";

const CommonHeader = () => {
  const navigate = useNavigate();
  const [toggle, setToggle] = useState(false);
  const { isLoggedIn, isLoading, logout } = useAuth();
  const [expandable, setExpandable] = useState(false);
  const [avatar, setAvatar] = useState("");

  const userOptionsRef = useRef(null);
  const userButtonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userOptionsRef.current &&
        !userOptionsRef.current.contains(event.target) &&
        userButtonRef.current &&
        !userButtonRef.current.contains(event.target)
      ) {
        setToggle(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const handleOnClick = () => {
    setToggle((prevToggle) => !prevToggle);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/user/get-profile`, {
          withCredentials: true,
        });

        setAvatar(response.data.avatar);
      } catch (error) {
        console.error(error);
      }
    };
    isLoggedIn ? fetchUserProfile() : "";
  }, [isLoggedIn]);

  const { width } = useWindowsize();
  const isMid = width < 1024;
  const isLarge = width >= 1024;
  return (
    <header className="w-full fixed mx-auto top-0 left-0 right-0 min-h-[10vh] bg-gradient-to-b from-white to-gray-100 z-10">
      <div className="max-container max-lg:flex-col flex flex-row justify-between items-center mt-2 max-lg:gap-2">
        {/* TripGo logo and UserMenu for mobile code*/}
        <div className="max-lg:flex max-lg:flex-row max-lg:justify-between max-lg:w-full max-md:p-4 md:p-8">
          <div
            className="inline-flex items-center gap-1 cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          >
            <CompassIcon className="text-primary cursor-pointer" />
            <p className="cursor-pointer text-xl xl:text-2xl font-thin">
              TripGO
            </p>
          </div>
          {isMid && (
            <div className="relative">
              <div
                className="cursor-pointer active:translate-y-0.5 transition-all duration-300"
                onClick={handleOnClick}
                ref={userButtonRef}
              >
                {isLoggedIn ? (
                  <img
                    src={
                      avatar ||
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyalF0xYA7hTJuxVhMvkkk2WMFiHjP-raN7w&s"
                    }
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover p-0.5"
                  />
                ) : (
                  <MenuIcon className="w-8 h-8 text-primary" />
                )}
              </div>

              {toggle && (
                <div ref={userOptionsRef}>
                  <UserOptions
                    navigate={navigate}
                    isLoading={isLoading}
                    logout={logout}
                    isLoggedIn={isLoggedIn}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* explore, tripgo your home and search for mobile code*/}
        <div className="flex max-sm:flex-col sm:flex-row p-4 gap-4 justify-center items-center">
          {isMid && (
            <div className="flex flex-row justify-center items-center gap-5">
              <button
                className="text-xl p-2 px-2 shadow-lg shadow-gray-400 active:bg-gray-200 active:translate-y-0.5 active:shadow-inner transition-all duration-300 font-thin bg-white"
                onClick={() => navigate("/explore")}
              >
                Explore
              </button>
              <div
                className="cursor-pointer inline-flex items-center gap-2 text-primary p-2 px-3 shadow-lg shadow-gray-400 active:bg-gray-200 active:translate-y-0.5 active:shadow-inner transition-all duration-300 font-thin bg-white"
                onClick={() => {
                  if (!isLoggedIn) {
                    localStorage.setItem("returnTo", "/new-form");
                    navigate("/login");
                  } else {
                    navigate("/new-form");
                  }
                }}
              >
                <p className="text-xl">Tripgo Your Home</p>
                <Globe className="max-lg:size-5" />
              </div>
            </div>
          )}
          <div className="flex flex-row gap-2 p-4">
            <input
              type="text"
              placeholder="Search Destinations"
              className={` border-b-2 border-gray-300 px-2 font-thin text-lg bg-inherit w-44 transition-all duration-200 ease-in focus:outline-none ${
                expandable ? "w-52" : "w-44"
              }`}
              onFocus={() => setExpandable(true)}
              onBlur={() => setExpandable(false)}
            />
            <div className="bg-inherit gap-2 inline-flex items-center">
              <Search className="cursor-pointer size-5 lg:size-6" />
              <p className="text-xl">Search</p>
            </div>
          </div>
        </div>

        {/* Desktop */}
        {isLarge && (
          <div className="flex flex-row max-lg:hidden gap-5 p-2 items-center">
            <div className="relative">
              <div
                className="realtive p-1 cursor-pointer active:translate-y-0.5 transition-all duration-300"
                onClick={handleOnClick}
                ref={userButtonRef}
              >
                {isLoggedIn ? (
                  <img
                    src={
                      avatar ||
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyalF0xYA7hTJuxVhMvkkk2WMFiHjP-raN7w&s"
                    }
                    alt="Profile"
                    className="w-14 h-14 rounded-full object-cover p-0.5"
                  />
                ) : (
                  <MenuIcon className="w-10 h-10" />
                )}
              </div>

              {toggle && (
                <div ref={userOptionsRef}>
                  <UserOptions
                    navigate={navigate}
                    isLoading={isLoading}
                    logout={logout}
                    isLoggedIn={isLoggedIn}
                  />
                </div>
              )}
            </div>

            <button
              className="text-lg p-2 font-thin shadow-lg shadow-gray-400 active:bg-gray-200 active:translate-y-0.5 active:shadow-inner transition-all duration-300 bg-white hover:bg-gray-100"
              onClick={() => navigate("/explore")}
            >
              Explore
            </button>

            <div
              className="cursor-pointer inline-flex items-center gap-2 font-thin py-2.5 px-2 shadow-lg shadow-gray-400 active:bg-gray-200 active:translate-y-0.5 active:shadow-inner transition-all duration-300 bg-white hover:bg-gray-100"
              onClick={() => {
                // Check authentication before navigating
                if (!isLoggedIn) {
                  localStorage.setItem("returnTo", "/new-form");
                  navigate("/login");
                } else {
                  navigate("/new-form");
                }
              }}
            >
              <p>TRIPGO YOUR HOME</p>
              <Globe />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default CommonHeader;
