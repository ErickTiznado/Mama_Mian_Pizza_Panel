import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, ShoppingCart, User, CreditCard, X } from 'lucide-react';
import { useNotifications } from '../../../context/NotificationContext';
import './NewOrderModal.css';

// Tabla de precios por pizza y tamaño
const PIZZA_PRICES = {
  // Pizzas regulares
  "Pepperoni": { personal: 6, mediana: 8, grande: 10 },
  "Hawaiana": { personal: 8, mediana: 10, grande: 12 },
  "Suprema": { personal: 8, mediana: 10, grande: 12 },
  "Vegetariana": { personal: 8, mediana: 10, grande: 12 },
  "4 Quesos": { personal: 10, mediana: 12, grande: 14 },
  // Especialidades
  "Curil o Camarón": { super_personal: 7, mediana_8pc: 14, grande_10pc: 17, gigante_12pc: 20 },
  "4 Quesos Suprema": { super_personal: 5, mediana_8pc: 12, grande_10pc: 14, gigante_12pc: 16 },
  "Suprema (Especialidad)": { mediana_8pc: 8, grande_10pc: 10, gigante_12pc: 12 }
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
      <h3>Datos de Cliente</h3>
      
      <form className="step1-form">
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
            <label htmlFor="lastname">Apellido</label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={clienteData.apellido || ""}
              onChange={(e) => handleInputChange("apellido", e.target.value)}
              placeholder="Apellido del cliente"
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

        {/* Método de pago simplificado */}
        <div className="payment-section">
          <h4>Método de Pago</h4>
          
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
      </form>
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

  // Efecto para mantener sincronizado el producto enfocado con la lista seleccionada
  useEffect(() => {
    if (focused) {
      setSelected(prevSelected => {
        const existingIndex = prevSelected.findIndex(p => p.id === focused.id);
        if (existingIndex >= 0) {
          const newSelected = [...prevSelected];
          newSelected[existingIndex] = focused;
          return newSelected;
        }
        return prevSelected;
      });
    }
  }, [focused]);

  // Listado de categorías dinámicas
  const categories = ["Todas","Pizza", "Complementos","Bebidas"];
  const Ingredientes = ["Queso", "Peperoni", "Champiñones", "Cebolla", "Chile", "Aceitunas", "Camaron", "Curiles", "Jamo", "Salami", "Salchicha Italiana"," Chorizo", "Loroco", "Jalapeño" ];
  
  const filteredMenu =
    categoryFilter === 0
      ? menu
      : menu.filter((p) => p.id_categoria === categoryFilter);

  console.log("Filtered Menu:", menu);
  
  // Función para calcular precio dinámico
  const calculateProductPrice = (product, tamano) => {
    const dynamicPrice = getPizzaPrice(product.titulo, tamano);
    return dynamicPrice > 0 ? dynamicPrice : (product.precio || 0);
  };
  
  // Obtener tamaños únicos disponibles para un producto
  const getAvailableSizes = (product) => {
    // Tamaños para pizzas regulares
    const regularSizes = [
      { label: "Personal (4 porciones)", value: "personal" },
      { label: "Mediana (6 porciones)", value: "mediana" },
      { label: "Grande (8 porciones)", value: "grande" }
    ];

    // Tamaños para especialidades
    const specialtySizes = [
      { label: "Súper Personal", value: "super_personal" },
      { label: "Mediana (8 pc)", value: "mediana_8pc" },
      { label: "Grande (10 pc)", value: "grande_10pc" },
      { label: "Gigante (12 pc)", value: "gigante_12pc" }
    ];

    // Verificar si el producto tiene precios definidos en la tabla
    const pizzaPrices = PIZZA_PRICES[product.titulo];
    if (!pizzaPrices) {
      // Si no está en la tabla, usar tamaños regulares por defecto
      return regularSizes;
    }

    // Determinar si es especialidad o pizza regular basado en los tamaños disponibles
    const hasSpecialtyKeys = Object.keys(pizzaPrices).some(key => 
      ['super_personal', 'mediana_8pc', 'grande_10pc', 'gigante_12pc'].includes(key)
    );

    if (hasSpecialtyKeys) {
      // Es una especialidad, filtrar solo los tamaños que tienen precio
      return specialtySizes.filter(size => pizzaPrices[size.value] !== undefined);
    } else {
      // Es una pizza regular, filtrar solo los tamaños que tienen precio
      return regularSizes.filter(size => pizzaPrices[size.value] !== undefined);
    }
  };
  
  // Selección o deselección de un producto
  const toggleSelect = (prod) => {
    const exists = selected.find((p) => p.id === prod.id);
    if (exists) {
      setSelected(selected.filter((p) => p.id !== prod.id));
    } else {
      const availableSizes = getAvailableSizes(prod);
      const defaultTamano = availableSizes[0]?.value || "personal";
      const dynamicPrice = calculateProductPrice(prod, defaultTamano);
      
      setSelected([
        ...selected,
        {
          ...prod,
          cantidad: 1,
          masa: "Tradicional", // Valor por defecto
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
    if (focused?.id === prod.id) {
      setFocused(null);
      return;
    }
    
    const availableSizes = getAvailableSizes(prod);
    const defaultTamano = availableSizes[0]?.value || "personal";
    const dynamicPrice = calculateProductPrice(prod, defaultTamano);
    
    const focusedProduct = {
      ...prod,
      cantidad: 1,
      masa: "Tradicional", // Valor por defecto
      tamano: defaultTamano,
      precio_unitario: dynamicPrice,
      precio: dynamicPrice,
      removedIngredients: [],
      addedIngredients: [],
    };
    
    setFocused(focusedProduct);
    
    // Actualizar en selected también
    const existingIndex = selected.findIndex(p => p.id === prod.id);
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
    return selected.find((p) => p.id === prod.id) !== undefined;
  };
  
  // Función para actualizar masa dinámicamente
  const updateMasa = (newMasa) => {
    const updatedFocused = { 
      ...focused, 
      masa: newMasa
    };
    
    // Actualizar focused inmediatamente
    setFocused(updatedFocused);
    
    // Actualizar en selected también
    setSelected(prevSelected => {
      const existingIndex = prevSelected.findIndex(p => p.id === focused.id);
      if (existingIndex >= 0) {
        const newSelected = [...prevSelected];
        newSelected[existingIndex] = updatedFocused;
        return newSelected;
      }
      return prevSelected;
    });
  };

  // Función para actualizar ingredientes dinámicamente
  const updateIngredients = (ingrediente) => {
    setFocused(prev => {
      const ingSelected = prev.addedIngredients.includes(ingrediente);
      const newIngredients = ingSelected
        ? prev.addedIngredients.filter(item => item !== ingrediente)
        : [...prev.addedIngredients, ingrediente];
      
      const updatedFocused = {...prev, addedIngredients: newIngredients};
      
      // También actualizar en selected
      setSelected(prevSelected => {
        const existingIndex = prevSelected.findIndex(p => p.id === prev.id);
        if (existingIndex >= 0) {
          const newSelected = [...prevSelected];
          newSelected[existingIndex] = updatedFocused;
          return newSelected;
        }
        return prevSelected;
      });
      
      return updatedFocused;
    });
  };

  // Función para actualizar cantidad dinámicamente
  const updateCantidad = (nuevaCantidad) => {
    const updatedFocused = { 
      ...focused, 
      cantidad: Math.max(1, nuevaCantidad)
    };
    
    // Actualizar focused inmediatamente
    setFocused(updatedFocused);
    
    // Actualizar en selected también
    setSelected(prevSelected => {
      const existingIndex = prevSelected.findIndex(p => p.id === focused.id);
      if (existingIndex >= 0) {
        const newSelected = [...prevSelected];
        newSelected[existingIndex] = updatedFocused;
        return newSelected;
      }
      return prevSelected;
    });
  };
  
  const updateTamanoAndPrice = (newTamano) => {
    const newPrice = calculateProductPrice(focused, newTamano);
    const updatedFocused = { 
      ...focused, 
      tamano: newTamano, 
      precio: newPrice,
      precio_unitario: newPrice 
    };
    
    // Actualizar focused inmediatamente
    setFocused(updatedFocused);
    
    // Actualizar en selected también de forma inmediata
    setSelected(prevSelected => {
      const existingIndex = prevSelected.findIndex(p => p.id === focused.id);
      if (existingIndex >= 0) {
        const newSelected = [...prevSelected];
        newSelected[existingIndex] = updatedFocused;
        return newSelected;
      }
      return prevSelected;
    });
  };

  // Función para confirmar producto personalizado
  const confirmCustomization = () => {
    const existingIndex = selected.findIndex(p => p.id === focused.id);
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
              <p>Precio por unidad: ${focused.precio}</p>
              <p>Cantidad: {focused.cantidad}</p>
              <h3 className="product-price">Total: ${(focused.precio * focused.cantidad).toFixed(2)}</h3>
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
                    onClick={() => updateMasa(m)}
                    onKeyDown={e => (e.key === "Enter" || e.key === " ") && updateMasa(m)}
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

                  return(
                    <div key={ing} role="button" tabIndex={0}
                      className={`option-card ${ingSelected ? "selected" : ""}`}
                      onClick={() => updateIngredients(ing)} 
                      onKeyDown={e => (e.key === "Enter" || e.key === " ") && updateIngredients(ing)}
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
                  onClick={() => updateCantidad(focused.cantidad - 1)}
                >
                  -
                </button>
                <span className="quantity-display">{focused.cantidad}</span>
                <button 
                  className="quantity-btn"
                  onClick={() => updateCantidad(focused.cantidad + 1)}
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
              key={prod.id}
              className={`nor-product-card ${ 
                focused?.id === prod.id ? "focused" : 
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
            <div key={`${item.id}-${index}`} className="nor-selected-item">
              <div className="nor-selected-header">
                <div>
                  <h5>{item.titulo}</h5>
                  <p>Tamaño: {item.tamano} | Masa: {item.masa} | Cantidad: {item.cantidad}</p>
                  <p>Precio unitario: ${item.precio || 0}</p>
                </div>
                <div className="item-total">
                  <strong>${((item.precio || 0) * item.cantidad).toFixed(2)}</strong>
                </div>
                <button 
                  className="remove-item-btn"
                  onClick={() => setSelected(selected.filter((_, i) => i !== index))}
                >
                  <X size={16} />
                </button>
              </div>
              {item.addedIngredients && item.addedIngredients.length > 0 && (
                <div className="added-ingredients">
                  <small>Ingredientes extra: {item.addedIngredients.join(", ")}</small>
                </div>
              )}
            </div>
          ))}
          <div className="selected-total">
            <strong>
              Total: ${selected.reduce((sum, item) => sum + ((item.precio || 0) * item.cantidad), 0).toFixed(2)}
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

  // Calcular totales con validación de precios
  const subtotal = selectedProducts.reduce((sum, item) => {
    const precio = item.precio || 0;
    const cantidad = item.cantidad || 0;
    return sum + (precio * cantidad);
  }, 0);
  
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
            <div key={`${item.id}-${index}`} className="product-summary-item">
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
                <span className="unit-price">${item.precio || 0} c/u</span>
                <span className="total-price">${((item.precio || 0) * item.cantidad).toFixed(2)}</span>
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

  // Hook de notificaciones
  const notificationContext = useNotifications();

  // Estados
  const [currentStep, setCurrentStep] = useState(1);
  const [menu, setMenu] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clienteData, setClienteData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    metodo_pago: "efectivo"
  });
  
  const nextStep = () => {
    // Validaciones antes de avanzar
    if (currentStep === 1) {
      if (!clienteData.nombre || !clienteData.telefono) {
        alert("Por favor complete todos los campos obligatorios (Nombre y Teléfono)");
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
      metodo_pago: "efectivo"
    });
  };
  
  // Función para enviar el pedido usando API
  const submitOrder = async (orderData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Preparar los datos del pedido en el formato esperado por la API
      const orderPayload = {
        tipo_cliente: "invitado", // Pedidos de admin son tratados como invitados
        cliente: {
          nombre: clienteData.nombre,
          apellido: clienteData.apellido || "",
          telefono: clienteData.telefono,
          email: `admin_${Date.now()}@mamamianpizza.com` // Email temporal para admin
        },
        direccion: {
          tipo_direccion: "formulario",
          direccion: "En el Local - Pedido creado por Administrador",
          pais: "El Salvador",
          departamento: "San Salvador",
          municipio: "San Salvador",
          latitud: "13.6988",
          longitud: "-89.2407",
          precision_ubicacion: "high",
          direccion_formateada: "En el Local - Mama Mian Pizza"
        },
        metodo_pago: clienteData.metodo_pago,
        productos: selectedProducts.map(producto => ({
          id: producto.id,
          nombre_producto: producto.titulo, // Usar titulo como nombre_producto
          cantidad: producto.cantidad,
          precio_unitario: producto.precio_unitario || producto.precio || 0,
          masa: producto.masa || "Tradicional",
          tamano: producto.tamano || "personal",
          instrucciones_especiales: producto.addedIngredients && producto.addedIngredients.length > 0 
            ? `Ingredientes extra: ${producto.addedIngredients.join(", ")}` 
            : null,
          subtotal: (producto.precio_unitario || producto.precio || 0) * producto.cantidad,
          metodo_entrega: 0 // 0 para entrega normal
        })),
        subtotal: orderData.subtotal,
        costo_envio: orderData.costoEnvio,
        impuestos: orderData.impuestos,
        total: orderData.total,
        aceptado_terminos: orderData.aceptadoTerminos,
        tiempo_estimado_entrega: 30 // 30 minutos por defecto
      };

      console.log("Enviando pedido:", orderPayload);

      // Realizar petición POST a la API
      const response = await fetch(`${API_URL}/orders/neworder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: No se pudo crear el pedido`);
      }

      const result = await response.json();
      console.log("Pedido creado exitosamente:", result);

      // Mostrar notificación de éxito
      if (notificationContext?.addNotification) {
        notificationContext.addNotification({
          type: 'success',
          title: '¡Pedido creado exitosamente!',
          message: `Pedido #${result.codigo_pedido || 'N/A'} ha sido registrado correctamente.`,
          duration: 5000
        });
      }

      // Cerrar modal y resetear
      onClose();
      resetSteps();
      
    } catch (error) {
      console.error('Error al enviar pedido:', error);
      setError(error.message);
      
      // Mostrar notificación de error
      if (notificationContext?.addNotification) {
        notificationContext.addNotification({
          type: 'error',
          title: 'Error al crear pedido',
          message: error.message || 'Ocurrió un error inesperado. Intente nuevamente.',
          duration: 7000
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const resp = await fetch(`${API_URL}/content/getMenu`);
        const data = await resp.json();
        setMenu(data.menu);
        console.log("Menu fetched:", data.menu);
      } catch (err) {
        console.error("Error fetching menu:", err);
        
        // Datos mock para desarrollo
        setMenu([
          {
            id: 1,
            titulo: "Pepperoni",
            precio: 6,
            imagen: "/placeholder-pizza.jpg",
            id_categoria: 1
          },
          {
            id: 2,
            titulo: "Hawaiana",
            precio: 8,
            imagen: "/placeholder-pizza.jpg",
            id_categoria: 1
          },
          {
            id: 3,
            titulo: "4 Quesos",
            precio: 10,
            imagen: "/placeholder-pizza.jpg",
            id_categoria: 1
          },
          {
            id: 4,
            titulo: "Curil o Camarón",
            precio: 7,
            imagen: "/placeholder-pizza.jpg",
            id_categoria: 1
          },
          {
            id: 5,
            titulo: "4 Quesos Suprema",
            precio: 5,
            imagen: "/placeholder-pizza.jpg",
            id_categoria: 1
          },
          {
            id: 6,
            titulo: "Suprema (Especialidad)",
            precio: 8,
            imagen: "/placeholder-pizza.jpg",
            id_categoria: 1
          }
        ]);
      }
    };
    
    if (show) {
      fetchMenu();
    }
  }, [show, API_URL]);

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

      {/* Mostrar error si existe */}
      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
          <button 
            onClick={() => setError(null)} 
            className="error-dismiss"
          >
            ×
          </button>
        </div>
      )}

      {/* Mostrar loading si está procesando */}
      {isLoading && (
        <div className="loading-message">
          <div className="loading-spinner"></div>
          <span>Procesando pedido...</span>
        </div>
      )}

      <div className="new__order-modal-content"
        style={{ opacity: isLoading ? 0.6 : 1, pointerEvents: isLoading ? 'none' : 'auto' }}
      >
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
