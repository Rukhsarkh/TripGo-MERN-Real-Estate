import { ArrowRight } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className='h-screen w-screen overflow-hidden bg-[url("../home6.jpg")] bg-cover max-sm:bg-center bg-no-repeat'>
      {/* <div className=" max-lg:bg-black/50 w-full h-full flex justify-center items-center">
        <div className="absolute text-white max-md:w-full w-80 lg:right-20 max-lg:top-56 xl:top-24 2xl:top-32 uppercase leading-tight flex flex-col gap-6">
          <p className="max-lg:leading-tight font-extrabold max-lg:text-5xl lg:text-7xl xl:text-8xl max-lg:px-8">
            Roam. Rest. Repeat.
          </p>
          <p className="text-sm lg:text-base font-thin text-justify max-lg:px-2 max-lg:ml-6 max-lg:border-l-4 max-lg:border-primary w-80">
            ❝ Creating a Global Community Where Every Traveler Finds Not Just a
            Place to Stay, But a Moment to Truly Live ❞
          </p>
          <button
            className=" cursor-pointer text-xl inline-flex items-center gap-2 p-3 font-extrabold lg:p-3 rounded-full hover:shadow-md hover:shadow-white shadow-inner shadow-white active:translate-y-0.5 transition-all duration-500 ease-linear"
            onClick={() => {
              navigate("/Explore");
            }}
          >
            Explore <ArrowRight />
          </button>
        </div>
      </div> */}
      <div className="max-2xl:bg-black/40 w-full flex justify-center items-center text-white h-screen">
        <div className="flex flex-col 2xl:items-start items-center justify-center gap-5 lg:gap-10 max-lg:mt-40 lg:mt-[4em] xl:mt-[5em] relative 2xl:left-[33em] 2xl:w-80">
          <p className="font-extrabold text-6xl lg:text-7xl xl:text-8xl max-lg:px-20 lg:uppercase">
            Roam. Rest. Repeat
          </p>
          <p className="max-lg:px-20 text-justify max-lg:text-xs max-md:tracking-wide max-md:leading-4">
            ❝ Creating a Global Community Where Every Traveler Finds Not Just a
            Place to Stay, But a Moment to Truly Live ❞
          </p>
          <button
            className="cursor-pointer text-xl inline-flex items-center gap-2 p-2 font-extrabold lg:p-3 rounded-full hover:shadow-md hover:shadow-white shadow-inner shadow-white active:translate-y-0.5 transition-all duration-500 ease-linear"
            onClick={() => {
              navigate("/Explore");
            }}
          >
            Explore <ArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
