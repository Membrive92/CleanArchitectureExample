import { describe, it, expect } from 'vitest';
import { OrderId } from '../../../src/domain/value-objects/OrderId';
import { ValidationError } from '../../../src/domain/errors';

describe('OrderId Value Object', () => {
  describe('Creation with valid UUID', () => {
    it('should create OrderId with valid UUID v4', () => {
      const validUuid = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';
      const orderId = OrderId.create(validUuid);

      expect(orderId.value).toBe(validUuid);
    });

    it('should accept uppercase UUID', () => {
      const validUuid = 'A1B2C3D4-E5F6-4A7B-8C9D-0E1F2A3B4C5D';
      const orderId = OrderId.create(validUuid);

      expect(orderId.value).toBe(validUuid);
    });
  });

  describe('Validation', () => {
    it('should throw ValidationError for empty string', () => {
      expect(() => OrderId.create(''))
        .toThrow(ValidationError);
    });

    it('should throw ValidationError for whitespace only', () => {
      expect(() => OrderId.create('   '))
        .toThrow(ValidationError);
    });

    it('should throw ValidationError for invalid UUID format', () => {
      expect(() => OrderId.create('not-a-uuid'))
        .toThrow(ValidationError);
    });

    it('should throw ValidationError for UUID v1', () => {
      const uuidV1 = 'a1b2c3d4-e5f6-1a7b-8c9d-0e1f2a3b4c5d'; // version 1
      
      expect(() => OrderId.create(uuidV1))
        .toThrow(ValidationError);
    });

    it('should throw ValidationError for missing hyphens', () => {
      expect(() => OrderId.create('a1b2c3d4e5f64a7b8c9d0e1f2a3b4c5d'))
        .toThrow(ValidationError);
    });
  });

  describe('Generation', () => {
    it('should generate valid UUID v4', () => {
      const orderId = OrderId.generate();

      expect(orderId.value).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
    });

    it('should generate unique IDs', () => {
      const orderId1 = OrderId.generate();
      const orderId2 = OrderId.generate();

      expect(orderId1.value).not.toBe(orderId2.value);
    });
  });

  describe('Equality', () => {
    it('should be equal for same UUID', () => {
      const uuid = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';
      const orderId1 = OrderId.create(uuid);
      const orderId2 = OrderId.create(uuid);

      expect(orderId1.equals(orderId2)).toBe(true);
    });

    it('should not be equal for different UUIDs', () => {
      const uuid1 = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';
      const uuid2 = 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e';
      const orderId1 = OrderId.create(uuid1);
      const orderId2 = OrderId.create(uuid2);

      expect(orderId1.equals(orderId2)).toBe(false);
    });
  });

  describe('String representation', () => {
    it('should return UUID as string', () => {
      const uuid = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';
      const orderId = OrderId.create(uuid);

      expect(orderId.toString()).toBe(uuid);
    });
  });
});