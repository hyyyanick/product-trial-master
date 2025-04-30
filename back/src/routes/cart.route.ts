import { Response, Router } from "express";
import authMiddleware from "../middlewares/auth";
import User from "../models/user";
import Product from "../models/product";

const router = Router();

router.get('/', authMiddleware.auth , async (req: any, res: Response) => {
    try {
      const user = await User.findById(req.user._id).populate('cart.product');
      if (!user) {
        res.status(400).json({ message: 'User not found' });
      }
      res.json(user?.cart);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
});

router.post('/:productId', authMiddleware.auth , async (req: any, res: Response) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        res.status(400).json({ message: 'User not found' });
      }
      const productId = req.params.productId;

      const product = await Product.findById(productId);
      if (!product) {
        res.status(400).json({ message: 'Product not found' });
        throw new Error('Product not found');
      }

      const existingItem = user?.cart.find(item => item.product.toString() === productId);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        user?.cart.push({product: productId});
      }

      await user?.save();
      res.json(true);

    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/:productId', authMiddleware.auth , async (req: any, res: Response) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        res.status(400).json({ message: 'User not found' });
      }
      const productId = req.params.productId;
      const isInCart = user?.cart.some(item => item.product._id.toString() === productId);
      if (!isInCart) {
        res.status(400).json({ message: 'Product not in cart' });
      }

      const product = await Product.findById(productId);
      if (!product) {
        res.status(400).json({ message: 'Product not found' });
      }

      if (user && user.cart) {
        user.cart = user.cart.filter((item) => item.product._id.toString() !== productId);
      }
  
      await user?.save();
      res.json(user?.cart);

    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
});

router.patch('/:productId', authMiddleware.auth , async (req: any, res: Response) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        res.status(400).json({ message: 'User not found' });
      }
      const productId = req.params.productId;
      const quantity = req.body.quantity;

      const product = await Product.findById(productId);
      if (!product) {
        res.status(400).json({ message: 'Product not found' });
      }

      const isInCart = user?.cart.some(item => item.product._id.toString() === productId);
      if (!isInCart) {
        res.status(400).json({ message: 'Product not in cart' });
      }

      if (user && user.cart) {
        user.cart.forEach((item) => {
          if (item.product._id.toString() === productId) {
            item.quantity = quantity;
          }
        });
      }
  
      await user?.save();
      res.json(user?.cart);

    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
});

export default router;