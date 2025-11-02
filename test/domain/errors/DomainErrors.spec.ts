import { describe, it, expect } from 'vitest';
import {
  DomainError,
  InvalidStateError,
  ValidationError,
  BusinessRuleViolationError,
  NotFoundError,
  ConflictError
} from '../../../src/domain/errors';

describe('Domain Errors', () => {
  describe('InvalidStateError', () => {
    it('should create error with entity, state, and action', () => {
      const error = new InvalidStateError('Order', 'DELIVERED', 'cancel');

      expect(error.message).toContain('Order');
      expect(error.message).toContain('DELIVERED');
      expect(error.message).toContain('cancel');
      expect(error.name).toBe('InvalidStateError');
      expect(error).toBeInstanceOf(DomainError);
      expect(error).toBeInstanceOf(Error);
    });

    it('should include allowed states in message', () => {
      const error = new InvalidStateError(
        'Order',
        'DELIVERED',
        'cancel',
        ['PENDING', 'CONFIRMED']
      );

      expect(error.message).toContain('PENDING');
      expect(error.message).toContain('CONFIRMED');
    });

    it('should have context information', () => {
      const error = new InvalidStateError('Order', 'DELIVERED', 'cancel');

      expect(error.context).toBeDefined();
      expect(error.context?.entityName).toBe('Order');
      expect(error.context?.currentState).toBe('DELIVERED');
      expect(error.context?.attemptedAction).toBe('cancel');
    });
  });

  describe('ValidationError', () => {
    it('should create single validation error', () => {
      const error = ValidationError.single(
        'Email',
        'value',
        'Invalid format',
        'not-an-email'
      );

      expect(error.message).toContain('Email');
      expect(error.message).toContain('value');
      expect(error.message).toContain('Invalid format');
      expect(error.failures).toHaveLength(1);
      expect(error.failures[0]?.field).toBe('value');
    });

    it('should create error with multiple failures', () => {
      const error = new ValidationError('Customer', [
        { field: 'name', message: 'Cannot be empty' },
        { field: 'email', message: 'Invalid format', value: 'bad@' }
      ]);

      expect(error.message).toContain('name');
      expect(error.message).toContain('email');
      expect(error.failures).toHaveLength(2);
    });

    it('should have context with failures', () => {
      const error = ValidationError.single('Price', 'amount', 'Must be positive');

      expect(error.context?.entityName).toBe('Price');
      expect(error.context?.failures).toBeDefined();
    });
  });

  describe('BusinessRuleViolationError', () => {
    it('should create error with rule name and message', () => {
      const error = new BusinessRuleViolationError(
        'MaxDiscount',
        'Discount cannot exceed 50%'
      );

      expect(error.message).toContain('MaxDiscount');
      expect(error.message).toContain('50%');
      expect(error.ruleName).toBe('MaxDiscount');
    });

    it('should include context information', () => {
      const error = new BusinessRuleViolationError(
        'MaxDiscount',
        'Discount cannot exceed 50%',
        { attempted: 75, max: 50 }
      );

      expect(error.context?.attempted).toBe(75);
      expect(error.context?.max).toBe(50);
      expect(error.context?.ruleName).toBe('MaxDiscount');
    });
  });

  describe('NotFoundError', () => {
    it('should create error with entity name and ID', () => {
      const error = new NotFoundError('Order', 'abc-123');

      expect(error.message).toContain('Order');
      expect(error.message).toContain('abc-123');
      expect(error.entityName).toBe('Order');
      expect(error.entityId).toBe('abc-123');
    });

    it('should have context information', () => {
      const error = new NotFoundError('Customer', 'cust-456');

      expect(error.context?.entityName).toBe('Customer');
      expect(error.context?.entityId).toBe('cust-456');
    });
  });

  describe('ConflictError', () => {
    it('should create error with entity and conflict reason', () => {
      const error = new ConflictError(
        'Customer',
        'Email already exists'
      );

      expect(error.message).toContain('Customer');
      expect(error.message).toContain('Email already exists');
    });

    it('should include context information', () => {
      const error = new ConflictError(
        'Customer',
        'Email already exists',
        { email: 'user@example.com' }
      );

      expect(error.context?.email).toBe('user@example.com');
      expect(error.context?.entityName).toBe('Customer');
    });
  });

  describe('DomainError base class', () => {
    it('should have timestamp', () => {
      const error = new InvalidStateError('Order', 'PENDING', 'ship');

      expect(error.timestamp).toBeInstanceOf(Date);
    });

    it('should serialize to JSON', () => {
      const error = new ValidationError('Email', [
        { field: 'value', message: 'Invalid format' }
      ]);

      const json = error.toJSON();

      expect(json.name).toBe('ValidationError');
      expect(json.message).toBeDefined();
      expect(json.timestamp).toBeDefined();
      expect(json.context).toBeDefined();
      expect(json.stack).toBeDefined();
    });

    it('should maintain error stack trace', () => {
      const error = new NotFoundError('Order', '123');

      expect(error.stack).toBeDefined();
      expect(error.stack).toContain('NotFoundError');
    });

    it('should be catchable as Error', () => {
      const throwError = () => {
        throw new InvalidStateError('Order', 'PENDING', 'ship');
      };

      expect(throwError).toThrow(Error);
    });

    it('should be identifiable by instanceof', () => {
      const error = new ValidationError('Email', [
        { field: 'value', message: 'Invalid' }
      ]);

      expect(error instanceof ValidationError).toBe(true);
      expect(error instanceof DomainError).toBe(true);
      expect(error instanceof Error).toBe(true);
      expect(error instanceof InvalidStateError).toBe(false);
    });
  });
});