import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';

import productRouter from './routes/product.route';
import userRouter from './routes/user.route';
import cartRouter from './routes/cart.route';
import wishlistRouter from './routes/wishlist.route';

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

app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/cart', cartRouter);
app.use('/api/wishlist', wishlistRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
