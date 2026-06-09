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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                Daily Attendance Report
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1 flex items-center gap-2">
                <i className="fas fa-calendar-day text-indigo-500"></i>
                Role-scoped report for {date}
              </p>
            </div>

            {/* Date Picker */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Select Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-900 dark:border-gray-600 dark:text-white cursor-pointer w-full sm:w-auto"
                />
                <i className="fas fa-calendar-alt absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          {/* Loading State */}
          {isLoading && (
            <div className="p-12 text-center">
              <div className="inline-flex flex-col items-center">
                <div className="relative">
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
                  Loading report data...
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  Please wait while we fetch attendance records
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="m-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <i className="fas fa-exclamation-triangle text-red-500"></i>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 font-medium">
                    Failed to load report data
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    Please try again or select a different date
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Report Data */}
          {!isLoading && !error && (
            <div className="p-6">
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gradient-to-r from-gray-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Punch In / Out
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Selfie
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Location
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Hours
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                      >
                        OT Status
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Remarks
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {data?.rows?.map((row) => (
                      <tr
                        key={row.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-medium">
                                {row.name?.charAt(0).toUpperCase() || "?"}
                              </span>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {row.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                          <div>
                            <span className="text-green-600 dark:text-green-200">
                              <i className="fas fa-sign-in-alt mr-1 text-xs"></i>
                              {formatDateTime(row.punchInTime)}
                            </span>
                          </div>
                          {row.punchOutTime && (
                            <div className="mt-1">
                              <span className="text-red-600">
                                <i className="fas fa-sign-out-alt mr-1 text-xs"></i>
                                {formatDateTime(row.punchOutTime)}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {row.selfie ? (
                            <img
                              className="h-10 w-10 rounded-lg object-cover shadow-sm cursor-pointer hover:scale-110 transition-transform duration-200"
                              src={row.selfie}
                              alt={`${row.name} selfie`}
                              onClick={() => window.open(row.selfie, "_blank")}
                            />
                          ) : (
                            <span className="text-gray-400 dark:text-gray-500 text-sm">
                              No Image
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                          {row.location ? (
                            <div className="flex items-center">
                              <i className="fas fa-map-marker-alt text-red-400 dark:text-red-300 mr-1 text-xs"></i>
                              <span className="text-xs text-gray-700 dark:text-gray-300">
                                {row.location.latitude?.toFixed(4)},{" "}
                                {row.location.longitude?.toFixed(4)}
                              </span>
                            </div>
                          ) : (
                            "N/A"
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                            <i className="fas fa-clock mr-1"></i>
                            {hours(row.workingHours)}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              row.status === "approved"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                : row.status === "rejected"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                                  : row.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              row.overtimeStatus === "approved"
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
                                : row.overtimeStatus === "pending"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                                  : row.overtimeStatus === "rejected"
                                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                                    : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-100"
                            }`}
                          >
                            {row.overtimeStatus || "none"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                          {row.validationRemarks || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {data?.rows?.map((row) => (
                  <div
                    key={row.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow duration-200"
                  >
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {row.name?.charAt(0).toUpperCase() || "?"}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {row.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            ID: {row.id?.slice(-6) || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="px-4 py-3 space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 block mb-1">
                          <i className="fas fa-clock"></i> Punch Times
                        </label>
                        <div className="text-sm space-y-1">
                          <div className="text-green-600 dark:text-green-200">
                            In: {formatDateTime(row.punchInTime)}
                          </div>
                          {row.punchOutTime && (
                            <div className="text-red-600 dark:text-red-200">
                              Out: {formatDateTime(row.punchOutTime)}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 block mb-1">
                            <i className="fas fa-chart-line"></i> Hours
                          </label>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                            {hours(row.workingHours)}
                          </span>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 block mb-1">
                            <i className="fas fa-check-circle"></i> Status
                          </label>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              row.status === "approved"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                : row.status === "rejected"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                                  : row.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
                            }`}
                          >
                            {row.status}
                          </span>
                        </div>
                      </div>

                      {row.selfie && (
                        <div>
                          <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 block mb-1">
                            <i className="fas fa-camera"></i> Selfie
                          </label>
                          <img
                            className="h-16 w-16 rounded-lg object-cover shadow-sm cursor-pointer hover:scale-105 transition-transform"
                            src={row.selfie}
                            alt="Selfie"
                            onClick={() => window.open(row.selfie, "_blank")}
                          />
                        </div>
                      )}

                      {row.location && (
                        <div>
                          <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 block mb-1">
                            <i className="fas fa-map-marker-alt"></i> Location
                          </label>
                          <p className="text-sm text-gray-800 dark:text-gray-100">
                            {row.location.latitude?.toFixed(4)},{" "}
                            {row.location.longitude?.toFixed(4)}
                          </p>
                        </div>
                      )}

                      <div>
                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 block mb-1">
                          <i className="fas fa-hourglass-half"></i> OT Status
                        </label>
                        <p className="text-sm text-gray-800 dark:text-gray-100 capitalize">
                          {row.overtimeStatus || "none"}
                        </p>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 block mb-1">
                          <i className="fas fa-comment"></i> Remarks
                        </label>
                        <p className="text-sm text-gray-800 dark:text-gray-100">
                          {row.validationRemarks || "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {(!data?.rows || data?.rows?.length === 0) && (
                <div className="text-center py-12 px-4">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                    <i className="fas fa-calendar-times text-3xl text-gray-400 dark:text-gray-500"></i>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                    No records found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-300">
                    No attendance records available for {date}
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                    Try selecting a different date
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Summary Stats (Optional Enhancement) */}
        {!isLoading && !error && data?.rows && data.rows.length > 0 && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">
                    Total Records
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {data.rows.length}
                  </p>
                </div>
                <div className="bg-indigo-100 rounded-full p-3">
                  <i className="fas fa-users text-indigo-600"></i>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">
                    Present
                  </p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-200 mt-1">
                    {data.rows.filter((r) => r.status === "approved").length}
                  </p>
                </div>
                <div className="bg-green-100 rounded-full p-3">
                  <i className="fas fa-check-circle text-green-600"></i>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">
                    Pending
                  </p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-200 mt-1">
                    {data.rows.filter((r) => r.status === "pending").length}
                  </p>
                </div>
                <div className="bg-yellow-100 rounded-full p-3">
                  <i className="fas fa-hourglass-half text-yellow-600"></i>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">
                    Overtime Requests
                  </p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-200 mt-1">
                    {
                      data.rows.filter((r) => r.overtimeStatus === "pending")
                        .length
                    }
                  </p>
                </div>
                <div className="bg-purple-100 rounded-full p-3">
                  <i className="fas fa-clock text-purple-600"></i>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
