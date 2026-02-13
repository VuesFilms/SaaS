import { Router, type Response } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { env } from '../config.js';
import { requireAuth, type AuthRequest } from '../middleware/auth.js';

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

authRouter.post('/api/auth/login', (req: AuthRequest, res: Response) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ error: 'Validation failed', issues: result.error.issues });
    return;
  }

  const { email } = result.data;

  const mockUser = {
    id: 'usr_mock_001',
    email,
    name: 'Mock User',
    role: 'owner' as const,
  };

  const token = jwt.sign(mockUser, env.JWT_SECRET, { expiresIn: '24h' });

  res.json({ token, user: mockUser });
});

authRouter.post('/api/auth/register', (req: AuthRequest, res: Response) => {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ error: 'Validation failed', issues: result.error.issues });
    return;
  }

  const { name, email } = result.data;

  const mockUser = {
    id: 'usr_mock_002',
    email,
    name,
    role: 'owner' as const,
  };

  const token = jwt.sign(mockUser, env.JWT_SECRET, { expiresIn: '24h' });

  res.status(201).json({ user: mockUser, token });
});

authRouter.get('/api/auth/me', requireAuth, (req: AuthRequest, res: Response) => {
  res.json({ user: req.user });
});
