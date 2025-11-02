# Tests: Shared

## `health.spec.ts`
Valida el contrato del health check expuesto en `src/shared/health.ts`.

### Qué se testea
- El resultado incluye `status: 'healthy'`.
- Se incluye un `timestamp` con formato ISO válido.
- El tipo de retorno cumple el contrato de `HealthStatus`.

### Valor
Garantiza un chequeo ligero del entorno y sirve como prueba de humo del tooling (TypeScript + Vitest).
