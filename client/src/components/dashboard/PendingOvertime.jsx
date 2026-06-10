import { useReviewOvertimeMutation } from "../../store/api.js";

export default function PendingOvertime({ pendingOt }) {
  const [reviewOvertime] = useReviewOvertimeMutation();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden mb-6 sm:mb-8">
      <div className="bg-gradient-to-r from-green-500 to-teal-500 px-4 sm:px-6 py-3 sm:py-4">
        <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
          <span className="text-sm sm:text-base">⏳</span>
          <span>Pending Overtime Requests</span>
        </h2>
      </div>
      <div className="p-4 sm:p-6">
        {pendingOt.length ? (
          <div className="space-y-2 sm:space-y-3">
            {pendingOt.map((record) => (
              <div
                key={record._id}
                className="bg-gray-50 dark:bg-gray-800/50 rounded-lg sm:rounded-xl p-3 sm:p-4 flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm sm:text-base text-gray-800 dark:text-white truncate">
                    {record.employee?.name}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 break-words">
                    {record.overtime?.reason || "No reason provided"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => reviewOvertime({ id: record._id, status: "approved" })}
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-xs sm:text-sm"
                  >
                    <span className="hidden xs:inline">✓ Approve</span>
                    <span className="xs:hidden">✓</span>
                  </button>
                  <button
                    onClick={() => reviewOvertime({ id: record._id, status: "rejected" })}
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs sm:text-sm"
                  >
                    <span className="hidden xs:inline">✗ Reject</span>
                    <span className="xs:hidden">✗</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4 sm:py-6 text-sm sm:text-base">
            <span className="text-xl sm:text-2xl mb-2 block">✅</span>
            No pending overtime requests.
          </p>
        )}
      </div>
    </div>
  );
}