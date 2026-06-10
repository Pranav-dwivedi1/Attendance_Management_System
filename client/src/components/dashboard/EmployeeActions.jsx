import { useState } from "react";
import CameraCapture from "../CameraCapture.jsx";
import {
  usePunchInMutation,
  usePunchOutMutation,
  useRequestOvertimeMutation,
} from "../../store/api.js";

export default function EmployeeActions({ activeRecord }) {
  const [selfie, setSelfie] = useState("");
  const [reason, setReason] = useState("");
  const [punchIn] = usePunchInMutation();
  const [punchOut] = usePunchOutMutation();
  const [requestOvertime] = useRequestOvertimeMutation();

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
        () => reject(new Error("Location permission is required to mark attendance"))
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
        await punchOut({ id: activeRecord._id, selfie, location }).unwrap();
      } else {
        await punchIn({ selfie, location }).unwrap();
      }
      setSelfie("");
    } catch (error) {
      console.error(error);
      alert(error?.data?.message || error?.message || "Failed to update attendance");
    }
  };

  const requestOt = async () => {
    try {
      if (!activeRecord) {
        alert("Create an attendance record before requesting overtime.");
        return;
      }
      if (!reason.trim()) {
        alert("Please enter a reason.");
        return;
      }
      await requestOvertime({ id: activeRecord._id, reason }).unwrap();
      setReason("");
    } catch (error) {
      alert(error?.data?.message || error?.message || "Failed to submit overtime request");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
      {/* Punch Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-4 sm:px-6 py-3 sm:py-4">
          <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
            <span className="text-sm sm:text-base">🖐️</span>
            <span>{activeRecord ? "Punch Out" : "Punch In"}</span>
          </h2>
        </div>
        <div className="p-4 sm:p-6">
          <CameraCapture onCapture={setSelfie} />
          <button
            onClick={punch}
            className="w-full mt-4 sm:mt-6 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02] focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-md text-sm sm:text-base"
          >
            📸 {activeRecord ? "Punch Out Now" : "Punch In Now"}
          </button>
        </div>
      </div>

      {/* Overtime Request */}
      <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 sm:px-6 py-3 sm:py-4">
          <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
            <span className="text-sm sm:text-base">⏰</span>
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
            📤 Request Overtime
          </button>
        </div>
      </div>
    </div>
  );
}