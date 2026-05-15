import express from 'express';
import { createSidebar, getSidebars, updateSidebar, deleteSidebar } from '../../controllers/add_by_admin/sidebarController.js';

const router = express.Router();

router.post('/', createSidebar);
router.get('/', getSidebars);
router.put('/:id', updateSidebar);
router.delete('/:id', deleteSidebar);

export default router;