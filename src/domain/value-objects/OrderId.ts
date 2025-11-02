/**
 * VALUE OBJECT: OrderId
 * 
 * Representa un identificador único de pedido.
 * Aunque es un "ID", es un Value Object porque:
 * - Es inmutable
 * - Se compara por valor
 * - No tiene comportamiento más allá de su representación
 * 
 * Nota: El OrderId es un Value Object, pero la Order (que lo usa) es una Entity.
 */

import { ValidationError } from '../errors';

export class OrderId {
  private constructor(readonly value: string) {}

  static create(value: string): OrderId {
    if (!value || value.trim().length === 0) {
      throw ValidationError.single(
        'OrderId',
        'value',
        'OrderId cannot be empty'
      );
    }

    // Validar formato: debe ser un UUID v4 o similar
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(value)) {
      throw ValidationError.single(
        'OrderId',
        'value',
        'Invalid OrderId format (must be UUID v4)',
        value
      );
    }

    return new OrderId(value);
  }

  static generate(): OrderId {
    // Generar un UUID v4 simple
    return OrderId.create(crypto.randomUUID());
  }

  equals(other: OrderId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}