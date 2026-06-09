import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Attendance from "../models/Attendance.js";
import { scopedEmployeeFilter } from "../utils/scope.js";

const router = express.Router();

router.use(protect);

router.get("/daily", async (req, res, next) => {
  try {
    const date = req.query.date || new Date().toISOString().slice(0, 10);

    const start = new Date(`${date}T00:00:00.000Z`);

    if (Number.isNaN(start.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format. Use YYYY-MM-DD.",
      });
    }

    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);

    const filter = await scopedEmployeeFilter(req.user);

    filter.punchInTime = {
      $gte: start,
      $lt: end,
    };

    const records = await Attendance.find(filter)
      .populate("employee", "name email role manager")
      .sort({
        punchInTime: 1,
      })
      .lean();

    const rows = records.map((record) => ({
      id: record._id,

      name: record.employee?.name || "Deleted User",

      email: record.employee?.email || "-",

      role: record.employee?.role || "-",

      punchInTime: record.punchInTime || null,

      punchOutTime: record.punchOutTime || null,

      selfie: record.punchInSelfie || "",

      location: record.punchInLocation || null,

      workingHours: record.totalWorkingHours || 0,

      status: record.validationStatus || "pending",

      validationRemarks: record.validationRemarks || "",

      overtimeStatus: record.overtime?.status || "none",

      workStatus: record.workStatus || "in-progress",
    }));

    return res.status(200).json({
      success: true,
      date,
      count: rows.length,
      rows,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
