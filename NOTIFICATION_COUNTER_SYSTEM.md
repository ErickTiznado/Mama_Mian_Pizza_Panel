# Sistema de Contadores de Notificaciones - Sidebar

## Descripción
Sistema integrado de contadores de notificaciones en el sidebar que muestra el número de notificaciones no leídas por categoría en cada elemento del menú.

## Características Implementadas

### 1. Contadores por Categoría
- **Pedidos**: Muestra notificaciones tipo 'pedido'
- **Clientes**: Muestra notificaciones tipo 'cliente'
- **Inventario**: Muestra notificaciones tipo 'inventario' (comentado actualmente)

### 2. Visualización Dual
- **Modo Expandido**: Badge circular junto al icono + badge de texto junto al label
- **Modo Colapsado**: Solo badge circular sobre el icono

### 3. Estilos y Animaciones
- Color rojo distintivo (#ff4757)
- Animación de pulso sutil para llamar la atención
- Efectos hover mejorados
- Responsive design

### 4. Funcionalidades

#### Contador Dinámico
```javascript
const getNotificationCountByCategory = (category) => {
  if (!category) return 0;
  return notifications.filter(notif => 
    notif.tipo === category && !notif.read
  ).length;
};
```

#### Tooltips Informativos
- En modo colapsado: "Nombre del menú (X nuevas)"
- Accesibilidad mejorada con aria-labels

### 5. Integración con Hook de Notificaciones
- Usa `useNotifications()` hook existente
- Se actualiza en tiempo real con SSE (Server-Sent Events)
- Compatible con sistema de marcado como leídas

## Configuración de Elementos del Menú

```javascript
{
  id: 'pedidos',
  path: '/pedidos',
  label: 'Pedidos',
  icon: ShoppingCart,
  hasNotification: true,
  notificationCategory: 'pedido' // Debe coincidir con el tipo de la API
}
```

## Archivos Modificados

### 1. `sidebar.jsx`
- Función `getNotificationCountByCategory()`
- Estructura del renderizado actualizada
- Tooltips mejorados

### 2. `sidebar.css`
- Nuevos estilos para contadores
- Animaciones CSS
- Responsive design

## Categorías de Notificaciones Soportadas

| Categoría | Tipo API | Estado |
|-----------|----------|--------|
| Pedidos | `pedido` | ✅ Activo |
| Clientes | `cliente` | ✅ Activo |
| Inventario | `inventario` | 🔧 Comentado |
| Sistema | `sistema` | ⏳ Pendiente |

## Personalización

### Agregar Nueva Categoría
1. Añadir elemento al array `menuItems` con:
   - `hasNotification: true`
   - `notificationCategory: 'tipo_api'`

2. Asegurar que la API envía notificaciones con ese tipo

### Modificar Estilos
- Cambiar colores en variables CSS
- Ajustar animaciones en keyframes
- Modificar tamaños de badges

## API Requirements
- Las notificaciones deben tener campo `tipo` que coincida con `notificationCategory`
- Campo `read` para determinar estado de lectura
- SSE endpoint activo en `/api/notifications/stream`

## Notas Técnicas
- Los contadores se actualizan automáticamente con nuevas notificaciones
- Compatible con dispositivos móviles
- Optimizado para performance (filtros eficientes)
- Accesible (aria-labels, contraste adecuado)
