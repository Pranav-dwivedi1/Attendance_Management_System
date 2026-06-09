import { formatDateTime, hours } from "../utils/format.js";
import { useState } from "react";

export default function AttendanceTable({ records = [], actions }) {
  const [expandedRow, setExpandedRow] = useState(null);

  if (!records.length) {
    return (
      <div className="text-center py-12 px-4 bg-white dark:bg-gray-900 rounded-3xl">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
          <i className="fas fa-calendar-alt text-2xl text-gray-400 dark:text-gray-500"></i>
        </div>
        <p className="text-gray-500 dark:text-gray-300 text-lg">
          No attendance records found.
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
          No data available to display
        </p>
      </div>
    );
  }

  // Helper to get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-700";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-100 dark:border-red-700";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-700";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-700";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600";
    }
  };

  const getWorkStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "full day":
        return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-100 dark:border-emerald-700";
      case "half day":
        return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-100 dark:border-orange-700";
      case "absent":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-100 dark:border-red-700";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600";
    }
  };

  return (
    <div className="w-full">
      {/* Desktop Table View - Hidden on mobile */}
      <div className="hidden lg:block overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
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
                Punch In
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
              >
                Punch Out
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
                Shift
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
              {actions && (
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {records.map((record, idx) => (
              <tr
                key={record._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {record.employee?.name?.charAt(0).toUpperCase() || "?"}
                      </span>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {record.employee?.name || "N/A"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  <i className="fas fa-sign-in-alt text-green-500 mr-1 text-xs"></i>
                  {formatDateTime(record.punchInTime)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  {record.punchOutTime ? (
                    <>
                      <i className="fas fa-sign-out-alt text-red-500 mr-1 text-xs"></i>
                      {formatDateTime(record.punchOutTime)}
                    </>
                  ) : (
                    <span className="text-yellow-600">In Progress</span>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {record.punchInSelfie ? (
                    <img
                      className="h-10 w-10 rounded-lg object-cover shadow-sm cursor-pointer hover:scale-110 transition-transform duration-200"
                      src={record.punchInSelfie}
                      alt={`${record.employee?.name || "Employee"} selfie`}
                      onClick={() =>
                        window.open(record.punchInSelfie, "_blank")
                      }
                    />
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500 text-sm">
                      No Image
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                  {record.punchInLocation ? (
                    <div className="flex items-center">
                      <i className="fas fa-map-marker-alt text-red-400 mr-1 text-xs"></i>
                      <span className="text-xs text-gray-700 dark:text-gray-300">
                        {record.punchInLocation.latitude?.toFixed(4)},{" "}
                        {record.punchInLocation.longitude?.toFixed(4)}
                      </span>
                    </div>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                    <i className="fas fa-clock mr-1"></i>
                    {hours(record.totalWorkingHours)}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getWorkStatusColor(record.workStatus)}`}
                  >
                    {record.workStatus || "Unknown"}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.validationStatus)}`}
                  >
                    {record.validationStatus || "Pending"}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      record.overtime?.status === "approved"
                        ? "bg-purple-100 text-purple-800"
                        : record.overtime?.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : record.overtime?.status === "rejected"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-100"
                    }`}
                  >
                    {record.overtime?.status || "none"}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                  {record.validationRemarks || "-"}
                </td>
                {actions && (
                  <td className="px-4 py-3 whitespace-nowrap">
                    {actions(record)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View - Visible on tablet and mobile */}
      <div className="lg:hidden space-y-4">
        {records.map((record) => (
          <div
            key={record._id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {record.employee?.name?.charAt(0).toUpperCase() || "?"}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {record.employee?.name || "N/A"}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      ID: {record._id?.slice(-6) || "N/A"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setExpandedRow(
                      expandedRow === record._id ? null : record._id,
                    )
                  }
                  className="text-indigo-600 hover:text-indigo-700"
                >
                  <i
                    className={`fas fa-chevron-${expandedRow === record._id ? "up" : "down"} transition-transform duration-200`}
                  ></i>
                </button>
              </div>
            </div>

            {/* Card Body - Always visible basic info */}
            <div className="px-4 py-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Status
                </span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.validationStatus)}`}
                >
                  {record.validationStatus || "Pending"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Working Hours
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <i className="fas fa-clock mr-1"></i>
                  {hours(record.totalWorkingHours)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Shift Type
                </span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getWorkStatusColor(record.workStatus)}`}
                >
                  {record.workStatus || "Unknown"}
                </span>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedRow === record._id && (
              <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 space-y-3 bg-gray-50 dark:bg-gray-800">
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 block mb-1">
                    <i className="fas fa-sign-in-alt text-green-500 mr-1"></i>{" "}
                    Punch In
                  </label>
                  <p className="text-sm text-gray-800 dark:text-gray-100">
                    {formatDateTime(record.punchInTime)}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 block mb-1">
                    <i className="fas fa-sign-out-alt text-red-500 mr-1"></i>{" "}
                    Punch Out
                  </label>
                  <p className="text-sm text-gray-800 dark:text-gray-100">
                    {record.punchOutTime ? (
                      formatDateTime(record.punchOutTime)
                    ) : (
                      <span className="text-yellow-600">
                        Not punched out yet
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 block mb-1">
                    <i className="fas fa-camera mr-1"></i> Selfie
                  </label>
                  {record.punchInSelfie ? (
                    <img
                      className="h-20 w-20 rounded-lg object-cover shadow-sm cursor-pointer hover:scale-105 transition-transform"
                      src={record.punchInSelfie}
                      alt="Selfie"
                      onClick={() =>
                        window.open(record.punchInSelfie, "_blank")
                      }
                    />
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No image available
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 block mb-1">
                    <i className="fas fa-map-marker-alt text-red-400 mr-1"></i>{" "}
                    Location
                  </label>
                  <p className="text-sm text-gray-800 dark:text-gray-100">
                    {record.punchInLocation
                      ? `${record.punchInLocation.latitude?.toFixed(4)}, ${record.punchInLocation.longitude?.toFixed(4)}`
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 block mb-1">
                    <i className="fas fa-hourglass-half mr-1"></i> OT Status
                  </label>
                  <p className="text-sm text-gray-800 dark:text-gray-100 capitalize">
                    {record.overtime?.status || "none"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 block mb-1">
                    <i className="fas fa-comment mr-1"></i> Remarks
                  </label>
                  <p className="text-sm text-gray-800 dark:text-gray-100">
                    {record.validationRemarks || "-"}
                  </p>
                </div>
                {actions && (
                  <div className="pt-2">
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 block mb-2">
                      Actions
                    </label>
                    {actions(record)}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
