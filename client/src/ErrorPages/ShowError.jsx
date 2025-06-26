import React from "react";

const ShowError = () => {
  return (
    <div className="flex flex-col max-xl:items-center max-xl:justify-center h-[60vh] max-xl:text-center lg:mt-10 lg:ml-5">
      <div className="text-2xl md:text-4xl lg:text-5xl text-gray-300 font-thin mb-8">
        No Listings Available Yet ! Be the First To upload
      </div>
      <img
        src="../helloThere.svg"
        className="w-52 h-52 md:w-64 md:h-64 lg:w-80 lg:h-80 opacity-50"
        alt="No listings"
      />
    </div>
  );
};

export default ShowError;
