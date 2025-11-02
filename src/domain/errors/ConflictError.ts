/**
 * CONFLICT ERROR
 * 
 * Se lanza cuando hay un conflicto con el estado actual del sistema.
 * 
 * Ejemplo: Intentar crear un cliente con un email que ya existe,
 * reservar un asiento ya ocupado, etc.
 */

import { DomainError } from './DomainError';

export class ConflictError extends DomainError {
  constructor(
    entityName: string,
    conflictReason: string,
    context?: Record<string, unknown>
  ) {
    super(
      `${entityName} conflict: ${conflictReason}`,
      { ...context, entityName, conflictReason }
    );
  }
}

/**
 * Ejemplo de uso:
 * 
 * throw new ConflictError(
 *   'Customer',
 *   'Email already exists',
 *   { email: 'user@example.com' }
 * );
 */