/**
 * INVALID STATE ERROR
 * 
 * Se lanza cuando una entidad intenta realizar una transición de estado inválida.
 * 
 * Ejemplo: Intentar enviar un pedido que no está confirmado,
 * o cancelar un pedido ya entregado.
 */

import { DomainError } from './DomainError';

export class InvalidStateError extends DomainError {
  constructor(
    entityName: string,
    currentState: string,
    attemptedAction: string,
    allowedStates?: string[]
  ) {
    const message = allowedStates
      ? `Cannot ${attemptedAction} ${entityName} in state '${currentState}'. Allowed states: ${allowedStates.join(', ')}`
      : `Cannot ${attemptedAction} ${entityName} in state '${currentState}'`;

    super(message, {
      entityName,
      currentState,
      attemptedAction,
      allowedStates,
    });
  }
}

/**
 * Ejemplo de uso:
 * 
 * throw new InvalidStateError(
 *   'Order',
 *   'DELIVERED',
 *   'cancel',
 *   ['PENDING', 'CONFIRMED']
 * );
 * 
 * // Output: "Cannot cancel Order in state 'DELIVERED'. Allowed states: PENDING, CONFIRMED"
 */