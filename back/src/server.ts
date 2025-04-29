import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';

import productsRouter from './routes/products.route';
import usersRouter from './routes/users.route';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alten-ecommerce');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};
connectDB();

app.use('/api/products', productsRouter);
app.use('/api/users', usersRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
