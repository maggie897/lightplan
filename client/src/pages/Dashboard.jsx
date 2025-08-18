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
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState('None'); 
  const [interval, setInterval_] = useState(1);
  const [endDate, setEndDate] = useState('');
  const [reminder, setReminder] = useState(0);


  const fileInputRef = useRef(null);

  const requestReminder = async () => {
    if(!('Notification' in window)) return;
    if(Notification.permission === 'default'){
      await Notification.requestPermission(); 
    }
  }; 

  const scheduleReminders = (tasks) => {
    const now = Date.now();
    tasks.forEach(t => {
      if(!t.dueDate || !t.reminder) return;
      const reminderAt = new Date(t.dueDate).getTime() - t.reminder * 60 * 1000;
      const delay = reminderAt - now;
      if(delay>0){
        setTimeout(()=>{
          if('Notification' in window && Notification.permission === 'granted'){
            new Notification('Task Reminder',{
              body: `${t.title} is due at ${new Date(t.dueDate).toLocaleString()}`
            })
          }else{
            alert(`Reminder: ${t.title} is due at ${new Date(t.dueDate).toLocaleString()}`)
          }
        }, delay)
      }      
    })
  }

  useEffect(()=>{
    const token = localStorage.getItem('token');
    if(!token){
      navigate('/login');
    }else{
      requestReminder();
      fetchTasks().then(ts => {
        scheduleReminders(ts); 
      });
    }
  },[]);

  const fetchTasks = async()=>{
    try{
      const res = await api.get('/task'); 
      setTasks(res.data); 
      return res.data; 
    }catch(err){
      console.error(err);   
      return [];   
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
    formData.append('isRecurring', isRecurring);
    formData.append('recurrence', JSON.stringify({
      frequency,
      interval: Number(interval) || 1,
      endDate: endDate || null
    }));
    formData.append('reminder', reminder); 

    try{
      await api.post('/task',formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setTitle('');
      setDueDate(''); 
      setDetails(''); 
      setIsRecurring(false);
      setFrequency('None');
      setReminder(0);
      setInterval_(1);
      setEndDate(''); 
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
        <br />
        <label>Repeat: 
          <select value={frequency} onChange={(e)=>setFrequency(e.target.value)}>
            <option>None</option>
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
          </select>
        </label>       
        {frequency !== 'None' && (
          <>
          {frequency === 'Weekly' && (
            <div>
              <select value={interval} onChange={e=>setInterval_(Number(e.target.value))}>
                <option value={1}>Every 1 Week</option>
                <option value={2}>Every 2 Weeks</option>
              </select>
            </div>
          )}
          <br />
          <label> End Date(optional)
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}/>
          </label>
          </>
        )}
        <br />
        <label>Reminder: 
          <select value={reminder} onChange={e=>setReminder(e.target.value)}>
            <option value={0}>No Reminder</option>
            <option value={60}>60 minutes before</option>
            <option value={1440}>1 day before</option>
          </select>
        </label>
        <br />
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
            <p>Due: {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'N/A'}</p>
              {isOverDue(t.dueDate) && <span style={{color: 'red', fontWeight: 'bold'}}>(Overdue)</span>}
              {t.recurrence && t.recurrence.frequency !== 'None' && <span>{t.recurrence.frequency}</span>}
              <br />
            
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