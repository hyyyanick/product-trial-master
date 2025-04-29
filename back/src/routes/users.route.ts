import { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import User from '../models/user';

const router = Router();

router.post('/account', [
    body('username').notEmpty().withMessage('Username is required'),
    body('firstname').notEmpty().withMessage('Firstname is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ], async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
      }
  
      const { username, firstname, email, password } = req.body;
  
      let user = await User.findOne({ email });
      if (user) {
        res.status(400).json({ message: 'User already exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      user = new User({ username, firstname, email, password: hashedPassword });
      await user.save();
  
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
});

router.post('/token', [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ], async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
      }
  
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        res.status(404).json({ message: 'User not found' });
      }

      const isMatch = await bcrypt.compare(password, (user as User).password);
      if (!isMatch) {
        res.status(401).json({ message: 'Invalid credentials' });
      }

      const secretKey = process.env.JWT_SECRET || 'my-secret-key';
      const token = jwt.sign({ id: user?._id }, secretKey as jwt.Secret, { expiresIn: '1h' });
      res.json({ 
        token, 
        user: {
          name: user?.username,
          email: user?.email
        }
      });

    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

export default router;