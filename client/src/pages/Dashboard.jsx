import { useNavigate} from "react-router-dom";
import { useEffect, useState , useRef} from "react";
import api from '../api';
import '../Home.css';

function Dashboard(){
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('Other'); 
  const [dueDate,setDueDate] = useState(''); 
  const [details, setDetails] = useState(''); 
  const [search, setSearch] = useState('');
  const [file, setFile] = useState(null);

  const fileInputRef = useRef(null);

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
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('tag', tag);
    formData.append('dueDate', dueDate);
    formData.append('details', details);
    formData.append('image',file); 

    try{
      await api.post('/task',formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setTitle('');
      setDueDate(''); 
      setDetails(''); 
      if(fileInputRef.current){
        fileInputRef.current.value =''
      }
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

  const getTagColor = (tag) =>{
    switch(tag){
      case 'Routine': return 'lightskyblue';
      case 'Event': return 'orange';
      case 'Deadline': return 'limegreen';
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
      <input 
        type="text"
        placeholder="search task by title"
        value={search}
        onChange={e=>setSearch(e.target.value)}
      />

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
        <input 
          type="text"
          value={details} 
          placeholder="details"
          onChange={(e)=>setDetails(e.target.value)}
        />
        <br />  
        <input type="file" onChange={e=>setFile(e.target.files[0])} ref={fileInputRef} /> 
        <br />  
        <button type="submit">Add</button>
      </form>
      <h2>My Tasks</h2>
      <div className="task-grid">
        {tasks
          .filter(t=>t.title.toLowerCase().includes(search.toLowerCase()))
          .map((t) =>(
          <div 
            key={t._id} 
            className="task-card"
            style={{backgroundColor: getTagColor(t.tag), cursor: "pointer"}}
            onClick={()=>navigate(`/task/view/${t._id}`)}
          >
              <h3>{t.title}</h3>
              <p>Due: {t.dueDate ? new Date(t.dueDate).toLocaleTimeString() : 'N/A'}</p>
              {isOverDue(t.dueDate) && <span style={{color: 'red', fontWeight: 'bold'}}>(Overdue)</span>}
            <button onClick={(e)=> {
              e.stopPropagation();
              deleteTask(t._id)
            }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard;