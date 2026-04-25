// models/Company.js
import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  name: String,
  designation: String,
  email: String,
  phone: String
}, { _id: false });

const companySchema = new mongoose.Schema({

  // 🏢 Basic
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, lowercase: true },

  // 📞 Contact
  email: { type: String, trim: true },
  phone: { type: String, trim: true },
  website: { type: String, trim: true },

  // 📍 Address
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    pincode: String
  },

  // 🧾 Legal
  gstNumber: String,
  panNumber: String,

  // 👤 Owner
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  // 📊 Business Info
  category: String,          // Dairy, Retail
  businessNature: String,    // Manufacturer, Distributor

  // ⚙️ Settings
  settings: {
    allowCredit: { type: Boolean, default: true },
    currency: { type: String, default: "INR" }
  },

  // 💳 SaaS future
  plan: {
    type: String,
    enum: ["Free", "Basic", "Pro"],
    default: "Free"
  },

  planExpiry: Date,

  // 📇 Contacts
  contacts: [contactSchema],

  // 🖼️ Branding
  logo: String,
  description: String,

  // 📌 Status
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active"
  }

}, { timestamps: true });

export default mongoose.model("Company", companySchema);