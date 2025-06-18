import React, { useState, useEffect } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { useNotifications } from '../../../context/NotificationContext';
import '../AgregarContenido.css';
import './NewProductModal.css';

const Step1 = ({ productData, onProductChange, isEditing = false, currentImageUrl = null }) => {
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
          <label htmlFor="sesion">Sección *</label>
          <select
            id="sesion"
            name="sesion"
            value={productData.sesion || ""}
            onChange={(e) => handleInputChange("sesion", e.target.value)}
            required
          >
            <option value="">Seleccione una sección</option>
            <option value="Las mas Populares">Las mas Populares</option>
            <option value="Recomendacion de la casa">Recomendacion de la casa</option>
            <option value="Banner">Banner</option>
            <option value="banner final">Banner Final</option>
            <option value="menu">Menu</option>
          </select>
        </div>

        <div className="step1-form-input">
          <label htmlFor="categoria">Categoría *</label>
          <select
            id="categoria"
            name="categoria"
            value={productData.categoria || ""}
            onChange={(e) => handleInputChange("categoria", e.target.value)}
            required
          >
            <option value="">Seleccione una categoría</option>
            <option value="pizza">Pizza</option>
            <option value="complemento">Complemento</option>
            <option value="bebida">Bebida</option>
            <option value="promociones">Promociones</option>
          </select>
        </div>        <div className="step1-form-input file-input-container">
          <label htmlFor="imagen">
            {productData.sesion === "Banner" || productData.sesion === "banner final" 
              ? "Imagen o Video del Banner" 
              : "Imagen del Producto"
            } {!isEditing && '*'}
          </label>
          {isEditing && currentImageUrl && !productData.imagen && (
            <div className="current-image-preview">
              <span>Imagen actual:</span>
              <img 
                src={currentImageUrl} 
                alt="Imagen actual" 
                className="current-image-thumbnail"
                style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover', marginBottom: '10px' }}
              />
            </div>
          )}
          <input
            type="file"
            id="imagen"
            name="imagen"
            accept={productData.sesion === "Banner" || productData.sesion === "banner final" 
              ? "image/*,video/*" 
              : "image/*"
            }
            onChange={handleFileChange}
            required={!isEditing}
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

        {/* Solo mostrar título y descripción si NO es Banner o Banner Final */}
        {productData.sesion !== "Banner" && productData.sesion !== "banner final" && (
          <>
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
              <label htmlFor="descripcion">Descripción *</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={productData.descripcion || ""}
                onChange={(e) => handleInputChange("descripcion", e.target.value)}
                placeholder="Descripción detallada del producto"
                rows={4}
                required
              />
            </div>
          </>
        )}

        <div className="step1-form-input">
          <label htmlFor="activo">Estado del Producto</label>
          <div className="switch-container">
            <label className="switch">
              <input
                type="checkbox"
                id="activo"
                name="activo"
                checked={productData.activo === 1}
                onChange={(e) => handleInputChange("activo", e.target.checked ? 1 : 0)}
              />
              <span className="slider round"></span>
            </label>
            <span className="switch-label">
              {productData.activo === 1 ? 'Activo' : 'Inactivo'}
            </span>
          </div>
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

  const handleSinglePriceChange = (value) => {
    onProductChange({
      ...productData,
      precio_unico: value
    });
  };  // Si es complemento, bebida o promociones, mostrar solo un campo de precio
  if (productData.categoria === "complemento" || productData.categoria === "bebida" || productData.categoria === "promociones") {
    let titulo, leyenda;
    
    switch (productData.categoria) {
      case "complemento":
        titulo = "Precio del Complemento";
        leyenda = "Precio por porción";
        break;
      case "bebida":
        titulo = "Precio de la Bebida";
        leyenda = "Precio por unidad";
        break;
      case "promociones":
        titulo = "Precio de la Promoción";
        leyenda = "Precio promocional";
        break;
      default:
        titulo = "Precio del Producto";
        leyenda = "Precio";
    }
    
    return (
      <div className="step-container">
        <h3>{titulo}</h3>
        
        <fieldset className="price-fieldset">
          <legend>{leyenda}</legend>
          
          <div className="single-price-container">
            <div className="price-item">
              <label htmlFor="precio-unico">Precio *</label>
              <input
                id="precio-unico"
                type="number"
                name="precio_unico"
                value={productData.precio_unico || ""}
                onChange={(e) => handleSinglePriceChange(e.target.value)}
                step="0.01"
                min="0"
                placeholder="0.00"
                required
              />
            </div>
          </div>
        </fieldset>
      </div>
    );
  }

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

const NewProductModal = ({ show, onClose, onSuccess, editingProduct = null, isEditing = false }) => {
  const API_URL = "https://api.mamamianpizza.com/api";
  
  // Hook de notificaciones
  const notificationContext = useNotifications();
  
  // Estados
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tamanos, setTamanos] = useState([]);  const [productData, setProductData] = useState({
    titulo: "",
    descripcion: "",
    sesion: "",
    categoria: "",
    imagen: null,
    precios: {},
    precio_unico: "",
    activo: 1
  });

  // Efecto para cargar datos del producto en edición
  useEffect(() => {
    if (isEditing && editingProduct && show) {
      // Convertir los datos del producto para edición
      const preciosObj = {};
      if (editingProduct.opciones) {
        editingProduct.opciones.forEach(opcion => {
          preciosObj[opcion.tamanoId] = opcion.precio.toString();
        });
      }

      setProductData({
        titulo: editingProduct.titulo || "",
        descripcion: editingProduct.descripcion || "",
        sesion: editingProduct.seccion || editingProduct.tipo || "",
        categoria: editingProduct.categoria || editingProduct.tipo || "",
        imagen: null, // Para edición, se mantendrá la imagen actual si no se cambia
        precios: preciosObj,
        activo: editingProduct.estado ? 1 : 0
      });
    } else if (!isEditing) {
      resetForm();
    }
  }, [isEditing, editingProduct, show]);
  
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
  }, [show, API_URL]);  // Función para calcular el número total de pasos
  const getTotalSteps = () => {
    // Si es Banner o Banner Final, solo necesita 1 paso (sin precios)
    if (productData.sesion === "Banner" || productData.sesion === "banner final") {
      return 1;
    }
    return 2; // Para otros productos (pizza, complemento, bebida, promociones)
  };

  const totalSteps = getTotalSteps();

  const nextStep = () => {
    // Validaciones antes de avanzar
    if (currentStep === 1) {
      const requiredFields = [
        productData.titulo, 
        productData.descripcion, 
        productData.sesion, 
        productData.categoria
      ];
      
      // En modo creación, la imagen es obligatoria. En edición, es opcional
      if (!isEditing) {
        requiredFields.push(productData.imagen);
      }
      
      if (requiredFields.some(field => !field)) {
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
  };  const resetForm = () => {
    setCurrentStep(1);
    setProductData({
      titulo: "",
      descripcion: "",
      sesion: "",
      categoria: "",
      imagen: null,
      precios: {},
      activo: 1
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
      formData.append('descripcion', productData.descripcion || "Producto sin descripción");
      formData.append('porciones', '1'); // Default value since backend expects it
      formData.append('sesion', productData.sesion);
      formData.append('categoria', productData.categoria);
      
      // Solo agregar imagen si se seleccionó una nueva
      if (productData.imagen) {
        formData.append('imagen', productData.imagen);
      }
      
      formData.append('activo', productData.activo.toString());
      
      // Agregar precios al FormData
      formData.append('precios', JSON.stringify(productData.precios));
        const url = isEditing 
        ? `${API_URL}/content/updateContent/${editingProduct.id}` 
        : `${API_URL}/content/submit`;
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: No se pudo ${isEditing ? 'actualizar' : 'crear'} el producto`);
      }
      
      const result = await response.json();
      
      // Mostrar notificación de éxito
      notificationContext.addNotification({
        type: 'success',
        title: `¡Producto ${isEditing ? 'actualizado' : 'creado'} exitosamente!`,
        message: `El producto "${productData.titulo}" ha sido ${isEditing ? 'actualizado' : 'registrado'} correctamente.`,
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
      console.error(`Error al ${isEditing ? 'actualizar' : 'crear'} producto:`, error);
      setError(error.message);
      
      // Mostrar notificación de error
      notificationContext.addNotification({
        type: 'error',
        title: `Error al ${isEditing ? 'actualizar' : 'crear'} producto`,
        message: error.message || 'Ocurrió un error inesperado. Intente nuevamente.',
        duration: 7000
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!show) return null;
  
  return (
    <div className="new-order-modal new-product-modal">      <header className="new__order-modal-header">
        <div className="new__order-modal-header-title">
          <h2>{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</h2>
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
      >        {currentStep === 1 && (
          <Step1 
            productData={productData}
            onProductChange={setProductData}
            isEditing={isEditing}
            currentImageUrl={isEditing && editingProduct ? editingProduct.imagen : null}
          />        )}
        {currentStep === 2 && productData.sesion !== "Banner" && productData.sesion !== "banner final" && (
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
          )}          {currentStep < totalSteps ? (
            <button
              className="nor-button"
              onClick={nextStep}
              disabled={isLoading || !productData.titulo || !productData.descripcion || !productData.sesion || !productData.categoria || (!isEditing && !productData.imagen)}
            >
              Siguiente
            </button>
          ) : (            <button
              className="nor-button"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isEditing ? 'Actualizar Producto' : 'Crear Producto'}
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default NewProductModal;
