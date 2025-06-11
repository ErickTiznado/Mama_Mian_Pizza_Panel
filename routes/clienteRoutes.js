const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Ruta para obtener resumen del cliente por teléfono
router.get('/resumen/:telefono', async (req, res) => {
    try {
        const { telefono } = req.params;
        let connection = await pool.promise().getConnection();
        
        // Buscar cliente registrado
        const [usuarioRegistrado] = await connection.query(`
            SELECT 
                u.id_usuario,
                u.nombre,
                u.correo,
                u.celular,
                COUNT(p.id_pedido) as total_pedidos,
                SUM(p.total) as total_gastado,
                AVG(p.total) as promedio_gasto,
                MAX(p.fecha_pedido) as ultimo_pedido
            FROM usuarios u
            LEFT JOIN pedidos p ON u.id_usuario = p.id_usuario
            WHERE u.celular = ?
            GROUP BY u.id_usuario
        `, [telefono]);

        // Buscar cliente invitado
        const [usuarioInvitado] = await connection.query(`
            SELECT 
                ui.id_usuario_invitado,
                ui.nombre,
                ui.apellido,
                ui.celular,
                COUNT(p.id_pedido) as total_pedidos,
                SUM(p.total) as total_gastado,
                AVG(p.total) as promedio_gasto,
                MAX(p.fecha_pedido) as ultimo_pedido
            FROM usuarios_invitados ui
            LEFT JOIN pedidos p ON ui.id_usuario_invitado = p.id_usuario_invitado
            WHERE ui.celular = ?
            GROUP BY ui.id_usuario_invitado
        `, [telefono]);

        // Obtener direcciones utilizadas
        const [direccionesUsadas] = await connection.query(`
            SELECT DISTINCT
                d.direccion,
                d.municipio,
                d.departamento,
                d.pais,
                d.direccion_formateada,
                COUNT(p.id_pedido) as veces_usado
            FROM direcciones d
            INNER JOIN pedidos p ON d.id_direccion = p.id_direccion
            INNER JOIN usuarios u ON d.id_usuario = u.id_usuario
            WHERE u.celular = ?
            GROUP BY d.id_direccion
            ORDER BY veces_usado DESC
            LIMIT 3
        `, [telefono]);

        // Obtener productos más pedidos
        const [productosFavoritos] = await connection.query(`
            SELECT 
                dp.nombre_producto,
                SUM(dp.cantidad) as total_cantidad,
                COUNT(DISTINCT p.id_pedido) as veces_pedido,
                AVG(dp.precio_unitario) as precio_promedio
            FROM detalle_pedidos dp
            INNER JOIN pedidos p ON dp.id_pedido = p.id_pedido
            INNER JOIN usuarios u ON p.id_usuario = u.id_usuario
            WHERE u.celular = ?
            GROUP BY dp.nombre_producto
            ORDER BY total_cantidad DESC
            LIMIT 5
        `, [telefono]);

        connection.release();

        let resumenCliente = null;

        if (usuarioRegistrado.length > 0) {
            resumenCliente = {
                tipo_cliente: 'registrado',
                ...usuarioRegistrado[0],
                direcciones_frecuentes: direccionesUsadas,
                productos_favoritos: productosFavoritos
            };
        } else if (usuarioInvitado.length > 0) {
            resumenCliente = {
                tipo_cliente: 'invitado',
                ...usuarioInvitado[0],
                direcciones_frecuentes: direccionesUsadas,
                productos_favoritos: productosFavoritos
            };
        }

        if (resumenCliente) {
            res.status(200).json({
                message: 'Resumen del cliente obtenido exitosamente',
                cliente: resumenCliente
            });
        } else {
            res.status(404).json({
                message: 'Cliente no encontrado',
                cliente: null
            });
        }

    } catch (error) {
        console.error('Error al obtener resumen del cliente:', error);
        res.status(500).json({
            message: 'Error al obtener resumen del cliente',
            error: error.message
        });
    }
});

module.exports = router;
