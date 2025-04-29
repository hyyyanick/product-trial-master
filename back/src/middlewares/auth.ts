import { Response, NextFunction } from 'express';
import User from '../models/user';
import jwt, { JwtPayload } from 'jsonwebtoken';

const auth = async (req: any, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        throw new Error('Invalid token');
    }
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById((decoded as JwtPayload).id);

    if (!user) {
        throw new Error('User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentification Required' });
  }
};

const isAdmin = async (req: any, res: Response, next: NextFunction) => {
  try {
    if (req.user.email !== 'admin@admin.com') {
      throw new Error('Access denied. Admin privileges required.');
    }
    next();
  } catch (error) {
    res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
};

export default { auth, isAdmin };