# Tests: Domain / Entities

## `Order.spec.ts`
Valida el agregado `Order` y su ciclo de vida.

- Creación (`create`) y reconstitución desde estado persistido.
- Transiciones válidas: `PENDING → CONFIRMED → SHIPPED → DELIVERED`.
- Transiciones inválidas: lanzan `InvalidStateError` con contexto (estado actual, acción, estados permitidos).
- Gestión de items:
  - `addItem` valida cantidad y precio, evita duplicados.
  - Copia defensiva al exponer colecciones.
- Cálculo de totales (`calculateTotal`) y consistencia de moneda.
- Igualdad por identidad (mismo `OrderId`).

## `Customer.spec.ts`
Valida la entidad `Customer`.

- Activación/desactivación con reglas (p. ej., no desactivar si ya está inactivo).
- Actualización de nombre y email, validando formato con `Email`.
- Igualdad por identidad (misma clave de entidad/ID).
- Manejo de errores: `ValidationError` e `InvalidStateError` según corresponda.
