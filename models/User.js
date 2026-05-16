import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: { type: String, required: true, select: false },
    phone: { type: String, trim: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], default: null },
    dateOfBirth: { type: Date, default: null },
    profileImage: { type: String, default: null },
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        pincode: { type: String }
    },
    companyId: {
        type: String,
        ref: 'Company',
        index: true
    },
    branchId: {
        type: String,
        ref: 'Branch',
        index: true
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdminRole',
        required: [true, 'User role is required']
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    lastLogin: Date
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for isSuperAdmin
userSchema.virtual('isSuperAdmin').get(function() {
    return this.role && this.role.role === 'Super Admin';
});

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);
export default User;
