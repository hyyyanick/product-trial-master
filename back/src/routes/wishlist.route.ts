import { Response, Router } from "express";
import authMiddleware from "../middlewares/auth";
import User from "../models/user";
import Product from "../models/product";

const router = Router();

router.get('/', authMiddleware.auth , async (req: any, res: Response) => {
    try {
      const user = await User.findById(req.user._id).populate('wishlist');
      if (!user) {
        res.status(400).json({ message: 'User not found' });
      }
      res.json(user?.wishlist);
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
      if (user?.wishlist.includes(productId)) {
        res.status(400).json({ message: 'Product already in wishlist' });
        throw new Error('Product already in wishlist');
      }

      user?.wishlist.push(productId);
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
      if (!user?.wishlist.includes(productId)) {
        res.status(400).json({ message: 'Product not in wishlist' });
      }

      const product = await Product.findById(productId);
      if (!product) {
        res.status(400).json({ message: 'Product not found' });
      }

      if (user && Array.isArray(user.wishlist)) {
        user.wishlist = user.wishlist.filter((id: string) => id.toString() !== productId);
        await user.save();
      }

      await user?.save();
      res.json(user?.wishlist);

    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
});

export default router;