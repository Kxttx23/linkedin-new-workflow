import { Router } from 'express';
import { handleApproval } from '../controllers/approvalController';
const router = Router();
router.get('/approve', handleApproval);
export default router;