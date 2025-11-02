import { describe, it, expect } from 'vitest';
import { Email } from '../../../src/domain/value-objects/Email';
import { ValidationError } from '../../../src/domain/errors';

describe('Email Value Object', () => {
  describe('Creation', () => {
    it('should create a valid email', () => {
      const email = Email.create('user@example.com');

      expect(email.value).toBe('user@example.com');
    });

    it('should trim whitespace', () => {
      const email = Email.create('  user@example.com  ');

      expect(email.value).toBe('user@example.com');
    });

    it('should convert to lowercase', () => {
      const email = Email.create('User@Example.COM');

      expect(email.value).toBe('user@example.com');
    });

    it('should throw ValidationError for empty email', () => {
      expect(() => Email.create(''))
        .toThrow(ValidationError);
    });

    it('should throw ValidationError for whitespace only', () => {
      expect(() => Email.create('   '))
        .toThrow(ValidationError);
    });

    it('should throw ValidationError for invalid format - no @', () => {
      expect(() => Email.create('userexample.com'))
        .toThrow(ValidationError);
    });

    it('should throw ValidationError for invalid format - no domain', () => {
      expect(() => Email.create('user@'))
        .toThrow(ValidationError);
    });

    it('should throw ValidationError for invalid format - no username', () => {
      expect(() => Email.create('@example.com'))
        .toThrow(ValidationError);
    });

    it('should throw ValidationError for invalid format - no TLD', () => {
      expect(() => Email.create('user@example'))
        .toThrow(ValidationError);
    });
  });

  describe('Domain extraction', () => {
    it('should extract domain from email', () => {
      const email = Email.create('user@example.com');

      expect(email.getDomain()).toBe('example.com');
    });

    it('should handle subdomain', () => {
      const email = Email.create('user@mail.example.com');

      expect(email.getDomain()).toBe('mail.example.com');
    });
  });

  describe('Equality', () => {
    it('should be equal for same email', () => {
      const email1 = Email.create('user@example.com');
      const email2 = Email.create('user@example.com');

      expect(email1.equals(email2)).toBe(true);
    });

    it('should be equal regardless of case', () => {
      const email1 = Email.create('User@Example.COM');
      const email2 = Email.create('user@example.com');

      expect(email1.equals(email2)).toBe(true);
    });

    it('should not be equal for different emails', () => {
      const email1 = Email.create('user1@example.com');
      const email2 = Email.create('user2@example.com');

      expect(email1.equals(email2)).toBe(false);
    });
  });

  describe('String representation', () => {
    it('should return email value as string', () => {
      const email = Email.create('user@example.com');

      expect(email.toString()).toBe('user@example.com');
    });
  });
});