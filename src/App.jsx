import { useState } from 'react'
import './App.css'
import Navbar from './components/navbar/nabvar'
import Sidebar from './components/sidebar/sidebar'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <main className='container'>
      <nav className='navbar-container'>
        <Navbar/>    
      </nav>
      <aside className='sidebar-container'>
        <Sidebar/>
      </aside>
    </main>
    </>
  )

}


export default App
