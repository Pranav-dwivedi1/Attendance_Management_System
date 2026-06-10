import { useSelector } from "react-redux";
import Protected from "../components/Protected.jsx";
import DashboardHeader from "../components/dashboard/DashboardHeader.jsx";
import EmployeeActions from "../components/dashboard/EmployeeActions.jsx";
import AdminUserManagement from "../components/dashboard/AdminUserManagement.jsx";
import PendingOvertime from "../components/dashboard/PendingOvertime.jsx";
import MyTeam from "../components/dashboard/MyTeam.jsx";
import AttendanceSection from "../components/dashboard/AttendanceSection.jsx";
import {
  useAttendanceQuery,
  useUsersQuery,
  useManagersQuery,
  useMyTeamQuery,
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
  const { data: team = [] } = useMyTeamQuery(undefined, {
    skip: user?.role !== "manager",
  });

  const activeRecord = attendance.find((record) => !record.punchOutTime);
  const reviewRecords = attendance.filter(
    (record) => record.validationStatus === "pending"
  );
  const showRecords = user?.role === "manager" ? reviewRecords : attendance;
  const pendingOt = attendance.filter(
    (record) => record.overtime?.status === "pending"
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-10">
        <DashboardHeader user={user} />

        {user?.role === "employee" && (
          <EmployeeActions activeRecord={activeRecord} />
        )}

        {user?.role === "admin" && (
          <AdminUserManagement users={users} managers={managers} />
        )}

        {(user?.role === "manager" || user?.role === "admin") && (
          <PendingOvertime pendingOt={pendingOt} />
        )}

        {user?.role === "manager" && <MyTeam team={team} />}

        <AttendanceSection
          isLoading={isLoading}
          showRecords={showRecords}
          userRole={user?.role}
        />
      </div>
    </div>
  );
}