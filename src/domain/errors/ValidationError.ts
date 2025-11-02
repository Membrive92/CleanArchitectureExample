/**
 * VALIDATION ERROR
 * 
 * Se lanza cuando los datos proporcionados no cumplen con las reglas de validación.
 * 
 * Ejemplo: Email inválido, precio negativo, nombre vacío, etc.
 */

import { DomainError } from './DomainError';

export interface ValidationFailure {
  field: string;
  message: string;
  value?: unknown;
}

export class ValidationError extends DomainError {
  public readonly failures: ValidationFailure[];

  constructor(
    entityName: string,
    failures: ValidationFailure[]
  ) {
    const failureMessages = failures
      .map(f => `${f.field}: ${f.message}`)
      .join('; ');

    super(
      `Validation failed for ${entityName}: ${failureMessages}`,
      { entityName, failures }
    );

    this.failures = failures;
  }

  /**
   * Crea un ValidationError para una única validación fallida
   */
  static single(
    entityName: string,
    field: string,
    message: string,
    value?: unknown
  ): ValidationError {
    return new ValidationError(entityName, [{ field, message, value }]);
  }
}

/**
 * Ejemplo de uso:
 * 
 * // Error simple
 * throw ValidationError.single('Email', 'value', 'Invalid email format', 'not-an-email');
 * 
 * // Múltiples errores
 * throw new ValidationError('Customer', [
 *   { field: 'name', message: 'Cannot be empty' },
 *   { field: 'email', message: 'Invalid format', value: 'bad-email' }
 * ]);
 */