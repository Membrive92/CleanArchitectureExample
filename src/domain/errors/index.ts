/**
 * DOMAIN ERRORS - Índice de exportación
 * 
 * Centraliza todos los errores de dominio para facilitar las importaciones.
 * 
 * Uso:
 * import { ValidationError, InvalidStateError } from '@domain/errors';
 */

export { DomainError } from './DomainError';
export { InvalidStateError } from './InvalidStateError';
export { ValidationError, type ValidationFailure } from './ValidationError';
export { BusinessRuleViolationError } from './BusinessRuleViolationError';
export { NotFoundError } from './NotFoundError';
export { ConflictError } from './ConflictError';
