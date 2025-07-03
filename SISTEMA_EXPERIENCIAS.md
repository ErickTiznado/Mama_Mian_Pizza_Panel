# Sistema de Experiencias - Documentación Técnica

## Resumen

El sistema de experiencias permite a los clientes de MamaMianPizza compartir sus opiniones, valoraciones y experiencias con el servicio. Esta documentación explica la implementación técnica y los componentes utilizados para integrar el módulo de experiencias en el perfil de clientes.

## Componentes Implementados

### 1. Servicio de API de Experiencias (`ExperienciasService.js`)

- Ubicación: `src/services/ExperienciasService.js`
- Propósito: Proporciona métodos para interactuar con la API REST de experiencias.
- Funciones implementadas:
  - `getAllExperiencias()`: Obtiene todas las experiencias.
  - `getExperienciasByUser(userId)`: Obtiene experiencias filtradas por usuario.
  - `getExperienciasByStatus(status)`: Obtiene experiencias por estado de aprobación.
  - `getExperienciaById(id)`: Obtiene una experiencia específica.
  - `createExperiencia(data)`: Crea una nueva experiencia.
  - `updateExperiencia(id, data)`: Actualiza una experiencia existente.
  - `updateExperienciaApproval(id, aprobado)`: Cambia el estado de aprobación.
  - `deleteExperiencia(id)`: Elimina una experiencia.

### 2. Visualización de Experiencias en Perfil de Cliente

- Ubicación: `src/components/GestionClientes/ClientePerfilModal.jsx`
- Cambios realizados:
  - Integración de la sección de Experiencias del usuario.
  - Implementación de acciones para aprobar, rechazar y eliminar experiencias.
  - Indicadores visuales del estado de aprobación.
  - Capacidad de visualizar el título, valoración y contenido de cada experiencia.

### 3. Estilos de UI para la Visualización de Experiencias

- Ubicación: `src/components/GestionClientes/ClientePerfilModal.css`
- Mejoras implementadas:
  - Tarjetas de experiencia con diseño coherente.
  - Estados visuales para experiencias aprobadas y pendientes.
  - Diseño responsivo para diferentes tamaños de pantalla.
  - Animaciones y transiciones para mejorar la experiencia de usuario.

## Flujo de Datos

1. **Carga de Experiencias**:
   - Al abrir el perfil de un cliente, se llama a `getExperienciasByUser(cliente.id)`.
   - Las experiencias se almacenan en el estado local `experiencias`.
   - Se muestra un indicador de carga durante la petición.

2. **Gestión de Estados**:
   - Las experiencias pendientes muestran un botón de "Aprobar".
   - Las experiencias aprobadas muestran un botón de "Rechazar".
   - Todas las experiencias tienen la opción de "Eliminar".

3. **Actualizaciones de Estado**:
   - Al aprobar/rechazar, se llama a `updateExperienciaApproval()` y se actualiza el estado local.
   - Al eliminar, se llama a `deleteExperiencia()` y se elimina del estado local.

## Consideraciones Técnicas

1. **Estados de Carga**:
   - Se implementaron estados `cargandoExperiencias` y `errorExperiencias` para manejar diferentes situaciones.

2. **Manejo de Errores**:
   - Todas las llamadas a la API están envueltas en bloques try-catch.
   - Los errores se muestran visualmente al usuario.
   - Se mantiene consistencia entre el estado de la UI y los datos del servidor.

3. **Consideraciones de Rendimiento**:
   - Las experiencias se cargan solo cuando el modal está visible.
   - Se actualiza el estado local inmediatamente tras las acciones para dar feedback instantáneo.

## Pruebas

Se han implementado pruebas unitarias en `ExperienciasService.test.js` que cubren:
- Obtención correcta de datos
- Manejo de errores en las peticiones
- Actualizaciones de estado de aprobación
- Eliminación de experiencias

## Futuras Mejoras

1. **Paginación**: Implementar paginación para clientes con muchas experiencias.
2. **Filtrado Avanzado**: Permitir filtrar experiencias por valoración o fecha.
3. **Respuestas a Experiencias**: Permitir que los administradores respondan directamente a las experiencias.
4. **Notificaciones**: Notificar a los usuarios cuando su experiencia cambia de estado.
5. **Estadísticas Ampliadas**: Mostrar más métricas basadas en las experiencias del usuario.

## Referencia de la API

Para más detalles sobre los endpoints disponibles, formatos de respuesta y códigos de error, consulte la documentación de la API de Experiencias en `API_EXPERIENCIAS.md`.
