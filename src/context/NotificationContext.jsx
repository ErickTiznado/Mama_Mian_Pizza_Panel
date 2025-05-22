import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  fetchNotifications, 
  fetchUnreadNotifications, 
  markNotificationReadOnServer, 
  markAllNotificationsReadOnServer, 
  deleteNotificationFromServer 
} from '../services/NotificationService';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [permission, setPermission] = useState('default');
  const [swRegistration, setSwRegistration] = useState(null);
  const [swRegistrationError, setSwRegistrationError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [syncError, setSyncError] = useState(null);

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

  // Función para reproducir sonido de notificación
  const playNotificationSound = async () => {
    try {
      console.log('Reproduciendo sonido de notificación...');
      const audio = new Audio('/notification-sound.mp3');
      audio.volume = 0.5;
      await audio.play();
    } catch (audioError) {
      console.warn('No se pudo reproducir el sonido de notificación:', audioError);
    }
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
        
        console.log('Notificación nativa mostrada correctamente');
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
    // Comprobar soporte para notificaciones
    const checkPermissionAndRegisterSW = async () => {
      if ('Notification' in window) {
        setPermission(Notification.permission);
        
        // Registrar el Service Worker para notificaciones
        if ('serviceWorker' in navigator) {
          try {
            console.log('Intentando registrar el Service Worker...');
            
            // En lugar de desregistrar los SW existentes, verificar si ya está registrado
            let registration = null;
            const registrations = await navigator.serviceWorker.getRegistrations();
            
            // Buscar si ya existe el service worker de notificaciones
            const existingSW = registrations.find(reg => 
              reg.scope === window.location.origin + '/' && 
              reg.active && 
              reg.active.scriptURL.includes('notification-sw.js')
            );
            
            if (existingSW) {
              console.log('Service Worker de notificaciones ya registrado, usándolo:', existingSW);
              registration = existingSW;
            } else {
              // Registrar nuevo service worker
              console.log('Registrando nuevo Service Worker...');
              registration = await navigator.serviceWorker.register('/notification-sw.js', {
                scope: '/'
              });
              console.log('Service Worker registrado con éxito:', registration);
            }
            
            setSwRegistration(registration);
            setSwRegistrationError(null);
            
            // Si ya tenemos permisos, suscribirse
            if (Notification.permission === 'granted') {
              await setupPushSubscription(registration);
              
              // Asegurarse de que el service worker esté activado
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
    
    // Limpiar al desmontar
    return () => {
      // Nada que limpiar aquí, ya que no queremos desregistrar el SW al navegar
    };
  }, []);

  // Cargar notificaciones del servidor al iniciar
  useEffect(() => {
    const loadNotificationsFromServer = async () => {
      try {
        setIsLoading(true);
        setSyncError(null);
        
        // Obtener todas las notificaciones y convertirlas al formato local
        const serverNotifications = await fetchNotifications();
        console.log('Notificaciones cargadas del servidor:', serverNotifications);
        
        // No necesitamos más formato ya que la función fetchNotifications
        // ya las convierte al formato local
        setNotifications(serverNotifications);
      } catch (error) {
        console.error('Error al sincronizar notificaciones con el servidor:', error);
        setSyncError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadNotificationsFromServer();
    
    // Configurar un intervalo para sincronizar periódicamente (cada 2 minutos)
    const syncInterval = setInterval(() => {
      loadNotificationsFromServer();
    }, 120000); // 2 minutos
    
    return () => {
      clearInterval(syncInterval);
    };
  }, []);

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
                
                // Iniciar sincronización de notificaciones
                if (registration.active) {
                  registration.active.postMessage({
                    type: 'INIT_NOTIFICATION_SYNC'
                  });
                }
              } catch (error) {
                console.error('Error al registrar el Service Worker durante solicitud de permiso:', error);
                setSwRegistrationError(error.message);
              }
            }
          } else {
            // Si ya tenemos el SW registrado, configurar suscripción
            console.log('Usando Service Worker ya registrado');
            await setupPushSubscription(swRegistration);
            
            // Iniciar sincronización de notificaciones
            if (swRegistration.active) {
              swRegistration.active.postMessage({
                type: 'INIT_NOTIFICATION_SYNC'
              });
            }
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
    
    // Asegurarnos de que tenemos permisos
    if (Notification.permission !== 'granted') {
      console.error('No hay permiso para notificaciones push');
      return false;
    }
    
    // Solo mostrar notificaciones no leídas
    if (notification.read) {
      console.log('No se muestra notificación push porque ya ha sido leída');
      return false;
    }
    
    // Primera opción: usar showNotification del Service Worker si está disponible
    try {
      // Verificar si el Service Worker está listo
      if (swRegistration && swRegistration.active) {
        console.log('Enviando notificación push vía Service Worker activo');
        
        // Enviar la notificación usando el Service Worker
        await swRegistration.showNotification(notification.title, {
          body: notification.message,
          icon: '/vite.svg',
          badge: '/vite.svg',
          vibrate: [100, 50, 100],
          requireInteraction: notification.data?.timeToShow ? true : false,
          tag: `notification-${notification.id || Date.now()}`, // Identificador único
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
        
        console.log('Notificación push enviada correctamente vía Service Worker');
        
        // Si la notificación incluye sonido, reproducirlo
        if (notification.data?.sound) {
          playNotificationSound();
        }
        
        return true;
      } else {
        console.log('Service Worker no está activo, intentando registrar uno nuevo');
        
        // Intentar registrar el SW si no está disponible
        if ('serviceWorker' in navigator) {
          try {
            const registration = await navigator.serviceWorker.register('/notification-sw.js', {
              scope: '/'
            });
            
            console.log('Service Worker registrado exitosamente:', registration);
            setSwRegistration(registration);
            
            // Si el SW se acaba de registrar, esperar a que se active
            if (registration.installing || registration.waiting) {
              console.log('Service Worker se está instalando, usando notificación nativa mientras tanto');
              showNativeNotification(notification);
              return true;
            }
            
            if (registration.active) {
              // Si ya está activo, intentar mostrar la notificación de nuevo
              console.log('Service Worker activado, reintentando notificación');
              return sendPushNotification(notification);
            }
          } catch (error) {
            console.error('Error registrando Service Worker para notificaciones:', error);
            setSwRegistrationError(error.message);
            // Fallar a notificación nativa
            return showNativeNotification(notification);
          }
        }
      }
    } catch (error) {
      console.error('Error al mostrar notificación push vía Service Worker:', error);
      // Intentar notificación nativa como fallback
      return showNativeNotification(notification);
    }
    
    // Si llegamos aquí, intentar notificación nativa como último recurso
    return showNativeNotification(notification);
  };

  // Añadir una nueva notificación (ahora ya se gestiona en los servicios la sincronización con el servidor)
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
    
    // Verificación mejorada de duplicados
    setNotifications((prev) => {
      // Verificar si ya existe una notificación con el mismo ID de servidor
      if (newNotification.serverId && prev.some(n => n.serverId === newNotification.serverId)) {
        console.log('Notificación duplicada por serverId, ignorando:', newNotification.serverId);
        return prev;
      }
      
      // Verificar si ya existe una notificación con el mismo ID local
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
        console.log('Notificación similar reciente encontrada, ignorando duplicado:', newNotification);
        return prev;
      }
      
      console.log('Añadiendo nueva notificación:', newNotification);
      return [newNotification, ...prev];
    });
    
    // Enviar notificación push si hay permisos, se solicitó y no está leída
    if (Notification.permission === 'granted' && 
        notification.showPush && 
        !notification.read) {
      console.log('Enviando notificación push desde addNotification...');
      
      // Usar un pequeño delay para asegurar que el UI se actualice primero
      setTimeout(() => {
        sendPushNotification(newNotification);
      }, 300);
    }
    
    return newNotification.id;
  };

  // Marcar una notificación como leída (sincronizando con el servidor)
  const markAsRead = async (notificationId) => {
    // Encontrar la notificación
    const notification = notifications.find(n => n.id === notificationId);
    
    if (!notification) {
      console.error('No se encontró la notificación con ID:', notificationId);
      return;
    }
    
    console.log('Marcando como leída notificación:', notification);
    
    // Actualizar el estado local primero para una UI responsiva
    setNotifications((prev) => 
      prev.map((n) => 
        n.id === notificationId 
          ? { ...n, read: true } 
          : n
      )
    );
    
    // Si existe un ID de servidor, sincronizar con el backend
    if (notification.serverId) {
      try {
        const result = await markNotificationReadOnServer(notification.serverId);
        if (result) {
          console.log('Notificación marcada como leída exitosamente en el servidor:', notification.serverId);
        } else {
          console.error('Falló al marcar como leída en el servidor, pero la UI está actualizada');
        }
      } catch (error) {
        console.error('Error al marcar notificación como leída en el servidor:', error);
      }
    } else {
      console.log('La notificación no tiene ID de servidor, solo se marcó como leída localmente');
    }
  };

  // Marcar todas las notificaciones como leídas (sincronizando con el servidor)
  const markAllAsRead = async () => {
    console.log('Marcando todas las notificaciones como leídas');
    
    // Actualizar el estado local primero para una UI responsiva
    setNotifications((prev) => 
      prev.map((notification) => ({ ...notification, read: true }))
    );
    
    // Sincronizar con el backend
    try {
      const result = await markAllNotificationsReadOnServer();
      if (result) {
        console.log('Todas las notificaciones marcadas como leídas en el servidor exitosamente');
      } else {
        console.error('Falló al marcar todas como leídas en el servidor, pero la UI está actualizada');
      }
    } catch (error) {
      console.error('Error al marcar todas las notificaciones como leídas en el servidor:', error);
    }
  };

  // Eliminar una notificación (sincronizando con el servidor)
  const removeNotification = async (notificationId) => {
    // Encontrar la notificación
    const notification = notifications.find(n => n.id === notificationId);
    
    if (!notification) return;
    
    // Actualizar el estado local primero para una UI responsiva
    setNotifications((prev) => 
      prev.filter((n) => n.id !== notificationId)
    );
    
    // Si existe un ID de servidor, sincronizar con el backend
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
      console.log('Sincronización manual: Notificaciones cargadas del servidor:', serverNotifications);
      
      setNotifications(serverNotifications);
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
        const newNotifications = unreadNotifications.filter(newNotif => {
          return !notifications.some(existingNotif => 
            (newNotif.serverId && existingNotif.serverId === newNotif.serverId) ||
            (newNotif.id && existingNotif.id === newNotif.id)
          );
        });
        
        console.log('Nuevas notificaciones detectadas:', newNotifications.length);
        
        // Añadir solo las notificaciones nuevas al estado
        // y mostrar push notifications
        newNotifications.forEach(notification => {
          const added = addNotification({
            ...notification,
            showPush: true // Asegurar que se muestre como push notification
          });
          console.log('Notificación añadida con ID:', added);
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

  const value = {
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
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);