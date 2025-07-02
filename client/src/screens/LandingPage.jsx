import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  const handleNavigate = () => {
    navigate("/explore");
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="h-screen w-screen flex overflow-hidden max-lg:bg-[url('../Realtor-amico.svg')] bg-cover bg-center bg-no-repeat">
      <div
        className={`hidden lg:block w-1/2 bg-[url('../Realtor-amico.svg')] bg-cover bg-center bg-no-repeat ml-8 xl:px-4 xl:mt-5 transform transition-all duration-1000 ${
          isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
        }`}
      ></div>

      <div className="max-lg:bg-black/50 w-full lg:w-1/2 flex justify-center items-center text-white lg:text-black h-screen lg:bg-[radial-gradient(circle_at_50%_120%,rgba(239,68,68,0.1),rgba(156,163,175,0.1))]">
        <div
          className={`flex flex-col gap-8 lg:gap-10 max-lg:mt-40 lg:mt-[4em] xl:mt-[5em] relative 2xl:w-80 transform transition-all duration-1000 delay-300 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="space-y-6 uppercase select-none">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold leading-tight 2xl:text-black">
              <span
                className={`block transform transition-all duration-700 delay-500 ${
                  isVisible
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-5 opacity-0"
                }`}
              >
                Roam.
              </span>
              <span
                className={`block transform transition-all duration-700 delay-700 ${
                  isVisible
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-5 opacity-0"
                }`}
              >
                Rest.
              </span>
              <span
                className={`block transform transition-all duration-700 delay-900 ${
                  isVisible
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-5 opacity-0"
                }`}
              >
                Repeat.
              </span>
            </h1>
          </div>
          <div
            className={`pt-8 transform transition-all duration-700 delay-1100 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-5 opacity-0"
            }`}
          >
            <button
              onClick={handleNavigate}
              className="group inline-flex items-center justify-center gap-3 px-14 py-6 text-white bg-primary text-xl font-thin shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300"
            >
              Explore
              <ArrowRight
                className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300"
                style={{
                  animation: "arrowBounce 1.5s ease-in-out infinite",
                }}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
