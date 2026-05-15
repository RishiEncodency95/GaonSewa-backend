import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
    role: {
        type: String,
        required: [true, 'Role is required'],
        trim: true
    },
    roleName: {
        type: String,
        required: [true, 'Role Name is required'],
        trim: true
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    added_by: {
        type: String,
        default: 'Admin'
    },
    updated_by: {
        type: String
    },
}, { timestamps: true });

export default mongoose.model('AdminRole', roleSchema, 'admin_roles');
