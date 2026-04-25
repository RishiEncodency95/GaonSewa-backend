import express from 'express';
import {
    getAllUsers,
    getUsersByBranch,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from '../controllers/userController.js';
import { protect, isAdminOrSuperAdmin, isSuperAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All user routes need auth

// Get users by branch (SuperAdmin or Admin)
router.get('/branch/:branchId', isAdminOrSuperAdmin, getUsersByBranch);

// CRUD
router.route('/')
    .get(isAdminOrSuperAdmin, getAllUsers)
    .post(isAdminOrSuperAdmin, createUser);

router.route('/:id')
    .get(isAdminOrSuperAdmin, getUserById)
    .patch(isAdminOrSuperAdmin, updateUser)
    .delete(isSuperAdmin, deleteUser);

export default router;
