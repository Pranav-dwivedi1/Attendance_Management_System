import { useState } from "react";
import {
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "../../store/api.js";

export default function AdminUserManagement({ users, managers }) {
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  
  const [adminForm, setAdminForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
    manager: "",
  });
  const [editingUserId, setEditingUserId] = useState(null);
  const [filterRole, setFilterRole] = useState("all");

  const handleAdminInput = (event) => {
    const { name, value } = event.target;
    setAdminForm((current) => ({ ...current, [name]: value }));
  };

  const startEditUser = (user) => {
    setEditingUserId(user._id);
    setAdminForm({
      name: user.name || "",
      email: user.email || "",
      password: "",
      role: user.role || "employee",
      manager: user.manager?._id || "",
    });
  };

  const resetAdminForm = () => {
    setEditingUserId(null);
    setAdminForm({
      name: "",
      email: "",
      password: "",
      role: "employee",
      manager: "",
    });
  };

  const submitAdminUser = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        name: adminForm.name,
        email: adminForm.email,
        role: adminForm.role,
        manager: adminForm.role === "employee" ? adminForm.manager || undefined : undefined,
      };
      if (adminForm.password) payload.password = adminForm.password;
      if (editingUserId) {
        await updateUser({ id: editingUserId, ...payload }).unwrap();
      } else {
        if (!adminForm.password) {
          alert("Password is required when creating a user.");
          return;
        }
        await createUser(payload).unwrap();
      }
      resetAdminForm();
    } catch (error) {
      alert(error?.data?.message || error?.message || "Failed to save user.");
    }
  };

  const removeUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await deleteUser(id).unwrap();
    } catch (error) {
      alert(error?.data?.message || error?.message || "Unable to delete user.");
    }
  };

  const filteredUsers = users.filter((item) =>
    filterRole === "all" ? true : item.role === filterRole
  );

  const roleSections = [
    { role: "employee", label: "Employees", icon: "👔" },
    { role: "manager", label: "Managers", icon: "👨‍💼" },
    { role: "admin", label: "Admins", icon: "🛡️" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden mb-6 sm:mb-8">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 sm:px-6 py-3 sm:py-4">
        <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
          <span className="text-sm sm:text-base">⚙️</span>
          <span>User Management</span>
        </h2>
      </div>

      <div className="p-4 sm:p-6">
        <form onSubmit={submitAdminUser} className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <input
              name="name"
              value={adminForm.name}
              onChange={handleAdminInput}
              placeholder="Full Name"
              required
              className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <input
              name="email"
              type="email"
              value={adminForm.email}
              onChange={handleAdminInput}
              placeholder="Email Address"
              required
              className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <input
              name="password"
              type="password"
              value={adminForm.password}
              onChange={handleAdminInput}
              placeholder={editingUserId ? "Password (leave blank to keep)" : "Password"}
              minLength={editingUserId ? 0 : 6}
              required={!editingUserId}
              className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <select
              name="role"
              value={adminForm.role}
              onChange={handleAdminInput}
              className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-900 dark:text-white"
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {adminForm.role === "employee" && (
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                Assign Manager
              </label>
              <select
                name="manager"
                value={adminForm.manager}
                onChange={handleAdminInput}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">No Manager Assigned</option>
                {managers.map((manager) => (
                  <option key={manager._id} value={manager._id}>
                    {manager.name} ({manager.role})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-md text-sm sm:text-base"
            >
              💾 {editingUserId ? "Update User" : "Create User"}
            </button>
            {editingUserId && (
              <button
                type="button"
                onClick={resetAdminForm}
                className="bg-gray-500 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg hover:bg-gray-600 transition-all text-sm sm:text-base"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Filter Buttons */}
        <div className="mt-6 sm:mt-8 flex flex-wrap gap-1.5 sm:gap-2 border-b border-gray-200 dark:border-gray-700 pb-3 sm:pb-4 overflow-x-auto">
          {[
            { key: "all", label: "All", icon: "👥" },
            { key: "employee", label: "Employees", icon: "👔" },
            { key: "manager", label: "Managers", icon: "👨‍💼" },
            { key: "admin", label: "Admins", icon: "🛡️" },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setFilterRole(item.key)}
              className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all flex items-center gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap ${
                filterRole === item.key
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <span className="text-xs sm:text-sm">{item.icon}</span>
              <span className="hidden xs:inline">{item.label}</span>
              <span className="xs:hidden">{item.label === "All" ? "All" : item.label.slice(0, 3)}</span>
            </button>
          ))}
        </div>

        {/* User List */}
        <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
          {filterRole === "all"
            ? roleSections.map((section) => {
                const sectionUsers = users.filter((item) => item.role === section.role);
                if (!sectionUsers.length) return null;
                return (
                  <div key={section.role}>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-2 sm:mb-3 flex items-center gap-2">
                      <span className="text-purple-500 text-sm sm:text-base">{section.icon}</span>
                      {section.label}
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      {sectionUsers.map((item) => (
                        <UserCard key={item._id} user={item} onEdit={startEditUser} onDelete={removeUser} />
                      ))}
                    </div>
                  </div>
                );
              })
            : filteredUsers.map((item) => (
                <UserCard key={item._id} user={item} onEdit={startEditUser} onDelete={removeUser} />
              ))}
        </div>
      </div>
    </div>
  );
}

function UserCard({ user, onEdit, onDelete }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:shadow-md transition-all">
      <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm sm:text-base text-gray-800 dark:text-white truncate">
            {user.name}
          </p>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
            {user.email}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
            {user.role}
          </span>
          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate max-w-[150px] sm:max-w-none">
            {user.manager?.name ? `Mgr: ${user.manager.name.split(" ")[0]}` : "No manager"}
          </span>
          <div className="flex gap-1.5 sm:gap-2">
            <button
              onClick={() => onEdit(user)}
              className="px-2 sm:px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs sm:text-sm"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(user._id)}
              className="px-2 sm:px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs sm:text-sm"
            >
              Del
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}