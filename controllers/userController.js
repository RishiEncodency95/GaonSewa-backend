import User from '../models/User.js';
import cloudinary from '../utils/cloudinary.js';
import fs from 'fs';

// ── GET all users ────────────────────────────────────────────────
// SuperAdmin → all; Admin → own branch only
export const getAllUsers = async (req, res) => {
    try {
        let filter = {};
        const isSuperAdmin = req.user.role && req.user.role.role === 'Super Admin';
        if (!isSuperAdmin) {
            filter = { branchId: req.user.branchId, companyId: req.user.companyId };
        }
        const users = await User.find(filter)
            .populate('role')
            .sort({ createdAt: -1 });
        res.status(200).json({ status: 'success', results: users.length, data: { users } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// ── GET users by branch ──────────────────────────────────────────
export const getUsersByBranch = async (req, res) => {
    try {
        const users = await User.find({ branchId: req.params.branchId })
            .populate('companyId', 'name')
            .populate('branchId', 'name')
            .populate('role')
            .sort({ createdAt: -1 });
        res.status(200).json({ status: 'success', results: users.length, data: { users } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// ── GET single user ──────────────────────────────────────────────
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate('companyId', 'name')
            .populate('branchId', 'name')
            .populate('role');
        if (!user) return res.status(404).json({ status: 'fail', message: 'User not found' });
        res.status(200).json({ status: 'success', data: { user } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// ── CREATE user ──────────────────────────────────────────────────
export const createUser = async (req, res) => {
    try {
        const {
            name, email, password, role,
            phone, gender, dateOfBirth, profileImage,
            address,
            companyId, branchId, status
        } = req.body;

        // Admin can only create users in their own company & branch
        const finalCompanyId = req.user.isSuperAdmin ? companyId : req.user.companyId;
        const finalBranchId  = req.user.isSuperAdmin ? branchId  : req.user.branchId;

        // 🔥 Handle Profile Image
        let finalProfileImage = profileImage;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "users"
            });
            finalProfileImage = result.secure_url;
            fs.unlink(req.file.path, (err) => { if (err) console.error(err); });
        }

        // 🔥 Handle nested address JSON if sent as string (from FormData)
        let finalAddress = address;
        if (typeof address === 'string') {
            try {
                finalAddress = JSON.parse(address);
            } catch (e) {
                console.error("Address parsing error:", e);
            }
        }

        // Admin cannot create another Admin
        if (!req.user.isSuperAdmin && role === 'Admin') {
            return res.status(403).json({ status: 'fail', message: 'Admin cannot create another Admin.' });
        }

        // 🔥 Email Uniqueness Check
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ status: 'fail', message: 'Email is already registered. Please use a different email address.' });
        }

        // 🔥 Phone Uniqueness Check
        if (phone) {
            const existingPhone = await User.findOne({ phone });
            if (existingPhone) {
                return res.status(400).json({ status: 'fail', message: 'Phone number is already registered. Please use a different phone number.' });
            }
        }

        const user = await User.create({
            name, email, password,
            role,
            phone, gender, dateOfBirth, 
            profileImage: finalProfileImage,
            address: finalAddress,
            companyId: finalCompanyId,
            branchId:  finalBranchId,
            status: status || 'Active'
        });

        user.password = undefined;
        res.status(201).json({ status: 'success', data: { user } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// ── Helper: extract Cloudinary public_id from URL ──────────────────
const getCloudinaryPublicId = (url) => {
    if (!url || !url.includes('cloudinary.com')) return null;
    // URL format: https://res.cloudinary.com/<cloud>/image/upload/v123456/users/filename.jpg
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) return null;
    // Skip the version segment (v123456) and join the rest without extension
    const relevantParts = parts.slice(uploadIndex + 2); // skip 'upload' + version
    const publicIdWithExt = relevantParts.join('/');
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, ''); // remove extension
    return publicId;
};

// ── UPDATE user ──────────────────────────────────────────────────
export const updateUser = async (req, res) => {
    try {
        // Strip password – use dedicated password-change endpoint if needed
        const { password, address, ...updateData } = req.body;

        // 🔥 Handle Profile Image: delete old from Cloudinary, upload new
        if (req.file) {
            // Find existing user to get old image URL
            const existingUser = await User.findById(req.params.id).select('profileImage');
            if (existingUser?.profileImage) {
                const publicId = getCloudinaryPublicId(existingUser.profileImage);
                if (publicId) {
                    try {
                        await cloudinary.uploader.destroy(publicId);
                    } catch (delErr) {
                        console.error('Old image delete error:', delErr.message);
                    }
                }
            }
            // Upload new image to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "users"
            });
            updateData.profileImage = result.secure_url;
            fs.unlink(req.file.path, (err) => { if (err) console.error(err); });
        }

        // 🔥 Email Uniqueness Check on Update
        if (updateData.email) {
            const existingEmail = await User.findOne({ email: updateData.email, _id: { $ne: req.params.id } });
            if (existingEmail) {
                return res.status(400).json({ status: 'fail', message: 'Email is already registered by another user. Please use a different email address.' });
            }
        }

        // 🔥 Phone Uniqueness Check on Update
        if (updateData.phone) {
            const existingPhone = await User.findOne({ phone: updateData.phone, _id: { $ne: req.params.id } });
            if (existingPhone) {
                return res.status(400).json({ status: 'fail', message: 'Phone number is already registered by another user. Please use a different phone number.' });
            }
        }

        // 🔥 Handle nested address JSON if sent as string
        if (address && typeof address === 'string') {
            try {
                updateData.address = JSON.parse(address);
            } catch (e) {
                console.error("Address parsing error:", e);
            }
        } else if (address) {
            updateData.address = address;
        }

        const user = await User.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        }).populate('role');

        if (!user) return res.status(404).json({ status: 'fail', message: 'User not found' });
        res.status(200).json({ status: 'success', data: { user } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// ── DELETE user ──────────────────────────────────────────────────
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ status: 'fail', message: 'User not found' });
        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
