import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Protected({ children }) {
  const { token, user } = useSelector((state) => state.auth);
  const [isVerifying, setIsVerifying] = useState(true);

  // Optional: Add a brief verification state for smoother UX
  useEffect(() => {
    if (token !== undefined) {
      // Small delay to prevent flash of redirect
      const timer = setTimeout(() => {
        setIsVerifying(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [token]);

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950 dark:via-gray-950 dark:to-purple-900 flex items-center justify-center">
        <div className="text-center">
          {/* Animated Loader */}
          <div className="relative inline-flex">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
              <svg
                className="w-8 h-8 text-white animate-spin"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-indigo-500"></div>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">
            Verifying access...
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Please wait while we check your credentials
          </p>
        </div>
      </div>
    );
  }

  if (!token) {
    // You can optionally show a message before redirect
    return <Navigate to="/login" replace />;
  }

  // Optional: Add a wrapper div with some styling for the protected content
  return <div className="protected-content">{children}</div>;
}
