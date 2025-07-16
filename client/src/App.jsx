import { useState } from 'react'
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import {Routes, Route} from 'react-router-dom'; 

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element ={<Register />}/>
        <Route path='/login' element ={<Login />}/>
      </Routes>
    </>
  )
}

export default App
