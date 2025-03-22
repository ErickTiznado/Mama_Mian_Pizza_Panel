import './navbar.css';
import { Bell, CircleUserRound } from 'lucide-react';
import NotificationBell from '../icons/notificationBell/notificationBell';

function Navbar() {
    return (
        <div className='navbar'>
            <div className='brand'>
                <h2>Pizza Admin</h2>
            </div>
            <div className='buttons-container'>
                <div className='notification-bell'>
                    <NotificationBell count={3}/>
                </div>
                <div>
                    <button><CircleUserRound className='icon' size={36}/></button>
                </div>
            </div>
        </div>
    );
}

export default Navbar;