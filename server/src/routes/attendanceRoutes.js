import express from "express";
import Attendance from "../models/Attendance.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { scopedEmployeeFilter } from "../utils/scope.js";

const router = express.Router();

const dayRange = (value) => {
  if (!value) return null;

  const start = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(start.getTime())) {
    return null;
  }

  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);

  return { start, end };
};

const isValidLocation = (location) => {
  return (
    typeof location?.latitude === "number" &&
    typeof location?.longitude === "number"
  );
};

const isValidSelfie = (selfie) => {
  return typeof selfie === "string" && selfie.startsWith("data:image/");
};

router.use(protect);

/**
 * Get Attendance Records
 */
router.get("/", async (req, res, next) => {
  try {
    const filter = await scopedEmployeeFilter(req.user);

    const range = dayRange(req.query.date);

    if (req.query.date && !range) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format. Use YYYY-MM-DD.",
      });
    }

    if (range) {
      filter.punchInTime = {
        $gte: range.start,
        $lt: range.end,
      };
    }

    const records = await Attendance.find(filter)
      .populate("employee", "name email role manager")
      .populate("validatedBy", "name")
      .populate("overtime.reviewedBy", "name")
      .sort({
        punchInTime: -1,
      });

    res.json(records);
  } catch (error) {
    next(error);
  }
});

/**
 * Punch In
 */
router.post("/punch-in", authorize("employee"), async (req, res, next) => {
  try {
    const { selfie, location } = req.body;

    if (!isValidSelfie(selfie)) {
      return res.status(400).json({
        message: "Valid selfie is required",
      });
    }

    if (!isValidLocation(location)) {
      return res.status(400).json({
        message: "Valid location is required",
      });
    }

    const openRecord = await Attendance.findOne({
      employee: req.user._id,
      punchOutTime: null,
    });

    if (openRecord) {
      return res.status(409).json({
        message: "You already have an active punch-in",
      });
    }

    const record = await Attendance.create({
      employee: req.user._id,
      punchInTime: new Date(),
      punchInSelfie: selfie,
      punchInLocation: location,
    });

    await record.populate("employee", "name email role manager");

    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
});

/**
 * Punch Out
 */
router.patch(
  "/:id/punch-out",
  authorize("employee"),
  async (req, res, next) => {
    try {
      const { selfie, location } = req.body;

      const record = await Attendance.findOne({
        _id: req.params.id,
        employee: req.user._id,
      });

      if (!record) {
        return res.status(404).json({
          message: "Attendance record not found",
        });
      }

      if (record.punchOutTime) {
        return res.status(409).json({
          message: "This attendance record is already closed",
        });
      }

      if (!isValidSelfie(selfie)) {
        return res.status(400).json({
          message: "Valid selfie is required",
        });
      }

      if (!isValidLocation(location)) {
        return res.status(400).json({
          message: "Valid location is required",
        });
      }

      record.punchOutSelfie = selfie;

      record.punchOutLocation = location;

      record.finishShift(new Date());

      await record.save();

      await record.populate("employee", "name email role manager");

      res.json(record);
    } catch (error) {
      next(error);
    }
  },
);

/**
 * Request Overtime
 */
router.post("/:id/overtime", authorize("employee"), async (req, res, next) => {
  try {
    const record = await Attendance.findOne({
      _id: req.params.id,
      employee: req.user._id,
    });

    if (!record) {
      return res.status(404).json({
        message: "Attendance record not found",
      });
    }

    if (record.overtime?.status === "pending") {
      return res.status(409).json({
        message: "Overtime request already pending",
      });
    }

    record.overtime = {
      requested: true,
      reason: req.body.reason?.trim() || "Overtime requested",
      status: "pending",
    };

    await record.save();

    res.json(record);
  } catch (error) {
    next(error);
  }
});

/**
 * Review Overtime
 */
router.patch(
  "/:id/overtime",
  authorize("manager", "admin"),
  async (req, res, next) => {
    try {
      const { status } = req.body;

      if (!["approved", "rejected"].includes(status)) {
        return res.status(400).json({
          message: "Status must be approved or rejected",
        });
      }

      const scope = await scopedEmployeeFilter(req.user);

      const record = await Attendance.findOne({
        _id: req.params.id,
        ...scope,
      });

      if (!record) {
        return res.status(404).json({
          message: "Attendance record not found in your scope",
        });
      }

      record.overtime.status = status;

      record.overtime.reviewedBy = req.user._id;

      record.overtime.reviewedAt = new Date();

      await record.save();

      await record.populate("employee", "name email role manager");

      res.json(record);
    } catch (error) {
      next(error);
    }
  },
);

/**
 * Validate Attendance
 */
router.patch(
  "/:id/validate",
  authorize("manager", "admin"),
  async (req, res, next) => {
    try {
      const { validationStatus, validationRemarks } = req.body;

      if (!["approved", "rejected"].includes(validationStatus)) {
        return res.status(400).json({
          message: "Validation status must be approved or rejected",
        });
      }

      if (validationStatus === "rejected" && !validationRemarks?.trim()) {
        return res.status(400).json({
          message: "Remarks are required when attendance is rejected",
        });
      }

      const scope = await scopedEmployeeFilter(req.user);

      const record = await Attendance.findOne({
        _id: req.params.id,
        ...scope,
      });

      if (!record) {
        return res.status(404).json({
          message: "Attendance record not found in your scope",
        });
      }

      record.validationStatus = validationStatus;

      record.validationRemarks = validationRemarks || "";

      record.validatedBy = req.user._id;

      await record.save();

      await record.populate("employee", "name email role manager");

      res.json(record);
    } catch (error) {
      next(error);
    }
  },
);

export default router;
