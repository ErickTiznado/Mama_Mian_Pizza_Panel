import React, { useState, useEffect } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import UserLogService from '../../../services/UserLogService';
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
        
        {/* 1. TÍTULO - Más importante */}
        {productData.sesion !== "Banner" && productData.sesion !== "banner final" && (
          <div className="step1-form-input">
            <label htmlFor="titulo">Título del Producto *</label>
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
        )}

        {/* 2. IMAGEN - Segunda en importancia */}
        <div className="step1-form-input file-input-container">
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

        {/* 3. DESCRIPCIÓN - Tercera en importancia */}
        {productData.sesion !== "Banner" && productData.sesion !== "banner final" && (
          <div className="step1-form-input">
            <label htmlFor="descripcion">Descripción del Producto *</label>
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
        )}

        {/* 4. CATEGORIZACIÓN - Agrupadas juntas */}
        <div className="step1-form-group">
          <h4 className="form-group-title">Categorización</h4>
          <div className="step1-form-row">
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
                <option value="Recomendacion de la casa">Recomendación de la casa</option>
                <option value="Banner">Banner</option>
                <option value="banner final">Banner Final</option>
                <option value="menu">Menú</option>
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
            </div>
          </div>
        </div>

        {/* 5. ESTADO - Al final */}
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
        leyenda = "";
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
        
        <div className="prices-grid">
          {tamanos.map((tamano) => (
            <div key={tamano.id_tamano} className="price-size-container">
              <h4 className="size-title">{tamano.nombre}</h4>
              <div className="price-item">
                <label htmlFor={`precio-${tamano.id_tamano}`}>Precio *</label>
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
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  );
};

const NewProductModal = ({ show, onClose, onSuccess, editingProduct = null, isEditing = false, user: propUser }) => {
  const API_URL = "https://api.mamamianpizza.com/api";
  
  // Hook de autenticación
  const { user: contextUser, getToken, checkAuth, logout } = useAuth();
  
  // Usar el usuario pasado como prop o el del contexto
  const user = propUser || contextUser;
  
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

  // Verificar autenticación al mostrar el modal
  useEffect(() => {
    if (show && !checkAuth()) {
      console.error('Acceso denegado - Debe iniciar sesión para acceder a esta función');
      onClose();
    }
  }, [show, checkAuth, onClose]);

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
        precio_unico: editingProduct.precio_unico || "",
        activo: editingProduct.activo ? 1 : 0
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
        console.error('Campos incompletos - Por favor complete todos los campos obligatorios');
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
      precio_unico: "",
      activo: 1
    });
    setError(null);
  };
  
  // Función para crear headers de autenticación
  const createAuthHeaders = () => {
    const token = getToken();
    if (!token) {
      throw new Error('Token de autenticación no disponible');
    }
    
    return {
      'Authorization': `Bearer ${token}`
    };
  };

  // Función para manejar errores de autenticación
  const handleAuthError = (response) => {
    if (response.status === 401) {
      console.error('Sesión expirada - Su sesión ha expirado. Redirigiendo al login...');
      setTimeout(() => {
        logout();
        // Aquí podrías agregar navegación al login si tienes acceso a navigate
      }, 2000);
      return true;
    } else if (response.status === 403) {
      console.error('Sin permisos - No tiene permisos para realizar esta acción');
      return true;
    }
    return false;
  };

  // Función para validar los precios
  const validatePrices = () => {
    // Si es Banner o Banner Final, no necesita validación de precios
    if (productData.sesion === "Banner" || productData.sesion === "banner final") {
      return true;
    }
    
    // Si es complemento, bebida o promociones, validar precio único
    if (productData.categoria === "complemento" || productData.categoria === "bebida" || productData.categoria === "promociones") {
      if (!productData.precio_unico || productData.precio_unico <= 0) {
        console.error('Precio requerido - Por favor ingrese un precio válido para el producto');
        return false;
      }
      return true;
    }
    
    // Para pizzas, validar precios por tamaño
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
      console.error(`Precios incompletos - Por favor ingrese precios válidos para: ${missingPrices.join(', ')}`);
    }
    
    return valid;
  };  // Función para enviar el producto al API
  const handleSubmit = async () => {
    // Verificar autenticación antes de proceder
    if (!checkAuth()) {
      console.error('Sesión expirada - Debe iniciar sesión para realizar esta acción');
      return;
    }

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
        // Agregar ID del usuario para logging
      formData.append('user_id', user?.id || null);
      formData.append('action', isEditing ? 'UPDATE' : 'CREATE');
      
      // Log para verificar que los datos del usuario se están enviando
      console.log('Enviando datos del producto con usuario:', {
        user_id: user?.id || null,
        action: isEditing ? 'UPDATE' : 'CREATE',
        titulo: productData.titulo,
        user_info: user
      });
      
      // Solo agregar imagen si se seleccionó una nueva
      if (productData.imagen) {
        formData.append('imagen', productData.imagen);
      }
      
      formData.append('activo', productData.activo.toString());
      
      // Agregar precios al FormData
      formData.append('precios', JSON.stringify(productData.precios));
      
      // Agregar precio único si existe
      if (productData.precio_unico) {
        formData.append('precio_unico', productData.precio_unico);
      }
        const url = isEditing 
        ? `${API_URL}/content/updateContent/${editingProduct.id}` 
        : `${API_URL}/content/submit`;
      
      const method = isEditing ? 'PUT' : 'POST';
      
      // Crear headers de autenticación
      const authHeaders = createAuthHeaders();
      
      const response = await fetch(url, {
        method: method,
        headers: authHeaders,
        body: formData
      });
      
      // Manejar errores de autenticación
      if (response.status === 401 || response.status === 403) {
        handleAuthError(response);
        return;
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: No se pudo ${isEditing ? 'actualizar' : 'crear'} el producto`);
      }
        const result = await response.json();
      
      // Registrar la acción en los logs del sistema
      if (user?.id) {
        const productDataForLog = {
          id: result.id || editingProduct?.id,
          titulo: productData.titulo,
          descripcion: productData.descripcion,
          categoria: productData.categoria,
          sesion: productData.sesion,
          activo: productData.activo,
          precios: productData.precios
        };
        
        await UserLogService.logProductAction(
          user.id, 
          isEditing ? 'UPDATE' : 'CREATE', 
          productDataForLog, 
          isEditing ? editingProduct : null
        );
      }
      
      // Log de éxito
      console.log(`Producto ${isEditing ? 'actualizado' : 'creado'} exitosamente: ${productData.titulo}`);
      
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
      
      console.error(`Error al ${isEditing ? 'actualizar' : 'crear'} producto: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!show) return null;
  
  // Función para obtener el icono y título del paso actual
  const getStepInfo = (step) => {
    switch (step) {
      case 1:
        return {
          icon: productData.sesion === "Banner" || productData.sesion === "banner final" ? "🎨" : "📝",
          title: productData.sesion === "Banner" || productData.sesion === "banner final" ? "Configuración del Banner" : "Información del Producto"
        };
      case 2:
        return {
          icon: "💰",
          title: "Configuración de Precios"
        };
      default:
        return { icon: "📋", title: "Configuración" };
    }
  };

  const currentStepInfo = getStepInfo(currentStep);

  return (
    <div className="npml-modal">
      <header className="npml-header">
        <div className="npml-header-title">
          <h2>
            <span className="step-icon">{currentStepInfo.icon}</span>
            {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
            <span className="step-subtitle">- {currentStepInfo.title}</span>
          </h2>
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="npml-close-button"
          >
            <X />
          </button>
        </div>
        <div className="npml-header-steps">
          <span className="npml-progress-text">
            Paso {currentStep} de {totalSteps} - {currentStepInfo.title}
          </span>
          <div className="npml-progress-bar-container">
            <div
              className="npml-progress-bar"
              style={{
                width: `${(currentStep / totalSteps) * 100}%`,
              }}
            />
          </div>
        </div>
      </header>
      
      {/* Mostrar error si existe */}
      {error && (
        <div className="npml-error-message">
          <strong>Error:</strong> {error}
          <button 
            onClick={() => setError(null)} 
            className="npml-error-dismiss"
          >
            ×
          </button>
        </div>
      )}
      
      {/* Mostrar loading si está procesando */}
      {isLoading && (
        <div className="npml-loading-message">
          <div className="npml-loading-spinner"></div>
          <span>Procesando...</span>
        </div>
      )}
      
      <div className="npml-content"
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
      
      <footer className="npml-footer">
        <div className="npml-footer-buttons">
          {currentStep > 1 && (
            <button
              className="npml-button npml-button-secondary"
              onClick={prevStep}
              disabled={isLoading}
            >
              <ArrowLeft size={18} />
              Anterior
            </button>
          )}
          
          {currentStep < totalSteps ? (
            <button
              className="npml-button"
              onClick={nextStep}
              disabled={isLoading || !productData.titulo || !productData.descripcion || !productData.sesion || !productData.categoria || (!isEditing && !productData.imagen)}
            >
              Siguiente
              <span>→</span>
            </button>
          ) : (
            <button
              className="npml-button npml-button-success"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              <span>✓</span>
              {isEditing ? 'Actualizar Producto' : 'Crear Producto'}
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default NewProductModal;
