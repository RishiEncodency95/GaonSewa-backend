import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'You are not logged in. Please log in to get access.' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if user still exists and populate role
        const currentUser = await User.findById(decoded.id).populate('role');
        if (!currentUser) {
            return res.status(401).json({ message: 'The user belonging to this token no longer exists.' });
        }

        // Attach user and tenant info to request
        req.user = currentUser;
        req.tenant = {
            companyId: decoded.companyId,
            branchId: decoded.branchId
        };

        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token. Please log in again.' });
    }
};

export const restrictTo = (module, action) => {
    return async (req, res, next) => {
        try {
            // Super Admin bypasses all checks
            // Role is already populated in protect middleware
            const userRole = req.user.role;
            
            if (!userRole) {
                return res.status(403).json({ message: 'No role assigned to this user.' });
            }

            // Super Admin check (dynamic based on role slug)
            if (userRole.role === 'Super Admin') return next();

            // Role Rights implementation (if using RoleRights model)
            // For now, let's assume we check the role's permissions object
            const hasPermission = userRole.permissions && userRole.permissions[module] && userRole.permissions[module][action];

            if (!hasPermission) {
                return res.status(403).json({ 
                    message: `You do not have permission to ${action} in ${module} module.` 
                });
            }

            next();
        } catch (err) {
            res.status(500).json({ message: 'Error checking permissions' });
        }
    };
};

// Only SuperAdmin can access
export const isSuperAdmin = (req, res, next) => {
    if (!req.user || !req.user.role || req.user.role.role !== 'Super Admin') {
        return res.status(403).json({ message: 'Access denied. Super Admin only.' });
    }
    next();
};

// Branch Admin or SuperAdmin can access
export const isAdminOrSuperAdmin = (req, res, next) => {
    if (!req.user || !req.user.role) return res.status(401).json({ message: 'Not authenticated or no role.' });
    const roleSlug = req.user.role.role;
    if (roleSlug === 'Super Admin' || roleSlug === 'Admin') return next();
    return res.status(403).json({ message: 'Access denied. Admin or Super Admin only.' });
};
