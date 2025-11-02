import { describe, it, expect, beforeEach } from 'vitest';
import { Order, OrderItem } from '../../../src/domain/entities/Order';
import { Email } from '../../../src/domain/value-objects/Email';
import { Price } from '../../../src/domain/value-objects/Price';
import { OrderId } from '../../../src/domain/value-objects/OrderId';
import { InvalidStateError, ValidationError } from '../../../src/domain/errors';

describe('Order Entity', () => {
  let customerEmail: Email;
  let sampleItems: OrderItem[];

  beforeEach(() => {
    customerEmail = Email.create('customer@example.com');
    sampleItems = [
      {
        productId: 'prod-1',
        productName: 'Product 1',
        quantity: 2,
        unitPrice: Price.create(10, 'EUR')
      },
      {
        productId: 'prod-2',
        productName: 'Product 2',
        quantity: 1,
        unitPrice: Price.create(20, 'EUR')
      }
    ];
  });

  describe('Creation', () => {
    it('should create a new order', () => {
      const order = Order.create(customerEmail, sampleItems);

      expect(order.customerEmail).toBe(customerEmail);
      expect(order.items).toHaveLength(2);
      expect(order.status).toBe('PENDING');
      expect(order.createdAt).toBeInstanceOf(Date);
    });

    it('should generate a unique ID', () => {
      const order1 = Order.create(customerEmail, sampleItems);
      const order2 = Order.create(customerEmail, sampleItems);

      expect(order1.id.equals(order2.id)).toBe(false);
    });

    it('should throw ValidationError for empty items', () => {
      expect(() => Order.create(customerEmail, []))
        .toThrow(ValidationError);
    });

    it('should create defensive copy of items', () => {
      const items = [...sampleItems];
      const order = Order.create(customerEmail, items);

      items.push({
        productId: 'prod-3',
        productName: 'Product 3',
        quantity: 1,
        unitPrice: Price.create(30, 'EUR')
      });

      expect(order.items).toHaveLength(2);
    });
  });

  describe('Reconstitution', () => {
    it('should reconstitute an existing order', () => {
      const orderId = OrderId.generate();
      const createdAt = new Date('2024-01-01');

      const order = Order.reconstitute(
        orderId,
        customerEmail,
        sampleItems,
        'CONFIRMED',
        createdAt
      );

      expect(order.id).toBe(orderId);
      expect(order.status).toBe('CONFIRMED');
      expect(order.createdAt).toBe(createdAt);
    });
  });

  describe('Total calculation', () => {
    it('should calculate total correctly', () => {
      const order = Order.create(customerEmail, sampleItems);

      const total = order.calculateTotal();

      expect(total.amount).toBe(40); // (2 * 10) + (1 * 20)
      expect(total.currency).toBe('EUR');
    });

    it('should handle single item', () => {
      const items: OrderItem[] = [{
        productId: 'prod-1',
        productName: 'Product 1',
        quantity: 3,
        unitPrice: Price.create(15.50, 'USD')
      }];

      const order = Order.create(customerEmail, items);
      const total = order.calculateTotal();

      expect(total.amount).toBe(46.5);
    });
  });

  describe('State transitions', () => {
    it('should confirm pending order', () => {
      const order = Order.create(customerEmail, sampleItems);

      order.confirm();

      expect(order.status).toBe('CONFIRMED');
    });

    it('should not confirm already confirmed order', () => {
      const order = Order.create(customerEmail, sampleItems);
      order.confirm();

      expect(() => order.confirm())
        .toThrow(InvalidStateError);
    });

    it('should ship confirmed order', () => {
      const order = Order.create(customerEmail, sampleItems);
      order.confirm();

      order.ship();

      expect(order.status).toBe('SHIPPED');
    });

    it('should not ship pending order', () => {
      const order = Order.create(customerEmail, sampleItems);

      expect(() => order.ship())
        .toThrow(InvalidStateError);
    });

    it('should deliver shipped order', () => {
      const order = Order.create(customerEmail, sampleItems);
      order.confirm();
      order.ship();

      order.deliver();

      expect(order.status).toBe('DELIVERED');
    });

    it('should not deliver confirmed order', () => {
      const order = Order.create(customerEmail, sampleItems);
      order.confirm();

      expect(() => order.deliver())
        .toThrow(InvalidStateError);
    });

    it('should cancel pending order', () => {
      const order = Order.create(customerEmail, sampleItems);

      order.cancel();

      expect(order.status).toBe('CANCELLED');
    });

    it('should cancel confirmed order', () => {
      const order = Order.create(customerEmail, sampleItems);
      order.confirm();

      order.cancel();

      expect(order.status).toBe('CANCELLED');
    });

    it('should not cancel delivered order', () => {
      const order = Order.create(customerEmail, sampleItems);
      order.confirm();
      order.ship();
      order.deliver();

      expect(() => order.cancel())
        .toThrow(InvalidStateError);
    });

    it('should not cancel already cancelled order', () => {
      const order = Order.create(customerEmail, sampleItems);
      order.cancel();

      expect(() => order.cancel())
        .toThrow(InvalidStateError);
    });
  });

  describe('Adding items', () => {
    it('should add new item to pending order', () => {
      const order = Order.create(customerEmail, sampleItems);
      const newItem: OrderItem = {
        productId: 'prod-3',
        productName: 'Product 3',
        quantity: 1,
        unitPrice: Price.create(15, 'EUR')
      };

      order.addItem(newItem);

      expect(order.items).toHaveLength(3);
    });

    it('should increment quantity if product already exists', () => {
      const order = Order.create(customerEmail, sampleItems);
      const duplicateItem: OrderItem = {
        productId: 'prod-1',
        productName: 'Product 1',
        quantity: 3,
        unitPrice: Price.create(10, 'EUR')
      };

      order.addItem(duplicateItem);

      expect(order.items).toHaveLength(2);
      const item = order.items.find(i => i.productId === 'prod-1');
      expect(item?.quantity).toBe(5); // 2 + 3
    });

    it('should not add items to confirmed order', () => {
      const order = Order.create(customerEmail, sampleItems);
      order.confirm();

      const newItem: OrderItem = {
        productId: 'prod-3',
        productName: 'Product 3',
        quantity: 1,
        unitPrice: Price.create(15, 'EUR')
      };

      expect(() => order.addItem(newItem))
        .toThrow(InvalidStateError);
    });
  });

  describe('Equality', () => {
    it('should be equal for same ID', () => {
      const orderId = OrderId.generate();
      const order1 = Order.reconstitute(
        orderId,
        customerEmail,
        sampleItems,
        'PENDING',
        new Date()
      );
      const order2 = Order.reconstitute(
        orderId,
        customerEmail,
        sampleItems,
        'CONFIRMED',
        new Date()
      );

      expect(order1.equals(order2)).toBe(true);
    });

    it('should not be equal for different IDs', () => {
      const order1 = Order.create(customerEmail, sampleItems);
      const order2 = Order.create(customerEmail, sampleItems);

      expect(order1.equals(order2)).toBe(false);
    });
  });

  describe('Immutability of items getter', () => {
    it('should return defensive copy of items', () => {
      const order = Order.create(customerEmail, sampleItems);
      const items = order.items;

      // Try to modify returned array (TypeScript won't allow push, but we can try with type assertion)
      expect(() => {
        (items as OrderItem[]).push({
          productId: 'prod-3',
          productName: 'Product 3',
          quantity: 1,
          unitPrice: Price.create(30, 'EUR')
        });
      }).not.toThrow();

      // Original order should still have 2 items
      expect(order.items).toHaveLength(2);
    });
  });

  describe('String representation', () => {
    it('should format order as string', () => {
      const order = Order.create(customerEmail, sampleItems);

      const str = order.toString();

      expect(str).toContain('Order');
      expect(str).toContain('PENDING');
      expect(str).toContain('40.00 EUR');
    });
  });
});