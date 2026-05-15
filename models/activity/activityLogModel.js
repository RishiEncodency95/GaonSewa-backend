import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference to the User model
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed, // flexible data storage
      default: {},
    },
    link: {
      type: String,
      default: "",
    },
    section: {
      type: String,
      required: true, // e.g. Banner, Blog, Member, Category
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } // createdAt, updatedAt auto
);

export default mongoose.model("ActivityLog", activityLogSchema);
