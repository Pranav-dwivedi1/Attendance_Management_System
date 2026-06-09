
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Please provide a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: [
        "employee",
        "manager",
        "admin",
      ],
      default: "employee",
      index: true,
    },

    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,

    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },

    toObject: {
      virtuals: true,
    },
  }
);

/**
 * Virtual ID field
 */
userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

/**
 * Password Hashing
 */
userSchema.pre(
  "save",
  async function hashPassword(next) {
    try {
      if (!this.isModified("password")) {
        return next();
      }

      const saltRounds = Number(
        process.env.BCRYPT_ROUNDS || 12
      );

      this.password = await bcrypt.hash(
        this.password,
        saltRounds
      );

      next();
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Password Comparison
 */
userSchema.methods.comparePassword =
  async function comparePassword(
    candidate
  ) {
    return bcrypt.compare(
      candidate,
      this.password
    );
  };

export default mongoose.model(
  "User",
  userSchema
);

