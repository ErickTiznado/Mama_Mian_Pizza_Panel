import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
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
import Inventario from './components/Inventario/Inventario';
import Graficas from './pages/graficas/graficas';
import NotificationsPollingManager from './components/OrderNotificationsManager';

// Importamos el contexto de notificaciones
import { NotificationProvider } from './context/NotificationContext';

function App() {
  return (
    <NotificationProvider>
      {/* Gestor de notificaciones en tiempo real */}
      <NotificationsPollingManager />
      
      <BrowserRouter>
        <main className='container'>

          <aside className='sidebar-container'>
            <Sidebar/>
          </aside>
          <div className='content-container'>
            <Routes>
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Register />} />
              <Route path="/recuperar" element={<Recuperar />} />
              <Route path="/verificar-codigo" element={<VerificarCodigo />} />
              <Route path="/restablecer" element={<Restablecer />} />
              <Route path="/home" element={<Graficas/> } />
              <Route path='/prueba' element={<Prueba/>}/>
              <Route path='/AgregarContenido' element={<AgregarContenido/>}/>
              <Route path="/pedidos" element={<OrderManager />} />
              <Route path="/clientes" element={<GestionClientes />} />
              <Route path="/inventario" element={<Inventario />} />
              <Route path="/graficas" element={<Graficas />} />
            </Routes>
          </div>
        </main>
      </BrowserRouter>
    </NotificationProvider>
  );
}

export default App;