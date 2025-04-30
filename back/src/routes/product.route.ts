import { Request, Response, Router } from 'express';
import Product from '../models/product';
import authMiddleware from '../middlewares/auth';

const router= Router();

// Create a new product
router.post('/',
    authMiddleware.auth,
    authMiddleware.isAdmin,
    async (req: Request, res: Response) => {
    try {
        const product = req.body;
        const productCreated = await Product.create(product);
        productCreated.save();
        res.status(201).json(productCreated);
    } catch (error) {
        res.status(500).json({ error });
    }
});

// Get all products
router.get('/',
    authMiddleware.auth,
    async (req: Request, res: Response) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error });
    }
});

// Get a product by ID
router.get('/:id',
    authMiddleware.auth,
    async (req: Request, res: Response) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error });
    }
});

// Update a product by ID
router.patch('/:id',
    authMiddleware.auth,
    authMiddleware.isAdmin,
    async (req: Request, res: Response) => {
    try {
        const productId = req.params.id;
        const updates = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
        }
        const updatedProduct = await Product.findByIdAndUpdate(productId, updates, { new: true });
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error });
    }
});

// Delete a product by ID
router.delete('/:id',
    authMiddleware.auth,
    authMiddleware.isAdmin,
    async (req: Request, res: Response) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
        }
        await Product.findByIdAndDelete(productId);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error });
    }
});

export default router;