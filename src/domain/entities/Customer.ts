/**
 * ENTITY: Customer
 * 
 * Otra ejemplo de Entity con identidad y ciclo de vida.
 * Un cliente puede cambiar su nombre, email, etc., pero sigue siendo
 * el mismo cliente porque su ID no cambia.
 */

import { Email } from '../value-objects/Email';
import { ValidationError, InvalidStateError } from '../errors';

export class CustomerId {
  private constructor(readonly value: string) {}

  static create(value: string): CustomerId {
    if (!value || value.trim().length === 0) {
      throw new Error('CustomerId cannot be empty');
    }
    return new CustomerId(value);
  }

  static generate(): CustomerId {
    return CustomerId.create(crypto.randomUUID());
  }

  equals(other: CustomerId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

export class Customer {
  private constructor(
    readonly id: CustomerId,
    private _name: string,
    private _email: Email,
    private _isActive: boolean,
    readonly createdAt: Date
  ) {}

  /**
   * Factory method para crear un nuevo cliente
   */
  static create(name: string, email: Email): Customer {
    if (!name || name.trim().length === 0) {
      throw ValidationError.single(
        'Customer',
        'name',
        'Customer name cannot be empty'
      );
    }

    return new Customer(
      CustomerId.generate(),
      name.trim(),
      email,
      true,
      new Date()
    );
  }

  /**
   * Factory method para reconstruir un cliente existente
   */
  static reconstitute(
    id: CustomerId,
    name: string,
    email: Email,
    isActive: boolean,
    createdAt: Date
  ): Customer {
    return new Customer(id, name, email, isActive, createdAt);
  }

  // Getters
  get name(): string {
    return this._name;
  }

  get email(): Email {
    return this._email;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  /**
   * LÓGICA DE DOMINIO: Actualizar el nombre del cliente
   */
  updateName(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw ValidationError.single(
        'Customer',
        'name',
        'Customer name cannot be empty'
      );
    }
    this._name = newName.trim();
  }

  /**
   * LÓGICA DE DOMINIO: Actualizar el email del cliente
   */
  updateEmail(newEmail: Email): void {
    this._email = newEmail;
  }

  /**
   * LÓGICA DE DOMINIO: Desactivar el cliente
   */
  deactivate(): void {
    if (!this._isActive) {
      throw new InvalidStateError(
        'Customer',
        'inactive',
        'deactivate'
      );
    }
    this._isActive = false;
  }

  /**
   * LÓGICA DE DOMINIO: Reactivar el cliente
   */
  activate(): void {
    if (this._isActive) {
      throw new InvalidStateError(
        'Customer',
        'active',
        'activate'
      );
    }
    this._isActive = true;
  }

  /**
   * Las Entities se comparan por ID
   */
  equals(other: Customer): boolean {
    return this.id.equals(other.id);
  }

  toString(): string {
    return `Customer ${this.id.toString()} - ${this._name} (${this._email.toString()})`;
  }
}