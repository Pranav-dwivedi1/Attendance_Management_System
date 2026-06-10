export default function DashboardHeader({ user }) {
  const roleTitle = user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1);

  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent truncate">
            {roleTitle} Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1 flex flex-wrap items-center gap-1 sm:gap-2">
            <span className="text-gray-400 dark:text-gray-400 text-xs sm:text-sm">👤</span>
            <span className="truncate">{user?.name}</span>
            <span className="hidden sm:inline">·</span>
            <span className="text-xs sm:text-sm truncate">{user?.email}</span>
          </p>
        </div>
        <div className="shrink-0">
          <div className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white dark:bg-gray-800 rounded-full shadow-sm text-xs sm:text-sm text-gray-600 dark:text-gray-300 whitespace-normal break-words text-center sm:text-left">
            <span className="text-indigo-500 mr-1 sm:mr-2 text-xs sm:text-sm">⏰</span>
            <span className="hidden xs:inline">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="xs:hidden">
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}