const ListingCardSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 items-start gap-6 mt-7 md:pl-4 lg:pl-8 gap-y-16">
      {Array.from({ length: 3 }).map((el, i) => {
        return (
          <div key={`${el}-${i}`}>
            <div className="bg-white border border-gray-200 animate-pulse overflow-hidden">
              <div className="w-full h-40 lg:h-64 bg-gray-200"></div>

              <div className="p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="h-5 w-3/5 bg-gray-300"></div>
                  <div className="h-8 w-16 bg-gray-200"></div>
                </div>

                <div className="h-4 w-full bg-gray-200"></div>
                <div className="h-4 w-5/6 bg-gray-200"></div>

                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-gray-300"></div>
                  <div className="h-4 w-1/2 bg-gray-200"></div>
                </div>

                <div className="flex justify-between pt-4 border-t border-gray-100">
                  <div className="h-5 w-24 bg-gray-300"></div>

                  <div className="flex flex-wrap gap-2">
                    <div className="h-6 w-14 bg-gray-200"></div>
                    <div className="h-6 w-16 bg-gray-200"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ListingCardSkeleton;
