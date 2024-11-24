import { CompassIcon, Globe, MenuIcon, Search, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWindowsize } from "../hooks/useWindowSize";

const UserOptions = ({ isLoggedIn, isLoading, logout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      navigate("/login");
    }
  };

  return (
    <div className="absolute right-0 top-12 bg-white shadow-lg rounded-lg p-4 w-60">
      {isLoggedIn ? (
        <div>
          <div className="flex flex-col gap-2">
            <button className="hover:bg-gray-100 py-2 px-4 rounded-md text-left transition-colors">
              Messages
            </button>
            <button className="hover:bg-gray-100 py-2 px-4 rounded-md text-left transition-colors">
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
              className="hover:bg-gray-100 py-2 px-4 rounded-md text-left transition-colors"
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
              onClick={() => navigate("/sign-up")}
            >
              Signup
            </button>
            <button
              className="hover:bg-gray-100 py-2 px-4 rounded-md text-left transition-colors"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>
          <hr />
          <div className="flex flex-col gap-2">
            <button className="hover:bg-gray-100 py-2 px-4 rounded-md text-left transition-colors">
              Airbnb Your Home
            </button>
            <button className="hover:bg-gray-100 py-2 px-4 rounded-md text-left transition-colors">
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
  const { isLoggedIn, isLoading, logout } = useAuth();
  const [expandable, setExpandable] = useState(false);
  const handleOnClick = () => {
    setToggle((prevToggle) => !prevToggle);
  };

  const { width } = useWindowsize();
  const isMid = width < 1024;
  const isLarge = width >= 1024;

  return (
    <header className="w-full fixed mx-auto top-0 left-0 right-0 sm:min-h-[5vh] z-10 max-container">
      <div className="flex flex-row max-lg:flex-col max-lg:gap-14 justify-between items-center p-3">
        <div className="max-lg:flex max-lg:flex-row max-lg:justify-between max-lg:w-full">
          <div className="inline-flex items-center gap-1 cursor-pointer">
            <CompassIcon
              className="text-gray-400 cursor-pointer max-lg:size-6"
              size={32}
            />
            <button
              className="cursor-pointer font-thin max-sm:text-xl text-2xl text-gray-400 hover:text-4xl transition-all duration-300 ease-in"
              onClick={() => navigate("/")}
            >
              TripGO
            </button>
          </div>
          {isMid && (
            <div className="relative">
              <div
                className="relative w-20 h-10 bg-inherit rounded-3xl inline-flex items-center gap-3 p-2 cursor-pointer shadow-gray-400 shadow-inner active:bg-gray-200 active:translate-y-0.5 active:shadow-inner transition-all duration-300 hover:shadow-lg hover:shadow-gray-400"
                onClick={handleOnClick}
              >
                <MenuIcon size={32} className="text-gray-300" />
                <User className=" text-white" size={32} />
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

        <div className="flex flex-row gap-2">
          <input
            type="text"
            placeholder="Search Destinations"
            className={`max-lg:border-b-2 p-2 text-lg bg-inherit w-44 border-gray-300 transition-all duration-200 ease-in focus:outline-none ${
              expandable ? "w-72" : "w-44"
            }`}
            onFocus={() => setExpandable(true)}
            onBlur={() => setExpandable(false)}
          />
          <div className="bg-inherit text-white gap-2 inline-flex items-center">
            <Search className="cursor-pointer size-5 lg:size-6" />
            <p className="text-xl">Search</p>
          </div>
        </div>

        <div>
          {isLarge && (
            <div className="flex flex-row max-md:gap-10 gap-4 text-lg text-thin">
              <div
                className="relative w-20 h-10 bg-inherit rounded-3xl inline-flex items-center gap-3 p-2 cursor-pointer shadow-gray-400 shadow-inner active:bg-gray-200 active:translate-y-0.5 active:shadow-inner transition-all duration-300 hover:shadow-lg hover:shadow-gray-400"
                onClick={handleOnClick}
              >
                <MenuIcon size={32} className="text-gray-300" />
                <User className=" text-white" size={32} />
              </div>

              {toggle && (
                <UserOptions
                  navigate={navigate}
                  isLoading={isLoading}
                  logout={logout}
                  isLoggedIn={isLoggedIn}
                />
              )}

              <div
                className="cursor-pointer inline-flex items-center gap-2 font-thin text-xl lg:text-2xl max-lg:rounded-3xl max-lg:p-3 max-lg:bg-white/50"
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
                <p className="lg:text-gray-400 hover:text-3xl transition-all duration-300 ease-in ">
                  TripGo YOUR HOME
                </p>
                <Globe />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
