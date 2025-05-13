import React, { createContext, useState, useContext, useEffect } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [permission, setPermission] = useState('default');
  const [swRegistration, setSwRegistration] = useState(null);
  const [swRegistrationError, setSwRegistrationError] = useState(null);

  // Registrar el Service Worker y comprobar permisos al cargar
  useEffect(() => {
    // Comprobar soporte para notificaciones
    const checkPermissionAndRegisterSW = async () => {
      if ('Notification' in window) {
        setPermission(Notification.permission);
        
        // Registrar el Service Worker para notificaciones
        if ('serviceWorker' in navigator) {
          try {
            console.log('Intentando registrar el Service Worker...');
            
            // Limpiar registros anteriores para evitar conflictos
            const registrations = await navigator.serviceWorker.getRegistrations();
            for (let registration of registrations) {
              await registration.unregister();
              console.log('Service Worker desregistrado:', registration);
            }
            
            // Registrar el service worker desde la carpeta public
            const registration = await navigator.serviceWorker.register('/notification-sw.js', {
              scope: '/'
            });
            
            console.log('Service Worker registrado con éxito:', registration);
            setSwRegistration(registration);
            setSwRegistrationError(null);
            
            // Si ya tenemos permisos, suscribirse
            if (Notification.permission === 'granted') {
              await setupPushSubscription(registration);
            }
          } catch (error) {
            console.error('Error al registrar el Service Worker:', error);
            setSwRegistrationError(error.message);
          }
        }
      }
    };
    
    checkPermissionAndRegisterSW();
    
    // Limpiar al desmontar
    return () => {
      // Nada que limpiar aquí, ya que no queremos desregistrar el SW al navegar
    };
  }, []);

  // Función para configurar la suscripción push
  const setupPushSubscription = async (registration) => {
    try {
      console.log('Configurando suscripción push...');
      
      // Verificar si ya existe suscripción
      let subscription = await registration.pushManager.getSubscription();
      
      if (!subscription) {
        // Crear nueva suscripción
        // En producción, usaríamos una clave VAPID real del servidor
        const vapidPublicKey = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';
        const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
        
        try {
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey
          });
          
          console.log('Nueva suscripción push creada', subscription);
        } catch (subscribeError) {
          console.error('Error al suscribirse a push:', subscribeError);
        }
      } else {
        console.log('Ya existe una suscripción push', subscription);
      }
    } catch (error) {
      console.error('Error al configurar la suscripción push:', error);
    }
  };
  
  // Función para convertir la clave VAPID al formato requerido
  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    
    return outputArray;
  };

  // Solicitar permisos para notificaciones push
  const requestPermission = async () => {
    console.log('Solicitando permisos de notificación...');
    
    if ('Notification' in window) {
      try {
        const result = await Notification.requestPermission();
        console.log('Permiso de notificación:', result);
        setPermission(result);
        
        if (result === 'granted') {
          // Si no tenemos un Service Worker registrado, intentar registrarlo
          if (!swRegistration) {
            if ('serviceWorker' in navigator) {
              try {
                console.log('Registrando Service Worker durante solicitud de permiso...');
                const registration = await navigator.serviceWorker.register('/notification-sw.js', {
                  scope: '/'
                });
                console.log('Service Worker registrado con éxito durante solicitud de permiso:', registration);
                setSwRegistration(registration);
                await setupPushSubscription(registration);
              } catch (error) {
                console.error('Error al registrar el Service Worker durante solicitud de permiso:', error);
                setSwRegistrationError(error.message);
              }
            }
          } else {
            // Si ya tenemos el SW registrado, configurar suscripción
            console.log('Usando Service Worker ya registrado');
            await setupPushSubscription(swRegistration);
          }
        }
        
        return result;
      } catch (error) {
        console.error('Error al solicitar permiso de notificaciones:', error);
        return 'error';
      }
    }
    return 'denied';
  };

  // Enviar notificación push directamente (no requiere servidor)
  const sendPushNotification = async (notification) => {
    console.log('Intentando enviar notificación push...', notification);
    
    // Verificar que el Service Worker esté activo
    if (!swRegistration) {
      console.error('El Service Worker no está registrado');
      
      // Intentar registrar el SW de nuevo
      if ('serviceWorker' in navigator && Notification.permission === 'granted') {
        try {
          console.log('Intentando registrar SW antes de enviar notificación...');
          const registration = await navigator.serviceWorker.register('/notification-sw.js', {
            scope: '/'
          });
          setSwRegistration(registration);
          console.log('Service Worker registrado con éxito antes de notificación:', registration);
          
          // Reintentamos la notificación después de registrar el SW
          return sendPushNotification(notification);
        } catch (error) {
          console.error('Error al registrar el Service Worker antes de notificación:', error);
          setSwRegistrationError(error.message);
        }
      }
      
      return false;
    }

    // Asegurarnos de que tenemos permisos
    if (Notification.permission !== 'granted') {
      console.error('No hay permiso para notificaciones');
      return false;
    }

    try {
      // Verificar si el Service Worker está activo
      const swState = await navigator.serviceWorker.ready;
      console.log('Estado del Service Worker:', swState);
      
      // Enviar la notificación directamente (sin servidor)
      await swRegistration.showNotification(notification.title, {
        body: notification.message,
        icon: '/vite.svg',
        badge: '/vite.svg',
        vibrate: [100, 50, 100],
        requireInteraction: notification.data?.timeToShow ? true : false,
        tag: `notification-${notification.id}`, // Identificador único para evitar duplicados
        data: {
          category: notification.category,
          url: notification.data?.url || '/',
          ...notification.data
        },
        actions: [
          {
            action: 'view',
            title: 'Ver ahora'
          }
        ]
      });
      
      console.log('Notificación push enviada correctamente');
      
      // Si la notificación incluye sonido, reproducirlo
      if (notification.data?.sound) {
        try {
          console.log('Reproduciendo sonido de notificación...');
          const audio = new Audio('/notification-sound.mp3');
          audio.volume = 0.5;
          await audio.play();
        } catch (audioError) {
          console.log('No se pudo reproducir sonido:', audioError);
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error al mostrar notificación push:', error);
      
      // Plan B: mostrar una notificación nativa si el Service Worker falla
      try {
        console.log('Intentando mostrar notificación nativa como respaldo...');
        new Notification(notification.title, {
          body: notification.message,
          icon: '/vite.svg'
        });
        console.log('Notificación nativa mostrada correctamente');
        return true;
      } catch (fallbackError) {
        console.error('Error en notificación de respaldo:', fallbackError);
        return false;
      }
    }
  };

  // Añadir una nueva notificación
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date(),
      read: false,
      ...notification
    };
    
    setNotifications((prev) => [newNotification, ...prev]);
    
    // Enviar notificación push si hay permisos y se solicitó
    if (Notification.permission === 'granted' && notification.showPush) {
      console.log('Enviando notificación push desde addNotification...');
      
      // Usar un pequeño delay para asegurar que el UI se actualice primero
      setTimeout(() => {
        sendPushNotification(newNotification);
      }, 300);
    }
    
    return newNotification.id;
  };

  // Marcar una notificación como leída
  const markAsRead = (notificationId) => {
    setNotifications((prev) => 
      prev.map((notification) => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  // Marcar todas las notificaciones como leídas
  const markAllAsRead = () => {
    setNotifications((prev) => 
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  // Eliminar una notificación
  const removeNotification = (notificationId) => {
    setNotifications((prev) => 
      prev.filter((notification) => notification.id !== notificationId)
    );
  };

  // Obtener el conteo de notificaciones no leídas por categoría
  const getUnreadCount = (category = null) => {
    return notifications.filter(
      (notification) => !notification.read && 
      (category ? notification.category === category : true)
    ).length;
  };

  // Enviar notificación de prueba
  const sendTestNotification = async () => {
    console.log('Enviando notificación de prueba...');
    
    const testNotification = {
      id: Date.now(),
      title: 'Notificación de prueba',
      message: `Esta es una notificación de prueba. Hora: ${new Date().toLocaleTimeString()}`,
      category: 'sistema',
      showPush: true,
      data: {
        url: '/prueba',
        timeToShow: 10000,
        sound: true
      }
    };
    
    // Añadir al state de notificaciones
    setNotifications((prev) => [testNotification, ...prev]);
    
    // Enviar como push
    try {
      const result = await sendPushNotification(testNotification);
      console.log('Resultado de envío de notificación de prueba:', result);
      return result;
    } catch (error) {
      console.error('Error al enviar notificación de prueba:', error);
      return false;
    }
  };

  const value = {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    getUnreadCount,
    requestPermission,
    permissionStatus: permission,
    swRegistration,
    swRegistrationError,
    sendPushNotification,
    sendTestNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);