import { useState, useEffect } from "react";
import { X, ArrowLeft,Check  } from "lucide-react";
import "./NewOrderModal.css";

const Step1 = () => (
  <div className="step-container">
    <h3>Datos de Cliente</h3>
    <form className="step1-form">
      <div className="step1-form-name">
        <div className="step1-form-input">
          <label htmlFor="name">Nombre</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Nombre del cliente"
          />
        </div>
        <div className="step1-form-input">
          <label htmlFor="lastname">Apellido</label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            placeholder="Apellido del cliente"
          />
        </div>
      </div>
      <div className="step1-form-input">
        <label htmlFor="phone">Teléfono</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          placeholder="Teléfono del cliente"
        />
      </div>
    </form>
  </div>
);

const Step2 = ({ menu, onUpdateProductos }) => {
  const [categoryFilter, setCategoryFilter] = useState(0);
  const [selected, setSelected] = useState([]);
  const [focused, setFocused] = useState(null);
  // Comunica al padre la selección actual
  useEffect(() => {
    onUpdateProductos(selected);
  }, [selected, onUpdateProductos]);

  // Listado de categorías dinámicas
  const categories = ["Todas","Pizza", "Complementos","Bebidas"];
  const Ingredientes = ["Queso", "Peperoni", "Champiñones", "Cebolla", "Chile", "Aceitunas", "Camaron", "Curiles", "Jamo", "Salami", "Salchicha Italiana"," Chorizo", "Loroco", "Jalapeño" ];
  console.log("Categorias:", menu);
  const filteredMenu =
    categoryFilter === 0
      ? menu
      : menu.filter((p) => p.id_categoria === categoryFilter);
  console.log("Productos filtrados:", categoryFilter);
  // Selección o deselección de un producto
  const toggleSelect = (prod) => {
    const exists = selected.find((p) => p.id_producto === prod.id_producto);
    if (exists) {
      setSelected(selected.filter((p) => p.id_producto !== prod.id_producto));
    } else {
      setSelected([
        ...selected,
        {
          ...prod,
          cantidad: 1,
          masa: prod.masas?.[0] || null,
          tamano: prod.tamanos?.[0] || null,
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
      setSelected([]);
      return;
    }
    setFocused({
      ...prod,
      cantidad: 1,
      masa: prod.masas?.[0] || null,
      tamano: prod.tamanos?.[0] || null,
      removedIngredients: [],
      addedIngredients: [],
    });
    setSelected([{
            ...prod,
      cantidad: 1,
      masa: prod.masas?.[0] || null,
      tamano: prod.tamanos?.[0] || null,
      removedIngredients: [],
      addedIngredients: [],
    }])
  }

const masaOptions = ["Delgada", "Tradicional"];
const sizeOptions = [
  { label: "Personal (4 porciones)", value: "personal" },
  { label: "Mediana (6 porciones)",    value: "mediana" },
  { label: "Grande (8 porciones)",     value: "grande" },
];
  const isSelected = (prod) => {
    if (selected.find((p) => p.id_producto === prod.id_producto)) {
      return true;
    }
    return false;
  }

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

  if (focused) {
    return (
      <div className="focused-view" role="region" aria-label="Personalización de pizza">
          <header className="focused-header">
          <button className="nor-back-btn" onClick={() => setFocused(null)}>
                <ArrowLeft /> Volver al menú
          </button>
          {console.log("Focused:", focused)}
            <h3>Personalizar {focused.titulo}</h3>
          </header>
          <main className="focused-main">
            <div className="focused-product-details">
              <img src={focused.imagen} alt="" />
              <div className="focused-product-price">
                <p>
                  Precio Total:
                </p>
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
              onClick={() => setFocused(prev => ({ ...prev, tamano: s.value }))}
              onKeyDown={e => (e.key === "Enter" || e.key === " ") && setFocused(prev => ({ ...prev, tamano: s.value }))}
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
                Ingredientes.map((ing) => (
                  <div key={ing} role="button" tabIndex={0}
                    className={`option-card ${focused.addedIngredients === ing ? "selected" : ""}`}
                     onClick={() => setFocused(prev => ({...prev, addedIngredients: ing}))} 
                     onKeyDown={e => (e.key === "Enter" || e.key === "") && setFocused(prev => ({...prev, addedIngredients: ing}))}
                     aria-pressed={focused.addedIngredients === ing}>
                    {ing}
                    {focused.addedIngredients === ing && <Check className="check-icon" />}
                    {console.log("Focused Ingredientes:", focused.addedIngredients)}
                      
                  </div>
                ))
              }
            </div>
      </div>
    </div>
          </main>
      </div>
    )
  }


  return (
    <div className="step-container">
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
        {/* Focus */}
        
      {/* 2) Grid de productos */}
      <div className="nor-product-grid">
        {filteredMenu.map((prod) => {
          console.log("Producto:", prod, "Seleccionado:", isSelected(prod));
          return (
            <div
              key={prod.id_producto}
              className={`nor-product-card ${ focused?.id_producto === prod.id_producto ? "focused" : isSelected(prod) ? "selected" : ""                
              }`}
              onClick={() => onCardClick(prod)}
            >
              <img src={prod.imagen} alt={prod.titulo} />
              <h4>{prod.titulo}</h4>
              <p className="product-price">${prod.precio}</p>
            </div>
          );
        })}
      </div>

    </div>
  );
};

const Step3 = () => (
  <div className="step-container">
    <h3>Revisión de Pedido</h3>
    <p>Aquí podrías mostrar un resumen final antes de enviar.</p>
  </div>
);

const NewOrderModal = ({ show, onClose }) => {
  const API_URL = "https://api.mamamianpizza.com/api";
  const totalSteps = 3;

  const [currentStep, setCurrentStep] = useState(1);
  const [menu, setMenu] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () =>
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  const resetSteps = () => setCurrentStep(1);

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
    fetchMenu();
  }, []);

  if (!show) return null;

  return (
    <div className="new-order-modal">
      <header className="new__order-modal-header">
        <div className="new__order-modal-header-title">
          <h2>Nuevo Pedido</h2>
          <button
            onClick={onClose}
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
        {currentStep === 1 && <Step1 />}
        {currentStep === 2 && (
          <Step2
            menu={menu}
            onUpdateProductos={setSelectedProducts}
          />
        )}
        {currentStep === 3 && <Step3 />}
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
          ) : (
            <button
              className="nor-button"
              onClick={resetSteps}
            >
              Finalizar
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default NewOrderModal;
