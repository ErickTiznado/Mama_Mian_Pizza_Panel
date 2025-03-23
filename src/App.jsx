import { useState } from 'react'
import './App.css'
import Navbar from './components/navbar/nabvar'
import Sidebar from './components/sidebar/sidebar'
import Graficas from './pages/graficas/graficas'
function App() {


  return (
    <>
    <main className='container'>
      <nav className='navbar-container'>
        <Navbar/>    
      </nav>
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


export default App
