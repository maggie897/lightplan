import { useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import api from '../api';

function Dashboard(){
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');

  useEffect(()=>{
    const token = localStorage.getItem('token');
    if(!token){
      navigate('/login');
    }else{
      fetchTasks();
    }
  },[]);

  const fetchTasks = async()=>{
    try{
      const res = await api.get('/task'); 
      setTasks(res.data); 
    }catch(err){
      console.error(err);     
    }
  };

  const addTask = async(e)=>{
    e.preventDefault();
    try{
      await api.post('/task',{title});
      setTitle('');
      fetchTasks();
    }catch(err){
      console.error(err);
    }
  };

  const checkProfile = () => {
    navigate('/profile');
  };


  return(
    <div>
      <h1>My LightPlan</h1>
      <button onClick={checkProfile}>My Profile</button>
      <h2>Add Task</h2>
      <form onSubmit={addTask}>
        <input type="text" 
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
          placeholder="Task title"
        />
        <button type="submit">Add</button>
      </form>
      <h2>My Tasks</h2>
      <ul>
        {tasks.map((t) =>(
          <li key={t._id}>{t.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default Dashboard;