import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './hooks/useNotification.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/navbar/nabvar'
import Sidebar from './components/sidebar/sidebar';
import Login from './components/auth/login/Login1';     // Asegúrate que esté bien el nombre del archivo
import Register from './components/auth/register/Register'; // Ruta correcta al componente Register
import Recuperar from './components/auth/restore/Recuperar'; // Ruta correcta al componente Recuperar
import VerificarCodigo from './components/auth/restore/VerificarCodigo'; // Ruta correcta al componente VerificarCodigo
import Restablecer from './components/auth/restore/Restablecer'; // Ruta correcta al componente Restablecer
import Home from './pages/app/home'; 
import Prueba from './components/prueba';
import AgregarContenido from './components/contenido/AgregarContenido';
import OrderManager from './components/pedidos/OrderManager';
import GestionClientes from './components/GestionClientes/GestionClientes';
import GestionAdministradores from './components/GestionAdministradores/GestionAdministradores';
import Inventario from './components/Inventario/Inventario';
import Graficas from './pages/graficas/graficas';
import ConfiguracionAdmin from './pages/configuracion/ConfiguracionAdmin';
import GeneradorInformes from  './components/GeneradorInformes/GeneradorInformes';
import './App.css';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar el tamaño de pantalla
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);  return (
    <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Ruta principal redirige al login */}
            <Route path="/" element={<Navigate to="/login" />} />
            
            {/* Rutas de autenticación sin sidebar */}
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
            <Route path="/recuperar" element={<Recuperar />} />
            <Route path="/verificar-codigo" element={<VerificarCodigo />} />
            <Route path="/restablecer" element={<Restablecer />} />
            
            {/* Rutas autenticadas con sidebar */}
            <Route path="/*" element={
              <ProtectedRoute>
                <NotificationProvider>
                  <main className='container'>
                    <aside className='sidebar-container'>
                      <Sidebar 
                        onToggle={setSidebarCollapsed}
                        collapsed={sidebarCollapsed}
                      />
                    </aside>
                    <div 
                      className={`content-container ${
                        !isMobile && sidebarCollapsed ? 'sidebar-collapsed' : ''
                      }`}
                    >
                      <Routes>
                        <Route path="/home" element={<Graficas/> } />
                        <Route path='/prueba' element={<Prueba/>}/>
                        <Route path='/AgregarContenido' element={<AgregarContenido/>}/>
                        <Route path="/pedidos" element={<OrderManager />} />
                        <Route path="/clientes" element={<GestionClientes />} />
                        <Route path="/administradores" element={<GestionAdministradores />} />
                        <Route path="/inventario" element={<Inventario />} />
                        <Route path="/graficas" element={<Graficas />} />
                        <Route path="/configuracion" element={<ConfiguracionAdmin />} />
                        <Route path="/generadordeinformes" element={<GeneradorInformes />} />
                      </Routes>
                    </div>
                  </main>
                </NotificationProvider>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
    </AuthProvider>
  );
}

export default App;