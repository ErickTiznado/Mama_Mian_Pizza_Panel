import './navbar.css';
import { Bell, CircleUserRound } from 'lucide-react';

function Navbar() {
    return (
        <nav className='navbar'>
            <div className='brand'>
                <h2>Pizza Admin</h2>
            </div>
            <div className='buttons-container'>

                <div>
                    <button><CircleUserRound className='icon' size={36}/></button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;