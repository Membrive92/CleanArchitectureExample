# Tests: Domain / Value Objects

## `Email.spec.ts`
Valida el value object `Email`.

- Normalización: trim y lowercasing del valor.
- Validación de formato: presencia de `@`, dominio y TLD razonables.
- Extracción del dominio (`getDomain`).
- Manejo de errores: lanza `ValidationError` con mensaje claro.

## `Price.spec.ts`
Valida el value object `Price` y sus operaciones.

- Creación válida: `amount >= 0`, moneda soportada.
- Inmutabilidad: operaciones devuelven nuevas instancias, no mutan el original.
- Operaciones aritméticas: `add` (misma moneda), `multiply` (por escalar positivo).
- Manejo de errores:
  - `ValidationError` para cantidades negativas/NaN/Infinity.
  - `BusinessRuleViolationError` al sumar monedas distintas.
- Igualdad por valor (`equals`) y formato de salida (`toString`).

## `OrderId.spec.ts`
Valida el identificador `OrderId`.

- Generación de UUID v4 (`generate`).
- Validación de formato UUID al crear desde string.
- Igualdad por valor (`equals`).
- Errores de validación cuando el formato no es correcto (`ValidationError`).
