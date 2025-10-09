import { Request, Response, NextFunction } from 'express';

// Extend Request type to include session info
export interface AuthenticatedRequest extends Request {
  session?: {
    username: string;
    role: string;
    createdAt: number;
  };
}

// Simple map to store active sessions
export const sessions = new Map<string, {
  username: string;
  role: string;
  createdAt: number;
}>();

export function auth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;

  // TEMP: bypass auth in dev when using demo-token
  if (token === 'demo-token') {
    (req as AuthenticatedRequest).session = {
      username: 'demo@admin.com',
      role: 'ADMIN',
      createdAt: Date.now()
    };
    next();
    return;
  }

  if (!token || !sessions.has(token)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  // Add session info to request
  const session = sessions.get(token);
  (req as AuthenticatedRequest).session = session;

  next();
}