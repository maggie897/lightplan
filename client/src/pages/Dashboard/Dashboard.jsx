import { useNavigate} from "react-router-dom";
import { useEffect, useState} from "react";
import '../../Home.css';
import AddTaskForm from './AddTaskForm';
import useTasks from '../../hooks/useTasks';
import SearchBar from "./SearchBar";
import TaskGrid from "./TaskGrid";

function Dashboard(){
  const navigate = useNavigate();
  const [tasks, fetchTasks, addTask, deleteTask] = useTasks(); 
  const [search, setSearch] = useState('');
  

  useEffect(()=>{
    const token = localStorage.getItem('token');
    if(!token){
      navigate('/login');
    }else{
      fetchTasks();};
    },[navigate, fetchTasks]);


  const checkProfile = () => {
    navigate('/profile');
  };

  const filtered = tasks.filter(t=>t.title.toLowerCase().includes(search.toLowerCase())); 

  return(
    <div>
      <h1>My LightPlan</h1>
      <SearchBar value={search} onChange={setSearch}/>

      <button onClick={checkProfile}>My Profile</button>
      <AddTaskForm onSubmit = {addTask}/>
      
      <h2>My Tasks</h2>
      <TaskGrid tasks= {filtered} onDelete={deleteTask}/>
    </div>
  )
}

export default Dashboard;