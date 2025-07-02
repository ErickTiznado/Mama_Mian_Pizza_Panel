# Ingredientes de Pizza - Personalización

## Descripción
Esta nueva tab permite gestionar los ingredientes que estarán disponibles para personalizar pizzas en el ecommerce. Solo los ingredientes agregados aquí se mostrarán como opciones de personalización con su precio extra correspondiente.

## Funcionalidades

### 📋 Vista Principal
- **Vista de Tarjetas**: Muestra cada ingrediente con su información detallada y precio extra destacado
- **Vista de Tabla**: Muestra todos los ingredientes en formato tabular para una vista más compacta
- **Búsqueda**: Filtrar ingredientes por nombre
- **Filtro por Categoría**: Filtrar por categorías de ingredientes

### ➕ Agregar Ingredientes
1. Click en "Agregar Ingrediente"
2. Se abre modal con lista de ingredientes del inventario
3. Solo se muestran ingredientes que AÚN NO están agregados a personalización
4. Seleccionar ingrediente y asignar precio extra
5. El ingrediente queda disponible para personalización de pizzas

### ✏️ Editar Precio Extra
- Click en "Editar Precio" en cualquier ingrediente
- Modificar el precio extra que se cobrará por este ingrediente
- Guardar cambios

### 🗑️ Quitar Ingredientes
- Click en "Quitar" para eliminar un ingrediente de la personalización
- El ingrediente deja de estar disponible en el ecommerce
- Puede volver a agregarse posteriormente

## Estructura de Datos

### Ingrediente de Pizza
```javascript
{
  id: 1,                    // ID único del registro
  id_ingrediente: 5,        // ID del ingrediente en el inventario
  nombre: "Pepperoni",      // Nombre del ingrediente
  categoria: "Carnes",      // Categoría
  precio_extra: 2.50,       // Precio extra por este ingrediente
  cantidad: 50,             // Stock disponible
  unidad: "piezas",         // Unidad de medida
  proveedor: "Carnes Premium" // Proveedor
}
```

## Endpoints de API (Para Implementar)

```javascript
// Obtener todos los ingredientes de pizza
GET /api/pizza-ingredients/getAll

// Agregar ingrediente a personalización
POST /api/pizza-ingredients/add
Body: { id_ingrediente: number, precio_extra: number }

// Actualizar precio extra
PUT /api/pizza-ingredients/update/:id
Body: { precio_extra: number }

// Eliminar ingrediente de personalización
DELETE /api/pizza-ingredients/delete/:id

// Obtener ingredientes para ecommerce
GET /api/pizza-ingredients/ecommerce
```

## Integración con Ecommerce
Los ingredientes agregados aquí automáticamente estarán disponibles en el ecommerce con su precio extra correspondiente. El sistema filtra solo los ingredientes que:
1. Están en esta lista de personalización
2. Tienen stock disponible en el inventario
3. Tienen un precio extra definido

## Notas Técnicas
- Los datos se sincronizan automáticamente con el inventario principal
- Si un ingrediente se elimina del inventario, también desaparece de personalización
- Los precios extra son independientes del costo del ingrediente en inventario
- El sistema previene duplicados automáticamente
