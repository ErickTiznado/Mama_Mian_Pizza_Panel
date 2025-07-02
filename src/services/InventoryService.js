/**
 * Servicio para la gestión del inventario
 * Proporciona funciones para CRUD de productos y generación de alertas
 */

import axios from 'axios';

const API_URL = 'https://api.mamamianpizza.com';

export class InventoryService {
  /**
   * Obtener todos los productos del inventario
   */
  static async getAllProducts() {
    try {
      const response = await fetch(`${API_URL}/api/inventory/getInventori`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching inventory:', error);
      throw new Error('No se pudieron cargar los productos del inventario');
    }
  }

  /**
   * Obtener estadísticas del inventario desde el backend
   */
  static async getInventoryStats() {
    try {
      const response = await fetch(`${API_URL}/api/inventory/getInventoriStats`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching inventory stats:', error);
      throw new Error('No se pudieron cargar las estadísticas del inventario');
    }
  }

  /**
   * Agregar un nuevo producto al inventario
   */
  static async addProduct(productData) {
    try {
      // Usar exactamente la estructura que espera la base de datos
      const formattedData = {
        nombre: productData.nombre,
        categoria: productData.categoria,
        cantidad: parseFloat(productData.cantidad),
        unidad: productData.unidad,
        fecha_caducidad: productData.fecha_caducidad,
        proveedor: productData.proveedor,
        costo: parseFloat(productData.costo)
      };

      const response = await axios.post(
        `${API_URL}/api/inventory/addInventori`,
        formattedData,
        { 
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          } 
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error adding product:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('No se pudo agregar el producto');
    }
  }

  /**
   * Actualizar un producto existente
   */
  static async updateProduct(productId, productData) {
    try {
      // Usar exactamente la estructura que espera la base de datos
      const formattedData = {
        nombre: productData.nombre,
        categoria: productData.categoria,
        cantidad: parseFloat(productData.cantidad),
        unidad: productData.unidad,
        fecha_caducidad: productData.fecha_caducidad,
        proveedor: productData.proveedor,
        costo: parseFloat(productData.costo)
      };

      const response = await axios.put(
        `${API_URL}/api/inventory/updateInventori/${productId}`,
        formattedData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('No se pudo actualizar el producto');
    }
  }

  /**
   * Eliminar un producto del inventario
   */
  static async deleteProduct(productId) {
    try {
      const response = await axios.delete(
        `${API_URL}/api/inventory/deleteInventori/${productId}`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('No se pudo eliminar el producto');
    }
  }

  /**
   * Generar alertas automáticas basadas en el inventario
   * También puede usar datos del backend si están disponibles
   */
  static generateAlerts(inventoryData, backendStats = null) {
    const alerts = [];
    const today = new Date();
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Si tenemos estadísticas del backend, usar esos datos
    if (backendStats) {
      // Alertas de stock bajo desde el backend
      if (backendStats.stockBajo?.productos) {
        backendStats.stockBajo.productos.forEach(item => {
          alerts.push({
            id: `stock-${item.id_ingrediente}`,
            type: item.cantidad_actual === 0 ? 'critical' : 'warning',
            category: 'stock',
            title: item.cantidad_actual === 0 ? 'Sin Stock' : 'Stock Bajo',
            message: item.cantidad_actual === 0 
              ? `${item.nombre}: Sin unidades disponibles`
              : `${item.nombre}: Solo ${item.cantidad_actual} ${item.unidad} restantes`,
            product: item.nombre,
            value: item.cantidad_actual,
            unit: item.unidad,
            priority: item.cantidad_actual === 0 ? 3 : 2
          });
        });
      }

      // Alertas de productos próximos a vencer desde el backend
      if (backendStats.proximosVencer?.productos) {
        backendStats.proximosVencer.productos.forEach(item => {
          const isExpired = item.dias_restantes <= 0;
          alerts.push({
            id: `expiry-${item.id_ingrediente}`,
            type: isExpired ? 'critical' : 'warning',
            category: 'expiry',
            title: isExpired ? 'Producto Vencido' : 'Próximo a Vencer',
            message: isExpired 
              ? `${item.nombre} venció el ${new Date(item.fecha_caducidad).toLocaleDateString()}`
              : `${item.nombre} vence en ${item.dias_restantes} días`,
            product: item.nombre,
            date: new Date(item.fecha_caducidad).toLocaleDateString(),
            daysRemaining: item.dias_restantes,
            priority: isExpired ? 3 : 2
          });
        });
      }
    } else {
      // Fallback: generar alertas localmente si no hay datos del backend
      inventoryData.forEach(item => {
        // Alertas de stock bajo
        const stock = parseFloat(item.cantidad_actual || 0);
        
        if (stock === 0) {
          alerts.push({
            id: `stock-${item.id_ingrediente}`,
            type: 'critical',
            category: 'stock',
            title: 'Sin Stock',
            message: `${item.nombre}: Sin unidades disponibles`,
            product: item.nombre,
            value: stock,
            unit: item.unidad,
            priority: 3
          });
        } else if (stock <= 5) {
          alerts.push({
            id: `stock-${item.id_ingrediente}`,
            type: 'warning',
            category: 'stock',
            title: 'Stock Bajo',
            message: `${item.nombre}: Solo ${stock} ${item.unidad} restantes`,
            product: item.nombre,
            value: stock,
            unit: item.unidad,
            priority: 2
          });
        }

        // Alertas de productos próximos a vencer
        if (item.fecha_caducidad) {
          const expiryDate = new Date(item.fecha_caducidad);
          const daysRemaining = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
          
          if (daysRemaining <= 0) {
            alerts.push({
              id: `expiry-${item.id_ingrediente}`,
              type: 'critical',
              category: 'expiry',
              title: 'Producto Vencido',
              message: `${item.nombre} venció el ${expiryDate.toLocaleDateString()}`,
              product: item.nombre,
              date: expiryDate.toLocaleDateString(),
              daysRemaining,
              priority: 3
            });
          } else if (daysRemaining <= 7) {
            alerts.push({
              id: `expiry-${item.id_ingrediente}`,
              type: 'warning',
              category: 'expiry',
              title: 'Próximo a Vencer',
              message: `${item.nombre} vence en ${daysRemaining} días`,
              product: item.nombre,
              date: expiryDate.toLocaleDateString(),
              daysRemaining,
              priority: 2
            });
          }
        }
      });
    }

    return alerts.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }

  /**
   * Calcular métricas del inventario 
   * Usa datos del backend si están disponibles, sino calcula localmente
   */
  static calculateMetrics(inventoryData, backendStats = null) {
    if (backendStats) {
      // Usar estadísticas del backend cuando estén disponibles
      return {
        totalItems: backendStats.totalProductos || 0,
        totalValue: backendStats.valorTotalInventario || 0,
        totalStock: inventoryData.reduce((sum, item) => 
          sum + parseFloat(item.cantidad_actual || 0), 0
        ),
        lowStockItems: backendStats.stockBajo?.cantidad || 0,
        expiringSoon: backendStats.proximosVencer?.cantidad || 0,
        categoryBreakdown: this.calculateCategoryBreakdown(inventoryData),
        statusBreakdown: this.calculateStatusBreakdown(inventoryData),
        averageCost: backendStats.valorTotalInventario / Math.max(backendStats.totalProductos, 1)
      };
    }

    // Fallback: calcular métricas localmente
    if (!inventoryData || inventoryData.length === 0) {
      return {
        totalItems: 0,
        totalValue: 0,
        totalStock: 0,
        lowStockItems: 0,
        expiringSoon: 0,
        categoryBreakdown: {},
        statusBreakdown: {},
        averageCost: 0
      };
    }

    const totalItems = inventoryData.length;
    const totalStock = inventoryData.reduce((sum, item) => 
      sum + parseFloat(item.cantidad_actual || 0), 0
    );
    const totalValue = inventoryData.reduce((sum, item) => 
      sum + (parseFloat(item.costo || 0) * parseFloat(item.cantidad_actual || 0)), 0
    );

    const lowStockItems = inventoryData.filter(item => 
      parseFloat(item.cantidad_actual || 0) <= 5
    ).length;

    const today = new Date();
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const expiringSoon = inventoryData.filter(item => {
      if (!item.fecha_caducidad) return false;
      const expiryDate = new Date(item.fecha_caducidad);
      return expiryDate <= weekFromNow;
    }).length;

    const categoryBreakdown = this.calculateCategoryBreakdown(inventoryData);
    const statusBreakdown = this.calculateStatusBreakdown(inventoryData);

    const averageCost = totalValue / Math.max(totalStock, 1);

    return {
      totalItems,
      totalValue,
      totalStock,
      lowStockItems,
      expiringSoon,
      categoryBreakdown,
      statusBreakdown,
      averageCost
    };
  }

  /**
   * Calcular distribución por categorías
   */
  static calculateCategoryBreakdown(inventoryData) {
    return inventoryData.reduce((acc, item) => {
      const category = item.categoria || 'Sin categoría';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
  }

  /**
   * Calcular distribución por estado
   */
  static calculateStatusBreakdown(inventoryData) {
    return inventoryData.reduce((acc, item) => {
      const status = item.estado || 'Normal';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
  }

  /**
   * Validar datos de producto antes de enviar al backend
   */
  static validateProductData(productData) {
    const errors = {};
    
    if (!productData.nombre?.trim()) {
      errors.nombre = 'El nombre del producto es obligatorio';
    }
    
    if (!productData.categoria?.trim()) {
      errors.categoria = 'La categoría es obligatoria';
    }
    
    const stock = productData.stock || productData.cantidad_actual;
    if (!stock || isNaN(parseFloat(stock)) || parseFloat(stock) < 0) {
      errors.stock = 'El stock debe ser un número válido mayor o igual a 0';
    }
    
    if (!productData.unidad?.trim()) {
      errors.unidad = 'La unidad de medida es obligatoria';
    }
    
    if (!productData.fecha_caducidad?.trim()) {
      errors.fecha_caducidad = 'La fecha de caducidad es obligatoria';
    } else {
      // Validar que la fecha no sea en el pasado (excepto para actualizaciones)
      const today = new Date();
      const expiryDate = new Date(productData.fecha_caducidad);
      if (expiryDate < today.setHours(0,0,0,0)) {
        errors.fecha_caducidad = 'La fecha de caducidad no puede ser en el pasado';
      }
    }
    
    if (!productData.proveedor?.trim()) {
      errors.proveedor = 'El proveedor es obligatorio';
    }
    
    if (!productData.costo || isNaN(parseFloat(productData.costo)) || parseFloat(productData.costo) <= 0) {
      errors.costo = 'El costo debe ser un número válido mayor a 0';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Formatear datos de producto para envío a la API
   */
  static formatProductData(formData) {
    return {
      nombre: formData.nombre.trim(),
      categoria: formData.categoria.trim(),
      cantidad_actual: parseFloat(formData.stock || formData.cantidad_actual),
      unidad: formData.unidad.trim(),
      fecha_caducidad: formData.fecha_caducidad,
      proveedor: formData.proveedor.trim(),
      costo: parseFloat(formData.costo),
      estado: formData.estado || 'Normal'
    };
  }

  /**
   * Obtener categorías disponibles (actualizadas para pizzería)
   */
  static getAvailableCategories() {
    return [
      'Quesos',
      'Carnes',
      'Vegetales',
      'Mariscos',
      'Salsas',
      'Harinas',
      'Aceites',
      'Condimentos',
      'Bebidas',
      'Lácteos',
      'Embutidos',
      'Conservas',
      'Congelados',
      'Otros'
    ];
  }

  /**
   * Obtener unidades de medida disponibles
   */
  static getAvailableUnits() {
    return [
      'kg',
      'g',
      'L',
      'ml',
      'piezas',
      'latas',
      'paquetes',
      'cajas',
      'bolsas',
      'bandejas',
      'unidades'
    ];
  }

  /**
   * Obtener recomendaciones basadas en alertas
   */
  static getRecommendations(alerts, inventoryData) {
    const recommendations = [];

    // Recomendaciones para stock bajo
    const lowStockAlerts = alerts.filter(alert => alert.category === 'stock');
    if (lowStockAlerts.length > 0) {
      recommendations.push({
        id: 'restock',
        type: 'action',
        title: 'Reabastecer productos',
        description: `Hay ${lowStockAlerts.length} productos con stock bajo que necesitan reabastecimiento.`,
        priority: 'high'
      });
    }

    // Recomendaciones para productos próximos a vencer
    const expiryAlerts = alerts.filter(alert => alert.category === 'expiry');
    if (expiryAlerts.length > 0) {
      recommendations.push({
        id: 'use-expiring',
        type: 'warning',
        title: 'Usar productos próximos a vencer',
        description: `${expiryAlerts.length} productos están próximos a vencer. Considera usarlos en promociones.`,
        priority: 'medium'
      });
    }

    // Recomendación para optimización de inventario
    const totalValue = inventoryData.reduce((sum, item) => 
      sum + (parseFloat(item.costo || 0) * parseFloat(item.cantidad_actual || 0)), 0
    );
    
    if (totalValue > 5000) {
      recommendations.push({
        id: 'optimize-inventory',
        type: 'info',
        title: 'Optimizar inventario',
        description: 'El valor del inventario es alto. Considera revisar las cantidades de stock.',
        priority: 'low'
      });
    }

    return recommendations;
  }

  /**
   * Función auxiliar para manejar errores de red
   */
  static handleNetworkError(error) {
    if (error.code === 'NETWORK_ERROR' || !navigator.onLine) {
      throw new Error('Sin conexión a internet. Verifica tu conexión e intenta nuevamente.');
    }
    
    if (error.response?.status === 401) {
      throw new Error('No tienes permisos para realizar esta acción.');
    }
    
    if (error.response?.status === 404) {
      throw new Error('El recurso solicitado no fue encontrado.');
    }
    
    if (error.response?.status >= 500) {
      throw new Error('Error del servidor. Intenta nuevamente en unos momentos.');
    }
    
    throw error;
  }
}

export default InventoryService;
