/**
 * ENTITY: Order
 * 
 * En Clean Architecture, una Entity (Entidad) es un objeto que tiene:
 * - IDENTIDAD ÚNICA: Se distingue por su ID, no por sus atributos
 * - CICLO DE VIDA: Puede cambiar de estado a lo largo del tiempo
 * - CONTINUIDAD: Sigue siendo la misma entidad aunque cambien sus atributos
 * 
 * Diferencias clave con Value Objects:
 * - Entity: "Este pedido #123" (identificable, mutable en el tiempo)
 * - Value Object: "10 EUR" (sin identidad, inmutable, intercambiable)
 * 
 * Ejemplo: Dos pedidos con exactamente los mismos productos y precio
 * son DOS pedidos DIFERENTES (porque tienen IDs diferentes).
 * Pero dos precios de "10 EUR" son el MISMO concepto.
 */

import { OrderId } from '../value-objects/OrderId';
import { Price } from '../value-objects/Price';
import { Email } from '../value-objects/Email';
import { InvalidStateError, ValidationError } from '../errors';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: Price;
}

export class Order {
  private constructor(
    readonly id: OrderId,
    readonly customerEmail: Email,
    private _items: OrderItem[],
    private _status: OrderStatus,
    readonly createdAt: Date
  ) {}

  /**
   * Factory method para crear una nueva orden
   */
  static create(
    customerEmail: Email,
    items: OrderItem[]
  ): Order {
    if (items.length === 0) {
      throw ValidationError.single(
        'Order',
        'items',
        'Order must have at least one item'
      );
    }

    return new Order(
      OrderId.generate(),
      customerEmail,
      [...items], // Copia defensiva
      'PENDING',
      new Date()
    );
  }

  /**
   * Factory method para reconstruir una orden existente (ej: desde base de datos)
   */
  static reconstitute(
    id: OrderId,
    customerEmail: Email,
    items: OrderItem[],
    status: OrderStatus,
    createdAt: Date
  ): Order {
    return new Order(id, customerEmail, items, status, createdAt);
  }

  /**
   * Getters para acceder al estado interno de forma controlada
   */
  get items(): readonly OrderItem[] {
    return [...this._items]; // Retornar copia para mantener inmutabilidad
  }

  get status(): OrderStatus {
    return this._status;
  }

  /**
   * LÓGICA DE DOMINIO: Calcular el total del pedido
   */
  calculateTotal(): Price {
    if (this._items.length === 0) {
      return Price.create(0, 'USD');
    }

    const firstItem = this._items[0];
    if (!firstItem) {
      return Price.create(0, 'USD');
    }

    let total = firstItem.unitPrice.multiply(firstItem.quantity);

    for (let i = 1; i < this._items.length; i++) {
      const item = this._items[i];
      if (item) {
        const itemTotal = item.unitPrice.multiply(item.quantity);
        total = total.add(itemTotal);
      }
    }

    return total;
  }

  /**
   * LÓGICA DE DOMINIO: Confirmar el pedido
   * Las Entities encapsulan las reglas de transición de estado
   */
  confirm(): void {
    if (this._status !== 'PENDING') {
      throw new InvalidStateError(
        'Order',
        this._status,
        'confirm',
        ['PENDING']
      );
    }
    this._status = 'CONFIRMED';
  }

  /**
   * LÓGICA DE DOMINIO: Marcar como enviado
   */
  ship(): void {
    if (this._status !== 'CONFIRMED') {
      throw new InvalidStateError(
        'Order',
        this._status,
        'ship',
        ['CONFIRMED']
      );
    }
    this._status = 'SHIPPED';
  }

  /**
   * LÓGICA DE DOMINIO: Marcar como entregado
   */
  deliver(): void {
    if (this._status !== 'SHIPPED') {
      throw new InvalidStateError(
        'Order',
        this._status,
        'deliver',
        ['SHIPPED']
      );
    }
    this._status = 'DELIVERED';
  }

  /**
   * LÓGICA DE DOMINIO: Cancelar el pedido
   */
  cancel(): void {
    if (this._status === 'DELIVERED') {
      throw new InvalidStateError(
        'Order',
        this._status,
        'cancel',
        ['PENDING', 'CONFIRMED', 'SHIPPED']
      );
    }
    if (this._status === 'CANCELLED') {
      throw new InvalidStateError(
        'Order',
        this._status,
        'cancel'
      );
    }
    this._status = 'CANCELLED';
  }

  /**
   * LÓGICA DE DOMINIO: Añadir un item al pedido
   */
  addItem(item: OrderItem): void {
    if (this._status !== 'PENDING') {
      throw new InvalidStateError(
        'Order',
        this._status,
        'add items',
        ['PENDING']
      );
    }

    // Verificar si el producto ya existe en el pedido
    const existingItemIndex = this._items.findIndex(
      i => i.productId === item.productId
    );

    if (existingItemIndex >= 0) {
      // Si existe, incrementar la cantidad
      const existingItem = this._items[existingItemIndex];
      if (existingItem) {
        existingItem.quantity += item.quantity;
      }
    } else {
      // Si no existe, añadir el nuevo item
      this._items.push(item);
    }
  }

  /**
   * Las Entities se comparan por IDENTIDAD, no por atributos
   */
  equals(other: Order): boolean {
    return this.id.equals(other.id);
  }

  toString(): string {
    return `Order ${this.id.toString()} - Status: ${this._status} - Total: ${this.calculateTotal().toString()}`;
  }
}
