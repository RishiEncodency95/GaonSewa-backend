import express from "express";
import {
  createActivityLog,
  getAllActivityLogs,
  getActivityLogById,
  deleteActivityLog,
} from "../../controllers/activity/activityLogController.js";

const router = express.Router();

router.post("/create", createActivityLog); // CREATE
router.get("/", getAllActivityLogs); // READ ALL
router.get("/:id", getActivityLogById); // READ ONE
router.delete("/:id", deleteActivityLog); // DELETE

export default router;
