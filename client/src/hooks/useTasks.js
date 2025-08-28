import { useState, useCallback } from "react";
import api from '../api'; 

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

export default function useTasks(){
  const [tasks, setTasks] = useState([]);

  const fetchTasks = useCallback(async()=>{
    try{
      const res = await api.get('/task'); 
      setTasks(res.data); 
      scheduleReminders(res.data); 
      return res.data; 
    }catch(err){
      console.error(err);   
      return [];   
    }
  }, []); 
  
  const addTask = useCallback(async(formData)=>{
    try{
      const res = await api.post('/task',formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setTasks(prev => [res.data, ...prev]);
      return res.data;
    }catch(err){
        console.error(err);     
      }
  },[]); 

  const deleteTask = useCallback(async (id) =>{
    try{
      const res = await api.delete(`/task/${id}`);
      alert(res.data.message); 
      setTasks(prev=>prev.filter(t=>t._id !== id))
    }catch(err){
      console.error('Delete failed: ', err);
      alert('Failed to delete task'); 
    }
  }, []); 

return [tasks, fetchTasks, addTask, deleteTask]; 
}