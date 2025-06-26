import MainScreen from "../components/MainScreen";

const ShowListingNotFound = () => {
  return (
    <div className="min-h-screen w-full overflow-hidden px-4">
      <MainScreen title="Not Found">
        <div className="text-3xl sm:text-4xl md:text-6xl text-gray-300 font-thin mt-5 flex flex-col items-center">
          <p className="text-center">
            The requested Listing could not be found
          </p>
          <img
            src="../ListNotFoundError.svg"
            className="w-full max-w-md h-auto mt-4"
            alt="Not Found"
          />
        </div>
      </MainScreen>
    </div>
  );
};

export default ShowListingNotFound;
