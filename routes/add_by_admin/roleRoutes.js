import express from 'express';
import { createRole, getRoles, updateRole, deleteRole } from '../../controllers/add_by_admin/roleController.js';

const router = express.Router();

router.post('/', createRole);
router.get('/', getRoles);
router.put('/:id', updateRole);
router.delete('/:id', deleteRole);

export default router;