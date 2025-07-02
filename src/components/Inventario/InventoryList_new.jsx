import React, { useState } from 'react';
import { Search, Trash2, Edit, AlertTriangle, Plus, Filter, ArrowUpDown, Grid3X3, List, ChevronLeft, ChevronRight } from 'lucide-react';
import InventoryService from '../../services/InventoryService';
import './InventoryList.css';

const InventoryList = ({ inventoryData, onDataUpdate, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('nombre');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' o 'table'
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, product: null });
  
  const itemsPerPage = 8;

  // Estado para el formulario
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    stock: '',
    unidad: '',
    estado: 'Normal',
    fecha_caducidad: '',
    proveedor: '',
    costo: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  // Datos para filtros
  const categories = [...new Set(inventoryData.map(item => item.categoria).filter(Boolean))];
  const statuses = [...new Set(inventoryData.map(item => item.estado).filter(Boolean))];

  // Filtrar y ordenar datos
  const filteredData = inventoryData
    .filter(item => {
      const matchesSearch = item.nombre?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !categoryFilter || item.categoria === categoryFilter;
      const matchesStatus = !statusFilter || item.estado === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      let aValue = a[sortBy] || '';
      let bValue = b[sortBy] || '';
      
      if (sortBy === 'cantidad_actual' || sortBy === 'costo') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      } else if (sortBy === 'fecha_caducidad') {
        aValue = new Date(aValue || '1900-01-01');
        bValue = new Date(bValue || '1900-01-01');
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Paginación
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Validación del formulario
  const validateForm = () => {
    const errors = {};
    
    if (!formData.nombre.trim()) errors.nombre = 'El nombre es requerido';
    if (!formData.categoria.trim()) errors.categoria = 'La categoría es requerida';
    if (!formData.stock || parseFloat(formData.stock) < 0) errors.stock = 'El stock debe ser mayor o igual a 0';
    if (!formData.unidad.trim()) errors.unidad = 'La unidad es requerida';
    if (!formData.fecha_caducidad) errors.fecha_caducidad = 'La fecha de caducidad es requerida';
    if (!formData.proveedor.trim()) errors.proveedor = 'El proveedor es requerido';
    if (!formData.costo || parseFloat(formData.costo) <= 0) errors.costo = 'El costo debe ser mayor a 0';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Manejar cambios en el formulario
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error específico cuando el usuario empiece a escribir
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Guardar producto
  const handleSave = async () => {
    if (!validateForm()) return;

    setSubmitError('');
    setSubmitSuccess('');

    try {
      const productData = {
        nombre: formData.nombre,
        categoria: formData.categoria,
        cantidad_actual: parseFloat(formData.stock),
        unidad: formData.unidad,
        estado: formData.estado,
        fecha_caducidad: formData.fecha_caducidad,
        proveedor: formData.proveedor,
        costo: parseFloat(formData.costo)
      };

      if (editingProduct) {
        await InventoryService.updateProduct(editingProduct, productData);
        setSubmitSuccess('Producto actualizado exitosamente');
      } else {
        await InventoryService.addProduct(productData);
        setSubmitSuccess('Producto agregado exitosamente');
      }

      resetForm();
      onDataUpdate();
      
      setTimeout(() => setSubmitSuccess(''), 3000);
    } catch (error) {
      setSubmitError('Error al guardar el producto. Intenta nuevamente.');
      setTimeout(() => setSubmitError(''), 5000);
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      nombre: '',
      categoria: '',
      stock: '',
      unidad: '',
      estado: 'Normal',
      fecha_caducidad: '',
      proveedor: '',
      costo: ''
    });
    setEditingProduct(null);
    setShowForm(false);
    setFormErrors({});
    setSubmitError('');
    setSubmitSuccess('');
  };

  // Editar producto
  const handleEdit = (product) => {
    setFormData({
      nombre: product.nombre || '',
      categoria: product.categoria || '',
      stock: product.cantidad_actual?.toString() || '',
      unidad: product.unidad || '',
      estado: product.estado || 'Normal',
      fecha_caducidad: product.fecha_caducidad ? 
        new Date(product.fecha_caducidad).toISOString().split('T')[0] : '',
      proveedor: product.proveedor || '',
      costo: product.costo?.toString() || ''
    });
    setEditingProduct(product.id_ingrediente);
    setShowForm(true);
  };

  // Eliminar producto
  const handleDelete = async () => {
    if (!deleteModal.product) return;

    try {
      await InventoryService.deleteProduct(deleteModal.product.id_ingrediente);
      setSubmitSuccess('Producto eliminado exitosamente');
      onDataUpdate();
      setDeleteModal({ show: false, product: null });
      
      setTimeout(() => setSubmitSuccess(''), 3000);
    } catch (error) {
      setSubmitError('Error al eliminar el producto. Intenta nuevamente.');
      setTimeout(() => setSubmitError(''), 5000);
    }
  };

  // Estados de loading
  if (loading) {
    return (
      <div className="ninv-inventory-list">
        <div className="ninv-loading-state">
          <div className="ninv-loading-spinner"></div>
          <p className="ninv-loading-text">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ninv-inventory-list">
      {/* Header con título y botón agregar */}
      <div className="ninv-list-header">
        <div className="ninv-list-title">
          <Package />
          Gestión de Inventario
        </div>
        <div className="ninv-header-actions">
          <button 
            className="ninv-btn-add-product"
            onClick={() => setShowForm(true)}
          >
            <Plus />
            Agregar Producto
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
              placeholder="Buscar productos..."
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

          <div className="ninv-filter-group">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="ninv-filter-select"
            >
              <option value="">Todos los estados</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Ordenamiento */}
          <button className="ninv-sort-btn" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
            <ArrowUpDown />
            Ordenar {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
          </button>

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

      {/* Contenedor de productos */}
      <div className="ninv-products-container">
        {showForm ? (
          /* Formulario */
          <div className="ninv-form-container">
            <div className="ninv-form-header">
              <h3 className="ninv-form-title">
                <Plus />
                {editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
              </h3>
              <button className="ninv-form-close" onClick={resetForm}>
                ×
              </button>
            </div>

            <form className="ninv-form-grid" onSubmit={(e) => e.preventDefault()}>
              <div className="ninv-input-group">
                <label className="ninv-input-label">
                  Nombre del Producto <span className="ninv-required-asterisk">*</span>
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleFormChange}
                  className={`ninv-input ${formErrors.nombre ? 'error' : ''}`}
                  placeholder="Ingresa el nombre del producto"
                />
                {formErrors.nombre && (
                  <div className="ninv-error-message">
                    <AlertTriangle />
                    {formErrors.nombre}
                  </div>
                )}
              </div>

              <div className="ninv-input-group">
                <label className="ninv-input-label">
                  Categoría <span className="ninv-required-asterisk">*</span>
                </label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleFormChange}
                  className={`ninv-select ${formErrors.categoria ? 'error' : ''}`}
                >
                  <option value="">Seleccionar categoría</option>
                  {['Carnes', 'Vegetales', 'Lácteos', 'Granos', 'Condimentos', 'Bebidas', 'Otros'].map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {formErrors.categoria && (
                  <div className="ninv-error-message">
                    <AlertTriangle />
                    {formErrors.categoria}
                  </div>
                )}
              </div>

              <div className="ninv-input-group">
                <label className="ninv-input-label">
                  Stock Actual <span className="ninv-required-asterisk">*</span>
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleFormChange}
                  min="0"
                  step="0.01"
                  className={`ninv-input ${formErrors.stock ? 'error' : ''}`}
                  placeholder="0.00"
                />
                {formErrors.stock && (
                  <div className="ninv-error-message">
                    <AlertTriangle />
                    {formErrors.stock}
                  </div>
                )}
              </div>

              <div className="ninv-input-group">
                <label className="ninv-input-label">
                  Unidad <span className="ninv-required-asterisk">*</span>
                </label>
                <select
                  name="unidad"
                  value={formData.unidad}
                  onChange={handleFormChange}
                  className={`ninv-select ${formErrors.unidad ? 'error' : ''}`}
                >
                  <option value="">Seleccionar unidad</option>
                  {['kg', 'g', 'L', 'ml', 'piezas', 'latas', 'paquetes'].map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
                {formErrors.unidad && (
                  <div className="ninv-error-message">
                    <AlertTriangle />
                    {formErrors.unidad}
                  </div>
                )}
              </div>

              <div className="ninv-input-group">
                <label className="ninv-input-label">
                  Fecha de Caducidad <span className="ninv-required-asterisk">*</span>
                </label>
                <input
                  type="date"
                  name="fecha_caducidad"
                  value={formData.fecha_caducidad}
                  onChange={handleFormChange}
                  className={`ninv-input ${formErrors.fecha_caducidad ? 'error' : ''}`}
                />
                {formErrors.fecha_caducidad && (
                  <div className="ninv-error-message">
                    <AlertTriangle />
                    {formErrors.fecha_caducidad}
                  </div>
                )}
              </div>

              <div className="ninv-input-group">
                <label className="ninv-input-label">
                  Proveedor <span className="ninv-required-asterisk">*</span>
                </label>
                <input
                  type="text"
                  name="proveedor"
                  value={formData.proveedor}
                  onChange={handleFormChange}
                  className={`ninv-input ${formErrors.proveedor ? 'error' : ''}`}
                  placeholder="Nombre del proveedor"
                />
                {formErrors.proveedor && (
                  <div className="ninv-error-message">
                    <AlertTriangle />
                    {formErrors.proveedor}
                  </div>
                )}
              </div>

              <div className="ninv-input-group">
                <label className="ninv-input-label">
                  Costo <span className="ninv-required-asterisk">*</span>
                </label>
                <input
                  type="number"
                  name="costo"
                  value={formData.costo}
                  onChange={handleFormChange}
                  min="0"
                  step="0.01"
                  className={`ninv-input ${formErrors.costo ? 'error' : ''}`}
                  placeholder="0.00"
                />
                {formErrors.costo && (
                  <div className="ninv-error-message">
                    <AlertTriangle />
                    {formErrors.costo}
                  </div>
                )}
              </div>

              <div className="ninv-input-group">
                <label className="ninv-input-label">Estado</label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleFormChange}
                  className="ninv-select"
                >
                  <option value="Normal">Normal</option>
                  <option value="Bajo">Bajo</option>
                  <option value="Crítico">Crítico</option>
                </select>
              </div>
            </form>

            <div className="ninv-form-actions">
              <button type="button" className="ninv-btn ninv-btn-cancel" onClick={resetForm}>
                Cancelar
              </button>
              <button type="button" className="ninv-btn ninv-btn-save" onClick={handleSave}>
                {editingProduct ? 'Actualizar' : 'Guardar'}
              </button>
            </div>
          </div>
        ) : filteredData.length === 0 ? (
          /* Estado vacío */
          <div className="ninv-empty-state">
            <Package />
            <h3>No hay productos</h3>
            <p>Agrega productos para comenzar a gestionar tu inventario</p>
          </div>
        ) : (
          /* Lista de productos */
          <>
            {viewMode === 'cards' ? (
              /* Vista de tarjetas */
              <div className="ninv-cards-grid">
                {paginatedData.map(product => (
                  <div key={product.id_ingrediente} className="ninv-product-card">
                    <div className="ninv-card-header">
                      <h4 className="ninv-card-title">{product.nombre}</h4>
                      <span className={`ninv-card-status ${product.estado?.toLowerCase() || 'normal'}`}>
                        {product.estado || 'Normal'}
                      </span>
                    </div>
                    
                    <div className="ninv-card-body">
                      <div className="ninv-card-info">
                        <div className="ninv-info-row">
                          <span className="ninv-info-label">Categoría:</span>
                          <span className="ninv-info-value">{product.categoria}</span>
                        </div>
                        <div className="ninv-info-row">
                          <span className="ninv-info-label">Stock:</span>
                          <span className="ninv-info-value">{product.cantidad_actual} {product.unidad}</span>
                        </div>
                        <div className="ninv-info-row">
                          <span className="ninv-info-label">Costo:</span>
                          <span className="ninv-info-value">${product.costo}</span>
                        </div>
                        <div className="ninv-info-row">
                          <span className="ninv-info-label">Proveedor:</span>
                          <span className="ninv-info-value">{product.proveedor}</span>
                        </div>
                        <div className="ninv-info-row">
                          <span className="ninv-info-label">Vence:</span>
                          <span className="ninv-info-value">
                            {product.fecha_caducidad ? new Date(product.fecha_caducidad).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ninv-card-actions">
                      <button 
                        className="ninv-btn-edit"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit />
                        Editar
                      </button>
                      <button 
                        className="ninv-btn-delete"
                        onClick={() => setDeleteModal({ show: true, product })}
                      >
                        <Trash2 />
                        Eliminar
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
                      <th>Estado</th>
                      <th>Costo</th>
                      <th>Proveedor</th>
                      <th>Caducidad</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map(product => (
                      <tr key={product.id_ingrediente}>
                        <td>{product.nombre}</td>
                        <td>{product.categoria}</td>
                        <td>{product.cantidad_actual} {product.unidad}</td>
                        <td>
                          <span className={`ninv-card-status ${product.estado?.toLowerCase() || 'normal'}`}>
                            {product.estado || 'Normal'}
                          </span>
                        </td>
                        <td>${product.costo}</td>
                        <td>{product.proveedor}</td>
                        <td>
                          {product.fecha_caducidad ? new Date(product.fecha_caducidad).toLocaleDateString() : 'N/A'}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button 
                              className="ninv-btn-edit"
                              onClick={() => handleEdit(product)}
                            >
                              <Edit />
                            </button>
                            <button 
                              className="ninv-btn-delete"
                              onClick={() => setDeleteModal({ show: true, product })}
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
                  Página {currentPage} de {totalPages} ({filteredData.length} productos)
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

      {/* Modal de confirmación de eliminación */}
      {deleteModal.show && (
        <div className="ninv-modal-overlay" onClick={() => setDeleteModal({ show: false, product: null })}>
          <div className="ninv-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="ninv-modal-header">
              <h3>
                <AlertTriangle />
                Confirmar Eliminación
              </h3>
            </div>
            <div className="ninv-modal-body">
              <p>¿Estás seguro de que deseas eliminar este producto?</p>
              <p className="ninv-modal-product">{deleteModal.product?.nombre}</p>
            </div>
            <div className="ninv-modal-actions">
              <button 
                className="ninv-btn ninv-btn-cancel"
                onClick={() => setDeleteModal({ show: false, product: null })}
              >
                Cancelar
              </button>
              <button 
                className="ninv-btn ninv-btn-delete"
                onClick={handleDelete}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryList;
