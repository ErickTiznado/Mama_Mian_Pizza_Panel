import React, { useState, useEffect } from 'react';
import { Search, Trash2, Edit, AlertTriangle, Plus, Grid3X3, List, ChevronLeft, ChevronRight, Pizza } from 'lucide-react';
import PizzaIngredientsService from '../../services/PizzaIngredientsService';
import './PizzaIngredients.css';

const PizzaIngredients = ({ inventoryData, onDataUpdate, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' o 'table'
  const [showForm, setShowForm] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, ingredient: null });
  
  // Estados para ingredientes de pizza
  const [pizzaIngredients, setPizzaIngredients] = useState([]);
  const [loadingPizzaIngredients, setLoadingPizzaIngredients] = useState(false);
  const [availableIngredients, setAvailableIngredients] = useState([]);
  const [loadingAvailable, setLoadingAvailable] = useState(false);
  
  const itemsPerPage = 8;

  // Estado para el formulario de precio
  const [formData, setFormData] = useState({
    precio_extra: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  // Cargar ingredientes de pizza
  const loadPizzaIngredients = async () => {
    try {
      setLoadingPizzaIngredients(true);
      const data = await PizzaIngredientsService.getAllPizzaIngredients();
      setPizzaIngredients(data);
    } catch (error) {
      console.error('Error loading pizza ingredients:', error);
      setSubmitError('Error al cargar ingredientes de pizza');
    } finally {
      setLoadingPizzaIngredients(false);
    }
  };

  // Cargar ingredientes disponibles del inventario
  const loadAvailableIngredients = async () => {
    try {
      setLoadingAvailable(true);
      const data = await PizzaIngredientsService.getAvailableIngredients();
      setAvailableIngredients(data);
    } catch (error) {
      console.error('Error loading available ingredients:', error);
      setSubmitError('Error al cargar ingredientes disponibles');
    } finally {
      setLoadingAvailable(false);
    }
  };

  useEffect(() => {
    loadPizzaIngredients();
  }, []);

  // Cargar ingredientes disponibles cuando se abre el modal
  useEffect(() => {
    if (showInventoryModal) {
      loadAvailableIngredients();
    }
  }, [showInventoryModal]);

  // Datos para filtros
  const categories = [...new Set(pizzaIngredients.map(item => item.categoria).filter(Boolean))];

  // Filtrar datos
  const filteredData = pizzaIngredients
    .filter(item => {
      const matchesSearch = item.nombre?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !categoryFilter || item.categoria === categoryFilter;
      return matchesSearch && matchesCategory;
    });

  // Paginación
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Validar formulario
  const validateForm = () => {
    const errors = {};

    if (!formData.precio_extra || parseFloat(formData.precio_extra) < 0) {
      errors.precio_extra = 'El precio extra debe ser un número positivo';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Manejar cambios en el formulario
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo si se corrige
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Agregar ingrediente desde inventario
  const handleAddFromInventory = async (inventoryItem) => {
    try {
      const ingredientData = {
        id_ingrediente: inventoryItem.id_ingrediente,
        precio_extra: parseFloat(formData.precio_extra)
      };

      await PizzaIngredientsService.addPizzaIngredient(ingredientData);
      
      setSubmitSuccess('Ingrediente agregado exitosamente');
      setShowInventoryModal(false);
      resetForm();
      
      // Recargar la lista de ingredientes de pizza y disponibles
      await loadPizzaIngredients();
      await loadAvailableIngredients();
      
      setTimeout(() => setSubmitSuccess(''), 3000);
    } catch (error) {
      setSubmitError(error.message || 'Error al agregar el ingrediente');
      setTimeout(() => setSubmitError(''), 5000);
    }
  };

  // Actualizar precio extra
  const handleUpdatePrice = async () => {
    if (!validateForm()) return;

    try {
      await PizzaIngredientsService.updatePizzaIngredient(editingIngredient.id, { 
        precio_extra: parseFloat(formData.precio_extra) 
      });
      
      setSubmitSuccess('Precio actualizado exitosamente');
      resetForm();
      
      // Recargar la lista de ingredientes de pizza
      await loadPizzaIngredients();
      
      setTimeout(() => setSubmitSuccess(''), 3000);
    } catch (error) {
      setSubmitError(error.message || 'Error al actualizar el precio');
      setTimeout(() => setSubmitError(''), 5000);
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      precio_extra: ''
    });
    setEditingIngredient(null);
    setShowForm(false);
    setFormErrors({});
    setSubmitError('');
    setSubmitSuccess('');
  };

  // Editar precio
  const handleEditPrice = (ingredient) => {
    setFormData({
      precio_extra: ingredient.precio_extra?.toString() || ''
    });
    setEditingIngredient(ingredient);
    setShowForm(true);
  };

  // Eliminar ingrediente de pizza
  const handleDelete = async () => {
    if (!deleteModal.ingredient) return;

    try {
      await PizzaIngredientsService.deletePizzaIngredient(deleteModal.ingredient.id);
      
      setSubmitSuccess('Ingrediente eliminado exitosamente');
      setDeleteModal({ show: false, ingredient: null });
      
      // Recargar la lista de ingredientes de pizza y disponibles
      await loadPizzaIngredients();
      await loadAvailableIngredients();
      
      setTimeout(() => setSubmitSuccess(''), 3000);
    } catch (error) {
      setSubmitError(error.message || 'Error al eliminar el ingrediente');
      setTimeout(() => setSubmitError(''), 5000);
    }
  };

  // Filtrar ingredientes del inventario que no estén ya agregados
  // Ahora usamos los ingredientes disponibles del endpoint específico
  const availableInventoryItems = availableIngredients;

  if (loadingPizzaIngredients) {
    return (
      <div className="ninv-pizza-ingredients">
        <div className="ninv-loading-state">
          <div className="ninv-loading-spinner"></div>
          <p className="ninv-loading-text">Cargando ingredientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ninv-pizza-ingredients">
      {/* Header con título y botón agregar */}
      <div className="ninv-list-header">
        <div className="ninv-list-title">
          <Pizza />
          Ingredientes para Pizza
        </div>
        <div className="ninv-header-actions">
          <button 
            className="ninv-btn-add-product"
            onClick={() => setShowInventoryModal(true)}
          >
            <Plus />
            Agregar Ingrediente
          </button>
        </div>
      </div>

      {/* Mensajes de estado */}
      {submitSuccess && (
        <div className="ninv-form-alert success">
          <AlertTriangle />
          {submitSuccess}
        </div>
      )}
      {submitError && (
        <div className="ninv-form-alert error">
          <AlertTriangle />
          {submitError}
        </div>
      )}

      {/* Controles de filtro y búsqueda */}
      <div className="ninv-controls-section">
        <div className="ninv-filters-row">
          {/* Buscador */}
          <div className="ninv-search-container">
            <Search className="ninv-search-icon" />
            <input
              type="text"
              className="ninv-search-input"
              placeholder="Buscar ingredientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filtros */}
          <div className="ninv-filter-group">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="ninv-filter-select"
            >
              <option value="">Todas las categorías</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Toggle de vista */}
          <div className="ninv-view-toggle">
            <button 
              className={`ninv-view-btn ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
            >
              <Grid3X3 />
              Tarjetas
            </button>
            <button 
              className={`ninv-view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              <List />
              Tabla
            </button>
          </div>
        </div>
      </div>

      {/* Contenedor de ingredientes */}
      <div className="ninv-products-container">
        {filteredData.length === 0 ? (
          <div className="ninv-empty-state">
            <Pizza className="ninv-empty-icon" />
            <h3>No hay ingredientes</h3>
            <p>Agrega ingredientes del inventario para personalización de pizzas.</p>
            <button 
              className="ninv-btn-add-product"
              onClick={() => setShowInventoryModal(true)}
            >
              <Plus />
              Agregar Primer Ingrediente
            </button>
          </div>
        ) : (
          <>
            {viewMode === 'cards' ? (
              /* Vista de tarjetas */
              <div className="ninv-products-grid">
                {paginatedData.map(ingredient => (
                  <div key={ingredient.id} className="ninv-product-card">
                    <div className="ninv-card-header">
                      <h3 className="ninv-card-title">{ingredient.nombre}</h3>
                      <span className="ninv-card-price">${ingredient.precio_extra}</span>
                    </div>
                    
                    <div className="ninv-card-body">
                      <div className="ninv-card-info">
                        <div className="ninv-info-row">
                          <span className="ninv-info-label">Categoría:</span>
                          <span className="ninv-info-value">{ingredient.categoria}</span>
                        </div>
                        <div className="ninv-info-row">
                          <span className="ninv-info-label">Stock:</span>
                          <span className="ninv-info-value">{ingredient.cantidad} {ingredient.unidad}</span>
                        </div>
                        <div className="ninv-info-row">
                          <span className="ninv-info-label">Precio Extra:</span>
                          <span className="ninv-info-value ninv-price">${ingredient.precio_extra}</span>
                        </div>
                        <div className="ninv-info-row">
                          <span className="ninv-info-label">Proveedor:</span>
                          <span className="ninv-info-value">{ingredient.proveedor}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ninv-card-actions">
                      <button 
                        className="ninv-btn-edit"
                        onClick={() => handleEditPrice(ingredient)}
                      >
                        <Edit />
                        Editar Precio
                      </button>
                      <button 
                        className="ninv-btn-delete"
                        onClick={() => setDeleteModal({ show: true, ingredient })}
                      >
                        <Trash2 />
                        Quitar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Vista de tabla */
              <div className="ninv-table-container">
                <table className="ninv-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Categoría</th>
                      <th>Stock</th>
                      <th>Precio Extra</th>
                      <th>Proveedor</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map(ingredient => (
                      <tr key={ingredient.id}>
                        <td>{ingredient.nombre}</td>
                        <td>{ingredient.categoria}</td>
                        <td>{ingredient.cantidad} {ingredient.unidad}</td>
                        <td>
                          <span className="ninv-price">${ingredient.precio_extra}</span>
                        </td>
                        <td>{ingredient.proveedor}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button 
                              className="ninv-btn-edit"
                              onClick={() => handleEditPrice(ingredient)}
                            >
                              <Edit />
                            </button>
                            <button 
                              className="ninv-btn-delete"
                              onClick={() => setDeleteModal({ show: true, ingredient })}
                            >
                              <Trash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="ninv-pagination">
                <button 
                  className="ninv-pagination-btn"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft />
                  Anterior
                </button>
                
                <div className="ninv-pagination-info">
                  Página {currentPage} de {totalPages} ({filteredData.length} ingredientes)
                </div>
                
                <button 
                  className="ninv-pagination-btn"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                  <ChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal para seleccionar ingrediente del inventario */}
      {showInventoryModal && (
        <div className="ninv-modal-overlay" onClick={() => setShowInventoryModal(false)}>
          <div className="ninv-modal-content ninv-inventory-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ninv-modal-header">
              <h3>
                <Pizza />
                Seleccionar Ingrediente del Inventario
              </h3>
              <button 
                className="ninv-modal-close"
                onClick={() => setShowInventoryModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="ninv-modal-body">
              <p className="ninv-modal-description">
                Selecciona un ingrediente del inventario y asigna su precio extra para personalización de pizzas.
              </p>
              
              <div className="ninv-inventory-list">
                {loadingAvailable ? (
                  <div className="ninv-loading-state">
                    <div className="ninv-loading-spinner"></div>
                    <p className="ninv-loading-text">Cargando ingredientes disponibles...</p>
                  </div>
                ) : availableInventoryItems.length === 0 ? (
                  <div className="ninv-empty-inventory">
                    <p>Todos los ingredientes del inventario ya han sido agregados.</p>
                  </div>
                ) : (
                  availableInventoryItems.map(item => (
                    <div key={item.id_ingrediente} className="ninv-inventory-item">
                      <div className="ninv-item-info">
                        <h4>{item.nombre}</h4>
                        <p>{item.categoria} - {item.cantidad || item.cantidad_actual} {item.unidad}</p>
                        <small>Proveedor: {item.proveedor}</small>
                      </div>
                      <button 
                        className="ninv-btn-select"
                        onClick={() => {
                          setFormData({ precio_extra: '' });
                          setShowForm(true);
                          setEditingIngredient(item);
                        }}
                      >
                        Seleccionar
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar precio */}
      {showForm && (
        <div className="ninv-modal-overlay" onClick={() => resetForm()}>
          <div className="ninv-modal-content ninv-form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ninv-modal-header">
              <h3>
                <Pizza />
                {editingIngredient && pizzaIngredients.some(p => p.id === editingIngredient.id) 
                  ? 'Editar Precio Extra' 
                  : `Agregar ${editingIngredient?.nombre}`}
              </h3>
              <button 
                className="ninv-modal-close"
                onClick={resetForm}
              >
                ×
              </button>
            </div>
            
            <div className="ninv-modal-body">
              <div className="ninv-ingredient-info">
                <h4>{editingIngredient?.nombre}</h4>
                <p>{editingIngredient?.categoria}</p>
              </div>

              <form className="ninv-form-simple" onSubmit={(e) => e.preventDefault()}>
                <div className="ninv-input-group">
                  <label className="ninv-input-label">
                    Precio Extra ($) <span className="ninv-required-asterisk">*</span>
                  </label>
                  <input
                    type="number"
                    name="precio_extra"
                    value={formData.precio_extra}
                    onChange={handleFormChange}
                    min="0"
                    step="0.01"
                    className={`ninv-input ${formErrors.precio_extra ? 'error' : ''}`}
                    placeholder="0.00"
                  />
                  {formErrors.precio_extra && (
                    <div className="ninv-error-message">
                      <AlertTriangle />
                      {formErrors.precio_extra}
                    </div>
                  )}
                </div>
              </form>
            </div>

            <div className="ninv-modal-actions">
              <button 
                type="button" 
                className="ninv-btn ninv-btn-cancel" 
                onClick={resetForm}
              >
                Cancelar
              </button>
              <button 
                type="button" 
                className="ninv-btn ninv-btn-save" 
                onClick={editingIngredient && pizzaIngredients.some(p => p.id === editingIngredient.id) 
                  ? handleUpdatePrice 
                  : () => handleAddFromInventory(editingIngredient)}
              >
                {editingIngredient && pizzaIngredients.some(p => p.id === editingIngredient.id) 
                  ? 'Actualizar' 
                  : 'Agregar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {deleteModal.show && (
        <div className="ninv-modal-overlay" onClick={() => setDeleteModal({ show: false, ingredient: null })}>
          <div className="ninv-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="ninv-modal-header">
              <h3>
                <AlertTriangle />
                Confirmar Eliminación
              </h3>
            </div>
            <div className="ninv-modal-body">
              <p>¿Estás seguro de que deseas quitar este ingrediente de la personalización de pizzas?</p>
              <p className="ninv-modal-product">{deleteModal.ingredient?.nombre}</p>
            </div>
            <div className="ninv-modal-actions">
              <button 
                className="ninv-btn ninv-btn-cancel"
                onClick={() => setDeleteModal({ show: false, ingredient: null })}
              >
                Cancelar
              </button>
              <button 
                className="ninv-btn ninv-btn-delete"
                onClick={handleDelete}
              >
                Quitar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PizzaIngredients;
