import React, { useState, useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { testNotification, NotificationCategories } from '../services/NotificationService';

const Prueba = () => {
  const notificationContext = useNotifications();
  const [testResult, setTestResult] = useState(null);
  const [diagnostico, setDiagnostico] = useState(null);
  
  useEffect(() => {
    // Realizar diagnóstico al cargar
    const realizarDiagnostico = async () => {
      const resultados = [];
      
      // Verificar soporte para notificaciones
      resultados.push({
        prueba: 'Soporte para notificaciones',
        resultado: 'Notification' in window ? 'Soportado ✅' : 'No soportado ❌',
        detalles: 'Notification' in window ? '' : 'Tu navegador no soporta notificaciones.'
      });
      
      // Verificar soporte para Service Worker
      resultados.push({
        prueba: 'Soporte para Service Worker',
        resultado: 'serviceWorker' in navigator ? 'Soportado ✅' : 'No soportado ❌',
        detalles: 'serviceWorker' in navigator ? '' : 'Tu navegador no soporta Service Workers.'
      });
      
      // Verificar estado de permisos
      resultados.push({
        prueba: 'Permisos de notificación',
        resultado: `${Notification.permission} ${Notification.permission === 'granted' ? '✅' : '⚠️'}`,
        detalles: Notification.permission === 'granted' 
          ? 'Los permisos están concedidos.' 
          : 'Necesitas conceder permisos para recibir notificaciones.'
      });
      
      // Verificar error de registro de SW
      resultados.push({
        prueba: 'Registro del Service Worker',
        resultado: notificationContext.swRegistrationError 
          ? `Error ❌` 
          : (notificationContext.swRegistration ? 'Registrado ✅' : 'No registrado ⚠️'),
        detalles: notificationContext.swRegistrationError 
          ? `Error: ${notificationContext.swRegistrationError}` 
          : (notificationContext.swRegistration 
              ? 'El Service Worker está registrado correctamente.' 
              : 'El Service Worker no está registrado aún.')
      });
      
      setDiagnostico(resultados);
    };
    
    realizarDiagnostico();
  }, [notificationContext.swRegistration, notificationContext.swRegistrationError, notificationContext.permissionStatus]);

  const handleTestNotification = async (category) => {
    // Usar el método antiguo para notificaciones internas
    testNotification(notificationContext, category);
  };

  const handlePushTest = async () => {
    setTestResult("Enviando notificación push de prueba...");
    
    try {
      // Usar el nuevo método directo para notificaciones push
      const result = await notificationContext.sendTestNotification();
      
      if (result) {
        setTestResult("¡Notificación push enviada correctamente! Revisa fuera del navegador.");
      } else {
        setTestResult("No se pudo enviar la notificación push. Verifica que los permisos estén activados.");
      }
    } catch (error) {
      console.error("Error al enviar notificación:", error);
      setTestResult(`Error: ${error.message}`);
    }
  };

  const handleRequestPermission = async () => {
    setTestResult("Solicitando permisos...");
    try {
      const result = await notificationContext.requestPermission();
      setTestResult(`Estado de permisos de notificación: ${result}`);
      
      if (result === 'granted') {
        // Enviar una notificación de prueba inmediata para confirmar
        setTimeout(() => {
          notificationContext.sendTestNotification();
        }, 1000);
      }
    } catch (error) {
      setTestResult(`Error al solicitar permisos: ${error.message}`);
    }
  };

  const forzarRegistroSW = async () => {
    setTestResult("Intentando registrar el Service Worker manualmente...");
    
    try {
      if ('serviceWorker' in navigator) {
        // Desregistrar cualquier service worker existente
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (let registration of registrations) {
          await registration.unregister();
        }
        
        // Registrar de nuevo
        const registration = await navigator.serviceWorker.register('/notification-sw.js', {
          scope: '/'
        });
        
        setTestResult(`Service Worker registrado manualmente. Scope: ${registration.scope}`);
        
        // Recargar la página para aplicar cambios
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setTestResult("Tu navegador no soporta Service Workers.");
      }
    } catch (error) {
      setTestResult(`Error al registrar el Service Worker: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Página de pruebas de notificaciones</h1>
      
      <div style={{ 
        marginTop: '20px',
        border: '1px solid #ccc', 
        padding: '20px', 
        borderRadius: '8px',
        backgroundColor: '#f9f9f9' 
      }}>
        <h2>Diagnóstico de notificaciones</h2>
        
        {diagnostico && (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead>
              <tr style={{ backgroundColor: '#e9e9e9', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Prueba</th>
                <th style={{ padding: '10px' }}>Resultado</th>
                <th style={{ padding: '10px' }}>Detalles</th>
              </tr>
            </thead>
            <tbody>
              {diagnostico.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px' }}>{item.prueba}</td>
                  <td style={{ padding: '10px' }}>{item.resultado}</td>
                  <td style={{ padding: '10px' }}>{item.detalles}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        <h3>Estado actual</h3>
        <div style={{ marginBottom: '20px' }}>
          <p>Estado de permisos: <strong>{notificationContext.permissionStatus}</strong></p>
          <p>Service Worker: <strong>{notificationContext.swRegistration ? 'Registrado' : 'No registrado'}</strong></p>
          {notificationContext.swRegistrationError && (
            <p style={{ color: 'red' }}>Error de SW: <strong>{notificationContext.swRegistrationError}</strong></p>
          )}
          
          {testResult && (
            <div style={{ 
              padding: '10px 15px', 
              marginTop: '10px',
              background: '#f0f0f0',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}>
              {testResult}
            </div>
          )}
        </div>
        
        <div style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <button 
            onClick={handleRequestPermission}
            style={{ 
              padding: '10px 15px', 
              background: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Solicitar permiso para notificaciones
          </button>
          
          <button 
            onClick={handlePushTest}
            style={{ 
              padding: '10px 15px', 
              background: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            disabled={notificationContext.permissionStatus !== 'granted'}
          >
            Enviar notificación push de prueba
          </button>
          
          <button 
            onClick={forzarRegistroSW}
            style={{ 
              padding: '10px 15px', 
              background: '#dc3545',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Forzar registro del Service Worker
          </button>
        </div>
        
        <hr style={{ margin: '20px 0' }} />
        
        <h3>Probar notificaciones por categoría</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          <button 
            onClick={() => handleTestNotification(NotificationCategories.PEDIDOS)}
            style={{ 
              padding: '15px',
              background: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Probar notificación de Pedidos
          </button>
          
          <button 
            onClick={() => handleTestNotification(NotificationCategories.INVENTARIO)}
            style={{ 
              padding: '15px',
              background: '#ffc107',
              color: '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Probar notificación de Inventario
          </button>
          
          <button 
            onClick={() => handleTestNotification(NotificationCategories.CLIENTES)}
            style={{ 
              padding: '15px',
              background: '#17a2b8',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Probar notificación de Clientes
          </button>
          
          <button 
            onClick={() => handleTestNotification(NotificationCategories.SISTEMA)}
            style={{ 
              padding: '15px',
              background: '#6c757d',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Probar notificación del Sistema
          </button>
        </div>
        
        <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#eef5ff', borderRadius: '4px', border: '1px solid #c8d8f7' }}>
          <h3>Solución de problemas con notificaciones push</h3>
          <ol style={{ paddingLeft: '20px', marginBottom: '0' }}>
            <li>Asegúrate de que tu navegador permita notificaciones para este sitio</li>
            <li>El Service Worker debe estar registrado correctamente (debe verse como "Registrado" arriba)</li>
            <li>Si sigues viendo errores, haz clic en "Forzar registro del Service Worker"</li>
            <li>Las notificaciones push funcionan incluso cuando la aplicación está en segundo plano</li>
            <li>Si usas Chrome, puedes revisar los Service Workers en chrome://serviceworker-internals/</li>
            <li>En Firefox, visita about:debugging#/runtime/this-firefox para ver los Service Workers activos</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Prueba;