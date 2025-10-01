import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import {Routes, Route} from 'react-router-dom'; 
import Dashboard from './pages/Dashboard/Dashboard';
import TaskView from './pages/TaskDetails';
import TaskDetails from './pages/TaskDetails';
import ValidationCode from './pages/ValidationCode';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword'; 
import './style/App.css'; 

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='dashboard' element={<Dashboard />} />
        <Route path= '/task/view/:id' element={<TaskView />} />
        <Route path='/task/:id' element={<TaskDetails />} />
        <Route path='/verify' element={<ValidationCode/>} />
        <Route path='/forgot-password' element={<ForgotPassword/>} />
        <Route path='/reset-password' element={<ResetPassword/>} />
      </Routes>
    </>
  )
}

export default App
