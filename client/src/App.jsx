import { useState } from 'react'
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import {Routes, Route} from 'react-router-dom'; 
import Dashboard from './pages/Dashboard/Dashboard';
import Profile from './pages/Profile';
import TaskView from './pages/TaskDetails';
import TaskDetails from './pages/TaskDetails';
import ValidationCode from './pages/ValidationCode';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword'; 

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='dashboard' element={<Dashboard />}></Route>
        <Route path='/profile' element={<Profile />}></Route>
        <Route path= '/task/view/:id' element={<TaskView />}></Route>
        <Route path='/task/:id' element={<TaskDetails />} ></Route>
        <Route path='/verify' element={<ValidationCode/>} ></Route>
        <Route path='/forgot-Password' element={<ForgotPassword/>} ></Route>
        <Route path='/reset-password' element={<ResetPassword/>} ></Route>
      </Routes>
    </>
  )
}

export default App
