# Corrección del Error de Aprobación de Comentarios

## Problema Identificado

El sistema estaba enviando datos incorrectos al API cuando se intentaba aprobar o rechazar comentarios, resultando en el error:

```json
{
  "message": "El estado de aprobación debe ser 0 (no visible) o 1 (visible)"
}
```

## Causa del Error

1. **Conversión Incorrecta de Datos**: Los servicios no estaban convirtiendo correctamente los valores booleanos (`true`/`false`) a números (`0`/`1`) que espera la API.

2. **Falta de Validación**: No había validación del formato de datos antes de enviar la petición.

3. **Inconsistencia entre Servicios**: Los servicios de experiencias y reseñas manejaban los datos de forma ligeramente diferente.

## Soluciones Implementadas

### 1. Función de Validación Centralizada

Se creó una función `validarEstadoAprobacion()` en `src/utils/debugUtils.js` que:
- Convierte `true` → `1` y `false` → `0`
- Valida que el valor sea correcto antes de enviarlo
- Maneja diferentes tipos de entrada (boolean, string, number)

### 2. Mejoras en los Servicios

**ResenasService.js**:
- Usa `validarEstadoAprobacion()` para garantizar formato correcto
- Añade debugging detallado para rastrear errores
- Mejora el manejo de errores con más información

**ExperienciasService.js**:
- Implementa la misma validación y debugging
- Mantiene consistencia con el servicio de reseñas

### 3. Sistema de Debug Mejorado

Se añadieron utilidades de debugging que muestran:
- Los datos que se envían en cada petición
- Las respuestas del servidor
- Información detallada sobre errores

## Formato Correcto de Datos

La API espera:
```json
{
  "aprobada": 1  // Para aprobar (visible)
}
```

o

```json
{
  "aprobada": 0  // Para rechazar (no visible)
}
```

## Cómo Usar

Los componentes siguen usando la misma interfaz:
```javascript
// Aprobar
handleComentarioApproval(comentarioId, true);

// Rechazar  
handleComentarioApproval(comentarioId, false);
```

Los servicios se encargan automáticamente de la conversión correcta.

## Verificación

Para verificar que el fix funciona:
1. Abre las Developer Tools del navegador
2. Ve a la consola
3. Intenta aprobar/rechazar un comentario
4. Verifica en la consola que aparezcan los logs de debug mostrando los datos correctos

Los logs deberían mostrar algo como:
```
🔍 API Request Debug: PUT https://api.mamamianpizza.com/api/resenas/estado/123
📤 Datos enviados: {aprobada: 1}
```
