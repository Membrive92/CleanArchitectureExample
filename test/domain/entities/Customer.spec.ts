import { describe, it, expect } from 'vitest';
import { Customer, CustomerId } from '../../../src/domain/entities/Customer';
import { Email } from '../../../src/domain/value-objects/Email';
import { ValidationError, InvalidStateError } from '../../../src/domain/errors';

describe('Customer Entity', () => {
  describe('Creation', () => {
    it('should create a new customer', () => {
      const email = Email.create('john@example.com');
      const customer = Customer.create('John Doe', email);

      expect(customer.name).toBe('John Doe');
      expect(customer.email).toBe(email);
      expect(customer.isActive).toBe(true);
      expect(customer.createdAt).toBeInstanceOf(Date);
    });

    it('should trim customer name', () => {
      const email = Email.create('john@example.com');
      const customer = Customer.create('  John Doe  ', email);

      expect(customer.name).toBe('John Doe');
    });

    it('should generate unique ID', () => {
      const email = Email.create('john@example.com');
      const customer1 = Customer.create('John Doe', email);
      const customer2 = Customer.create('Jane Doe', email);

      expect(customer1.id.equals(customer2.id)).toBe(false);
    });

    it('should throw ValidationError for empty name', () => {
      const email = Email.create('john@example.com');

      expect(() => Customer.create('', email))
        .toThrow(ValidationError);
    });

    it('should throw ValidationError for whitespace-only name', () => {
      const email = Email.create('john@example.com');

      expect(() => Customer.create('   ', email))
        .toThrow(ValidationError);
    });
  });

  describe('Reconstitution', () => {
    it('should reconstitute an existing customer', () => {
      const customerId = CustomerId.generate();
      const email = Email.create('john@example.com');
      const createdAt = new Date('2024-01-01');

      const customer = Customer.reconstitute(
        customerId,
        'John Doe',
        email,
        false,
        createdAt
      );

      expect(customer.id).toBe(customerId);
      expect(customer.name).toBe('John Doe');
      expect(customer.isActive).toBe(false);
      expect(customer.createdAt).toBe(createdAt);
    });
  });

  describe('Name updates', () => {
    it('should update customer name', () => {
      const email = Email.create('john@example.com');
      const customer = Customer.create('John Doe', email);

      customer.updateName('John Smith');

      expect(customer.name).toBe('John Smith');
    });

    it('should trim updated name', () => {
      const email = Email.create('john@example.com');
      const customer = Customer.create('John Doe', email);

      customer.updateName('  John Smith  ');

      expect(customer.name).toBe('John Smith');
    });

    it('should throw ValidationError for empty name', () => {
      const email = Email.create('john@example.com');
      const customer = Customer.create('John Doe', email);

      expect(() => customer.updateName(''))
        .toThrow(ValidationError);
    });

    it('should throw ValidationError for whitespace-only name', () => {
      const email = Email.create('john@example.com');
      const customer = Customer.create('John Doe', email);

      expect(() => customer.updateName('   '))
        .toThrow(ValidationError);
    });
  });

  describe('Email updates', () => {
    it('should update customer email', () => {
      const email = Email.create('john@example.com');
      const customer = Customer.create('John Doe', email);
      const newEmail = Email.create('john.doe@example.com');

      customer.updateEmail(newEmail);

      expect(customer.email).toBe(newEmail);
    });
  });

  describe('Activation/Deactivation', () => {
    it('should deactivate active customer', () => {
      const email = Email.create('john@example.com');
      const customer = Customer.create('John Doe', email);

      customer.deactivate();

      expect(customer.isActive).toBe(false);
    });

    it('should throw InvalidStateError when deactivating inactive customer', () => {
      const email = Email.create('john@example.com');
      const customer = Customer.create('John Doe', email);
      customer.deactivate();

      expect(() => customer.deactivate())
        .toThrow(InvalidStateError);
    });

    it('should activate inactive customer', () => {
      const email = Email.create('john@example.com');
      const customer = Customer.create('John Doe', email);
      customer.deactivate();

      customer.activate();

      expect(customer.isActive).toBe(true);
    });

    it('should throw InvalidStateError when activating active customer', () => {
      const email = Email.create('john@example.com');
      const customer = Customer.create('John Doe', email);

      expect(() => customer.activate())
        .toThrow(InvalidStateError);
    });

    it('should allow multiple activation/deactivation cycles', () => {
      const email = Email.create('john@example.com');
      const customer = Customer.create('John Doe', email);

      customer.deactivate();
      customer.activate();
      customer.deactivate();

      expect(customer.isActive).toBe(false);
    });
  });

  describe('Equality', () => {
    it('should be equal for same ID', () => {
      const customerId = CustomerId.generate();
      const email = Email.create('john@example.com');
      
      const customer1 = Customer.reconstitute(
        customerId,
        'John Doe',
        email,
        true,
        new Date()
      );
      const customer2 = Customer.reconstitute(
        customerId,
        'Jane Doe',
        Email.create('jane@example.com'),
        false,
        new Date()
      );

      expect(customer1.equals(customer2)).toBe(true);
    });

    it('should not be equal for different IDs', () => {
      const email = Email.create('john@example.com');
      const customer1 = Customer.create('John Doe', email);
      const customer2 = Customer.create('John Doe', email);

      expect(customer1.equals(customer2)).toBe(false);
    });
  });

  describe('String representation', () => {
    it('should format customer as string', () => {
      const email = Email.create('john@example.com');
      const customer = Customer.create('John Doe', email);

      const str = customer.toString();

      expect(str).toContain('Customer');
      expect(str).toContain('John Doe');
      expect(str).toContain('john@example.com');
    });
  });
});