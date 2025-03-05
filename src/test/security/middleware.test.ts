import { describe, it, expect, vi } from 'vitest';
import { 
  applySecurityHeaders,
  csrfProtection,
  validateInput
} from '../../lib/middleware';
import { z } from 'zod';

describe('Security Middleware', () => {
  describe('Security Headers', () => {
    it('applies security headers', () => {
      const req = {};
      const res = { setHeader: vi.fn() };
      const next = vi.fn();

      applySecurityHeaders(req, res, next);

      expect(res.setHeader).toHaveBeenCalledWith(
        'Content-Security-Policy',
        expect.any(String)
      );
      expect(res.setHeader).toHaveBeenCalledWith(
        'X-XSS-Protection',
        '1; mode=block'
      );
      expect(next).toHaveBeenCalled();
    });
  });

  describe('CSRF Protection', () => {
    it('blocks requests without CSRF token', () => {
      const req = {
        method: 'POST',
        headers: {},
        session: { csrfToken: 'valid-token' }
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };
      const next = vi.fn();

      csrfProtection(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid CSRF token' });
      expect(next).not.toHaveBeenCalled();
    });

    it('allows GET requests without token', () => {
      const req = {
        method: 'GET',
        headers: {},
        session: {}
      };
      const res = {};
      const next = vi.fn();

      csrfProtection(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('Input Validation', () => {
    it('validates input against schema', () => {
      const schema = z.object({
        email: z.string().email()
      });

      const req = {
        body: { email: 'test@example.com' }
      };
      const res = {};
      const next = vi.fn();

      validateInput(schema)(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('rejects invalid input', () => {
      const schema = z.object({
        email: z.string().email()
      });

      const req = {
        body: { email: 'invalid' }
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };
      const next = vi.fn();

      validateInput(schema)(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid input' });
      expect(next).not.toHaveBeenCalled();
    });
  });
});