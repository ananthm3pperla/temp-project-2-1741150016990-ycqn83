import { Request, Response, NextFunction } from 'express';
import { securityHeaders, createRateLimiter } from './security';

// Apply security headers
export const applySecurityHeaders = (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  next();
};

// CSRF Protection middleware
export const csrfProtection = (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  const token = req.headers['x-csrf-token'];
  const storedToken = req.session?.csrfToken;

  if (req.method !== 'GET' && !validateCSRFToken(token, storedToken)) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }

  next();
};

// Rate limiting middleware
export const apiLimiter = createRateLimiter();
export const authLimiter = createRateLimiter(15 * 60 * 1000, 5); // 5 attempts per 15 minutes

// Input validation middleware
export const validateInput = (schema: any) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validated = schema.parse(req.body);
    req.body = validated;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid input' });
  }
};