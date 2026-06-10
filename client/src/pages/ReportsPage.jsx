import { useState } from "react";
import Protected from "../components/Protected.jsx";
import { useDailyReportQuery } from "../store/api.js";
import { formatDateTime, hours } from "../utils/format.js";

export default function ReportsPage() {
  return (
    <Protected>
      <Reports />
    </Protected>
  );
}

function Reports() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const { data, isLoading, error } = useDailyReportQuery(date);

  // Debug logging
  console.log("Reports data:", data);
  console.log("Is loading:", isLoading);
  console.log("Error:", error);

  // Helper function to safely get rows
  const getRows = () => {
    if (!data) return [];
    if (data.rows && Array.isArray(data.rows)) return data.rows;
    if (Array.isArray(data)) return data;
    return [];
  };

  const rows = getRows();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-10">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent break-words">
                Daily Attendance Report
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 flex flex-wrap items-center gap-1 sm:gap-2">
                <span className="text-indigo-500 dark:text-indigo-400 text-xs sm:text-sm">📅</span>
                <span className="text-xs sm:text-sm dark:text-gray-400">
                  Role-scoped report for
                </span>
                <span className="font-medium text-indigo-600 dark:text-indigo-300 text-xs sm:text-sm break-all">
                  {date}
                </span>
              </p>
            </div>

            {/* Date Picker */}
            <div className="w-full sm:w-auto">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                Select Date
              </label>
              <div className="relative w-full sm:w-64">
                <input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-800 dark:text-white cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          {/* Loading State */}
          {isLoading && (
            <div className="p-8 sm:p-12 md:p-16 text-center">
              <div className="inline-flex flex-col items-center">
                <div className="relative">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8 text-white animate-spin"
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
                <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 dark:text-gray-300 font-medium">
                  Loading report data...
                </p>
                <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-1">
                  Please wait while we fetch attendance records
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="m-3 sm:m-4 md:m-6 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 rounded-lg p-3 sm:p-4">
              <div className="flex items-start sm:items-center">
                <div className="shrink-0">
                  <span className="text-red-500 text-sm sm:text-base">⚠️</span>
                </div>
                <div className="ml-2 sm:ml-3 flex-1">
                  <p className="text-xs sm:text-sm text-red-700 dark:text-red-300 font-medium">
                    Failed to load report data
                  </p>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-0.5 sm:mt-1">
                    {error?.message || "Please try again or select a different date"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Report Data */}
          {!isLoading && !error && (
            <div className="p-3 sm:p-4 md:p-6">
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gradient-to-r from-gray-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800">
                    <tr>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                        Punch In / Out
                      </th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                        Selfie
                      </th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                        Hours
                      </th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                        OT Status
                      </th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                        Remarks
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {rows.map((row) => (
                      <tr
                        key={row.id || row._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                      >
                        <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="shrink-0 h-7 w-7 sm:h-8 sm:w-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-medium">
                                {row.name?.charAt(0).toUpperCase() || "?"}
                              </span>
                            </div>
                            <div className="ml-2 sm:ml-3">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {row.name || "Unknown"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                          <div>
                            <span className="text-green-600 dark:text-green-400">
                              📥 {formatDateTime(row.punchInTime)}
                            </span>
                          </div>
                          {row.punchOutTime && (
                            <div className="mt-1">
                              <span className="text-red-600 dark:text-red-400">
                                📤 {formatDateTime(row.punchOutTime)}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                          {row.selfie ? (
                            <img
                              className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg object-cover shadow-sm cursor-pointer hover:scale-110 transition-transform duration-200"
                              src={row.selfie}
                              alt={`${row.name} selfie`}
                              onClick={() => window.open(row.selfie, "_blank")}
                            />
                          ) : (
                            <span className="text-gray-400 dark:text-gray-500 text-xs">
                              No Image
                            </span>
                          )}
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                          {row.location ? (
                            <div className="flex items-center">
                              <span className="text-red-400 dark:text-red-300 mr-1 text-xs">📍</span>
                              <span className="text-xs text-gray-700 dark:text-gray-300">
                                {row.location.latitude?.toFixed(4)},{" "}
                                {row.location.longitude?.toFixed(4)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
                            ⏱️ {hours(row.workingHours)}
                          </span>
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              row.status === "approved"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200"
                                : row.status === "rejected"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200"
                                  : row.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {row.status || "unknown"}
                          </span>
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              row.overtimeStatus === "approved"
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200"
                                : row.overtimeStatus === "pending"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200"
                                  : row.overtimeStatus === "rejected"
                                    ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200"
                                    : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {row.overtimeStatus || "none"}
                          </span>
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                          {row.validationRemarks || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View - Fixed text colors */}
              <div className="lg:hidden space-y-2 px-1">
                {rows.map((row) => (
                  <div
                    key={row.id || row._id}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {row.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                          {row.name || "Unknown"}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{row.status || "unknown"}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Punch In</p>
                        <p className="dark:text-gray-200">{formatDateTime(row.punchInTime)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Punch Out</p>
                        <p className="dark:text-gray-200">
                          {row.punchOutTime
                            ? formatDateTime(row.punchOutTime)
                            : "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Hours</p>
                        <p className="dark:text-gray-200">{hours(row.workingHours)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">OT Status</p>
                        <p className="dark:text-gray-200">{row.overtimeStatus || "None"}</p>
                      </div>
                    </div>

                    {row.selfie && (
                      <div className="mt-3">
                        <img
                          src={row.selfie}
                          alt="Selfie"
                          className="h-20 w-20 rounded-lg object-cover cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => window.open(row.selfie, "_blank")}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {rows.length === 0 && (
                <div className="text-center py-8 sm:py-12 md:py-16 px-3 sm:px-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 dark:bg-gray-700 rounded-full mb-3 sm:mb-4">
                    <span className="text-2xl sm:text-3xl text-gray-400 dark:text-gray-400">📅</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                    No records found
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No attendance records available for {date}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-2">
                    Try selecting a different date
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Summary Stats - Fixed dark mode text */}
        {!isLoading && !error && rows.length > 0 && (
          <div className="mt-4 sm:mt-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-md p-3 sm:p-4 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">
                    Total Records
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mt-0.5 sm:mt-1">
                    {rows.length}
                  </p>
                </div>
                <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-full p-2 sm:p-3">
                  <span className="text-indigo-600 dark:text-indigo-300 text-sm sm:text-base">👥</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-md p-3 sm:p-4 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">
                    Present
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400 mt-0.5 sm:mt-1">
                    {rows.filter((r) => r.status === "approved").length}
                  </p>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-2 sm:p-3">
                  <span className="text-green-600 dark:text-green-300 text-sm sm:text-base">✓</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-md p-3 sm:p-4 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">
                    Pending
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-0.5 sm:mt-1">
                    {rows.filter((r) => r.status === "pending").length}
                  </p>
                </div>
                <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-full p-2 sm:p-3">
                  <span className="text-yellow-600 dark:text-yellow-300 text-sm sm:text-base">⏳</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-md p-3 sm:p-4 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">
                    Overtime Requests
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400 mt-0.5 sm:mt-1">
                    {
                      rows.filter((r) => r.overtimeStatus === "pending")
                        .length
                    }
                  </p>
                </div>
                <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full p-2 sm:p-3">
                  <span className="text-purple-600 dark:text-purple-300 text-sm sm:text-base">⏰</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}