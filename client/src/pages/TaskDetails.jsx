import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from '../api';

function TaskDetails(){
  const {id} = useParams();
  const [task, setTask] = useState(null);
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState(''); 
  const [dueDate, setDueDate] = useState(''); 
  const [dueTime, setDueTime] = useState(''); 
  const [details, setDetails] = useState(''); 
  const [file, setFile] = useState(null);
  const [frequency, setFrequency] = useState('None');
  const [interval, setInterval_] = useState(1); 
  const [endDate, setEndDate] = useState('');
  const [reminder, setReminder] = useState(0); 

  useEffect(()=>{
      fetchTask();
    },[id]);

  const fetchTask= async()=>{
    try{
      const res= await api.get(`/task/${id}`);
      setTask(res.data);
      setTitle(res.data.title);
      setTag(res.data.tag); 
      setDueDate(res.data.dueDate?.slice(0,10)); 
      setDueTime(res.data.dueTime); 
      setDetails(res.data.details || ''); 
      setFrequency(res.data.recurrence.frequency);
      setInterval_(res.data.recurrence.interval); 
      setEndDate(res.data.recurrence.endDate);
      setReminder(res.data.reminder);  
    }catch(err){
      console.error('Failed to fetch task', err);
      alert('Failed to load task');
    }
  }
  if(!task) return <p>Loading...</p>

  const handleUpdates = async()=>{
    await api.put(`/task/${id}`, {
      title, 
      tag,
      dueDate,
      dueTime, 
      details,
      imagePath: task.imagePath
    });
    alert('updated');
  }

  const handleUpload = async() =>{
    const formData = new FormData();
    formData.append('image', file); 
    try{
      const res = await api.post(`/task/upload/${id}`, formData);
      alert(res.data.message); 
      await fetchTask(); 
      console.log(res.data)
    }catch(err){
      console.error('upload failed', err);
      
    }
  }

  const isOverDue = (dueDate) =>{
    if(!dueDate) return false;
    return new Date(dueDate) < new Date(); 
  }

  return (
    <div>
      <label>Title: </label>
      <input 
        type={title} 
        value={title}
        onChange={e=>setTitle(e.target.value)}
      />
      <br />
      <label>Tag: 
        <select value={tag} onChange={(e)=>setTag(e.target.value)} >
          <option value="Routine">Routine</option>
          <option value="Event">Event</option>
          <option value="Deadline">Deadline</option>
          <option value="Other">Other</option>
        </select>
      </label>
      <br />
      <label>Due Date: 
        <input 
          type='date'
          value={dueDate}
          onChange={e=>setDueDate(e.target.value)}
        />
        {isOverDue(task.dueDate) && <span style={{color: 'red', fontWeight: 'bold'}}>(Overdue)</span>}
      </label>
      <label>Due Time: 
        <input type="time" 
          value={dueTime}
          onChange={(e)=>setDueTime(e.target.value)}
        />
      </label>
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
            <input type="date" value={endDate || ''} onChange={e => setEndDate(e.target.value)}/>
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
      <label>Details: 
        <input 
          type='text'
          value={details}
          onChange={e=>setDetails(e.target.value)}
        />
      </label>
      <br />

      <button onClick={handleUpdates}>Save Changes</button>
      <h3>Attachment: </h3>
      {task.imagePath && <img src={`http://localhost:5000/uploads/${task.imagePath}?t=${Date.now()}`} alt="task" style={{width: '300px', marginTop: '10px'}} />}
      <input type="file" onChange={e=>setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Update Image</button>
      <br />
    </div>
  )
}

export default TaskDetails; 