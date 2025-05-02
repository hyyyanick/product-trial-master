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

router.post('/:productId', authMiddleware.auth, async (req: any, res: Response) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    if (!product) {
      res.status(400).json({ message: 'Product not found' });
    }

    const result = await User.updateOne(
      { _id: req.user._id },
      { $addToSet: { wishlist: productId } }
    );

    if (result.matchedCount === 0) {
      res.status(400).json({ message: 'User not found' });
    }

    const updatedUser = await User.findById(req.user._id).populate('wishlist');
    res.json(updatedUser?.wishlist);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:productId', authMiddleware.auth , async (req: any, res: Response) => {
    try {
      const productId = req.params.productId;

      const product = await Product.findById(productId);
      if (!product) {
        res.status(400).json({ message: 'Product not found' });
      }

      const result = await User.updateOne(
        { _id: req.user._id },
        { $pull: { wishlist: productId } 
      });

      if (result.matchedCount === 0) {
        res.status(400).json({ message: 'User not found' });
      }

      const updatedUser = await User.findById(req.user._id).populate('wishlist');
      res.json(updatedUser?.wishlist);

    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
});

export default router;