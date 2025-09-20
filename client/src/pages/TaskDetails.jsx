import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from '../api';
import classes from '../style/TaskDetail.module.css'; 

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
  const [imageUrl, setImageUrl] = useState(null); 

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
      fetchImageUrl(); 

    }catch(err){
      console.error('Failed to fetch task', err);
      alert('Failed to load task');
    }
  }

  const fetchImageUrl = async() =>{
    try{
      const res = await api.get(`/task/${id}/imageUrl`);
      setImageUrl(res.data.url || null); 
    }catch(err){
      console.error('failed to get signed url', err);
      setImageUrl(null); 
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
      recurrence: JSON.stringify({
        frequency,
        interval,
        endDate: endDate || null
      }),
      reminder
    });
    alert('updated');
    await fetchTask(); 
  }

  const handleUpload = async() =>{
    if(!file) return alert('Please choose an image first.');
    const formData = new FormData();
    formData.append('image', file); 

    try{
      const res = await api.post(`/task/${id}/image`, formData);
      alert(res.data.message || 'Image Updated'); 
      setFile(null); 
      await fetchImageUrl(); 
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
    <div className={classes.container}>
      <div className={classes.details}>
      <h2>Task Details: </h2>
      <label className={classes.title}>Title: </label>
      <input 
        type={title} 
        value={title}
        onChange={e=>setTitle(e.target.value)}
        className={classes.input}
      />
      <br />
      <label>Tag: 
        <select value={tag} onChange={(e)=>setTag(e.target.value)} className={classes.input}>
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
          className={classes.input}
        />
        {isOverDue(task.dueDate) && <span style={{color: 'red', fontWeight: 'bold'}}>(Overdue)</span>}
      </label>
      <br />
      <label>Due Time: 
        <input type="time" 
          value={dueTime}
          onChange={(e)=>setDueTime(e.target.value)}
          className={classes.input}
        />
      </label>
      <br />
      <label>Repeat: 
        <select value={frequency} onChange={(e)=>setFrequency(e.target.value)} className={classes.input}>
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
              <select value={interval} onChange={e=>setInterval_(Number(e.target.value))} className={classes.input}>
                <option value={1}>Every 1 Week</option>
                <option value={2}>Every 2 Weeks</option>
              </select>
            </div>
          )}
          <br />
          <label> End Date(optional)
            <input 
            type="date" value={endDate || ''} 
            onChange={e => setEndDate(e.target.value)}
            className={classes.input}
            />
          </label>
        </>
      )}
      <br />
      <label>Reminder: 
          <select value={reminder} onChange={e=>setReminder(e.target.value)} className={classes.input}>
            <option value={0}>No Reminder</option>
            <option value={60}>60 minutes before</option>
            <option value={1440}>1 day before</option>
          </select>
      </label>
      <br />
      <label>Details: 
        <br />
        <input 
          type='text'
          value={details}
          onChange={e=>setDetails(e.target.value)}
          className={classes.detailBox}
        />
      </label>
      <br />
      <button onClick={handleUpdates} className={classes.button}>Save Changes</button>
      </div>
      <div className={classes.attachment}>
      <h3>Attachment: </h3>
      {imageUrl? (<img src={imageUrl} alt="task" style={{width: '300px'}} />) : (<p>No image</p>)}
      <br />
      <input 
        type="file" 
        onChange={e=>setFile(e.target.files[0])} 
        className={classes.input}
      />
      <br />
      <button onClick={handleUpload} className={classes.button}>Update Image</button>
      </div>
    </div>
  )
}

export default TaskDetails; 