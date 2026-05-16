import User from "../models/User.js";
import jwt from "jsonwebtoken";

// 🔐 Token generate
const signToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      companyId: user.companyId,
      branchId: user.branchId,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

// ================= SIGNUP =================
export const signup = async (req, res) => {
  try {
    const { name, email, password, role, companyId, branchId } = req.body;

    // ❌ duplicate check
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // ✅ create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      companyId,
      branchId
    });

    const token = signToken(user);

    await user.populate("role");
    user.password = undefined;

    res.status(201).json({
      status: "success",
      token,
      data: { user }
    });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ❌ validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }

    // find user
    const user = await User.findOne({ email }).select("+password");

    // ❌ wrong credentials
    if (!user || !(await user.comparePassword(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ❌ inactive
    if (user.status === "Inactive") {
      return res.status(403).json({ message: "User inactive" });
    }

    const token = signToken(user);

    // update last login
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });
    await user.populate("role");

    user.password = undefined;

    res.status(200).json({
      status: "success",
      token,
      data: { user }
    });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};