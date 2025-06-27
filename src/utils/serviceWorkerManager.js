// Utility para registrar y manejar el Service Worker
class ServiceWorkerManager {
    constructor() {
        this.registration = null;
        this.isSupported = 'serviceWorker' in navigator;
    }

    // Registrar el service worker
    async register() {
        if (!this.isSupported) {
            console.warn('Service Workers no están soportados en este navegador');
            return false;
        }

        try {
            this.registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });

            console.log('Service Worker registrado exitosamente:', this.registration);

            // Manejar actualizaciones
            this.registration.addEventListener('updatefound', () => {
                console.log('Nueva versión del Service Worker disponible');
                this.handleUpdate();
            });

            // Escuchar mensajes del service worker
            navigator.serviceWorker.addEventListener('message', this.handleMessage.bind(this));

            return true;
        } catch (error) {
            console.error('Error registrando Service Worker:', error);
            return false;
        }
    }

    // Manejar actualizaciones del service worker
    handleUpdate() {
        const newWorker = this.registration.installing;
        
        if (newWorker) {
            newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // Nueva versión disponible
                    this.notifyUpdate();
                }
            });
        }
    }

    // Notificar sobre actualizaciones disponibles
    notifyUpdate() {
        if (confirm('Nueva versión disponible. ¿Deseas actualizar?')) {
            this.skipWaiting();
        }
    }

    // Saltar la espera y activar el nuevo service worker
    skipWaiting() {
        if (this.registration && this.registration.waiting) {
            this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
        window.location.reload();
    }

    // Manejar mensajes del service worker
    handleMessage(event) {
        console.log('Mensaje del Service Worker:', event.data);
        
        const { type, url, data } = event.data;
        
        if (type === 'NOTIFICATION_CLICK') {
            // Navegar a la URL especificada
            if (url && window.location.pathname !== url) {
                window.location.hash = url;
            }
        }
    }

    // Desregistrar el service worker
    async unregister() {
        if (this.registration) {
            try {
                await this.registration.unregister();
                console.log('Service Worker desregistrado');
                return true;
            } catch (error) {
                console.error('Error desregistrando Service Worker:', error);
                return false;
            }
        }
        return false;
    }

    // Obtener el estado del service worker
    getState() {
        if (!this.isSupported) {
            return 'not-supported';
        }
        
        if (!this.registration) {
            return 'not-registered';
        }
        
        if (this.registration.active) {
            return 'active';
        }
        
        if (this.registration.installing) {
            return 'installing';
        }
        
        if (this.registration.waiting) {
            return 'waiting';
        }
        
        return 'unknown';
    }
}

// Instancia global del manager
const swManager = new ServiceWorkerManager();

// Función para inicializar el service worker
export const initializeServiceWorker = async () => {
    const registered = await swManager.register();
    return registered;
};

// Función para obtener el registration
export const getServiceWorkerRegistration = () => {
    return swManager.registration;
};

// Función para desregistrar
export const unregisterServiceWorker = async () => {
    return await swManager.unregister();
};

// Función para obtener el estado
export const getServiceWorkerState = () => {
    return swManager.getState();
};

export default swManager;
