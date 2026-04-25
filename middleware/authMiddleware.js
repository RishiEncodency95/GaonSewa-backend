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

        // Check if user still exists
        const currentUser = await User.findById(decoded.id);
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
            if (req.user.isSuperAdmin) return next();

            // Populate roles if not already populated
            const userWithRoles = await req.user.populate('roles');
            const roles = userWithRoles.roles;

            if (!roles || roles.length === 0) {
                return res.status(403).json({ message: 'No roles assigned to this user.' });
            }

            // Check if any role has the required permission
            const hasPermission = roles.some(role => {
                return role.permissions && role.permissions[module] && role.permissions[module][action];
            });

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
    if (!req.user || !req.user.isSuperAdmin) {
        return res.status(403).json({ message: 'Access denied. Super Admin only.' });
    }
    next();
};

// Branch Admin or SuperAdmin can access
export const isAdminOrSuperAdmin = (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated.' });
    if (req.user.isSuperAdmin || req.user.role === 'Admin') return next();
    return res.status(403).json({ message: 'Access denied. Admin or Super Admin only.' });
};
