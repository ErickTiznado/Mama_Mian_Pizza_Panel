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
            onChange={(e) => setTipoCliente(e.target.value)}
          />
          Cliente Invitado
        </label>
        <label>
          <input 
            type="radio" 
            value="registrado" 
            checked={tipoCliente === "registrado"}
            onChange={(e) => setTipoCliente(e.target.value)}
          />
          Cliente Registrado
        </label>
      </div>

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
          <label htmlFor="phone">
            Teléfono * 
            {loadingResumen && <span className="loading-text"> (Buscando cliente...)</span>}
          </label>
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

        {/* Mostrar resumen del cliente si se encuentra */}
        {resumenCliente && (
          <div className="client-summary-card">
            <h4>📊 Resumen del Cliente</h4>
            <div className="summary-content">
              <div className="summary-stats">
                <div className="stat-item">
                  <span className="stat-label">Pedidos totales:</span>
                  <span className="stat-value">{resumenCliente.total_pedidos || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Total gastado:</span>
                  <span className="stat-value">${(resumenCliente.total_gastado || 0).toFixed(2)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Ticket promedio:</span>
                  <span className="stat-value">${(resumenCliente.promedio_gasto || 0).toFixed(2)}</span>
                </div>
                {resumenCliente.ultimo_pedido && (
                  <div className="stat-item">
                    <span className="stat-label">Último pedido:</span>
                    <span className="stat-value">{new Date(resumenCliente.ultimo_pedido).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              
              {resumenCliente.productos_favoritos?.length > 0 && (
                <div className="favorite-products">
                  <h5>🍕 Productos favoritos:</h5>
                  <ul>
                    {resumenCliente.productos_favoritos.slice(0, 3).map((producto, index) => (
                      <li key={index}>
                        <span>{producto.nombre_producto}</span>
                        <small> ({producto.veces_pedido} veces)</small>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {tipoCliente === "registrado" && (
          <>
            <div className="step1-form-input">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={clienteData.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="correo@ejemplo.com"
                required
              />
            </div>
            <div className="step1-form-input">
              <label htmlFor="password">Contraseña *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={clienteData.password || ""}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Contraseña"
                required
              />
            </div>
          </>
        )}

        {/* Dirección */}
        <div className="address-section">
          <h4><MapPin className="inline-icon" /> Dirección de Entrega</h4>
          
          <div className="address-type-selector">
            <label>
              <input 
                type="radio" 
                value="formulario" 
                checked={clienteData.direccion?.tipo_direccion === "formulario"}
                onChange={(e) => handleInputChange("direccion", { 
                  ...clienteData.direccion, 
                  tipo_direccion: e.target.value 
                })}
              />
              Escribir dirección
            </label>
            <label>
              <input 
                type="radio" 
                value="tiempo_real" 
                checked={clienteData.direccion?.tipo_direccion === "tiempo_real"}
                onChange={(e) => handleInputChange("direccion", { 
                  ...clienteData.direccion, 
                  tipo_direccion: e.target.value 
                })}
              />
              Usar ubicación actual
            </label>
          </div>

          {clienteData.direccion?.tipo_direccion === "formulario" ? (
            <div className="address-form">
              <div className="step1-form-input">
                <label htmlFor="direccion">Dirección *</label>
                <input
                  type="text"
                  id="direccion"
                  value={clienteData.direccion?.direccion || ""}
                  onChange={(e) => handleInputChange("direccion", { 
                    ...clienteData.direccion, 
                    direccion: e.target.value 
                  })}
                  placeholder="Calle, número, colonia..."
                  required
                />
              </div>
              
              {/* Sugerencias de direcciones frecuentes */}
              {resumenCliente?.direcciones_frecuentes?.length > 0 && (
                <div className="address-suggestions">
                  <label>Direcciones frecuentes:</label>
                  {resumenCliente.direcciones_frecuentes.map((dir, index) => (
                    <button
                      key={index}
                      type="button"
                      className="suggestion-btn"
                      onClick={() => handleInputChange("direccion", {
                        ...clienteData.direccion,
                        direccion: dir.direccion,
                        municipio: dir.municipio,
                        departamento: dir.departamento,
                        pais: dir.pais || "El Salvador"
                      })}
                    >
                      📍 {dir.direccion} {dir.municipio ? `- ${dir.municipio}` : ""}
                      <small> (usada {dir.veces_usado} veces)</small>
                    </button>
                  ))}
                </div>
              )}
              
              <div className="step1-form-name">
                <div className="step1-form-input">
                  <label htmlFor="pais">País</label>
                  <input
                    type="text"
                    id="pais"
                    value={clienteData.direccion?.pais || "El Salvador"}
                    onChange={(e) => handleInputChange("direccion", { 
                      ...clienteData.direccion, 
                      pais: e.target.value 
                    })}
                    placeholder="País"
                  />
                </div>
                <div className="step1-form-input">
                  <label htmlFor="departamento">Departamento</label>
                  <input
                    type="text"
                    id="departamento"
                    value={clienteData.direccion?.departamento || ""}
                    onChange={(e) => handleInputChange("direccion", { 
                      ...clienteData.direccion, 
                      departamento: e.target.value 
                    })}
                    placeholder="Departamento"
                  />
                </div>
              </div>
              <div className="step1-form-input">
                <label htmlFor="municipio">Municipio</label>
                <input
                  type="text"
                  id="municipio"
                  value={clienteData.direccion?.municipio || ""}
                  onChange={(e) => handleInputChange("direccion", { 
                    ...clienteData.direccion, 
                    municipio: e.target.value 
                  })}
                  placeholder="Municipio"
                />
              </div>
            </div>
          ) : (
            <div className="location-info">
              <p>Se utilizará su ubicación actual para la entrega</p>
              <button 
                type="button" 
                className="nor-button"
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        handleInputChange("direccion", {
                          ...clienteData.direccion,
                          latitud: position.coords.latitude,
                          longitud: position.coords.longitude,
                          precision_ubicacion: position.coords.accuracy,
                          direccion_formateada: "Ubicación en tiempo real"
                        });
                      },
                      (error) => {
                        console.error("Error obteniendo ubicación:", error);
                        alert("No se pudo obtener la ubicación");
                      }
                    );
                  }
                }}
              >
                Obtener mi ubicación
              </button>
            </div>
          )}
        </div>

        {/* Método de pago */}
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
                value="tarjeta" 
                checked={clienteData.metodo_pago === "tarjeta"}
                onChange={(e) => handleInputChange("metodo_pago", e.target.value)}
              />
              Tarjeta de Crédito/Débito
            </label>
          </div>

          {clienteData.metodo_pago === "tarjeta" && (
            <div className="card-info">
              <div className="step1-form-input">
                <label htmlFor="cardNumber">Número de Tarjeta</label>
                <input
                  type="text"
                  id="cardNumber"
                  value={clienteData.num_tarjeta_masked || ""}
                  onChange={(e) => handleInputChange("num_tarjeta_masked", e.target.value)}
                  placeholder="**** **** **** 1234"
                  maxLength="19"
                />
              </div>
              <div className="step1-form-input">
                <label htmlFor="cardName">Nombre en la Tarjeta</label>
                <input
                  type="text"
                  id="cardName"
                  value={clienteData.nombre_tarjeta || ""}
                  onChange={(e) => handleInputChange("nombre_tarjeta", e.target.value)}
                  placeholder="Nombre como aparece en la tarjeta"
                />
              </div>
            </div>
          )}
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

  // Selección o deselección de un producto
  const toggleSelect = (prod) => {
    const exists = selected.find((p) => p.id_producto === prod.id_producto);
    if (exists) {
      setSelected(selected.filter((p) => p.id_producto !== prod.id_producto));
    } else {
      const defaultTamano = prod.tamanos?.[0] || "personal";
      const dynamicPrice = calculateProductPrice(prod, defaultTamano);
      
      setSelected([
        ...selected,
        {
          ...prod,
          cantidad: 1,
          masa: prod.masas?.[0] || null,
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
    
    const defaultTamano = prod.tamanos?.[0] || "personal";
    const dynamicPrice = calculateProductPrice(prod, defaultTamano);
    
    const focusedProduct = {
      ...prod,
      cantidad: 1,
      masa: prod.masas?.[0] || null,
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
const sizeOptions = [
  { label: "Personal (4 porciones)", value: "personal" },
  { label: "Mediana (6 porciones)",    value: "mediana" },
  { label: "Grande (8 porciones)",     value: "grande" },
  { label: "Súper Personal", value: "super_personal" },
  { label: "Mediana (8 pc)", value: "mediana_8pc" },
  { label: "Grande (10 pc)", value: "grande_10pc" },
  { label: "Gigante (12 pc)", value: "gigante_12pc" },
];
  
  const isSelected = (prod) => {
    return selected.find((p) => p.id_producto === prod.id_producto) !== undefined;
  };

  // Actualiza un campo de personalización
  const updateCustom = (id, field, value) => {
    setSelected(
      selected.map((p) =>
        p.id === id
          ? {
              ...p,
              [field]: value,
            }
          : p
      )
    );
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
          {sizeOptions.map((s) => (
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
              {
                Ingredientes.map((ing) => {
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
                    className={`option-card ${ ingSelected ? "selected" : ""}`}
                     onClick={toggleIngredient} 
                     onKeyDown={e => (e.key === "Enter" || e.key === "") && toggleIngredient()}
                     aria-pressed={ingSelected}>
                    {ing}
                    {ingSelected  && <Check className="check-icon" />}
                      
                  </div>
)
                })
              }
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
              <p className="product-price">${calculateProductPrice(prod, "personal")}</p>
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

const Step3 = ({ clienteData, direccionData, metodoPago, selectedProducts, onSubmitFinal }) => {
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
            <strong>Tipo de Cliente:</strong> {clienteData.tipo_cliente === "registrado" ? "Registrado" : "Invitado"}
          </div>
        </div>
      </div>

      {/* Resumen de Dirección */}
      <div className="order-summary-section">
        <h4><MapPin className="inline-icon" /> Dirección de Entrega</h4>
        <div className="address-summary">
          {clienteData.direccion?.tipo_direccion === "formulario" ? (
            <>
              <div className="summary-row">
                <strong>Dirección:</strong> {clienteData.direccion.direccion}
              </div>
              {clienteData.direccion.municipio && (
                <div className="summary-row">
                  <strong>Municipio:</strong> {clienteData.direccion.municipio}
                </div>
              )}
              {clienteData.direccion.departamento && (
                <div className="summary-row">
                  <strong>Departamento:</strong> {clienteData.direccion.departamento}
                </div>
              )}
              <div className="summary-row">
                <strong>País:</strong> {clienteData.direccion.pais || "El Salvador"}
              </div>
            </>
          ) : (
            <div className="summary-row">
              <strong>Ubicación:</strong> {clienteData.direccion?.direccion_formateada || "Ubicación en tiempo real"}
            </div>
          )}
        </div>
      </div>

      {/* Método de Pago */}
      <div className="order-summary-section">
        <h4><CreditCard className="inline-icon" /> Método de Pago</h4>
        <div className="payment-summary">
          <div className="summary-row">
            <strong>Método:</strong> {clienteData.metodo_pago === "efectivo" ? "Efectivo" : "Tarjeta de Crédito/Débito"}
          </div>
          {clienteData.metodo_pago === "tarjeta" && clienteData.num_tarjeta_masked && (
            <div className="summary-row">
              <strong>Tarjeta:</strong> {clienteData.num_tarjeta_masked}
            </div>
          )}
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
    tipo_cliente: "invitado",
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    password: "",
    metodo_pago: "efectivo",
    direccion: {
      tipo_direccion: "formulario",
      direccion: "",
      pais: "El Salvador",
      departamento: "",
      municipio: "",
      latitud: null,
      longitud: null,
      precision_ubicacion: null,
      direccion_formateada: ""
    }
  });

  const nextStep = () => {
    // Validaciones antes de avanzar
    if (currentStep === 1) {
      if (!clienteData.nombre || !clienteData.telefono) {
        alert("Por favor complete los campos obligatorios");
        return;
      }
      if (clienteData.tipo_cliente === "registrado" && (!clienteData.email || !clienteData.password)) {
        alert("Email y contraseña son requeridos para clientes registrados");
        return;
      }
      if (!clienteData.metodo_pago) {
        alert("Seleccione un método de pago");
        return;
      }
      if (clienteData.direccion.tipo_direccion === "formulario" && !clienteData.direccion.direccion) {
        alert("Ingrese una dirección válida");
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
      tipo_cliente: "invitado",
      nombre: "",
      apellido: "",
      telefono: "",
      email: "",
      password: "",
      metodo_pago: "efectivo",
      direccion: {
        tipo_direccion: "formulario",
        direccion: "",
        pais: "El Salvador",
        departamento: "",
        municipio: "",
        latitud: null,
        longitud: null,
        precision_ubicacion: null,
        direccion_formateada: ""
      }
    });
  };

  // Función para enviar el pedido
  const submitOrder = async (orderData) => {
    try {
      // Preparar datos para enviar al backend
      const orderPayload = {
        tipo_cliente: clienteData.tipo_cliente,
        cliente: {
          nombre: clienteData.nombre,
          apellido: clienteData.apellido,
          telefono: clienteData.telefono,
          email: clienteData.email,
          password: clienteData.password
        },
        direccion: clienteData.direccion,
        metodo_pago: clienteData.metodo_pago,
        num_tarjeta_masked: clienteData.num_tarjeta_masked,
        nombre_tarjeta: clienteData.nombre_tarjeta,
        productos: selectedProducts.map(p => ({
          id_producto: p.id_producto,
          nombre_producto: p.titulo,
          cantidad: p.cantidad,
          precio_unitario: p.precio_unitario || p.precio,
          masa: p.masa,
          tamano: p.tamano,
          instrucciones_especiales: p.addedIngredients?.length > 0 ? 
            `Ingredientes extra: ${p.addedIngredients.join(", ")}` : null,
          subtotal: (p.precio_unitario || p.precio) * p.cantidad,
          metodo_entrega: 0 // Delivery por defecto
        })),
        subtotal: orderData.subtotal,
        costo_envio: orderData.costoEnvio,
        impuestos: orderData.impuestos,
        total: orderData.total,
        aceptado_terminos: orderData.aceptadoTerminos,
        tiempo_estimado_entrega: 30 // 30 minutos por defecto
      };

      console.log("Enviando pedido:", orderPayload);

      const response = await fetch(`${API_URL}/orders/neworder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload)
      });

      const result = await response.json();

      if (response.ok) {
        alert(`¡Pedido creado exitosamente! Código: ${result.codigo_pedido}`);
        onClose();
        resetSteps();
      } else {
        throw new Error(result.message || 'Error al crear el pedido');
      }
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
