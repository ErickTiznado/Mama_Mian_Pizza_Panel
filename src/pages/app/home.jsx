import { useState } from 'react';
import './home.css';
import Navbar from '../../components/navbar/nabvar';
import Sidebar from '../../components/sidebar/sidebar';
import Graficas from '../graficas/graficas';

const Home = () => {
    return(
        <>
        <main className='container'>
          <aside className='sidebar-container'>
            <Sidebar/>
          </aside>
          <div className='content-container'>
            <Graficas/>
          </div>
        </main>
        </>
    )
}

export default Home;