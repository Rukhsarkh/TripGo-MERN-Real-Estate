import { CompassIcon, Globe, MenuIcon, Search, User } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useWindowsize } from "../hooks/useWindowSize";
import UserOptions from "./UserOptions";

const Header = () => {
  const navigate = useNavigate();
  const [toggle, setToggle] = useState(false);
  const { isLoggedIn, isLoading, logout } = useAuth();
  const [expandable, setExpandable] = useState(false);

  // Create refs for user options and button
  const userOptionsRef = useRef(null);
  const userButtonRef = useRef(null);

  const handleOnClick = () => {
    setToggle((prevToggle) => !prevToggle);
  };

  useEffect(() => {
    // Handler to check if click is outside of user options
    const handleClickOutside = (event) => {
      // Check if the click is outside both the user options and the user button
      if (
        userOptionsRef.current &&
        !userOptionsRef.current.contains(event.target) &&
        userButtonRef.current &&
        !userButtonRef.current.contains(event.target)
      ) {
        setToggle(false);
      }
    };

    // Add event listener when component mounts
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener when component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleanup on unmount

  const { width } = useWindowsize();
  const isMid = width < 1024;
  const isLarge = width >= 1024;

  return (
    <header className="w-full fixed mx-auto top-0 left-0 right-0 sm:min-h-[5vh] z-10 max-container">
      <div className="flex flex-row max-lg:flex-col max-lg:gap-14 justify-between items-center p-3">
        <div className="max-lg:flex max-lg:flex-row max-lg:justify-between max-lg:w-full">
          <div className="inline-flex items-center gap-1 cursor-pointer">
            <CompassIcon
              className="text-white cursor-pointer max-lg:size-6"
              size={32}
            />
            <button
              className="cursor-pointer font-thin max-sm:text-xl text-2xl text-white 2xl:hover:text-4xl transition-all duration-300 ease-in"
              onClick={() => navigate("/")}
            >
              TripGO
            </button>
          </div>

          {/* Mobile View User Menu */}
          {isMid && (
            <div className="relative">
              <div
                ref={userButtonRef}
                className="relative w-20 h-10 bg-inherit rounded-3xl inline-flex items-center gap-3 p-2 cursor-pointer shadow-gray-400 shadow-inner active:bg-gray-200 active:translate-y-0.5 active:shadow-inner transition-all duration-300 hover:shadow-lg hover:shadow-gray-400"
                onClick={handleOnClick}
              >
                <MenuIcon size={32} className="text-gray-300" />
                <User className="text-white" size={32} />
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

        <div className="flex flex-row gap-2">
          <input
            type="text"
            placeholder="Search Destinations"
            className={`max-lg:border-b-2 p-2 text-lg bg-inherit w-44 border-gray-300 transition-all duration-200 ease-in focus:outline-none ${
              expandable ? "w-52" : "w-44"
            }`}
            onFocus={() => setExpandable(true)}
            onBlur={() => setExpandable(false)}
          />
          <div className="bg-inherit text-white gap-2 inline-flex items-center">
            <Search className="cursor-pointer size-5 lg:size-6" />
            <p className="text-xl">Search</p>
          </div>
        </div>

        {/* Desktop View User Menu */}
        {isLarge && (
          <div>
            <div className="flex flex-row max-md:gap-10 gap-4 text-lg text-thin p-2">
              <div className="relative">
                <div
                  ref={userButtonRef}
                  className="relative w-20 h-10 bg-inherit rounded-3xl inline-flex items-center gap-3 p-2 cursor-pointer shadow-gray-400 shadow-inner active:bg-gray-200 active:translate-y-0.5 active:shadow-inner transition-all duration-300 hover:shadow-lg hover:shadow-gray-400"
                  onClick={handleOnClick}
                >
                  <MenuIcon size={32} className="text-gray-300" />
                  <User className="text-white" size={32} />
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
                <p className="lg:text-gray-400 hover:text-3xl transition-all duration-300 ease-in">
                  TripGo YOUR HOME
                </p>
                <Globe className="text-gray-400" size={32} />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
