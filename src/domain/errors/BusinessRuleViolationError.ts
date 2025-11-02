/**
 * BUSINESS RULE VIOLATION ERROR
 * 
 * Se lanza cuando se viola una regla de negocio específica.
 * 
 * Ejemplo: Intentar aplicar un descuento mayor al 100%,
 * agregar más items de los permitidos, superar límites de crédito, etc.
 */

import { DomainError } from './DomainError';

export class BusinessRuleViolationError extends DomainError {
  public readonly ruleName: string;

  constructor(
    ruleName: string,
    message: string,
    context?: Record<string, unknown>
  ) {
    super(
      `Business rule '${ruleName}' violated: ${message}`,
      { ...context, ruleName }
    );
    
    this.ruleName = ruleName;
  }
}

/**
 * Ejemplo de uso:
 * 
 * throw new BusinessRuleViolationError(
 *   'MaxDiscountPercentage',
 *   'Discount cannot exceed 50%',
 *   { attemptedDiscount: 75, maxAllowed: 50 }
 * );
 */