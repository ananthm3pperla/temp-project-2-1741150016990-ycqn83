import { describe, it, expect, vi } from 'vitest';
import { 
  sanitizeInput,
  emailSchema,
  nameSchema,
  searchQuerySchema,
  feedbackSchema,
  generateCSRFToken,
  validateCSRFToken
} from '../../lib/security';

describe('Security Utils', () => {
  describe('Input Sanitization', () => {
    it('removes HTML tags', () => {
      const input = '<script>alert("xss")</script>Hello';
      expect(sanitizeInput(input)).toBe('Hello');
    });

    it('removes dangerous attributes', () => {
      const input = '<div onclick="alert(1)">Click me</div>';
      expect(sanitizeInput(input)).toBe('Click me');
    });

    it('preserves safe text', () => {
      const input = 'Hello, World!';
      expect(sanitizeInput(input)).toBe('Hello, World!');
    });
  });

  describe('Schema Validation', () => {
    it('validates email format', () => {
      expect(() => emailSchema.parse('invalid')).toThrow();
      expect(emailSchema.parse('test@example.com')).toBe('test@example.com');
    });

    it('validates name format', () => {
      expect(() => nameSchema.parse('a')).toThrow();
      expect(() => nameSchema.parse('123')).toThrow();
      expect(nameSchema.parse('John Doe')).toBe('John Doe');
    });

    it('validates search query', () => {
      const longQuery = 'a'.repeat(101);
      expect(() => searchQuerySchema.parse(longQuery)).toThrow();
      expect(searchQuerySchema.parse('search term')).toBe('search term');
    });

    it('validates feedback', () => {
      expect(() => feedbackSchema.parse({ score: 6, text: '' })).toThrow();
      expect(feedbackSchema.parse({ score: 5, text: 'Great!' })).toEqual({
        score: 5,
        text: 'Great!'
      });
    });
  });

  describe('CSRF Protection', () => {
    it('generates valid CSRF tokens', () => {
      const token = generateCSRFToken();
      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
    });

    it('validates CSRF tokens', () => {
      const token = generateCSRFToken();
      expect(validateCSRFToken(token, token)).toBe(true);
      expect(validateCSRFToken('invalid', token)).toBe(false);
      expect(validateCSRFToken(token, 'invalid')).toBe(false);
    });
  });
});