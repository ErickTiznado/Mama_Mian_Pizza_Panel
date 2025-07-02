/**
 * Script de prueba para verificar la integración con el backend de ingredientes de pizza
 * Ejecutar con: node test-pizza-ingredients.js
 */

const API_URL = 'https://api.mamamianpizza.com';

// Función para hacer peticiones fetch
async function testAPI(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  try {
    console.log(`\n🧪 Testing ${method} ${endpoint}`);
    const response = await fetch(`${API_URL}${endpoint}`, options);
    
    console.log(`   Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`   ✅ Success:`, data);
      return data;
    } else {
      const error = await response.text();
      console.log(`   ❌ Error:`, error);
      return null;
    }
  } catch (error) {
    console.log(`   💥 Exception:`, error.message);
    return null;
  }
}

async function runTests() {
  console.log('🍕 Probando endpoints de Pizza Ingredients\n');
  console.log('=' .repeat(60));

  // 1. Obtener todos los ingredientes de pizza
  const pizzaIngredients = await testAPI('/api/pizza-ingredients/getPizzaIngredients');

  // 2. Obtener ingredientes disponibles del inventario
  const availableIngredients = await testAPI('/api/pizza-ingredients/getAvailableIngredients');

  // 3. Obtener estadísticas
  const stats = await testAPI('/api/pizza-ingredients/getPizzaIngredientsStats');

  // 4. Si hay ingredientes disponibles, probar agregar uno
  if (availableIngredients && availableIngredients.length > 0) {
    const testIngredient = availableIngredients[0];
    console.log(`\n📝 Intentando agregar ingrediente: ${testIngredient.nombre}`);
    
    const addResult = await testAPI('/api/pizza-ingredients/addPizzaIngredient', 'POST', {
      id_ingrediente: testIngredient.id_ingrediente,
      precio_extra: 2.50
    });

    if (addResult) {
      const newPizzaIngredientId = addResult.id;
      
      // 5. Probar obtener un ingrediente específico
      await testAPI(`/api/pizza-ingredients/getPizzaIngredient/${newPizzaIngredientId}`);

      // 6. Probar actualizar precio
      await testAPI(`/api/pizza-ingredients/updatePizzaIngredient/${newPizzaIngredientId}`, 'PUT', {
        precio_extra: 3.00
      });

      // 7. Probar eliminar
      await testAPI(`/api/pizza-ingredients/deletePizzaIngredient/${newPizzaIngredientId}`, 'DELETE');
    }
  }

  console.log('\n' + '=' .repeat(60));
  console.log('🏁 Pruebas completadas');
}

// Ejecutar las pruebas
runTests().catch(error => {
  console.error('💥 Error en las pruebas:', error);
});
