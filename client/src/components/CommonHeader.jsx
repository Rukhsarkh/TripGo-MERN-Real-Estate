import { CompassIcon, Globe, MenuIcon, Search, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UserOptions from "./UserOptions";
import { useWindowsize } from "../hooks/useWindowSize";

const CommonHeader = () => {
  const navigate = useNavigate();
  const [toggle, setToggle] = useState(false);
  const { isLoggedIn, isLoading, logout } = useAuth();
  const [expandable, setExpandable] = useState(false);

  const handleOnClick = () => {
    setToggle((prevToggle) => !prevToggle);
  };

  const { width } = useWindowsize();
  const isMid = width < 1024;
  const isLarge = width >= 1024;
  return (
    <header className="w-full fixed mx-auto top-0 left-0 right-0 min-h-[10vh] bg-gradient-to-b from-white to-gray-100 z-10">
      <div className="max-container max-lg:flex-col flex flex-row justify-between items-center mt-2 max-lg:gap-2">
        <div className="max-lg:flex max-lg:flex-row max-lg:justify-between max-lg:w-full max-md:p-4 md:p-8">
          <div
            className="inline-flex items-center gap-1 cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          >
            <CompassIcon className="text-primary cursor-pointer" />
            <p className="cursor-pointer font-thin text-xl">TripGO</p>
          </div>
          {isMid && (
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

              {toggle && (
                <UserOptions
                  navigate={navigate}
                  isLoading={isLoading}
                  logout={logout}
                  isLoggedIn={isLoggedIn}
                />
              )}
            </div>
          )}
        </div>

        <div className="flex max-sm:flex-col sm:flex-row p-4 md:gap-4 justify-center items-center">
          {isMid && (
            <div
              className="cursor-pointer inline-flex items-center gap-2 text-primary"
              onClick={() => {
                if (!isLoggedIn) {
                  localStorage.setItem("returnTo", "/new-form");
                  navigate("/login");
                } else {
                  navigate("/new-form");
                }
              }}
            >
              <p className="text-xl">TRIPGO YOUR HOME</p>
              <Globe className="max-lg:size-5" />
            </div>
          )}
          <div className="flex flex-row gap-2 p-4">
            <input
              type="text"
              placeholder="Search Destinations"
              className={` border-b-2 px-2 text-lg bg-inherit w-44 border-black transition-all duration-200 ease-in focus:outline-none ${
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

        {isLarge && (
          <div className="flex flex-row max-lg:flex-col gap-5 text-lg text-thin p-2">
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

              {toggle && (
                <UserOptions
                  navigate={navigate}
                  isLoading={isLoading}
                  logout={logout}
                  isLoggedIn={isLoggedIn}
                />
              )}
            </div>
            <div
              className="cursor-pointer inline-flex items-center gap-2"
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
