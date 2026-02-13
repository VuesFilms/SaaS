import type { Response, NextFunction } from 'express';
import { hasPermission, type Permission } from '@film/shared';
import type { AuthRequest } from './auth.js';

export function requirePermission(permission: Permission) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!hasPermission(user.role, permission)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    next();
  };
}
