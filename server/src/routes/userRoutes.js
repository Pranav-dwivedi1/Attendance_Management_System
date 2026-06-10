import express from "express";
import { authorize, protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

/**
 * Get Managers
 * Used for employee signup
 */
router.get("/managers", async (_req, res, next) => {
  try {
    const managers = await User.find(
      {
        role: "manager",
      },
      "name email role",
    ).lean();

    res.json(managers);
  } catch (error) {
    next(error);
  }
});


router.get(
  "/my-team",
  protect,
  authorize("manager"),
  async (req, res, next) => {
    try {
      const employees = await User.find({
        manager: req.user._id,
        role: "employee",
      })
        .select("name email role")
        .lean();

      res.json(employees);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Protected Routes
 */
router.use(protect);

/**
 * Admin - Get All Users
 */
router.get("/", authorize("admin"), async (_req, res, next) => {
  try {
    const users = await User.find()
      .select("name email role manager createdAt")
      .populate("manager", "name email")
      .sort({
        createdAt: -1,
      })
      .lean();

    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.post("/", authorize("admin"), async (req, res, next) => {
  try {
    const { name, email, password, role = "employee", manager } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    if (!["employee", "manager", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const existing = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role,
      manager: role === "employee" && manager ? manager : null,
    });

    const safeUser = await User.findById(user._id)
      .select("name email role manager createdAt")
      .populate("manager", "name email");

    res.status(201).json(safeUser);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", authorize("admin"), async (req, res, next) => {
  try {
    const { name, email, password, role, manager } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name) user.name = name.trim();
    if (email) user.email = email.toLowerCase().trim();
    if (password) user.password = password;
    if (role && ["employee", "manager", "admin"].includes(role)) {
      user.role = role;
    }
    user.manager = user.role === "employee" ? manager || null : null;

    await user.save();

    const safeUser = await User.findById(user._id)
      .select("name email role manager createdAt")
      .populate("manager", "name email");

    res.json(safeUser);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", authorize("admin"), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await user.deleteOne();
    res.json({ success: true, message: "User deleted" });
  } catch (error) {
    next(error);
  }
});

export default router;
