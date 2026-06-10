import { useState } from "react";
import { useValidateAttendanceMutation } from "../store/api.js";

export default function ValidationPanel({ record }) {
  const [remarks, setRemarks] = useState("");
  const [validateAttendance, { isLoading }] = useValidateAttendanceMutation();

  const handleReview = async (status) => {
    if (status === "rejected" && !remarks.trim()) {
      alert("Please add remarks before rejecting attendance.");
      return;
    }

    try {
      await validateAttendance({
        id: record._id,
        status,
        remarks,
      }).unwrap();
      setRemarks("");
    } catch (error) {
      alert(
        error?.data?.message ||
          error?.message ||
          "Unable to update attendance review",
      );
    }
  };

  return (
    <div className="space-y-2 sm:space-y-3 w-full">
      {/* Remarks Textarea */}
      <div className="relative w-full">
        <textarea
          value={remarks}
          onChange={(event) => setRemarks(event.target.value)}
          placeholder="Remarks (required for rejection)"
          rows="2"
          disabled={isLoading}
          className={`
            w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm 
            border rounded-lg focus:outline-none focus:ring-2 
            focus:ring-indigo-500 focus:border-transparent
            transition-all duration-200 resize-none
            ${isLoading ? "bg-gray-100 dark:bg-gray-700 cursor-not-allowed" : ""}
            ${
              remarks && remarks.trim() && !isLoading
                ? "border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20"
                : !isLoading &&
                  "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            }
          `}
        />

        {/* Status indicators */}
        {!isLoading && (
          <>
            {remarks && remarks.trim() && (
              <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 text-[10px] sm:text-xs text-green-600 dark:text-green-400 flex items-center gap-0.5 sm:gap-1">
                <svg
                  className="inline-block w-2.5 h-2.5 sm:w-3 sm:h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="hidden xs:inline">Remarks added</span>
                <span className="xs:hidden">✓</span>
              </div>
            )}

            {!remarks.trim() && (
              <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 flex items-center gap-0.5 sm:gap-1">
                <svg
                  className="inline-block w-2.5 h-2.5 sm:w-3 sm:h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="hidden sm:inline">Optional for approval</span>
                <span className="sm:hidden">Optional</span>
              </div>
            )}
          </>
        )}

        {isLoading && (
          <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 flex items-center gap-0.5 sm:gap-1">
            <svg
              className="inline-block w-2.5 h-2.5 sm:w-3 sm:h-3 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="hidden xs:inline">Processing...</span>
            <span className="xs:hidden">...</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col xs:flex-row gap-2">
        <button
          type="button"
          onClick={() => handleReview("approved")}
          disabled={isLoading}
          className={`
            flex-1 px-3 sm:px-4 py-2 rounded-lg font-medium text-white
            transition-all duration-200 transform hover:scale-105
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
            ${
              isLoading
                ? "bg-gray-400 dark:bg-gray-600"
                : "bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-md hover:shadow-lg"
            }
          `}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-1.5 sm:gap-2">
              <svg
                className="animate-spin h-3 w-3 sm:h-4 sm:w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-xs sm:text-sm">Processing...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-1.5 sm:gap-2">
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs sm:text-sm">Approve</span>
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => handleReview("rejected")}
          disabled={isLoading}
          className={`
            flex-1 px-3 sm:px-4 py-2 rounded-lg font-medium text-white
            transition-all duration-200 transform hover:scale-105
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
            ${
              isLoading
                ? "bg-gray-400 dark:bg-gray-600"
                : "bg-linear-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-md hover:shadow-lg"
            }
          `}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-1.5 sm:gap-2">
              <svg
                className="animate-spin h-3 w-3 sm:h-4 sm:w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-xs sm:text-sm">Processing...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-1.5 sm:gap-2">
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs sm:text-sm">Reject</span>
            </span>
          )}
        </button>
      </div>

      {/* Help Text */}
      <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-300 flex items-start gap-1 bg-white dark:bg-gray-900/50 p-2 sm:p-2.5 rounded-lg border border-gray-200 dark:border-gray-700">
        <svg
          className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-500 mt-0.5 shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
            clipRule="evenodd"
          />
        </svg>
        <span className="leading-relaxed">
          <strong className="font-semibold">Tip:</strong>
          <span className="hidden xs:inline">
            {" "}
            Remarks are required when rejecting. You can leave them empty when
            approving.
          </span>
          <span className="xs:hidden"> Remarks required for rejection</span>
        </span>
      </div>

      {/* Dynamic Warning for Empty Remarks */}
      {!remarks.trim() && !isLoading && (
        <div className="text-[10px] sm:text-xs text-amber-600 dark:text-amber-300 flex items-start gap-1 bg-amber-50 dark:bg-amber-900/20 p-2 sm:p-2.5 rounded-lg border border-amber-200 dark:border-amber-600">
          <svg
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-500 mt-0.5 shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span className="leading-relaxed">
            <span className="hidden xs:inline">
              Please add remarks before rejecting this attendance record.
            </span>
            <span className="xs:hidden">Add remarks to reject</span>
          </span>
        </div>
      )}
    </div>
  );
}
