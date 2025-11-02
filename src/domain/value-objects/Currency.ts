/**
 * VALUE OBJECT: Currency
 * 
 * En Clean Architecture, un Value Object es un objeto inmutable que se define
 * por sus atributos, no por una identidad única. Dos value objects son iguales
 * si todos sus atributos son iguales.
 * 
 * Características de un Value Object:
 * - Inmutable: Una vez creado, no puede cambiar
 * - Sin identidad: Se compara por valor, no por referencia
 * - Auto-validación: Garantiza que siempre está en un estado válido
 * - Lógica de dominio: Encapsula reglas de negocio relacionadas con ese concepto
 */

export type Currency = "USD" | "EUR" | "GBP" | "JPY";

export const VALID_CURRENCIES: readonly Currency[] = ["USD", "EUR", "GBP", "JPY"] as const;

export function isCurrency(value: string): value is Currency {
  return VALID_CURRENCIES.includes(value as Currency);
}

export function assertCurrency(value: string): asserts value is Currency {
  if (!isCurrency(value)) {
    throw new Error(`Invalid currency: ${value}. Valid currencies are: ${VALID_CURRENCIES.join(', ')}`);
  }
}

