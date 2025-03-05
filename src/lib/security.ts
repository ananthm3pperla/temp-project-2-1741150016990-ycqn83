import DOMPurify from 'dompurify';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';

// Input Sanitization
export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [], // No attributes allowed
  });
};

// Input Validation Schemas
export const emailSchema = z
  .string()
  .email()
  .transform((email) => sanitizeInput(email.toLowerCase()));

export const nameSchema = z
  .string()
  .min(2)
  .max(100)
  .regex(/^[a-zA-Z\s\-']+$/)
  .transform(sanitizeInput);

export const searchQuerySchema = z
  .string()
  .max(100)
  .transform(sanitizeInput);

export const feedbackSchema = z.object({
  score: z.number().int().min(1).max(5),
  text: z.string().max(1000).transform(sanitizeInput),
});

// CSRF Protection
export const generateCSRFToken = (): string => {
  return crypto.randomUUID();
};

export const validateCSRFToken = (token: string, storedToken: string): boolean => {
  if (!token || !storedToken) return false;
  return crypto.timingSafeEqual(
    Buffer.from(token),
    Buffer.from(storedToken)
  );
};

// Rate Limiting
export const createRateLimiter = (
  windowMs: number = 15 * 60 * 1000, // 15 minutes
  max: number = 100 // limit each IP to 100 requests per windowMs
) => {
  return rateLimit({
    windowMs,
    max,
    message: 'Too many requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// XSS Protection Headers
export const securityHeaders = {
  'Content-Security-Policy': 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' https: data:; " +
    "font-src 'self'; " +
    "connect-src 'self' https://*.supabase.co",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};