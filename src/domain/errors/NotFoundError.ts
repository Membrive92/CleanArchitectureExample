/**
 * NOT FOUND ERROR
 * 
 * Se lanza cuando una entidad solicitada no existe.
 * 
 * Útil para distinguir entre "no existe" y "error de acceso".
 */

import { DomainError } from './DomainError';

export class NotFoundError extends DomainError {
  public readonly entityName: string;
  public readonly entityId: string;

  constructor(
    entityName: string,
    entityId: string
  ) {
    super(
      `${entityName} with id '${entityId}' not found`,
      { entityName, entityId }
    );

    this.entityName = entityName;
    this.entityId = entityId;
  }
}

/**
 * Ejemplo de uso:
 * 
 * throw new NotFoundError('Order', 'abc-123-def');
 * // Output: "Order with id 'abc-123-def' not found"
 */