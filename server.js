import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import heroRoutes from "./routes/website/heroRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cloudinary from "./utils/cloudinary.js";
import companyRoutes from "./routes/superAdmin/companyRoutes.js";
import roleRoutes from "./routes/add_by_admin/roleRoutes.js";
import sidebarRoutes from "./routes/add_by_admin/sidebarRoutes.js";
import roleRightsRoutes from "./routes/add_by_admin/role_rights/roleRightsRoutes.js";
import activityLogRoutes from "./routes/activity/activityLogRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import qs from "qs";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/hero", heroRoutes);
app.use("/api/users", userRoutes);
// super admin
app.use("/api/companies", companyRoutes);
// admin roles
app.use("/api/roles", roleRoutes);
app.use("/api/role-rights", roleRightsRoutes);
app.use("/api/sidebars", sidebarRoutes);
app.use("/api/activity-logs", activityLogRoutes);
app.use("/api/locations", locationRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("DB Connected"))
    .catch(err => console.log(err));

cloudinary.api.ping()
    .then(() => console.log("Cloudinary Connected ☁️"))
    .catch(err => console.log("Cloudinary Error: Check your keys!"));

app.get("/", (req, res) => {
    res.send("Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => console.log(`Server running on ${PORT}`));

server.on("error", (error) => {
    console.error("Server failed to start:", error.message);
});
