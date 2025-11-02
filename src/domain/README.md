# Capa de Dominio - Clean Architecture

Esta capa contiene el **corazón del negocio**: las reglas, conceptos y lógica que son independientes de frameworks, bases de datos o interfaces de usuario.

## Value Objects (Objetos de Valor)

Los **Value Objects** son objetos inmutables que se definen por sus atributos, no por una identidad.

### Características:
- ✅ **Inmutables**: Una vez creados, no pueden cambiar
- ✅ **Sin identidad**: Se comparan por valor, no por referencia
- ✅ **Auto-validación**: Siempre están en un estado válido
- ✅ **Intercambiables**: Dos instancias con los mismos valores son equivalentes

### Ejemplos en este proyecto:
- `Price`: Un precio de 10 EUR es siempre 10 EUR, sin importar dónde se use
- `Email`: Una dirección de email válida
- `Currency`: Un tipo de moneda
- `OrderId`: Aunque es un ID, es un Value Object porque no tiene comportamiento propio

### Cuándo usar Value Objects:
- Conceptos que se definen por sus atributos (dinero, fechas, rangos)
- Cuando necesitas validación en la creación
- Cuando la igualdad debe basarse en valores, no en referencias

```typescript
const price1 = Price.create(10, 'EUR');
const price2 = Price.create(10, 'EUR');
console.log(price1.equals(price2)); // true - son el mismo "concepto"
```

---

## Entities (Entidades)

Las **Entities** son objetos que tienen una **identidad única** que persiste a lo largo del tiempo, independientemente de los cambios en sus atributos.

### Características:
- ✅ **Identidad única**: Se distinguen por su ID
- ✅ **Mutables**: Pueden cambiar de estado
- ✅ **Ciclo de vida**: Tienen un historial y transiciones de estado
- ✅ **Continuidad**: Siguen siendo "la misma cosa" aunque cambien sus atributos

### Ejemplos en este proyecto:
- `Order`: Un pedido específico con un ID único
- `Customer`: Un cliente específico que puede cambiar su email, nombre, etc.

### Cuándo usar Entities:
- Objetos que necesitan ser rastreados a lo largo del tiempo
- Cuando el concepto tiene un ciclo de vida (creado, modificado, eliminado)
- Cuando dos instancias con los mismos datos NO son la misma cosa

```typescript
const order1 = Order.create(email, items);
const order2 = Order.create(email, items);
console.log(order1.equals(order2)); // false - son dos pedidos DIFERENTES

// El mismo pedido después de cambiar su estado
order1.confirm();
order1.ship();
console.log(order1.equals(order1)); // true - sigue siendo el mismo pedido
```

---

## Comparación Visual

```
VALUE OBJECT (Price)          |  ENTITY (Order)
-----------------------------|---------------------------
10 EUR                       |  Order #123
↓                            |  ↓
Es siempre "10 EUR"         |  Tiene identidad única
No importa dónde o cuándo   |  Cambia de estado
Inmutable                    |  Mutable
Sin ID                       |  Con ID
Comparación por valor        |  Comparación por ID
```

---

## Reglas de Oro

### Value Objects:
1. **Constructor privado** + factory method para validación
2. **readonly** en todos los campos
3. Métodos que retornan **nuevas instancias** (inmutabilidad)
4. Método `equals()` basado en atributos

### Entities:
1. **ID inmutable** (no cambia nunca)
2. **Atributos privados** con getters/setters controlados
3. **Métodos de dominio** que encapsulan reglas de negocio
4. Método `equals()` basado en ID
5. Factory methods: `create()` y `reconstitute()`

---

## Ventajas de esta separación

1. **Claridad**: Código que expresa el dominio de forma natural
2. **Validación**: Imposible crear objetos inválidos
3. **Testabilidad**: Fácil de probar sin dependencias externas
4. **Mantenibilidad**: Cambios en el negocio = cambios en el dominio
5. **Reutilización**: Value Objects se pueden usar en múltiples contextos
