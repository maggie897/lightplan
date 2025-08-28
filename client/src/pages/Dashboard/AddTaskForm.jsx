import {useRef, useState} from 'react';

export default function addTaskForm({onSubmit}){
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('Other'); 
  const [dueDate,setDueDate] = useState(''); 
  const [details, setDetails] = useState(''); 
  const [file, setFile] = useState(null);
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState('None'); 
  const [interval, setInterval_] = useState(1);
  const [endDate, setEndDate] = useState('');
  const [reminder, setReminder] = useState(0);
  const fileInputRef = useRef(null);
  
  const handleSubmit = async(e)=>{
    e.preventDefault();
    requestReminder(); 

    const formData = new FormData();
    formData.append('title', title);
    formData.append('tag', tag);
    formData.append('dueDate', dueDate);
    formData.append('details', details);
    if(file) formData.append('image',file); 
    formData.append('isRecurring', isRecurring);
    formData.append('recurrence', JSON.stringify({
      frequency,
      interval: Number(interval) || 1,
      endDate: endDate || null
    }));
    formData.append('reminder', reminder); 

    await onSubmit(formData);

      setTitle('');
      setTag('Other'); 
      setDueDate(''); 
      setDetails(''); 
      setFile(null);
      setIsRecurring(false);
      setFrequency('None');
      setInterval_(1);
      setEndDate(''); 
      setReminder(0);
      if(fileInputRef.current){
        fileInputRef.current.value =''
      }
  }
  
  const requestReminder = async () => {
    if(!('Notification' in window)) return;
    if(Notification.permission === 'default'){
      await Notification.requestPermission(); 
    }
  }; 

  return(
    <>
    <h2>Add Task</h2>
      <form onSubmit={handleSubmit}>
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
    </>
  )
}

