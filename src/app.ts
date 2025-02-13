import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors  from 'cors';
import productRoutes from './routes/productRoutes';
import homeRoute from './routes/homeRoute';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => logger.info('Connected to MongoDB'))
  .catch((error) => logger.error('MongoDB connection error:', error));

app.use('/', homeRoute)
app.use('/api/products', productRoutes);

app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});

export default app;
