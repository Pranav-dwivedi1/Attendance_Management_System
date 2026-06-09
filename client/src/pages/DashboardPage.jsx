import { useState } from "react";
import { useSelector } from "react-redux";
import Protected from "../components/Protected.jsx";
import AttendanceTable from "../components/AttendanceTable.jsx";
import CameraCapture from "../components/CameraCapture.jsx";
import ValidationPanel from "../components/ValidationPanel.jsx";
import {
  useAttendanceQuery,
  usePunchInMutation,
  usePunchOutMutation,
  useRequestOvertimeMutation,
  useReviewOvertimeMutation,
  useUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useManagersQuery,
} from "../store/api.js";

export default function DashboardPage() {
  return (
    <Protected>
      <Dashboard />
    </Protected>
  );
}

function Dashboard() {
  const { user } = useSelector((state) => state.auth);

  const { data: attendance = [], isLoading } = useAttendanceQuery();

  const { data: users = [] } = useUsersQuery(undefined, {
    skip: user?.role !== "admin",
  });

  const { data: managers = [] } = useManagersQuery(undefined, {
    skip: user?.role !== "admin",
  });

  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [punchIn] = usePunchInMutation();
  const [punchOut] = usePunchOutMutation();
  const [requestOvertime] = useRequestOvertimeMutation();
  const [reviewOvertime] = useReviewOvertimeMutation();

  const [selfie, setSelfie] = useState("");
  const [reason, setReason] = useState("");

  const [adminForm, setAdminForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
    manager: "",
  });
  const [editingUserId, setEditingUserId] = useState(null);
  const [filterRole, setFilterRole] = useState("all");

  const activeRecord = attendance.find((record) => !record.punchOutTime);

  const latestRecord = activeRecord || attendance[0];

  const reviewRecords = attendance.filter(
    (record) => record.validationStatus === "pending",
  );

  const showRecords = user?.role === "manager" ? reviewRecords : attendance;

  const pendingOt = attendance.filter(
    (record) => record.overtime?.status === "pending",
  );

  const handleAdminInput = (event) => {
    const { name, value } = event.target;
    setAdminForm((current) => ({
      ...current,
      [name]: value,
    }));
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
        manager:
          adminForm.role === "employee"
            ? adminForm.manager || undefined
            : undefined,
      };

      if (adminForm.password) {
        payload.password = adminForm.password;
      }

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
    if (!window.confirm("Delete this user?")) {
      return;
    }

    try {
      await deleteUser(id).unwrap();
    } catch (error) {
      alert(error?.data?.message || error?.message || "Unable to delete user.");
    }
  };

  const locate = () =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) =>
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }),
        () =>
          reject(
            new Error("Location permission is required to mark attendance"),
          ),
      );
    });

  const punch = async () => {
    try {
      if (!selfie) {
        alert("Capture a selfie first.");
        return;
      }

      const location = await locate();

      if (activeRecord) {
        await punchOut({
          id: activeRecord._id,
          selfie,
          location,
        }).unwrap();
      } else {
        await punchIn({
          selfie,
          location,
        }).unwrap();
      }

      setSelfie("");
    } catch (error) {
      console.error(error);
      alert(
        error?.data?.message || error?.message || "Failed to update attendance",
      );
    }
  };

  const requestOt = async () => {
    try {
      if (!latestRecord) {
        alert("Create an attendance record before requesting overtime.");
        return;
      }

      if (!reason.trim()) {
        alert("Please enter a reason.");
        return;
      }

      await requestOvertime({
        id: latestRecord._id,
        reason,
      }).unwrap();

      setReason("");
    } catch (error) {
      alert(
        error?.data?.message ||
          error?.message ||
          "Failed to submit overtime request",
      );
    }
  };

  const roleTitle = user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-10">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent truncate">
                {roleTitle} Dashboard
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1 flex flex-wrap items-center gap-1 sm:gap-2">
                <i className="fas fa-user-circle text-gray-400 dark:text-gray-400 text-xs sm:text-sm"></i>
                <span className="truncate">{user?.name}</span>
                <span className="hidden sm:inline">·</span>
                <span className="text-xs sm:text-sm truncate">{user?.email}</span>
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white dark:bg-gray-800 rounded-full shadow-sm text-xs sm:text-sm text-gray-600 dark:text-gray-300 whitespace-normal break-words text-center sm:text-left">
                <i className="fas fa-clock mr-1 sm:mr-2 text-indigo-500 text-xs sm:text-sm"></i>
                <span className="hidden xs:inline">{new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}</span>
                <span className="xs:hidden">{new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Employee Actions Grid */}
        {user?.role === "employee" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Punch Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-4 sm:px-6 py-3 sm:py-4">
                <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
                  <i className="fas fa-fingerprint text-sm sm:text-base"></i>
                  <span>{activeRecord ? "Punch Out" : "Punch In"}</span>
                </h2>
              </div>
              <div className="p-4 sm:p-6">
                <CameraCapture onCapture={setSelfie} />
                <button
                  onClick={punch}
                  className="w-full mt-4 sm:mt-6 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02] focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-md text-sm sm:text-base"
                >
                  <i className="fas fa-camera-retro mr-2"></i>
                  {activeRecord ? "Punch Out Now" : "Punch In Now"}
                </button>
              </div>
            </div>

            {/* Overtime Request */}
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 sm:px-6 py-3 sm:py-4">
                <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
                  <i className="fas fa-clock text-sm sm:text-base"></i>
                  <span>Overtime Request</span>
                </h2>
              </div>
              <div className="p-4 sm:p-6">
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Reason for overtime..."
                  rows="3"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none"
                />
                <button
                  onClick={requestOt}
                  className="w-full mt-3 sm:mt-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 transform hover:scale-[1.02] shadow-md text-sm sm:text-base"
                >
                  <i className="fas fa-paper-plane mr-2"></i>
                  Request Overtime
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Admin User Management */}
        {user?.role === "admin" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden mb-6 sm:mb-8">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 sm:px-6 py-3 sm:py-4">
              <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
                <i className="fas fa-users-cog text-sm sm:text-base"></i>
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
                    placeholder={
                      editingUserId
                        ? "Password (leave blank to keep)"
                        : "Password"
                    }
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
                    <i className="fas fa-save mr-2"></i>
                    {editingUserId ? "Update User" : "Create User"}
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
                  { key: "all", label: "All", icon: "fa-users" },
                  { key: "employee", label: "Employees", icon: "fa-user-tie" },
                  {
                    key: "manager",
                    label: "Managers",
                    icon: "fa-chalkboard-user",
                  },
                  { key: "admin", label: "Admins", icon: "fa-shield-alt" },
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
                    <i className={`fas ${item.icon} text-xs sm:text-sm`}></i>
                    <span className="hidden xs:inline">{item.label}</span>
                    <span className="xs:hidden">{item.label === "All" ? "All" : item.label.slice(0, 3)}</span>
                  </button>
                ))}
              </div>

              {/* User List */}
              <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
                {filterRole === "all"
                  ? [
                      {
                        role: "employee",
                        label: "Employees",
                        icon: "fa-user-tie",
                      },
                      {
                        role: "manager",
                        label: "Managers",
                        icon: "fa-chalkboard-user",
                      },
                      { role: "admin", label: "Admins", icon: "fa-shield-alt" },
                    ].map((section) => {
                      const sectionUsers = users.filter(
                        (item) => item.role === section.role,
                      );

                      if (!sectionUsers.length) {
                        return null;
                      }

                      return (
                        <div key={section.role}>
                          <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-2 sm:mb-3 flex items-center gap-2">
                            <i
                              className={`fas ${section.icon} text-purple-500 text-sm sm:text-base`}
                            ></i>
                            {section.label}
                          </h3>
                          <div className="space-y-2 sm:space-y-3">
                            {sectionUsers.map((item) => (
                              <div
                                key={item._id}
                                className="bg-gray-50 dark:bg-gray-800/50 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:shadow-md transition-all"
                              >
                                <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm sm:text-base text-gray-800 dark:text-white truncate">
                                      {item.name}
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                                      {item.email}
                                    </p>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                      {item.role}
                                    </span>
                                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate max-w-[150px] sm:max-w-none">
                                      {item.manager?.name
                                        ? `Mgr: ${item.manager.name.split(' ')[0]}`
                                        : "No manager"}
                                    </span>
                                    <div className="flex gap-1.5 sm:gap-2">
                                      <button
                                        onClick={() => startEditUser(item)}
                                        className="px-2 sm:px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs sm:text-sm"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => removeUser(item._id)}
                                        className="px-2 sm:px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs sm:text-sm"
                                      >
                                        Del
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  : users
                      .filter((item) => item.role === filterRole)
                      .map((item) => (
                        <div
                          key={item._id}
                          className="bg-gray-50 dark:bg-gray-800/50 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:shadow-md transition-all"
                        >
                          <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm sm:text-base text-gray-800 dark:text-white truncate">
                                {item.name}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                                {item.email}
                              </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                {item.role}
                              </span>
                              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate max-w-[150px] sm:max-w-none">
                                {item.manager?.name
                                  ? `Mgr: ${item.manager.name.split(' ')[0]}`
                                  : "No manager"}
                              </span>
                              <div className="flex gap-1.5 sm:gap-2">
                                <button
                                  onClick={() => startEditUser(item)}
                                  className="px-2 sm:px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs sm:text-sm"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => removeUser(item._id)}
                                  className="px-2 sm:px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs sm:text-sm"
                                >
                                  Del
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
              </div>
            </div>
          </div>
        )}

        {/* Pending Overtime (Manager/Admin) */}
        {(user?.role === "manager" || user?.role === "admin") && (
          <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden mb-6 sm:mb-8">
            <div className="bg-gradient-to-r from-green-500 to-teal-500 px-4 sm:px-6 py-3 sm:py-4">
              <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
                <i className="fas fa-hourglass-half text-sm sm:text-base"></i>
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
                          onClick={() =>
                            reviewOvertime({
                              id: record._id,
                              status: "approved",
                            })
                          }
                          className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-xs sm:text-sm"
                        >
                          <i className="fas fa-check mr-1 text-xs"></i>
                          <span className="hidden xs:inline">Approve</span>
                          <span className="xs:hidden">✓</span>
                        </button>
                        <button
                          onClick={() =>
                            reviewOvertime({
                              id: record._id,
                              status: "rejected",
                            })
                          }
                          className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs sm:text-sm"
                        >
                          <i className="fas fa-times mr-1 text-xs"></i>
                          <span className="hidden xs:inline">Reject</span>
                          <span className="xs:hidden">✗</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4 sm:py-6 text-sm sm:text-base">
                  <i className="fas fa-check-circle text-xl sm:text-2xl mb-2 block"></i>
                  No pending overtime requests.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Attendance Table Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-4 sm:px-6 py-3 sm:py-4">
            <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
              <i className="fas fa-calendar-alt text-sm sm:text-base"></i>
              <span>
                {user?.role === "employee"
                  ? "My Attendance History"
                  : "Attendance Review"}
              </span>
            </h2>
          </div>
          <div className="p-3 sm:p-4 md:p-6 overflow-x-auto">
            {isLoading ? (
              <div className="text-center py-6 sm:py-8">
                <i className="fas fa-spinner fa-spin text-2xl sm:text-3xl text-indigo-500"></i>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-2">
                  Loading attendance records...
                </p>
              </div>
            ) : (
              <div className="min-w-[280px]">
                <AttendanceTable
                  records={showRecords}
                  actions={
                    user?.role === "manager" || user?.role === "admin"
                      ? (record) => <ValidationPanel record={record} />
                      : undefined
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}