/**
 * VALUE OBJECT: Email
 * 
 * Representa una dirección de correo electrónico válida.
 * Ejemplo perfecto de Value Object que encapsula validación y lógica de dominio.
 */

import { ValidationError } from '../errors';

export class Email {
  private constructor(readonly value: string) {}

  static create(value: string): Email {
    const trimmed = value.trim().toLowerCase();

    if (!trimmed) {
      throw ValidationError.single(
        'Email',
        'value',
        'Email cannot be empty'
      );
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      throw ValidationError.single(
        'Email',
        'value',
        'Invalid email format',
        value
      );
    }

    return new Email(trimmed);
  }

  getDomain(): string {
    return this.value.split('@')[1] || '';
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}