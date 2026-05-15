import mongoose from 'mongoose';

const sidebarSchema = new mongoose.Schema({
    label: {
        type: String,
        required: [true, 'Label is required'],
        trim: true
    },
    path: {
        type: String,
        trim: true
    },
    section: {
        type: String,
        required: [true, 'Section is required'],
        trim: true
    },
    icon: {
        type: String,
        trim: true
    },
    parentMenu: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    order: {
        type: Number,
        default: 0
    },
    added_by: {
        type: String,
        default: 'Admin'
    },
    updated_by: {
        type: String,
        default: null
    },
}, { timestamps: true });

export default mongoose.model('AdminSidebar', sidebarSchema, 'admin_sidebars');