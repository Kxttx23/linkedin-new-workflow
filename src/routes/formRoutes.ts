import { Router } from 'express';
import { showForm, handleSubmit } from '../controllers/formController';
const router = Router();
router.get('/form', showForm);
router.post('/submit', handleSubmit);
export default router;