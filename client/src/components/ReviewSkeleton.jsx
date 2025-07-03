import React from "react";

const ReviewSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1, 2, 3, 4].map((_, idx) => (
        <div
          key={idx}
          className="animate-pulse space-y-3 p-4 border border-gray-200 rounded-lg shadow-sm bg-white"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-300" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 bg-gray-300 rounded" />
              <div className="h-3 w-1/2 bg-gray-200 rounded" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="h-3 w-full bg-gray-200 rounded" />
            <div className="h-3 w-5/6 bg-gray-200 rounded" />
            <div className="h-3 w-4/6 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewSkeleton;
