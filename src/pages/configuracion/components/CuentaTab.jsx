import React from 'react';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  Edit,
  X,
  Save,
  LogOut,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import PerfilAdmin from './PerfilAdmin';
import CambiarContrasena from './CambiarContrasena';
import SesionAdmin from './SesionAdmin';

function CuentaTab({ 
  adminData, 
  loading, 
  error, 
  successMessage, 
  modoEdicion, 
  setModoEdicion,
  nombreAdmin,
  setNombreAdmin,
  emailAdmin,
  setEmailAdmin,
  telefonoAdmin,
  setTelefonoAdmin,
  guardarCambiosPerfil,
  formatearFecha,
  formatearUltimoAcceso,
  // Password change props
  contrasenaActual,
  setContrasenaActual,
  nuevaPassword,
  setNuevaPassword,
  confirmarPassword,
  setConfirmarPassword,
  contrasenaValida,
  showCurrent,
  setShowCurrent,
  showNew,
  setShowNew,
  showConfirm,
  setShowConfirm,
  cambiarContrasena,
  cerrarSesion
}) {
  return (
    <div className="account-tab-content">
      <div className="account-optimized-layout">
        <div className="account-main-column">
          <PerfilAdmin
            adminData={adminData}
            loading={loading}
            modoEdicion={modoEdicion}
            setModoEdicion={setModoEdicion}
            nombreAdmin={nombreAdmin}
            setNombreAdmin={setNombreAdmin}
            emailAdmin={emailAdmin}
            setEmailAdmin={setEmailAdmin}
            telefonoAdmin={telefonoAdmin}
            setTelefonoAdmin={setTelefonoAdmin}
            guardarCambiosPerfil={guardarCambiosPerfil}
            formatearFecha={formatearFecha}
            formatearUltimoAcceso={formatearUltimoAcceso}
          />

          <CambiarContrasena
            successMessage={successMessage}
            error={error}
            contrasenaActual={contrasenaActual}
            setContrasenaActual={setContrasenaActual}
            nuevaPassword={nuevaPassword}
            setNuevaPassword={setNuevaPassword}
            confirmarPassword={confirmarPassword}
            setConfirmarPassword={setConfirmarPassword}
            contrasenaValida={contrasenaValida}
            showCurrent={showCurrent}
            setShowCurrent={setShowCurrent}
            showNew={showNew}
            setShowNew={setShowNew}
            showConfirm={showConfirm}
            setShowConfirm={setShowConfirm}
            cambiarContrasena={cambiarContrasena}
            loading={loading}
          />
        </div>

        <div className="account-sidebar-column">
          <SesionAdmin cerrarSesion={cerrarSesion} />
        </div>
      </div>
    </div>
  );
}

export default CuentaTab;
