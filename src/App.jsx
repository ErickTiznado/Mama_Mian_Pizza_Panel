import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/login/Login1';     // Asegúrate que esté bien el nombre del archivo
import Register from './components/auth/register/Register'; // Ruta correcta al componente Register
import Recuperar from './components/auth/restore/Recuperar'; // Ruta correcta al componente Recuperar
import VerificarCodigo from './components/auth/restore/VerificarCodigo'; // Ruta correcta al componente VerificarCodigo
import Restablecer from './components/auth/restore/Restablecer'; // Ruta correcta al componente Restablecer
import Home from './pages/app/home'; 
import Prueba from './components/prueba';
import AgregarContenido from './components/contenido/AgregarContenido';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/recuperar" element={<Recuperar />} />
        <Route path="/verificar-codigo" element={<VerificarCodigo />} />
        <Route path="/restablecer" element={<Restablecer />} />
        <Route path="/home" element={<Home/> } />
        <Route path='/prueba' element={<Prueba/>}/>
        <Route path='/AgregarContenido' element={<AgregarContenido/>}/>
      </Routes>
    </Router>
  );
}

export default App;