import express from 'express';
import formRoutes from './routes/formRoutes';
import approvalRoutes from './routes/approvalRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', formRoutes);
app.use('/', approvalRoutes);
app.use(errorHandler);

export default app;