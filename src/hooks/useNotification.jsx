import {useState, useEffect, useRef, createContext, useContext} from 'react';
import axios from 'axios';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);
    const evtSourceRef = useRef(null);
    const [noleidas, setnoleidas] = useState(0);

    const markAllRead = async () => {
        try {
            // Actualizar inmediatamente el estado local
            setnoleidas(0);
            setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
            
            // Hacer la llamada al servidor
            await axios.post('https://api.mamamianpizza.com/api/notifications/mark-all-read', {}, {withCredentials: true} );
        } catch (err){
            console.error('Error marcando notificaciones como leídas:', err);
            // En caso de error, revertir el estado
            fetchNoLeidas();
        }
    };

   const fetchNoLeidas = async () => {
        try {
            const {data} = await axios.get('https://api.mamamianpizza.com/api/notifications/unread', {withCredentials: true});
            setnoleidas(data.count);
        }
        catch(err) {
            console.error('Error al extraer todos las notificaciones no leidas:', err);
        }
   };

    useEffect(() => {
        fetchNoLeidas();
        evtSourceRef.current = new EventSource('https://api.mamamianpizza.com/api/notifications/stream', {withCredentials: true});
        evtSourceRef.current.onmessage = e => {
            const notif = JSON.parse(e.data);
            setNotifications(n => [notif, ...n]);
            setnoleidas((u) => u + 1);
        };
        return () => {
            evtSourceRef.current?.close();
        };
    }, []);

    return (
        <NotificationContext.Provider value={{notifications, markAllRead, noleidas, fetchNoLeidas }}>
            {children}
        </NotificationContext.Provider>
    )
}

export const useNotifications = () => {
    const ctx = useContext(NotificationContext);
    if (!ctx) {
        throw new Error(
            'useNotifications debe ser usado dentro de un NotificationProvider'
        );
    }
    return ctx;
};
