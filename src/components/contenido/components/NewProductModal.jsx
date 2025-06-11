import React, { useState, useEffect } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { useNotifications } from '../../../context/NotificationContext';
import '../AgregarContenido.css';
import './NewProductModal.css';

const Step1 = ({ productData, onProductChange }) => {
  const handleInputChange = (field, value) => {
    onProductChange({
      ...productData,
      [field]: value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleInputChange('imagen', file);
    }
  };

  return (
    <div className="step-container">
      <h3>Datos Básicos del Producto</h3>
      
      <form className="step1-form">
        <div className="step1-form-input">
          <label htmlFor="titulo">Título *</label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={productData.titulo || ""}
            onChange={(e) => handleInputChange("titulo", e.target.value)}
            placeholder="Nombre del producto"
            required
          />
        </div>

        <div className="step1-form-input">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={productData.descripcion || ""}
            onChange={(e) => handleInputChange("descripcion", e.target.value)}
            placeholder="Descripción detallada del producto"
            rows={4}
          />
        </div>

        <div className="step1-form-row">
          <div className="step1-form-input">
            <label htmlFor="porciones">Porciones *</label>
            <input
              type="number"
              id="porciones"
              name="porciones"
              value={productData.porciones || ""}
              onChange={(e) => handleInputChange("porciones", e.target.value)}
              placeholder="Número de porciones"
              required
            />
          </div>
          
          <div className="step1-form-input">
            <label htmlFor="categoria">Categoría *</label>
            <input
              type="text"
              id="categoria"
              name="categoria"
              value={productData.categoria || ""}
              onChange={(e) => handleInputChange("categoria", e.target.value)}
              placeholder="Categoría del producto"
              required
            />
          </div>
        </div>

        <div className="step1-form-input">
          <label htmlFor="sesion">Sección *</label>
          <select
            id="sesion"
            name="sesion"
            value={productData.sesion || ""}
            onChange={(e) => handleInputChange("sesion", e.target.value)}
            required
          >
            <option value="">Seleccione una sección</option>
            <option value="menu_principal">Menú Principal</option>
            <option value="especiales">Especiales</option>
            <option value="bebidas">Bebidas</option>
            <option value="complementos">Complementos</option>
          </select>
        </div>

        <div className="step1-form-input file-input-container">
          <label htmlFor="imagen">Imagen del Producto *</label>
          <input
            type="file"
            id="imagen"
            name="imagen"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
          {productData.imagen && (
            <div className="file-preview">
              <span>{productData.imagen.name}</span>
              <button 
                type="button" 
                className="clear-file-btn"
                onClick={() => handleInputChange("imagen", null)}
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

const Step2 = ({ tamanos, productData, onProductChange }) => {
    const API_URL = "https://api.mamamianpizza.com/api/";


  const handlePriceChange = (id_tamano, value) => {
    const updatedPrecios = {
      ...productData.precios,
      [id_tamano]: value
    };
    
    onProductChange({
      ...productData,
      precios: updatedPrecios
    });
  };

  return (
    <div className="step-container">
      <h3>Precios por Tamaño</h3>
      
      <fieldset className="price-fieldset">
        <legend>Precios por tamaño</legend>
        
        <div className="prices-grid">
          {tamanos.map((tamano) => (
            <div key={tamano.id_tamano} className="price-item">
              <label htmlFor={`precio-${tamano.id_tamano}`}>{tamano.nombre}</label>
              <input
                id={`precio-${tamano.id_tamano}`}
                type="number"
                name={`precios[${tamano.id_tamano}]`}
                value={productData.precios?.[tamano.id_tamano] || ""}
                onChange={(e) => handlePriceChange(tamano.id_tamano, e.target.value)}
                step="0.01"
                min="0"
                placeholder="0.00"
                required
              />
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  );
};

const NewProductModal = ({ show, onClose, onSuccess }) => {
  const API_URL = "https://api.mamamianpizza.com/api";
  const totalSteps = 2;
  
  // Hook de notificaciones
  const notificationContext = useNotifications();
  
  // Estados
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tamanos, setTamanos] = useState([]);
  const [productData, setProductData] = useState({
    titulo: "",
    descripcion: "",
    porciones: "",
    sesion: "",
    categoria: "",
    imagen: null,
    precios: {}
  });
  
  // Obtener los tamaños disponibles para el paso 2
  useEffect(() => {
    const fetchTamanos = async () => {
      try {
        const response = await fetch(`${API_URL}/tamanos/tamanos`);
        if (!response.ok) {
          throw new Error('Error al cargar tamaños');
        }
        const data = await response.json();
        setTamanos(data);
      } catch (err) {
        console.error("Error al cargar tamaños:", err);
        // Datos mock para desarrollo
        setTamanos([
          { id_tamano: 1, nombre: "Personal" },
          { id_tamano: 2, nombre: "Mediana" },
          { id_tamano: 3, nombre: "Grande" },
          { id_tamano: 4, nombre: "Súper Personal" },
          { id_tamano: 5, nombre: "Mediana (8 pc)" },
          { id_tamano: 6, nombre: "Grande (10 pc)" },
          { id_tamano: 7, nombre: "Gigante (12 pc)" }
        ]);
      }
    };
    
    if (show) {
      fetchTamanos();
    }
  }, [show, API_URL]);
  
  const nextStep = () => {
    // Validaciones antes de avanzar
    if (currentStep === 1) {
      if (!productData.titulo || !productData.porciones || !productData.sesion || !productData.categoria || !productData.imagen) {
        notificationContext.addNotification({
          type: 'error',
          title: 'Campos incompletos',
          message: 'Por favor complete todos los campos obligatorios.',
          duration: 5000
        });
        return;
      }
    }
    
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };
  
  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };
  
  const resetForm = () => {
    setCurrentStep(1);
    setProductData({
      titulo: "",
      descripcion: "",
      porciones: "",
      sesion: "",
      categoria: "",
      imagen: null,
      precios: {}
    });
    setError(null);
  };
  
  // Función para validar los precios
  const validatePrices = () => {
    let valid = true;
    let missingPrices = [];
    
    tamanos.forEach(tamano => {
      const precio = productData.precios[tamano.id_tamano];
      if (!precio || precio <= 0) {
        valid = false;
        missingPrices.push(tamano.nombre);
      }
    });
    
    if (!valid) {
      notificationContext.addNotification({
        type: 'error',
        title: 'Precios incompletos',
        message: `Por favor ingrese precios válidos para: ${missingPrices.join(', ')}`,
        duration: 5000
      });
    }
    
    return valid;
  };
  
  // Función para enviar el producto al API
  const handleSubmit = async () => {
    // Validar precios
    if (!validatePrices()) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Crear FormData para enviar la imagen
      const formData = new FormData();
      formData.append('titulo', productData.titulo);
      formData.append('descripcion', productData.descripcion);
      formData.append('porciones', productData.porciones);
      formData.append('sesion', productData.sesion);
      formData.append('categoria', productData.categoria);
      formData.append('imagen', productData.imagen);
      
      // Agregar precios al FormData
      formData.append('precios', JSON.stringify(productData.precios));
      
      const response = await fetch(`${API_URL}/content/submitContent`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: No se pudo crear el producto`);
      }
      
      const result = await response.json();
      
      // Mostrar notificación de éxito
      notificationContext.addNotification({
        type: 'success',
        title: '¡Producto creado exitosamente!',
        message: `El producto "${productData.titulo}" ha sido registrado correctamente.`,
        duration: 5000
      });
      
      // Cerrar modal y resetear formulario
      onClose();
      resetForm();
      
      // Notificar al componente padre para refrescar la lista
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error) {
      console.error('Error al crear producto:', error);
      setError(error.message);
      
      // Mostrar notificación de error
      notificationContext.addNotification({
        type: 'error',
        title: 'Error al crear producto',
        message: error.message || 'Ocurrió un error inesperado. Intente nuevamente.',
        duration: 7000
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!show) return null;
  
  return (
    <div className="new-order-modal new-product-modal">
      <header className="new__order-modal-header">
        <div className="new__order-modal-header-title">
          <h2>Nuevo Producto</h2>
          <button
            onClick={() => {
              onClose();
              resetForm();
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
          <span>Procesando...</span>
        </div>
      )}
      
      <div className="new__order-modal-content"
        style={{ opacity: isLoading ? 0.6 : 1, pointerEvents: isLoading ? 'none' : 'auto' }}
      >
        {currentStep === 1 && (
          <Step1 
            productData={productData}
            onProductChange={setProductData}
          />
        )}
        {currentStep === 2 && (
          <Step2
            tamanos={tamanos}
            productData={productData}
            onProductChange={setProductData}
          />
        )}
      </div>
      
      <footer className="new__order-modal-footer">
        <div className="new__order-modal-footer-buttons">
          {currentStep > 1 && (
            <button
              className="nor-button"
              onClick={prevStep}
              disabled={isLoading}
            >
              Anterior
            </button>
          )}
          {currentStep < totalSteps ? (
            <button
              className="nor-button"
              onClick={nextStep}
              disabled={isLoading || !productData.titulo || !productData.porciones || !productData.sesion || !productData.categoria || !productData.imagen}
            >
              Siguiente
            </button>
          ) : (
            <button
              className="nor-button"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              Crear Producto
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default NewProductModal;
