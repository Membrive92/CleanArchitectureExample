# Domain Errors - Errores de Dominio

Los errores de dominio son excepciones personalizadas que representan violaciones de reglas de negocio. No son errores técnicos (como fallos de red o base de datos), sino situaciones donde se intenta hacer algo que el dominio no permite.

## ¿Por qué errores personalizados?

### ❌ Sin errores personalizados:
```typescript
throw new Error('Cannot ship order'); // ¿Qué tipo de error es? ¿Cómo manejarlo?
```

### ✅ Con errores personalizados:
```typescript
throw new InvalidStateError('Order', 'PENDING', 'ship', ['CONFIRMED']);
// Claro, tipado, manejable específicamente
```

## Jerarquía de Errores

```
DomainError (abstracta)
├── InvalidStateError
├── ValidationError
├── BusinessRuleViolationError
├── NotFoundError
└── ConflictError
```

## Tipos de Errores

### 1. DomainError (Clase Base)

Clase abstracta de la que heredan todos los errores de dominio.

**Características:**
- Timestamp automático
- Contexto adicional opcional
- Serialización para logging

**No se usa directamente**, solo como clase base.

---

### 2. InvalidStateError

Se usa cuando una entidad intenta realizar una acción en un estado inválido.

**Uso:**
```typescript
throw new InvalidStateError(
  'Order',           // Nombre de la entidad
  'DELIVERED',       // Estado actual
  'cancel',          // Acción intentada
  ['PENDING']        // Estados permitidos (opcional)
);

// Output: "Cannot cancel Order in state 'DELIVERED'. Allowed states: PENDING"
```

**Casos de uso:**
- Intentar enviar un pedido no confirmado
- Cancelar un pedido ya entregado
- Activar un cliente ya activo

---

### 3. ValidationError

Se usa cuando los datos no cumplen las reglas de validación.

**Uso simple:**
```typescript
throw ValidationError.single(
  'Email',
  'value',
  'Invalid email format',
  'not-an-email'
);
```

**Múltiples validaciones:**
```typescript
throw new ValidationError('Customer', [
  { field: 'name', message: 'Cannot be empty' },
  { field: 'email', message: 'Invalid format', value: 'bad@' }
]);
```

**Casos de uso:**
- Email inválido
- Precio negativo
- Nombre vacío
- Formato de ID incorrecto

---

### 4. BusinessRuleViolationError

Se usa cuando se viola una regla de negocio específica.

**Uso:**
```typescript
throw new BusinessRuleViolationError(
  'MaxDiscountPercentage',
  'Discount cannot exceed 50%',
  { attempted: 75, max: 50 }
);
```

**Casos de uso:**
- Descuento mayor al permitido
- Superar límite de crédito
- Violación de política de precios
- Cantidad máxima de items excedida

---

### 5. NotFoundError

Se usa cuando una entidad solicitada no existe.

**Uso:**
```typescript
throw new NotFoundError('Order', 'abc-123-def');
// Output: "Order with id 'abc-123-def' not found"
```

**Casos de uso:**
- Buscar un pedido inexistente
- Cliente no encontrado
- Producto no disponible

---

### 6. ConflictError

Se usa cuando hay un conflicto con el estado actual del sistema.

**Uso:**
```typescript
throw new ConflictError(
  'Customer',
  'Email already exists',
  { email: 'user@example.com' }
);
```

**Casos de uso:**
- Email duplicado
- Asiento ya reservado
- Recurso en uso por otro proceso

---

## Manejo de Errores en Capas Superiores

### En Application Layer (Use Cases):

```typescript
try {
  order.ship();
} catch (error) {
  if (error instanceof InvalidStateError) {
    // Manejar error de estado
    return { success: false, error: error.message };
  }
  throw error; // Re-lanzar si no sabemos manejarlo
}
```

### En Infrastructure Layer (HTTP Controllers):

```typescript
try {
  await useCase.execute(command);
  return res.status(200).json({ success: true });
} catch (error) {
  if (error instanceof ValidationError) {
    return res.status(400).json({ 
      error: error.message,
      failures: error.failures 
    });
  }
  if (error instanceof NotFoundError) {
    return res.status(404).json({ error: error.message });
  }
  if (error instanceof ConflictError) {
    return res.status(409).json({ error: error.message });
  }
  // Error desconocido
  return res.status(500).json({ error: 'Internal server error' });
}
```

---

## Ventajas de Este Enfoque

1. **Expresividad**: El código comunica claramente qué salió mal
2. **Type Safety**: TypeScript ayuda a manejar cada tipo correctamente
3. **Debugging**: Stack traces y contexto facilitan encontrar problemas
4. **Testing**: Fácil verificar que se lanzan los errores correctos
5. **Separación de Responsabilidades**: El dominio decide qué es válido
6. **Consistencia**: Todos los errores tienen el mismo formato

---

## Mejores Prácticas

### ✅ Hacer:
- Usar el error más específico posible
- Incluir contexto relevante
- Lanzar errores temprano (fail fast)
- Documentar qué errores puede lanzar una función

### ❌ Evitar:
- Usar `Error` genérico en el dominio
- Capturar y silenciar errores de dominio
- Errores de dominio para problemas técnicos
- Mensajes vagos como "Invalid data"

---

## Ejemplo Completo

```typescript
// Value Object con validación
export class Email {
  static create(value: string): Email {
    if (!value.trim()) {
      throw ValidationError.single('Email', 'value', 'Cannot be empty');
    }
    if (!EMAIL_REGEX.test(value)) {
      throw ValidationError.single('Email', 'value', 'Invalid format', value);
    }
    return new Email(value);
  }
}

// Entity con transiciones de estado
export class Order {
  ship(): void {
    if (this.status !== 'CONFIRMED') {
      throw new InvalidStateError('Order', this.status, 'ship', ['CONFIRMED']);
    }
    this.status = 'SHIPPED';
  }
}

// Use Case manejando errores
export class ShipOrderUseCase {
  execute(orderId: string): Result {
    try {
      const order = this.repository.findById(orderId);
      if (!order) {
        throw new NotFoundError('Order', orderId);
      }
      order.ship();
      this.repository.save(order);
      return { success: true };
    } catch (error) {
      if (error instanceof DomainError) {
        return { success: false, error: error.message };
      }
      throw error; // Re-lanzar errores técnicos
    }
  }
}
```
