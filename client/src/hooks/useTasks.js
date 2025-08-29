import { useState, useCallback } from "react";
import api from '../api'; 

export default function useTasks(){
  const [tasks, setTasks] = useState([]);

  const fetchTasks = useCallback(async()=>{
    try{
      const res = await api.get('/task'); 
      setTasks(res.data); 
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
      await api.delete(`/task/${id}`);
      setTasks(prev=>prev.filter(t=>t._id !== id))
    }catch(err){
      console.error('Delete failed: ', err);
      alert('Failed to delete task'); 
    }
  }, []); 

return [tasks, fetchTasks, addTask, deleteTask]; 
}