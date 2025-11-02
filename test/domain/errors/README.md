# Tests: Domain / Errors

## `DomainErrors.spec.ts`
Valida la jerarquía de errores de dominio y su información de contexto.

### Qué se testea
- `InvalidStateError`: mensajes expresivos con entidad, estado actual, acción e (opcional) estados permitidos; contexto accesible.
- `ValidationError`: creación con un fallo (`single`) o múltiples; lista de fallos (`failures`) y `context` presentes.
- `BusinessRuleViolationError`: incluye `ruleName` y contexto adicional (p. ej., valores intentados y máximos).
- `NotFoundError`: incluye `entityName` y `entityId` en el mensaje y en el contexto.
- `ConflictError`: razón del conflicto y contexto opcional.
- Clase base `DomainError`:
  - `timestamp` es un `Date` válido.
  - Serialización `toJSON()` incluye `name`, `message`, `timestamp`, `context` y `stack`.
  - Comprobaciones `instanceof` a tipos específicos y a `Error`.

### Valor
Estandariza el modelado de fallos de negocio y facilita la observabilidad (mensajes/JSON consistentes) sin filtrar detalles de infraestructura.
