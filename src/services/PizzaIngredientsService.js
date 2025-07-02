/**
 * Servicio para la gestión de ingredientes de personalización de pizzas
 * Proporciona funciones para CRUD de ingredientes de pizza con precios extra
 */

const API_URL = 'https://api.mamamianpizza.com';

export class PizzaIngredientsService {
  /**
   * Obtener todos los ingredientes disponibles para pizzas
   */
  static async getAllPizzaIngredients() {
    try {
      const response = await fetch(`${API_URL}/api/pizza-ingredients/getPizzaIngredients`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching pizza ingredients:', error);
      throw new Error('No se pudieron cargar los ingredientes de pizza');
    }
  }

  /**
   * Obtener un ingrediente específico de pizza
   */
  static async getPizzaIngredient(id) {
    try {
      const response = await fetch(`${API_URL}/api/pizza-ingredients/getPizzaIngredient/${id}`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching pizza ingredient:', error);
      throw new Error('No se pudo cargar el ingrediente de pizza');
    }
  }

  /**
   * Obtener ingredientes del inventario disponibles para agregar
   */
  static async getAvailableIngredients() {
    try {
      const response = await fetch(`${API_URL}/api/pizza-ingredients/getAvailableIngredients`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching available ingredients:', error);
      throw new Error('No se pudieron cargar los ingredientes disponibles');
    }
  }

  /**
   * Obtener estadísticas de ingredientes de pizza
   */
  static async getPizzaIngredientsStats() {
    try {
      const response = await fetch(`${API_URL}/api/pizza-ingredients/getPizzaIngredientsStats`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching pizza ingredients stats:', error);
      throw new Error('No se pudieron cargar las estadísticas de ingredientes de pizza');
    }
  }

  /**
   * Agregar un ingrediente del inventario a la lista de ingredientes de pizza
   */
  static async addPizzaIngredient(ingredientData) {
    try {
      // Estructura esperada: { id_ingrediente, precio_extra }
      const formattedData = {
        id_ingrediente: ingredientData.id_ingrediente,
        precio_extra: parseFloat(ingredientData.precio_extra)
      };

      const response = await fetch(`${API_URL}/api/pizza-ingredients/addPizzaIngredient`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formattedData)
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error adding pizza ingredient:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('No se pudo agregar el ingrediente a la pizza');
    }
  }

  /**
   * Actualizar el precio extra de un ingrediente de pizza
   */
  static async updatePizzaIngredient(pizzaIngredientId, updateData) {
    try {
      const formattedData = {
        precio_extra: parseFloat(updateData.precio_extra)
      };

      const response = await fetch(`${API_URL}/api/pizza-ingredients/updatePizzaIngredient/${pizzaIngredientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formattedData)
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating pizza ingredient:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('No se pudo actualizar el ingrediente de pizza');
    }
  }

  /**
   * Eliminar un ingrediente de la lista de ingredientes de pizza
   */
  static async deletePizzaIngredient(pizzaIngredientId) {
    try {
      const response = await fetch(`${API_URL}/api/pizza-ingredients/deletePizzaIngredient/${pizzaIngredientId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting pizza ingredient:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('No se pudo eliminar el ingrediente de pizza');
    }
  }

  /**
   * Obtener ingredientes disponibles para el ecommerce
   * (Alias para getAllPizzaIngredients)
   */
  static async getEcommerceIngredients() {
    return this.getAllPizzaIngredients();
  }

  /**
   * Validar si un ingrediente ya está en la lista de ingredientes de pizza
   */
  static async isIngredientInPizzaList(ingredientId) {
    try {
      const pizzaIngredients = await this.getAllPizzaIngredients();
      return pizzaIngredients.some(item => item.id_ingrediente === ingredientId);
    } catch (error) {
      console.error('Error checking ingredient in pizza list:', error);
      return false;
    }
  }

  /**
   * Generar estadísticas de ingredientes de pizza
   */
  static generatePizzaIngredientsStats(pizzaIngredients) {
    if (!pizzaIngredients || pizzaIngredients.length === 0) {
      return {
        totalIngredients: 0,
        averagePrice: 0,
        categoryBreakdown: {},
        priceRanges: {
          low: 0,
          medium: 0,
          high: 0
        }
      };
    }

    const totalIngredients = pizzaIngredients.length;
    const totalPrice = pizzaIngredients.reduce((sum, item) => sum + (item.precio_extra || 0), 0);
    const averagePrice = totalPrice / totalIngredients;

    // Desglose por categoría
    const categoryBreakdown = pizzaIngredients.reduce((acc, item) => {
      const category = item.categoria || 'Sin categoría';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    // Rangos de precio (basado en precio extra)
    const priceRanges = pizzaIngredients.reduce((acc, item) => {
      const price = item.precio_extra || 0;
      if (price < 1) acc.low++;
      else if (price < 3) acc.medium++;
      else acc.high++;
      return acc;
    }, { low: 0, medium: 0, high: 0 });

    return {
      totalIngredients,
      averagePrice: Math.round(averagePrice * 100) / 100,
      categoryBreakdown,
      priceRanges
    };
  }
}

export default PizzaIngredientsService;
