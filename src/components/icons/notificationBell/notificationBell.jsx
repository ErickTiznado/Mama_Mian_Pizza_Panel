import './notificationBell.css';

function NotificationBell({count}){
return(
    <div className='notification-bell'>
        <span className='notification-button'>
            {count > 0 && <span className='notification-count'>{count}</span>}
        </span>
    </div>
);
}
export default NotificationBell;