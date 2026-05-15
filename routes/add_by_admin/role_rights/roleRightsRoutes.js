import express from "express";
import {
    createRoleRights,
    getAllRoleRights,
    getRoleRightsById,
    updateRoleRights,
    deleteRoleRights,
} from "../../../controllers/add_by_admin/role_rights/roleRightsController.js";
import { protect } from "../../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createRoleRights);
router.get("/", getAllRoleRights);
router.get("/:id", getRoleRightsById);
router.put("/:id", protect, updateRoleRights);
router.delete("/:id", protect, deleteRoleRights);

export default router;