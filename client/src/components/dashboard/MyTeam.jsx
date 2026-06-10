export default function MyTeam({ team }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden mb-6">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-4">
        <h2 className="text-xl font-semibold text-white">👥 My Team</h2>
      </div>
      <div className="p-6">
        {team.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No employees assigned.</p>
        ) : (
          <div className="space-y-3">
            {team.map((employee) => (
              <div key={employee._id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white">{employee.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{employee.email}</p>
                <span className="text-xs text-gray-500 dark:text-gray-500">{employee.role}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}