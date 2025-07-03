# Panel de Gestión de Comentarios y Experiencias

## Descripción

Este módulo proporciona una interfaz centralizada para la gestión de comentarios y experiencias de usuarios en MamaMianPizza. Permite a los administradores revisar, aprobar, rechazar y eliminar tanto comentarios como experiencias, priorizando los elementos pendientes de aprobación.

## Características Principales

- **Vista Unificada**: Gestiona tanto comentarios como experiencias en un solo panel.
- **Priorización Automática**: Los elementos pendientes de aprobación se muestran primero.
- **Filtrado Flexible**: Filtra por estado (pendientes, aprobados, rechazados) y tipo (comentarios, experiencias).
- **Ordenación Personalizable**: Ordena por fecha o valoración, en orden ascendente o descendente.
- **Acciones Rápidas**: Aprueba, rechaza o elimina elementos con un solo clic.
- **Paginación**: Navegación sencilla entre páginas de resultados.
- **Contador de Pendientes**: Muestra claramente el número de elementos que requieren atención.
- **Diseño Responsivo**: Funciona en dispositivos móviles y de escritorio.

## Cómo Acceder

El panel está disponible en la sección de "Comentarios" en el menú lateral. Solo es accesible para usuarios con roles de `super_admin` y `admin`.

## Flujo de Trabajo Recomendado

1. **Revisar Pendientes**: Al entrar al panel, se muestran primero los elementos pendientes.
2. **Evaluar Contenido**: Leer cada comentario o experiencia para determinar su idoneidad.
3. **Tomar Acción**:
   - **Aprobar**: Si el contenido es apropiado y positivo.
   - **Rechazar**: Si el contenido es inapropiado pero no lo suficiente para eliminarlo.
   - **Eliminar**: Si el contenido viola las políticas (spam, lenguaje ofensivo, etc.).

## Integración con APIs

El panel se integra con dos APIs principales:

- `/api/experiencias`: Para la gestión de experiencias de usuario.
- `/api/resenas`: Para la gestión de comentarios y reseñas.

## Consideraciones Técnicas

- Los elementos aprobados se muestran automáticamente en la tienda online.
- Las acciones realizadas en el panel se reflejan inmediatamente en la base de datos.
- Las estadísticas en otros paneles se actualizan basándose en las acciones realizadas aquí.

## Notas sobre Mantenimiento

- El componente `ComentariosExperienciasPanel` es el núcleo de esta funcionalidad.
- La página `GestionComentariosPage` sirve como contenedor para el panel.
- El sistema de notificaciones está integrado para alertar sobre nuevos comentarios o experiencias pendientes.
