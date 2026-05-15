import Role from '../../models/add_by_admin/Role.js';

// Create a new Role
export const createRole = async (req, res) => {
    try {
        const { role, roleName, status, added_by } = req.body;

        if (!role || !roleName) {
            return res.status(400).json({ success: false, message: 'Role and Role Name are required' });
        }

        const newRole = await Role.create({ role, roleName, status, added_by });
        res.status(201).json({ success: true, message: 'Role registered successfully', data: newRole });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all Roles
export const getRoles = async (req, res) => {
    try {
        const roles = await Role.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: roles });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a Role
export const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedRole = await Role.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });

        if (!updatedRole) {
            return res.status(404).json({ success: false, message: 'Role not found' });
        }

        res.status(200).json({ success: true, message: 'Role updated successfully', data: updatedRole });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a Role
export const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRole = await Role.findByIdAndDelete(id);

        if (!deletedRole) return res.status(404).json({ success: false, message: 'Role not found' });
        res.status(200).json({ success: true, message: 'Role deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};