import express from "express";
import User from "../models/User.js";
import { signToken } from "../utils/auth.js";
import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";
const router = express.Router();



/**
 * Signup
 */
router.post(
  "/signup",
  async (req, res, next) => {
    try {
      let {
  name,
  email,
  password,
  manager,
} = req.body;

const role = "employee";

      name = name?.trim();
      email = email?.trim().toLowerCase();

      if (
        !name ||
        !email ||
        !password
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Name, email and password are required",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message:
            "Password must be at least 6 characters",
        });
      }




      /**
       * For assessment:
       * allow admin signup
       *
       * Production:
       * force role = employee
       */

      const existingUser =
        await User.findOne({
          email,
        });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message:
            "Email is already registered",
        });
      }

      const user = await User.create({
        name,
        email,
        password,
        role,
        manager:
          role === "employee" &&
          manager
            ? manager
            : null,
      });

      const safeUser =
        await User.findById(
          user._id
        ).select(
          "-password"
        );

      res.status(201).json({
        success: true,
        user: safeUser,
        token: signToken(user),
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Login
 */

router.post(
  "/login",
  async (req, res, next) => {
    try {
      let {
        email,
        password,
      } = req.body;

      email = email
        ?.trim()
        .toLowerCase();

      if (
        !email ||
        !password
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Email and password are required",
        });
      }

      const user =
        await User.findOne({
          email,
        }).select("+password");

      if (!user) {
        return res.status(401).json({
          success: false,
          message:
            "Invalid email or password",
        });
      }

      const isMatch =
        await user.comparePassword(
          password
        );

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message:
            "Invalid email or password",
        });
      }

      const safeUser =
        await User.findById(
          user._id
        )
          .select("-password")
          .populate(
            "manager",
            "name email"
          );

      return res.json({
        success: true,
        user: safeUser,
        token: signToken(user),
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/my-team",
  protect,
  authorize("manager"),
  async (req, res, next) => {
    try {
      const employees = await User.find({
        manager: req.user._id,
        role: "employee",
      });

      res.json(employees);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Current User
 */
router.get(
  "/me",
  protect,
  async (req, res, next) => {
    try {
      const user =
        await User.findById(
          req.user._id
        )
          .select("-password")
          .populate(
            "manager",
            "name email"
          );

      res.json({
        success: true,
        user,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;