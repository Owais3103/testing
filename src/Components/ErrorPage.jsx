// Components/ErrorPage.js
import React from "react";

const ErrorPage = ({ message, onRetry }) => {
  return (
    <div className="error-page flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18.364 5.636a9 9 0 11-12.728 0 9 9 0 0112.728 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v4m0 4h.01"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mt-4">Something Went Wrong</h1>
        <p className="text-sm mt-2 text-gray-600">
          {message || "An unexpected error has occurred. Please try again later."}
        </p>
        <div className="mt-6">
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Reload Page
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          If the problem persists, contact support.
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;
