import React from 'react';
import './GestionComentarios.css';
import ComentariosExperienciasPanel from '../../components/GestionComentarios/ComentariosExperienciasPanel';

/**
 * Página de gestión de comentarios y experiencias
 * @returns {JSX.Element} Página para gestionar comentarios y experiencias
 */
const GestionComentariosPage = () => {
  return (
    <div className="gestion-comentarios-page">
      <header className="page-header">
        <h1>Gestión de Comentarios y Experiencias</h1>
      </header>
      
      <div className="page-content">
        <ComentariosExperienciasPanel />
      </div>
    </div>
  );
};

export default GestionComentariosPage;
