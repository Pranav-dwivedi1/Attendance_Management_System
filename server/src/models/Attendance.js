import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    latitude: {
      type: Number,
      min: -90,
      max: 90,
    },

    longitude: {
      type: Number,
      min: -180,
      max: 180,
    },
  },
  {
    _id: false,
  },
);

const overtimeSchema = new mongoose.Schema(
  {
    requested: {
      type: Boolean,
      default: false,
    },

    reason: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    status: {
      type: String,
      enum: ["none", "pending", "approved", "rejected"],
      default: "none",
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reviewedAt: Date,
  },
  {
    _id: false,
  },
);

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    punchInTime: {
      type: Date,
      required: true,
      index: true,
    },

    punchOutTime: Date,

    punchInSelfie: {
      type: String,
      required: true,
    },

    punchOutSelfie: {
      type: String,
    },

    punchInLocation: locationSchema,

    punchOutLocation: locationSchema,

    totalWorkingHours: {
      type: Number,
      default: 0,
      min: 0,
    },

    workStatus: {
      type: String,
      enum: ["in-progress", "completed", "incomplete"],
      default: "in-progress",
    },

    validationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    validationRemarks: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    validatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    overtime: {
      type: overtimeSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,

    toJSON: {
      virtuals: true,
    },

    toObject: {
      virtuals: true,
    },
  },
);

/**
 * Indexes
 */
attendanceSchema.index({
  employee: 1,
  punchInTime: -1,
});

attendanceSchema.index({
  validationStatus: 1,
});

attendanceSchema.index({
  "overtime.status": 1,
});

/**
 * Virtual ID
 */
attendanceSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

/**
 * Shift Completion Logic
 */
attendanceSchema.methods.finishShift = function finishShift(punchOutTime) {
  this.punchOutTime = punchOutTime;

  const milliseconds = this.punchOutTime.getTime() - this.punchInTime.getTime();

  this.totalWorkingHours = Math.max(milliseconds / 1000 / 60 / 60, 0);

  this.workStatus = this.totalWorkingHours >= 8 ? "completed" : "incomplete";
};

export default mongoose.model("Attendance", attendanceSchema);
