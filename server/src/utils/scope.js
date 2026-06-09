import User from "../models/User.js";

export const scopedEmployeeFilter = async (viewer) => {
  if (viewer.role === "admin") {
    return {};
  }

  if (viewer.role === "manager") {
    const teamMembers = await User.find(
      { manager: viewer._id },
      "_id"
    ).lean();

    return {
      employee: {
        $in: [
          viewer._id,
          ...teamMembers.map((user) => user._id),
        ],
      },
    };
  }

  return {
    employee: viewer._id,
  };
};