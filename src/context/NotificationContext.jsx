import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  fetchNotifications, 
  fetchUnreadNotifications, 
  markNotificationReadOnServer, 
  markAllNotificationsReadOnServer, 
  deleteNotificationFromServer,
  playNotificationSound
} from '../services/NotificationService';

// Crear el contexto
export const NotificationContext = createContext();

// Proveedor del contexto de notificaciones
export const NotificationProvider = ({ children }) => {
  // Estado para almacenar las notificaciones
  const [notifications, setNotifications] = useState([]);
  // Estado para el permiso de notificaciones
  const [permission, setPermission] = useState('default');
  // Estado para el registro del Service Worker
  const [swRegistration, setSwRegistration] = useState(null);
  // Estado para errores en el registro del Service Worker
  const [swRegistrationError, setSwRegistrationError] = useState(null);
  // Estado para indicar si se están cargando notificaciones
  const [isLoading, setIsLoading] = useState(false);
  // Estado para errores de sincronización
  const [syncError, setSyncError] = useState(null);

  // Función para convertir la clave VAPID al formato requerido para notificaciones push
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

  // Función auxiliar para mostrar notificación nativa como fallback
  const showNativeNotification = (notification) => {
    try {
      if (Notification.permission === 'granted') {
        console.log('Mostrando notificación nativa como respaldo');
        
        const nativeNotification = new Notification(notification.title, {
          body: notification.message,
          icon: '/vite.svg',
          tag: `notification-${notification.id || Date.now()}`
        });
        
        // Manejar clic en la notificación nativa
        nativeNotification.onclick = () => {
          window.focus();
          if (notification.data?.url) {
            window.location.href = notification.data.url;
          }
        };
        
        // Si la notificación incluye sonido, reproducirlo
        if (notification.data?.sound) {
          playNotificationSound();
        }
        
        return true;
      } else {
        console.error('No hay permisos para mostrar notificaciones nativas');
        return false;
      }
    } catch (error) {
      console.error('Error al mostrar notificación nativa:', error);
      return false;
    }
  };

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

  // Registrar el Service Worker y comprobar permisos al cargar
  useEffect(() => {
    const checkPermissionAndRegisterSW = async () => {
      if ('Notification' in window) {
        setPermission(Notification.permission);
        
        if ('serviceWorker' in navigator) {
          try {
            console.log('Verificando Service Worker existente...');
            
            // Verificar si ya existe un Service Worker registrado
            const registrations = await navigator.serviceWorker.getRegistrations();
            const existingSW = registrations.find(reg => 
              reg.active && reg.active.scriptURL.includes('notification-sw.js')
            );
            
            let registration;
            if (existingSW) {
              console.log('Service Worker ya registrado:', existingSW);
              registration = existingSW;
            } else {
              // Registrar un nuevo Service Worker
              console.log('Registrando nuevo Service Worker...');
              registration = await navigator.serviceWorker.register('/notification-sw.js', {
                scope: '/'
              });
              console.log('Service Worker registrado con éxito:', registration);
            }
            
            setSwRegistration(registration);
            setSwRegistrationError(null);
            
            // Si ya tenemos permisos, configurar suscripción
            if (Notification.permission === 'granted') {
              await setupPushSubscription(registration);
              
              // Iniciar sincronización de notificaciones si el Service Worker está activo
              if (registration.active) {
                registration.active.postMessage({
                  type: 'INIT_NOTIFICATION_SYNC'
                });
              } else if (registration.installing || registration.waiting) {
                // Si el SW está instalando o esperando, escuchar el evento de estado cambiado
                const serviceWorker = registration.installing || registration.waiting;
                serviceWorker.addEventListener('statechange', (event) => {
                  if (event.target.state === 'activated') {
                    console.log('Service Worker activado, enviando mensaje de sincronización');
                    registration.active.postMessage({
                      type: 'INIT_NOTIFICATION_SYNC'
                    });
                  }
                });
              }
            }
          } catch (error) {
            console.error('Error al registrar el Service Worker:', error);
            setSwRegistrationError(error.message);
          }
        }
      }
    };
    
    checkPermissionAndRegisterSW();
  }, []);

  // Cargar notificaciones del servidor al iniciar
  useEffect(() => {
    const loadNotificationsFromServer = async () => {
      try {
        setIsLoading(true);
        setSyncError(null);
        
        const serverNotifications = await fetchNotifications();
        console.log('Notificaciones cargadas del servidor:', serverNotifications.length);
        
        setNotifications(serverNotifications);
      } catch (error) {
        console.error('Error al cargar notificaciones:', error);
        setSyncError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadNotificationsFromServer();
    
    // Configurar un intervalo para sincronizar periódicamente
    const syncInterval = setInterval(() => {
      loadNotificationsFromServer();
    }, 120000); // 2 minutos
    
    return () => {
      clearInterval(syncInterval);
    };
  }, []);

  // Solicitar permisos para notificaciones
  const requestPermission = async () => {
    console.log('Solicitando permisos de notificación...');
    
    if ('Notification' in window) {
      try {
        const result = await Notification.requestPermission();
        console.log('Permiso de notificación:', result);
        setPermission(result);
        
        if (result === 'granted') {
          // Registrar Service Worker si aún no tenemos uno
          if (!swRegistration) {
            if ('serviceWorker' in navigator) {
              try {
                console.log('Registrando Service Worker tras permiso...');
                const registration = await navigator.serviceWorker.register('/notification-sw.js', {
                  scope: '/'
                });
                console.log('Service Worker registrado exitosamente:', registration);
                setSwRegistration(registration);
                await setupPushSubscription(registration);
                
                // Iniciar sincronización con el Service Worker
                if (registration.active) {
                  registration.active.postMessage({
                    type: 'INIT_NOTIFICATION_SYNC'
                  });
                }
              } catch (error) {
                console.error('Error al registrar el Service Worker:', error);
                setSwRegistrationError(error.message);
              }
            }
          } else {
            // Si ya tenemos un SW registrado, configurar suscripción
            console.log('Usando Service Worker ya registrado');
            await setupPushSubscription(swRegistration);
            
            // Iniciar sincronización con el Service Worker
            if (swRegistration.active) {
              swRegistration.active.postMessage({
                type: 'INIT_NOTIFICATION_SYNC'
              });
            }
          }
        }
        
        return result;
      } catch (error) {
        console.error('Error al solicitar permiso:', error);
        return 'error';
      }
    }
    return 'denied';
  };

  // Enviar notificación push
  const sendPushNotification = async (notification) => {
    console.log('Enviando notificación push:', notification);
    
    // Comprobar permisos
    if (Notification.permission !== 'granted') {
      console.error('No hay permiso para notificaciones push');
      return false;
    }
    
    // No mostrar notificaciones leídas
    if (notification.read) {
      console.log('No se muestra la notificación porque ya está leída');
      return false;
    }
    
    try {
      // Verificar si el Service Worker está disponible
      if (swRegistration && swRegistration.active) {
        console.log('Enviando notificación vía Service Worker activo');
        
        // Enviar notificación usando el Service Worker
        await swRegistration.showNotification(notification.title, {
          body: notification.message,
          icon: '/vite.svg',
          badge: '/vite.svg',
          vibrate: [100, 50, 100],
          requireInteraction: notification.data?.timeToShow ? true : false,
          tag: `notification-${notification.id || Date.now()}`,
          data: {
            category: notification.category,
            url: notification.data?.url || '/',
            notificationId: notification.id,
            serverId: notification.serverId,
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
        
        // Reproducir sonido si está configurado
        if (notification.data?.sound) {
          playNotificationSound();
        }
        
        return true;
      } else {
        console.log('Service Worker no disponible, intentando registrar uno nuevo');
        
        // Intentar registrar el Service Worker
        if ('serviceWorker' in navigator) {
          try {
            const registration = await navigator.serviceWorker.register('/notification-sw.js', {
              scope: '/'
            });
            
            console.log('Service Worker registrado exitosamente:', registration);
            setSwRegistration(registration);
            
            if (registration.installing || registration.waiting) {
              console.log('Service Worker instalándose, usando notificación nativa mientras tanto');
              return showNativeNotification(notification);
            }
            
            if (registration.active) {
              // Si ya está activo, intentar mostrar la notificación de nuevo
              console.log('Service Worker activado, reintentando notificación');
              return sendPushNotification(notification);
            }
          } catch (error) {
            console.error('Error registrando Service Worker:', error);
            setSwRegistrationError(error.message);
            // Usar notificación nativa como fallback
            return showNativeNotification(notification);
          }
        }
      }
    } catch (error) {
      console.error('Error al mostrar notificación push:', error);
      // Usar notificación nativa como fallback
      return showNativeNotification(notification);
    }
    
    // Si llegamos aquí, intentar notificación nativa como último recurso
    return showNativeNotification(notification);
  };

  // Añadir una nueva notificación
  const addNotification = (notification) => {
    // Verificar si la notificación es válida
    if (!notification || !notification.title || !notification.message) {
      console.error('Intento de añadir notificación inválida:', notification);
      return null;
    }
    
    const newNotification = {
      id: notification.id || Date.now(),
      timestamp: notification.timestamp || new Date(),
      read: notification.read || false,
      ...notification
    };
    
    // Verificación de duplicados
    setNotifications((prev) => {
      // Verificar duplicados por ID de servidor
      if (newNotification.serverId && prev.some(n => n.serverId === newNotification.serverId)) {
        console.log('Notificación duplicada por serverId, ignorando:', newNotification.serverId);
        return prev;
      }
      
      // Verificar duplicados por ID local
      if (prev.some(n => n.id === newNotification.id)) {
        console.log('Notificación duplicada por id local, ignorando:', newNotification.id);
        return prev;
      }
      
      // Verificar duplicados por contenido similar en la última hora
      const oneHourAgo = new Date();
      oneHourAgo.setHours(oneHourAgo.getHours() - 1);
      
      const similarNotification = prev.find(n => 
        n.title === newNotification.title && 
        n.message === newNotification.message &&
        n.category === newNotification.category &&
        new Date(n.timestamp) > oneHourAgo
      );
      
      if (similarNotification) {
        console.log('Notificación similar reciente encontrada, ignorando duplicado');
        return prev;
      }
      
      console.log('Añadiendo nueva notificación:', newNotification);
      return [newNotification, ...prev];
    });
    
    // Enviar notificación push si es necesario
    if (Notification.permission === 'granted' && 
        notification.showPush && 
        !notification.read) {
      setTimeout(() => {
        sendPushNotification(newNotification);
      }, 300);
    }
    
    return newNotification.id;
  };

  // Marcar una notificación como leída
  const markAsRead = async (notificationId) => {
    // Buscar la notificación en el estado
    const notification = notifications.find(n => n.id === notificationId);
    
    if (!notification) {
      console.error('No se encontró la notificación con ID:', notificationId);
      return;
    }
    
    console.log('Marcando como leída notificación:', notification);
    
    // Actualizar el estado local primero
    setNotifications((prev) => 
      prev.map((n) => 
        n.id === notificationId 
          ? { ...n, read: true } 
          : n
      )
    );
    
    // Sincronizar con el servidor si tiene ID de servidor
    if (notification.serverId) {
      try {
        const result = await markNotificationReadOnServer(notification.serverId);
        if (result) {
          console.log('Notificación marcada como leída en el servidor:', notification.serverId);
        } else {
          console.error('Falló al marcar como leída en el servidor');
        }
      } catch (error) {
        console.error('Error al marcar como leída en el servidor:', error);
      }
    } else {
      console.log('La notificación no tiene ID de servidor, solo se marcó localmente');
    }
  };

  // Marcar todas las notificaciones como leídas
  const markAllAsRead = async () => {
    console.log('Marcando todas las notificaciones como leídas');
    
    // Actualizar el estado local primero
    setNotifications((prev) => 
      prev.map((notification) => ({ ...notification, read: true }))
    );
    
    // Sincronizar con el servidor
    try {
      const result = await markAllNotificationsReadOnServer();
      if (result) {
        console.log('Todas las notificaciones marcadas como leídas en el servidor');
      } else {
        console.error('Falló al marcar todas como leídas en el servidor');
      }
    } catch (error) {
      console.error('Error al marcar todas como leídas en el servidor:', error);
    }
  };

  // Eliminar una notificación
  const removeNotification = async (notificationId) => {
    // Buscar la notificación en el estado
    const notification = notifications.find(n => n.id === notificationId);
    
    if (!notification) return;
    
    // Actualizar el estado local primero
    setNotifications((prev) => 
      prev.filter((n) => n.id !== notificationId)
    );
    
    // Sincronizar con el servidor si tiene ID de servidor
    if (notification.serverId) {
      try {
        await deleteNotificationFromServer(notification.serverId);
        console.log('Notificación eliminada en el servidor:', notification.serverId);
      } catch (error) {
        console.error('Error al eliminar notificación en el servidor:', error);
      }
    }
  };

  // Obtener el conteo de notificaciones no leídas por categoría
  const getUnreadCount = (category = null) => {
    return notifications.filter(
      (notification) => !notification.read && 
      (category ? notification.category === category : true)
    ).length;
  };

  // Forzar una sincronización manual con el servidor
  const syncWithServer = async () => {
    try {
      setIsLoading(true);
      setSyncError(null);
      
      const serverNotifications = await fetchNotifications();
      console.log('Sincronización manual: Notificaciones del servidor:', serverNotifications.length);
      
      // Fusionar notificaciones conservando las existentes para evitar duplicados
      setNotifications(prevNotifications => {
        // Crear un mapa de notificaciones existentes por serverId
        const existingNotificationsMap = new Map();
        prevNotifications.forEach(notification => {
          if (notification.serverId) {
            existingNotificationsMap.set(notification.serverId, notification);
          }
        });
        
        // Procesar las notificaciones del servidor
        const mergedNotifications = serverNotifications.map(notification => {
          // Si ya existe una notificación con este serverId, conservar su estado local
          if (notification.serverId && existingNotificationsMap.has(notification.serverId)) {
            const existingNotification = existingNotificationsMap.get(notification.serverId);
            // Actualizar solo si hay cambios relevantes
            if (existingNotification.read !== notification.read) {
              return {
                ...existingNotification,
                read: notification.read // Mantener el estado de lectura actualizado
              };
            }
            return existingNotification; // Conservar la notificación existente
          }
          // Es una notificación nueva del servidor
          return notification;
        });
        
        // Agregar notificaciones locales que no existen en el servidor
        const localOnlyNotifications = prevNotifications.filter(notification => 
          !notification.serverId || !serverNotifications.some(sn => sn.serverId === notification.serverId)
        );
        
        // Combinar y ordenar por fecha descendente
        return [...mergedNotifications, ...localOnlyNotifications]
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      });
      
      return true;
    } catch (error) {
      console.error('Error en sincronización manual:', error);
      setSyncError(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar solo las notificaciones no leídas
  const loadUnreadNotifications = async () => {
    try {
      setIsLoading(true);
      
      const unreadNotifications = await fetchUnreadNotifications();
      console.log('Notificaciones no leídas cargadas:', unreadNotifications.length);
      
      if (unreadNotifications.length > 0) {
        // Detectar notificaciones nuevas (no presentes en el estado actual)
        const newNotifications = unreadNotifications.filter(newNotif => 
          !notifications.some(existingNotif => 
            (newNotif.serverId && existingNotif.serverId === newNotif.serverId) ||
            (newNotif.id && existingNotif.id === newNotif.id)
          )
        );
        
        console.log('Nuevas notificaciones detectadas:', newNotifications.length);
        
        // Añadir solo las notificaciones nuevas al estado
        newNotifications.forEach(notification => {
          addNotification({
            ...notification,
            showPush: true // Asegurar que se muestre como push notification
          });
        });
      }
      
      setIsLoading(false);
      return unreadNotifications;
    } catch (error) {
      console.error('Error al cargar notificaciones no leídas:', error);
      setIsLoading(false);
      return [];
    }
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
      read: false,
      data: {
        url: '/prueba',
        timeToShow: 10000,
        sound: true
      }
    };
    
    // Añadir al state de notificaciones
    addNotification(testNotification);
    
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

  // Valores expuestos por el contexto
  const contextValue = {
    notifications,
    isLoading,
    syncError,
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
    sendTestNotification,
    syncWithServer,
    loadUnreadNotifications
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook personalizado para usar el contexto de notificaciones
export const useNotifications = () => useContext(NotificationContext);