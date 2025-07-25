import { useState } from 'react'
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import {Routes, Route} from 'react-router-dom'; 
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='dashboard' element={<Dashboard/>}></Route>
        <Route path='/profile' element={<Profile/>}></Route>
      </Routes>
    </>
  )
}

export default App
