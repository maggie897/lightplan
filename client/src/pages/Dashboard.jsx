import { useNavigate} from "react-router-dom";
import { use, useEffect, useState } from "react";
import api from '../api';

function Dashboard(){
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('Other'); 
  const [dueDate,setDueDate] = useState(''); 

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
      await api.post('/task',{title, tag, dueDate});
      setTitle('');
      setDueDate(''); 
      fetchTasks();
    }catch(err){
      console.error(err);
    }
  };

  const deleteTask = async (id) =>{
    try{
      const res = await api.delete(`/task/${id}`);
      alert(res.data.message); 
      fetchTasks(); 
    }catch(err){
      console.error('Delete failed: ', err);
      alert('Failed to delete task'); 
    }
  }; 

  const updateTask = async(id, updatedData)=>{
    await api.put(`/task/${id}`, updatedData);
    fetchTasks(); 
  }; 

  const getTagColor = (tag) =>{
    switch(tag){
      case 'Routine': return 'green';
      case 'Event': return 'lightskyblue';
      case 'Deadline': return 'orange';
      case 'Other': return 'lightgray'; 
      default: return 'black'; 
    }
  }; 

  const isOverDue = (dueDate) =>{
    if(!dueDate) return false;
    return new Date(dueDate) < new Date(); 
  }

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
        <select value={tag} onChange={(e)=>setTag(e.target.value)}>
          <option value="Routine">Routine</option>
          <option value="Event">Event</option>
          <option value="Deadline">Deadline</option>
          <option value="Other">Other</option>
        </select>
        <input type="date" 
          value={dueDate}
          onChange={(e)=>setDueDate(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
      <h2>My Tasks</h2>
      <ul>
        {tasks.map((t) =>(
          <li key={t._id} style={{color: getTagColor(t.tag)}}>
            {t.title}-{t.tag}-Due: {t.dueDate? new Date(t.dueDate).toLocaleDateString(): 'N/A'}
            {isOverDue(t.dueDate) && <span style={{color: 'red'}}>(Overdue)</span>}
            <button onClick={()=> deleteTask(t._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Dashboard;