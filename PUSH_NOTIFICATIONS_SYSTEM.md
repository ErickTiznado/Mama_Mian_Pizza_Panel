# Sistema de Notificaciones Push - MamaMian Pizza

## Descripción General

Se ha implementado un sistema completo de notificaciones push que permite a los administradores recibir alertas en tiempo real, incluso cuando no están activamente usando la aplicación en el navegador.

## Características Implementadas

### 🔔 Notificaciones Push del Navegador
- **Notificaciones nativas del sistema operativo** que aparecen aunque la pestaña no esté activa
- **Persistencia entre sesiones** - Las notificaciones funcionan incluso si el usuario cierra y vuelve a abrir el navegador
- **Diferentes tipos de notificación** según el tipo de evento (pedidos, inventario, clientes, sistema)

### 🎯 Tipos de Notificaciones

1. **Pedidos** (Alta prioridad)
   - Requieren interacción del usuario
   - Incluyen acciones (Ver Pedido, Descartar)
   - Icono: 🛒
   - Color: Verde (#4CAF50)

2. **Clientes** (Prioridad normal)
   - Notificaciones automáticas
   - Icono: 👥
   - Color: Azul (#2196F3)

3. **Inventario** (Prioridad normal)
   - Alertas de stock
   - Icono: 📦
   - Color: Naranja (#FF9800)

4. **Sistema** (Prioridad baja)
   - Notificaciones administrativas
   - Icono: ⚙️
   - Color: Púrpura (#9C27B0)

### 🚀 Service Worker
- **Funcionamiento en background** para manejar notificaciones cuando la app no está activa
- **Cache inteligente** para mejorar el rendimiento
- **Manejo de clics** en notificaciones para navegar a la sección relevante
- **Auto-actualización** cuando hay nuevas versiones disponibles

### 📱 Progressive Web App (PWA)
- **Manifest.json** configurado para instalación como app nativa
- **Iconos optimizados** para diferentes dispositivos
- **Shortcuts** para acceso rápido a secciones importantes
- **Theme colors** coherentes con el diseño de la aplicación

## Componentes Implementados

### 1. Hooks y Servicios

#### `usePushNotifications.js`
```javascript
// Hook principal para manejar notificaciones push
const {
    permission,           // Estado del permiso
    isSupported,         // Si el navegador las soporta
    requestPermission,   // Solicitar permisos
    showNotification,    // Mostrar notificación
    canShowNotifications // Si se pueden mostrar
} = usePushNotifications();
```

#### `useNotification.jsx` (Actualizado)
```javascript
// Hook mejorado con soporte para push
const {
    notifications,              // Lista de notificaciones
    enablePushNotifications,    // Habilitar push
    canShowNotifications,       // Estado de permisos
    pushPermission,            // Nivel de permisos
    isPushSupported           // Soporte del navegador
} = useNotifications();
```

### 2. Componentes UI

#### `PushNotificationBanner`
- **Banner no intrusivo** que aparece 3 segundos después del login
- **Explicación clara** de los beneficios
- **Botones de acción** para habilitar o rechazar
- **Responsive design** para móviles y desktop

#### `PushNotificationSettings`
- **Panel de configuración** en la sección de configuración
- **Estado visual** del sistema de notificaciones
- **Información detallada** sobre qué incluyen las notificaciones
- **Botón para habilitar** si no están activas

#### `NotificationSystemStatus`
- **Widget de estado** para el dashboard
- **Indicadores visuales** del funcionamiento del sistema
- **Contador de notificaciones** no leídas
- **Estados diferentes** (activo, pendiente, bloqueado, no soportado)

### 3. Indicadores en la Sidebar
- **Indicador de estado push** que muestra si están habilitadas
- **Animaciones** para estados activo/inactivo
- **Información tooltip** en estado collapsed

## Flujo de Funcionamiento

### 1. Inicialización
1. Al cargar la app, se registra el Service Worker
2. Se verifican los permisos de notificación
3. Si es la primera vez, se muestra el banner promocional

### 2. Solicitud de Permisos
1. Usuario hace clic en "Habilitar Notificaciones"
2. Se muestra el diálogo nativo del navegador
3. Se guarda la preferencia del usuario

### 3. Recepción de Notificaciones
1. El servidor envía notificación via EventSource
2. Se verifica si la página está visible
3. Si NO está visible → Se muestra notificación push
4. Si SÍ está visible → Solo se actualiza la UI interna

### 4. Interacción con Notificaciones
1. Usuario hace clic en la notificación
2. Se enfoca/abre la ventana de la aplicación
3. Se navega automáticamente a la sección relevante
4. Se cierra la notificación

## Archivos Modificados/Creados

### Nuevos Archivos
```
src/hooks/usePushNotifications.js
src/components/common/PushNotificationBanner/
src/components/common/PushNotificationSettings/
src/components/common/NotificationSystemStatus/
src/utils/serviceWorkerManager.js
public/sw.js
public/manifest.json
```

### Archivos Modificados
```
src/hooks/useNotification.jsx           # Integración con push
src/components/sidebar/sidebar.jsx      # Indicador de estado
src/components/sidebar/sidebar.css      # Estilos del indicador
src/pages/configuracion/ConfiguracionAdmin.jsx  # Nueva pestaña
src/App.jsx                            # Banner de notificaciones
index.html                             # Meta tags PWA
```

## Estados de Notificaciones

### ✅ Habilitadas
- Permisos concedidos
- Service Worker activo
- Indicador verde en sidebar
- Banner no se muestra

### ⚠️ Pendientes
- Permisos no solicitados
- Se muestra banner promocional
- Indicador amarillo en sidebar

### ❌ Bloqueadas
- Permisos denegados por el usuario
- Instrucciones para habilitar manualmente
- Indicador rojo en sidebar

### 🚫 No Soportadas
- Navegador incompatible
- Funcionalidad deshabilitada
- Mensaje informativo

## Navegadores Compatibles

- ✅ Chrome 50+
- ✅ Firefox 44+
- ✅ Safari 16+ (iOS 16.4+)
- ✅ Edge 79+
- ❌ IE (no soportado)

## Configuración del Servidor

Para que las notificaciones funcionen completamente, el servidor debe:

1. **Mantener el EventSource stream** (`/api/notifications/stream`)
2. **Enviar notificaciones estructuradas** con los campos requeridos
3. **Soportar CORS** para el dominio de la aplicación
4. **Usar HTTPS** (requerido para Service Workers)

## Mejoras Futuras Posibles

1. **Push via servidor** - Notificaciones incluso con la app cerrada
2. **Configuración granular** - Tipos específicos de notificación
3. **Notificaciones programadas** - Recordatorios y reportes
4. **Analytics** - Tracking de interacciones con notificaciones
5. **Sonidos personalizados** - Diferentes tonos por tipo
6. **Modo no molestar** - Horarios de silencio

## Solución de Problemas

### No aparecen las notificaciones
1. Verificar permisos en configuración del navegador
2. Comprobar que el Service Worker esté registrado
3. Verificar conexión a internet
4. Revisar consola del navegador por errores

### El Service Worker no se registra
1. Verificar que la aplicación use HTTPS
2. Comprobar que el archivo `sw.js` exista en `/public/`
3. Revisar la consola del navegador

### Las notificaciones no navegan correctamente
1. Verificar que las rutas estén bien configuradas
2. Comprobar que el hash routing funcione
3. Revisar la configuración del Service Worker

Este sistema proporciona una experiencia completa de notificaciones push que mejora significativamente la usabilidad y eficiencia del panel administrativo de MamaMian Pizza.
