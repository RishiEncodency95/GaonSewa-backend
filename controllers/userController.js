import User from '../models/User.js';

// ── GET all users ────────────────────────────────────────────────
// SuperAdmin → all; Admin → own branch only
export const getAllUsers = async (req, res) => {
    try {
        let filter = {};
        if (!req.user.isSuperAdmin) {
            filter = { branchId: req.user.branchId, companyId: req.user.companyId };
        }
        const users = await User.find(filter)
            .populate('companyId', 'name')
            .populate('branchId', 'name')
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
            finalProfileImage = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
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

// ── UPDATE user ──────────────────────────────────────────────────
export const updateUser = async (req, res) => {
    try {
        // Strip password – use dedicated password-change endpoint if needed
        const { password, address, ...updateData } = req.body;

        // 🔥 Handle Profile Image
        if (req.file) {
            updateData.profileImage = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
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
