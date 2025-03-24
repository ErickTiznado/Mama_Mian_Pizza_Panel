import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login1';     // Asegúrate que esté bien el nombre del archivo
import Register from './components/Register'; // Ruta correcta al componente Register
import Recuperar from './components/Recuperar';
import VerificarCodigo from './components/VerificarCodigo';
import Restablecer from './components/Restablecer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/recuperar" element={<Recuperar />} />
        <Route path="/verificar-codigo" element={<VerificarCodigo />} />
        <Route path="/restablecer" element={<Restablecer />} />
        
      </Routes>
    </Router>
  );
}

export default App;