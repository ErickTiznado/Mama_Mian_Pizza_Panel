import { useState, useEffect } from "react";
import { X, ArrowLeft, Check, User, MapPin, CreditCard, ShoppingCart } from "lucide-react";
import "./NewOrderModal.css";

// Tabla de precios por pizza y tamaño
const PIZZA_PRICES = {
  "Pepperoni": { personal: 6, mediana: 8, grande: 10 },
  "Hawaiana": { personal: 8, mediana: 10, grande: 12 },
  "Suprema": { personal: 8, mediana: 10, grande: 12 },
  "Vegetariana": { personal: 8, mediana: 10, grande: 12 },
  "4 Quesos": { personal: 10, mediana: 12, grande: 14 },
  // Especialidades
  "Curil o Camarón": { "super_personal": 7, "mediana_8pc": 14, "grande_10pc": 17, "gigante_12pc": 20 },
  "4 Quesos Suprema": { "super_personal": 5, "mediana_8pc": 12, "grande_10pc": 14, "gigante_12pc": 16 },
  "Suprema (Especialidad)": { "mediana_8pc": 8, "grande_10pc": 10, "gigante_12pc": 12 }
};

// Función para obtener el precio correcto según pizza y tamaño
const getPizzaPrice = (pizzaName, tamaño) => {
  const prices = PIZZA_PRICES[pizzaName];
  if (!prices) return 0;
  return prices[tamaño] || 0;
};

const Step1 = ({ clienteData, onClienteChange }) => {
  
  const handleInputChange = (field, value) => {
    onClienteChange({
      ...clienteData,
      [field]: value
    });
  };

  return (
    <div className="step-container">
      <h3><User className="inline-icon" /> Datos de Cliente</h3>
      
      {/* Formulario básico de cliente */}
      <div className="form-grid">
        <div className="step1-form-name">
          <div className="step1-form-input">
            <label htmlFor="name">Nombre *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={clienteData.nombre || ""}
              onChange={(e) => handleInputChange("nombre", e.target.value)}
              placeholder="Nombre del cliente"
              required
            />
          </div>
          <div className="step1-form-input">
            <label htmlFor="lastname">Apellido *</label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={clienteData.apellido || ""}
              onChange={(e) => handleInputChange("apellido", e.target.value)}
              placeholder="Apellido del cliente"
              required
            />
          </div>
        </div>

        <div className="step1-form-input">
          <label htmlFor="phone">Teléfono *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={clienteData.telefono || ""}
            onChange={(e) => handleInputChange("telefono", e.target.value)}
            placeholder="Teléfono del cliente"
            required
          />
        </div>

        <div className="step1-form-input">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={clienteData.email || ""}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="correo@ejemplo.com (opcional)"
          />
        </div>

        <div className="step1-form-input">
          <label htmlFor="direccion">Dirección de Entrega *</label>
          <input
            type="text"
            id="direccion"
            value={clienteData.direccion || ""}
            onChange={(e) => handleInputChange("direccion", e.target.value)}
            placeholder="Dirección completa de entrega"
            required
          />
        </div>

        {/* Método de pago simplificado */}
        <div className="payment-section">
          <h4><CreditCard className="inline-icon" /> Método de Pago</h4>
          
          <div className="payment-methods">
            <label>
              <input 
                type="radio" 
                value="efectivo" 
                checked={clienteData.metodo_pago === "efectivo"}
                onChange={(e) => handleInputChange("metodo_pago", e.target.value)}
              />
              Efectivo
            </label>
            <label>
              <input 
                type="radio" 
                value="pago_en_linea" 
                checked={clienteData.metodo_pago === "pago_en_linea"}
                onChange={(e) => handleInputChange("metodo_pago", e.target.value)}
              />
              Pago en línea (Wompi)
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

const Step2 = ({ menu, onUpdateProductos, selectedProducts }) => {
  const [categoryFilter, setCategoryFilter] = useState(0);
  const [selected, setSelected] = useState(selectedProducts || []);
  const [focused, setFocused] = useState(null);
  
  // Comunica al padre la selección actual
  useEffect(() => {
    onUpdateProductos(selected);
  }, [selected, onUpdateProductos]);

  // Listado de categorías dinámicas
  const categories = ["Todas","Pizza", "Complementos","Bebidas"];
  const Ingredientes = ["Queso", "Peperoni", "Champiñones", "Cebolla", "Chile", "Aceitunas", "Camaron", "Curiles", "Jamo", "Salami", "Salchicha Italiana"," Chorizo", "Loroco", "Jalapeño" ];
  
  const filteredMenu =
    categoryFilter === 0
      ? menu
      : menu.filter((p) => p.id_categoria === categoryFilter);

  // Función para calcular precio dinámico
  const calculateProductPrice = (product, tamano) => {
    const dynamicPrice = getPizzaPrice(product.titulo, tamano);
    return dynamicPrice > 0 ? dynamicPrice : product.precio;
  };

  // Obtener tamaños únicos disponibles para un producto
  const getAvailableSizes = (product) => {
    const allSizes = [
      { label: "Personal (4 porciones)", value: "personal" },
      { label: "Mediana (6 porciones)", value: "mediana" },
      { label: "Grande (8 porciones)", value: "grande" },
      { label: "Súper Personal", value: "super_personal" },
      { label: "Mediana (8 pc)", value: "mediana_8pc" },
      { label: "Grande (10 pc)", value: "grande_10pc" },
      { label: "Gigante (12 pc)", value: "gigante_12pc" },
    ];

    // Filtrar solo los tamaños que tienen precio definido para esta pizza
    const pizzaPrices = PIZZA_PRICES[product.titulo];
    if (!pizzaPrices) return allSizes.slice(0, 3); // Por defecto personal, mediana, grande

    return allSizes.filter(size => pizzaPrices[size.value] !== undefined);
  };

  // Selección o deselección de un producto
  const toggleSelect = (prod) => {
    const exists = selected.find((p) => p.id_producto === prod.id_producto);
    if (exists) {
      setSelected(selected.filter((p) => p.id_producto !== prod.id_producto));
    } else {
      const availableSizes = getAvailableSizes(prod);
      const defaultTamano = availableSizes[0]?.value || "personal";
      const dynamicPrice = calculateProductPrice(prod, defaultTamano);
      
      setSelected([
        ...selected,
        {
          ...prod,
          cantidad: 1,
          masa: prod.masas?.[0] || "Tradicional",
          tamano: defaultTamano,
          precio_unitario: dynamicPrice,
          precio: dynamicPrice,
          removedIngredients: [],
          addedIngredients: [],
          isCustomizing: false,
        },
      ]);
    }
  };

  const onCardClick = (prod) => {
    if (focused?.id_producto === prod.id_producto) {
      setFocused(null);
      return;
    }
    
    const availableSizes = getAvailableSizes(prod);
    const defaultTamano = availableSizes[0]?.value || "personal";
    const dynamicPrice = calculateProductPrice(prod, defaultTamano);
    
    const focusedProduct = {
      ...prod,
      cantidad: 1,
      masa: prod.masas?.[0] || "Tradicional",
      tamano: defaultTamano,
      precio_unitario: dynamicPrice,
      precio: dynamicPrice,
      removedIngredients: [],
      addedIngredients: [],
    };
    
    setFocused(focusedProduct);
    
    // Actualizar en selected también
    const existingIndex = selected.findIndex(p => p.id_producto === prod.id_producto);
    if (existingIndex >= 0) {
      const newSelected = [...selected];
      newSelected[existingIndex] = focusedProduct;
      setSelected(newSelected);
    } else {
      setSelected([...selected, focusedProduct]);
    }
  };

  const masaOptions = ["Delgada", "Tradicional"];
  
  const isSelected = (prod) => {
    return selected.find((p) => p.id_producto === prod.id_producto) !== undefined;
  };

  // Actualizar precio cuando cambia el tamaño
  const updateTamanoAndPrice = (newTamano) => {
    const newPrice = calculateProductPrice(focused, newTamano);
    const updatedFocused = { 
      ...focused, 
      tamano: newTamano, 
      precio: newPrice,
      precio_unitario: newPrice 
    };
    
    setFocused(updatedFocused);
    
    // Actualizar en selected también
    const existingIndex = selected.findIndex(p => p.id_producto === focused.id_producto);
    if (existingIndex >= 0) {
      const newSelected = [...selected];
      newSelected[existingIndex] = updatedFocused;
      setSelected(newSelected);
    }
  };

  // Función para confirmar producto personalizado
  const confirmCustomization = () => {
    const existingIndex = selected.findIndex(p => p.id_producto === focused.id_producto);
    if (existingIndex >= 0) {
      const newSelected = [...selected];
      newSelected[existingIndex] = focused;
      setSelected(newSelected);
    } else {
      setSelected([...selected, focused]);
    }
    setFocused(null);
  };

  if (focused) {
    const availableSizes = getAvailableSizes(focused);
    
    return (
      <div className="focused-view" role="region" aria-label="Personalización de pizza">
        <header className="focused-header">
          <button className="nor-back-btn" onClick={() => setFocused(null)}>
            <ArrowLeft /> Volver al menú
          </button>
          <h3>Personalizar {focused.titulo}</h3>
        </header>
        <main className="focused-main">
          <div className="focused-product-details">
            <img src={focused.imagen} alt="" />
            <div className="focused-product-price">
              <p>Precio Total:</p>
              <h3 className="product-price">${focused.precio}</h3>
            </div>
          </div>
          <div className="focused-product-options">
            {/* ————————— MASA ————————— */}
            <div className="option-group">
              <h4>Selecciona Masa</h4>
              <div className="options-grid">
                {masaOptions.map((m) => (
                  <div
                    key={m}
                    role="button"
                    tabIndex={0}
                    className={`option-card ${focused.masa === m ? "selected" : ""}`}
                    onClick={() => setFocused(prev => ({ ...prev, masa: m }))}
                    onKeyDown={e => (e.key === "Enter" || e.key === " ") && setFocused(prev => ({ ...prev, masa: m }))}
                    aria-pressed={focused.masa === m}
                  >
                    {m}
                    {focused.masa === m && <Check className="check-icon" />}
                  </div>
                ))}
              </div>
            </div>

            {/* —————— TAMAÑO —————— */}
            <div className="option-group">
              <h4>Selecciona Tamaño</h4>
              <div className="options-grid">
                {availableSizes.map((s) => (
                  <div
                    key={s.value}
                    role="button"
                    tabIndex={0}
                    className={`option-card ${focused.tamano === s.value ? "selected" : ""}`}
                    onClick={() => updateTamanoAndPrice(s.value)}
                    onKeyDown={e => (e.key === "Enter" || e.key === " ") && updateTamanoAndPrice(s.value)}
                    aria-pressed={focused.tamano === s.value}
                  >
                    {s.label}
                    {focused.tamano === s.value && <Check className="check-icon" />}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="option-group">
              <h4>Selecciona Ingredientes</h4>  
              <div className="options-grid">
                {Ingredientes.map((ing) => {
                  const ingSelected = focused.addedIngredients.includes(ing);

                  const toggleIngredient = () => {
                    setFocused(prev => {
                      const {addedIngredients} = prev;
                      const newIngredients = ingSelected
                        ? addedIngredients.filter(item => item !== ing)
                        : [...addedIngredients, ing];
                      return {...prev, addedIngredients: newIngredients};
                    });
                  };

                  return(
                    <div key={ing} role="button" tabIndex={0}
                      className={`option-card ${ingSelected ? "selected" : ""}`}
                      onClick={toggleIngredient} 
                      onKeyDown={e => (e.key === "Enter" || e.key === " ") && toggleIngredient()}
                      aria-pressed={ingSelected}>
                      {ing}
                      {ingSelected && <Check className="check-icon" />}
                    </div>
                  )
                })}
              </div>
            </div>
            
            {/* Cantidad */}
            <div className="option-group">
              <h4>Cantidad</h4>
              <div className="quantity-controls">
                <button 
                  className="quantity-btn"
                  onClick={() => setFocused(prev => ({ 
                    ...prev, 
                    cantidad: Math.max(1, prev.cantidad - 1) 
                  }))}
                >
                  -
                </button>
                <span className="quantity-display">{focused.cantidad}</span>
                <button 
                  className="quantity-btn"
                  onClick={() => setFocused(prev => ({ 
                    ...prev, 
                    cantidad: prev.cantidad + 1 
                  }))}
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Botón para confirmar */}
            <div className="option-group">
              <button className="nor-button confirm-btn" onClick={confirmCustomization}>
                Confirmar Producto - ${(focused.precio * focused.cantidad).toFixed(2)}
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="step-container">
      <h3><ShoppingCart className="inline-icon" /> Seleccionar Productos</h3>
      
      {/* 1) Filtro de categorías */}
      <div className="nor-product-filter-bar">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`nor-filter-btn ${
              categoryFilter === categories.indexOf(cat) ? "active" : ""
            }`}
            onClick={() => setCategoryFilter(categories.indexOf(cat))}
          >
            {cat}
          </button>
        ))}
      </div>
        
      {/* 2) Grid de productos */}
      <div className="nor-product-grid">
        {filteredMenu.map((prod) => {
          const availableSizes = getAvailableSizes(prod);
          const defaultTamano = availableSizes[0]?.value || "personal";
          const displayPrice = calculateProductPrice(prod, defaultTamano);
          
          return (
            <div
              key={prod.id_producto}
              className={`nor-product-card ${ 
                focused?.id_producto === prod.id_producto ? "focused" : 
                isSelected(prod) ? "selected" : ""                
              }`}
              onClick={() => onCardClick(prod)}
            >
              <img src={prod.imagen} alt={prod.titulo} />
              <h4>{prod.titulo}</h4>
              <p className="product-price">${displayPrice}</p>
            </div>
          );
        })}
      </div>

      {/* Panel de productos seleccionados */}
      {selected.length > 0 && (
        <div className="nor-selected-panel">
          <h4>Productos Seleccionados ({selected.length})</h4>
          {selected.map((item, index) => (
            <div key={`${item.id_producto}-${index}`} className="nor-selected-item">
              <div className="nor-selected-header">
                <div>
                  <h5>{item.titulo}</h5>
                  <p>Tamaño: {item.tamano} | Masa: {item.masa} | Cantidad: {item.cantidad}</p>
                  <p>Precio unitario: ${item.precio}</p>
                </div>
                <div className="item-total">
                  <strong>${(item.precio * item.cantidad).toFixed(2)}</strong>
                </div>
                <button 
                  className="remove-item-btn"
                  onClick={() => setSelected(selected.filter((_, i) => i !== index))}
                >
                  <X size={16} />
                </button>
              </div>
              {item.addedIngredients.length > 0 && (
                <div className="added-ingredients">
                  <small>Ingredientes extra: {item.addedIngredients.join(", ")}</small>
                </div>
              )}
            </div>
          ))}
          <div className="selected-total">
            <strong>
              Total: ${selected.reduce((sum, item) => sum + (item.precio * item.cantidad), 0).toFixed(2)}
            </strong>
          </div>
        </div>
      )}
    </div>
  );
};

const Step3 = ({ clienteData, selectedProducts, onSubmitFinal }) => {
  const [loading, setLoading] = useState(false);
  const [aceptadoTerminos, setAceptadoTerminos] = useState(false);

  // Calcular totales
  const subtotal = selectedProducts.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  const costoEnvio = 2.50; // Costo fijo de envío
  const impuestos = subtotal * 0.13; // 13% de impuestos
  const total = subtotal + costoEnvio + impuestos;

  const handleSubmit = async () => {
    if (!aceptadoTerminos) {
      alert("Debe aceptar los términos y condiciones");
      return;
    }

    setLoading(true);
    try {
      await onSubmitFinal({
        clienteData,
        selectedProducts,
        subtotal,
        costoEnvio,
        impuestos,
        total,
        aceptadoTerminos
      });
    } catch (error) {
      console.error("Error al enviar pedido:", error);
      alert("Error al procesar el pedido. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="step-container">
      <h3>📋 Resumen del Pedido</h3>
      
      {/* Resumen del Cliente */}
      <div className="order-summary-section">
        <h4><User className="inline-icon" /> Información del Cliente</h4>
        <div className="client-summary">
          <div className="summary-row">
            <strong>Nombre:</strong> {clienteData.nombre} {clienteData.apellido}
          </div>
          <div className="summary-row">
            <strong>Teléfono:</strong> {clienteData.telefono}
          </div>
          {clienteData.email && (
            <div className="summary-row">
              <strong>Email:</strong> {clienteData.email}
            </div>
          )}
          <div className="summary-row">
            <strong>Dirección:</strong> {clienteData.direccion}
          </div>
        </div>
      </div>

      {/* Método de Pago */}
      <div className="order-summary-section">
        <h4><CreditCard className="inline-icon" /> Método de Pago</h4>
        <div className="payment-summary">
          <div className="summary-row">
            <strong>Método:</strong> {clienteData.metodo_pago === "efectivo" ? "Efectivo" : "Pago en línea (Wompi)"}
          </div>
        </div>
      </div>

      {/* Resumen de Productos */}
      <div className="order-summary-section">
        <h4><ShoppingCart className="inline-icon" /> Productos Seleccionados</h4>
        <div className="products-summary">
          {selectedProducts.map((item, index) => (
            <div key={`${item.id_producto}-${index}`} className="product-summary-item">
              <div className="product-info">
                <div className="product-name">{item.titulo}</div>
                <div className="product-details">
                  {item.tamano && <span>Tamaño: {item.tamano}</span>}
                  {item.masa && <span> | Masa: {item.masa}</span>}
                  <span> | Cantidad: {item.cantidad}</span>
                </div>
                {item.addedIngredients && item.addedIngredients.length > 0 && (
                  <div className="added-ingredients">
                    <small>Ingredientes extra: {item.addedIngredients.join(", ")}</small>
                  </div>
                )}
              </div>
              <div className="product-price">
                <span className="unit-price">${item.precio} c/u</span>
                <span className="total-price">${(item.precio * item.cantidad).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resumen de Costos */}
      <div className="order-summary-section">
        <h4>💰 Resumen de Costos</h4>
        <div className="cost-summary">
          <div className="cost-row">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="cost-row">
            <span>Costo de envío:</span>
            <span>${costoEnvio.toFixed(2)}</span>
          </div>
          <div className="cost-row">
            <span>Impuestos (13%):</span>
            <span>${impuestos.toFixed(2)}</span>
          </div>
          <div className="cost-row total-row">
            <span><strong>Total:</strong></span>
            <span><strong>${total.toFixed(2)}</strong></span>
          </div>
        </div>
      </div>

      {/* Términos y Condiciones */}
      <div className="terms-section">
        <label className="terms-checkbox">
          <input 
            type="checkbox" 
            checked={aceptadoTerminos}
            onChange={(e) => setAceptadoTerminos(e.target.checked)}
          />
          Acepto los términos y condiciones del servicio
        </label>
      </div>

      {/* Botón de Confirmación */}
      <div className="confirm-section">
        <button 
          className={`nor-button confirm-order-btn ${!aceptadoTerminos ? 'disabled' : ''}`}
          onClick={handleSubmit}
          disabled={!aceptadoTerminos || loading}
        >
          {loading ? "Procesando..." : `Confirmar Pedido - $${total.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
};

const NewOrderModal = ({ show, onClose }) => {
  const API_URL = "https://api.mamamianpizza.com/api";
  const totalSteps = 3;

  const [currentStep, setCurrentStep] = useState(1);
  const [menu, setMenu] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [clienteData, setClienteData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    direccion: "",
    metodo_pago: "efectivo"
  });

  const nextStep = () => {
    // Validaciones antes de avanzar
    if (currentStep === 1) {
      if (!clienteData.nombre || !clienteData.telefono || !clienteData.direccion) {
        alert("Por favor complete todos los campos obligatorios");
        return;
      }
      if (!clienteData.metodo_pago) {
        alert("Seleccione un método de pago");
        return;
      }
    }
    
    if (currentStep === 2) {
      if (selectedProducts.length === 0) {
        alert("Debe seleccionar al menos un producto");
        return;
      }
    }
    
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () =>
    setCurrentStep((prev) => Math.max(prev - 1, 1));

  const resetSteps = () => {
    setCurrentStep(1);
    setSelectedProducts([]);
    setClienteData({
      nombre: "",
      apellido: "",
      telefono: "",
      email: "",
      direccion: "",
      metodo_pago: "efectivo"
    });
  };

  // Función para enviar el pedido (simplificada sin API por ahora)
  const submitOrder = async (orderData) => {
    try {
      console.log("Datos del pedido:", {
        cliente: clienteData,
        productos: selectedProducts,
        totales: {
          subtotal: orderData.subtotal,
          envio: orderData.costoEnvio,
          impuestos: orderData.impuestos,
          total: orderData.total
        }
      });

      // Simular éxito
      alert("¡Pedido creado exitosamente!");
      onClose();
      resetSteps();
    } catch (error) {
      console.error('Error al enviar pedido:', error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const resp = await fetch(`${API_URL}/content/getMenu`);
        const data = await resp.json();
        setMenu(data.productos);
      } catch (err) {
        console.error("Error fetching menu:", err);
        // Datos mock para desarrollo
        setMenu([
          {
            id_producto: 1,
            titulo: "Pepperoni",
            precio: 8,
            imagen: "/placeholder-pizza.jpg",
            id_categoria: 1
          },
          {
            id_producto: 2,
            titulo: "Hawaiana",
            precio: 10,
            imagen: "/placeholder-pizza.jpg",
            id_categoria: 1
          }
        ]);
      }
    };
    
    if (show) {
      fetchMenu();
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="new-order-modal">
      <header className="new__order-modal-header">
        <div className="new__order-modal-header-title">
          <h2>Nuevo Pedido</h2>
          <button
            onClick={() => {
              onClose();
              resetSteps();
            }}
            className="new__order-modal-close-button"
          >
            <X />
          </button>
        </div>
        <div className="new__order-modal-header-steps">
          <span className="nor-step-progress-text">
            Paso {currentStep} de {totalSteps}
          </span>
          <div className="nor-step-progress-bar-container">
            <div
              className="nor-step-progress-bar"
              style={{
                width: `${(currentStep / totalSteps) * 100}%`,
              }}
            />
          </div>
        </div>
      </header>

      <div className="new__order-modal-content">
        {currentStep === 1 && (
          <Step1 
            clienteData={clienteData}
            onClienteChange={setClienteData}
          />
        )}
        {currentStep === 2 && (
          <Step2
            menu={menu}
            selectedProducts={selectedProducts}
            onUpdateProductos={setSelectedProducts}
          />
        )}
        {currentStep === 3 && (
          <Step3 
            clienteData={clienteData}
            selectedProducts={selectedProducts}
            onSubmitFinal={submitOrder}
          />
        )}
      </div>

      <footer className="new__order-modal-footer">
        <div className="new__order-modal-footer-buttons">
          {currentStep > 1 && (
            <button
              className="nor-button"
              onClick={prevStep}
            >
              Anterior
            </button>
          )}
          {currentStep < totalSteps ? (
            <button
              className="nor-button"
              onClick={nextStep}
            >
              Siguiente
            </button>
          ) : null}
        </div>
      </footer>
    </div>
  );
};

export default NewOrderModal;
