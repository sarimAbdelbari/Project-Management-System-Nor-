import React from 'react';

const LoadingPage = () => {
  return (
    <div>
        <div className="fixed z-10 top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-90">
          <div className="relative">
            <div className="animate-spin  rounded-full h-40 w-40 border-t-2 border-b-2 border-white"></div>
            <p className="text-white  text-xl font-bold absolute inset-0 flex items-center justify-center">Loading</p>
          </div>
        </div>
    </div>
  );
};

export default LoadingPage;
