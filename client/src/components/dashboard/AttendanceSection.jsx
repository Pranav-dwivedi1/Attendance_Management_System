import AttendanceTable from "../AttendanceTable.jsx";
import ValidationPanel from "../ValidationPanel.jsx";

export default function AttendanceSection({ isLoading, showRecords, userRole }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-4 sm:px-6 py-3 sm:py-4">
        <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
          <span className="text-sm sm:text-base">📅</span>
          <span>{userRole === "employee" ? "My Attendance History" : "Attendance Review"}</span>
        </h2>
      </div>
      <div className="p-3 sm:p-4 md:p-6 overflow-x-auto">
        {isLoading ? (
          <div className="text-center py-6 sm:py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-4 border-indigo-500 border-t-transparent"></div>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-2">
              Loading attendance records...
            </p>
          </div>
        ) : (
          <div className="min-w-[280px]">
            <AttendanceTable
              records={showRecords}
              actions={
                userRole === "manager" || userRole === "admin"
                  ? (record) => <ValidationPanel record={record} />
                  : undefined
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}