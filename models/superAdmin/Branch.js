// models/Branch.js
import mongoose from "mongoose";

const branchSchema = new mongoose.Schema({

  name: { type: String, required: true },

  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true
  },

  isMainBranch: { type: Boolean, default: false },

  // 📍 Address
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    pincode: String
  },

  // 📞 Contact
  email: String,
  phone: String,

  // 👤 Manager
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  // 🕒 Working Hours
  workingHours: {
    start: String,
    end: String
  },

  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active"
  },
  added_by: {
    type: String,
    default: 'Admin'
  },
  updated_by: {
    type: String
  },

}, { timestamps: true });

export default mongoose.model("Branch", branchSchema);