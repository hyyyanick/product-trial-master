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

router.post('/:productId', authMiddleware.auth, async (req: any, res: Response) => {
  try {
    const productId = req.params.productId;

    const product = await Product.findById(productId);
    if (!product) {
      res.status(400).json({ message: 'Product not found' });
    }

    // Increment quantity if product already exists in cart
    const result = await User.updateOne(
      { _id: req.user._id, 'cart.product': productId },
      {
        $inc: { 'cart.$.quantity': 1 }
      }
    );

    // Add product to cart if it doesn't exist
    if (result.matchedCount === 0) {
      await User.updateOne(
        { _id: req.user._id },
        { $push: { cart: { product: productId, quantity: 1 } } }
      );
    }

    res.json({ success: true });
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

      const result =  await User.updateOne(
        { _id: req.user._id },
        { $pull: { cart: { product: productId } } 
      });

      if (result.matchedCount === 0) {
        res.status(400).json({ message: 'User not found' });
      }
  
      const updatedUser = await User.findById(req.user._id).populate('cart.product');
      res.json(updatedUser?.cart);

    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
});

router.patch('/:productId', authMiddleware.auth, async (req: any, res: Response) => {
  try {
    const productId = req.params.productId;
    const quantity = req.body.quantity;

    if (!quantity || quantity < 1) {
      res.status(400).json({ message: 'Invalid quantity' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(400).json({ message: 'Product not found' });
    }

    const result = await User.updateOne(
      { _id: req.user._id, 'cart.product': productId },
      { $set: { 'cart.$.quantity': quantity } }
    );

    if (result.matchedCount === 0) {
      res.status(400).json({ message: 'Cart product not found for user' });
    }

    const updatedUser = await User.findById(req.user._id).populate('cart.product');
    res.json(updatedUser?.cart);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;