import { describe, it, expect } from 'vitest';
import { Price } from '../../../src/domain/value-objects/Price';
import { ValidationError, BusinessRuleViolationError } from '../../../src/domain/errors';

describe('Price Value Object', () => {
  describe('Creation', () => {
    it('should create a valid price', () => {
      const price = Price.create(10.99, 'EUR');

      expect(price.amount).toBe(10.99);
      expect(price.currency).toBe('EUR');
    });

    it('should round to 2 decimal places', () => {
      const price = Price.create(10.999, 'USD');

      expect(price.amount).toBe(11);
    });

    it('should throw ValidationError for negative amount', () => {
      expect(() => Price.create(-10, 'EUR'))
        .toThrow(ValidationError);
    });

    it('should throw ValidationError for NaN', () => {
      expect(() => Price.create(NaN, 'EUR'))
        .toThrow(ValidationError);
    });

    it('should throw ValidationError for Infinity', () => {
      expect(() => Price.create(Infinity, 'EUR'))
        .toThrow(ValidationError);
    });

    it('should accept zero as valid amount', () => {
      const price = Price.create(0, 'USD');

      expect(price.amount).toBe(0);
    });
  });

  describe('Arithmetic Operations', () => {
    it('should add two prices with same currency', () => {
      const price1 = Price.create(10.50, 'EUR');
      const price2 = Price.create(5.25, 'EUR');

      const result = price1.add(price2);

      expect(result.amount).toBe(15.75);
      expect(result.currency).toBe('EUR');
    });

    it('should throw BusinessRuleViolationError when adding different currencies', () => {
      const price1 = Price.create(10, 'EUR');
      const price2 = Price.create(10, 'USD');

      expect(() => price1.add(price2))
        .toThrow(BusinessRuleViolationError);
    });

    it('should multiply price by quantity', () => {
      const price = Price.create(10.50, 'USD');

      const result = price.multiply(3);

      expect(result.amount).toBe(31.5);
      expect(result.currency).toBe('USD');
    });

    it('should throw ValidationError for negative quantity', () => {
      const price = Price.create(10, 'EUR');

      expect(() => price.multiply(-1))
        .toThrow(ValidationError);
    });

    it('should throw ValidationError for non-integer quantity', () => {
      const price = Price.create(10, 'EUR');

      expect(() => price.multiply(2.5))
        .toThrow(ValidationError);
    });

    it('should multiply by zero', () => {
      const price = Price.create(10, 'EUR');

      const result = price.multiply(0);

      expect(result.amount).toBe(0);
    });
  });

  describe('Equality', () => {
    it('should be equal when amount and currency match', () => {
      const price1 = Price.create(10.50, 'EUR');
      const price2 = Price.create(10.50, 'EUR');

      expect(price1.equals(price2)).toBe(true);
    });

    it('should not be equal when amounts differ', () => {
      const price1 = Price.create(10.50, 'EUR');
      const price2 = Price.create(10.51, 'EUR');

      expect(price1.equals(price2)).toBe(false);
    });

    it('should not be equal when currencies differ', () => {
      const price1 = Price.create(10, 'EUR');
      const price2 = Price.create(10, 'USD');

      expect(price1.equals(price2)).toBe(false);
    });
  });

  describe('Immutability', () => {
    it('should not modify original price when adding', () => {
      const price1 = Price.create(10, 'EUR');
      const price2 = Price.create(5, 'EUR');

      price1.add(price2);

      expect(price1.amount).toBe(10);
    });

    it('should not modify original price when multiplying', () => {
      const price = Price.create(10, 'EUR');

      price.multiply(3);

      expect(price.amount).toBe(10);
    });
  });

  describe('String representation', () => {
    it('should format price as string', () => {
      const price = Price.create(10.5, 'USD');

      expect(price.toString()).toBe('10.50 USD');
    });
  });
});