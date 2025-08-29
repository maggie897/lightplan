import { useEffect, useRef } from "react";

function buildDueTime(dueDate,dueTime){
  if(!dueDate) return;
  const date = new Date(dueDate).toISOString().slice(0,10);
  const time = dueTime && /^\d{2}:\d{2}$/.test(dueTime) ? dueTime : '23:59'; 
  return new Date(`${date}T${time}:00`); 
}

function fireReminder(t) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Task Reminder', {
        body: `${t.title} is due`,
      });
    } else {
      alert(`Reminder: ${t.title} is due`);
    }
}

export default function useReminder(tasks, enable = true){
  const timersRef = useRef([]);
  useEffect(()=>{
    if(!enable) return;

    timersRef.current.forEach(clearTimeout);
    timersRef.current=[];

    const now = Date.now();
    tasks.forEach(t => {
    const dueAt = buildDueTime(t.dueDate,t.dueTime);
    if(!dueAt) return;
  
    const reminder = Number(t.reminder ?? 0);

    if(reminder>0){
      const reminderAt = new Date(dueAt.getTime() - reminder * 60 * 1000);
      const delay = reminderAt.getTime() - now;

      if(delay>0){
        const id = setTimeout(()=>fireReminder(t),delay); 
        timersRef.current.push(id);
      }else if (delay <= 0 && delay > -60*1000) {
        fireReminder(t);
      }
    }
  });
  return()=>{
    timersRef.current.forEach(clearTimeout);
    timersRef.current=[]; 
  } 
  }, [tasks, enable])
}
