/**
 * DOMAIN ERROR - Error Base del Dominio
 * 
 * Clase base para todos los errores de dominio.
 * Los errores de dominio representan violaciones de reglas de negocio,
 * no problemas técnicos (como fallos de red o BD).
 * 
 * Ventajas de errores personalizados:
 * - Expresivos: Comunican claramente qué regla de negocio se violó
 * - Tipados: TypeScript puede verificarlos en tiempo de compilación
 * - Manejables: Permiten tratamiento específico por tipo de error
 * - Trazables: Incluyen información de contexto útil
 */

export abstract class DomainError extends Error {
  public readonly timestamp: Date;
  public readonly context: Record<string, unknown> | undefined;

  constructor(
    message: string,
    context?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.timestamp = new Date();
    this.context = context;

    // Mantener el stack trace correcto en V8
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Serializa el error para logging o debugging
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      timestamp: this.timestamp.toISOString(),
      context: this.context,
      stack: this.stack,
    };
  }
}