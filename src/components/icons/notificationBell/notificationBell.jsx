import {Bell} from 'lucide-react';
import './notificationBell.css';

function NotificationBell({count}){
return(
    <div className='notification-bell'>
        <button className='notification-button'>
            <Bell className='icon' size={36}/>
            {count > 0 && <span className='notification-count'>{count}</span>}
        </button>
    </div>
);
}
export default NotificationBell;