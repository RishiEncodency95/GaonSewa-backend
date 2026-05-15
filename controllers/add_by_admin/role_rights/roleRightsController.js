import RoleRights from "../../../models/add_by_admin/role_rights/RoleRightsModel.js";

/* ===============================
   CREATE ROLE RIGHTS
================================ */
export const createRoleRights = async (req, res) => {
    try {
        const { role, permissions, created_by } = req.body;

        if (!role) {
            return res.status(400).json({
                success: false,
                message: "Role is required",
            });
        }

        const existingRoleRights = await RoleRights.findOne({ role });

        if (existingRoleRights) {
            return res.status(409).json({
                success: false,
                message: "Role rights for this role already exist",
            });
        }

        const data = await RoleRights.create({
            role,
            permissions,
            created_by,
        });

        res.status(201).json({
            success: true,
            message: "Role rights created successfully",
            data,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* ===============================
   GET ALL ROLE RIGHTS
================================ */
export const getAllRoleRights = async (req, res) => {
    try {
        const data = await RoleRights.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* ===============================
   GET ROLE RIGHTS BY ID
================================ */
export const getRoleRightsById = async (req, res) => {
    try {
        const data = await RoleRights.findById(req.params.id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Role rights not found",
            });
        }

        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* ===============================
   UPDATE ROLE RIGHTS
================================ */
export const updateRoleRights = async (req, res) => {
    try {
        const data = await RoleRights.findById(req.params.id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Role rights not found",
            });
        }

        if (req.body.role && req.body.role !== data.role) {
            const existingRoleRights = await RoleRights.findOne({ role: req.body.role });
            if (existingRoleRights) {
                return res.status(409).json({
                    success: false,
                    message: "Role rights for this role already exist",
                });
            }
        }

        data.role = req.body.role ?? data.role;
        data.permissions = req.body.permissions ?? data.permissions;
        data.updated_by = req.body.updated_by ?? data.updated_by;

        await data.save();

        res.status(200).json({
            success: true,
            message: "Role rights updated successfully",
            data,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* ===============================
   DELETE ROLE RIGHTS
================================ */
export const deleteRoleRights = async (req, res) => {
    try {
        const data = await RoleRights.findByIdAndDelete(req.params.id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Role rights not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Role rights deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};