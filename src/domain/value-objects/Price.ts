/**
 * VALUE OBJECT: Price
 * 
 * Representa un precio monetario. Es inmutable y contiene lógica de negocio
 * relacionada con precios (suma, multiplicación, comparación).
 * 
 * Un Value Object NUNCA tiene identidad propia. Dos precios de 10 EUR son
 * exactamente el mismo concepto, no importa dónde o cuándo fueron creados.
 */

import { Currency } from "./Currency";
import { ValidationError, BusinessRuleViolationError } from '../errors';

export class Price {
  private constructor(
    readonly amount: number,
    readonly currency: Currency
  ) {}

  /**
   * Factory method: Crea un Price validando que los datos son correctos.
   * Los Value Objects deben ser siempre válidos desde su creación.
   */
  static create(amount: number, currency: Currency): Price {
    if (!Number.isFinite(amount) || amount < 0) {
      throw ValidationError.single(
        'Price',
        'amount',
        'Must be a positive finite number',
        amount
      );
    }
    
    // Redondear a 2 decimales para evitar problemas de precisión
    const rounded = Math.round(amount * 100) / 100;
    
    return new Price(rounded, currency);
  }

  /**
   * Suma dos precios. Solo se pueden sumar precios de la misma moneda.
   * Retorna un NUEVO Price (inmutabilidad).
   */
  add(other: Price): Price {
    if (this.currency !== other.currency) {
      throw new BusinessRuleViolationError(
        'CurrencyMatch',
        `Cannot add prices with different currencies`,
        { 
          currency1: this.currency,
          currency2: other.currency
        }
      );
    }
    return Price.create(this.amount + other.amount, this.currency);
  }

  /**
   * Multiplica el precio por una cantidad.
   * Retorna un NUEVO Price (inmutabilidad).
   */
  multiply(quantity: number): Price {
    if (!Number.isInteger(quantity) || quantity < 0) {
      throw ValidationError.single(
        'Price',
        'quantity',
        'Must be a positive integer',
        quantity
      );
    }
    return Price.create(this.amount * quantity, this.currency);
  }

  /**
   * Compara dos precios por valor.
   * En Value Objects, la igualdad se basa en los atributos, no en la referencia.
   */
  equals(other: Price): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }

  /**
   * Representación en string para debug/logging
   */
  toString(): string {
    return `${this.amount.toFixed(2)} ${this.currency}`;
  }
}
