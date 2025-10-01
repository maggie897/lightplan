import { useEffect, useRef } from "react";

// Build a full due date and time for a task.
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

export default function useReminder(tasks, enable = true) {
  const timersRef = useRef([]);

  useEffect(() => {
    if (!enable) return;

    // Clear old timers to avoid duplicate reminders
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    const now = Date.now();

    tasks.forEach((task) => {
      const dueAt = buildDueTime(task.dueDate, task.dueTime);
      if (!dueAt) return;

      const reminder = Number(task.reminder ?? 0);

      if (reminder > 0) {
        const reminderAt = new Date(dueAt.getTime() - reminder * 60 * 1000);
        const delay = reminderAt.getTime() - now;

        if (delay > 0) {
          const id = setTimeout(() => fireReminder(task), delay);
          timersRef.current.push(id);
        } else if (delay <= 0 && delay > -60 * 1000) {
          fireReminder(task);
        }
      }
    });

    // Clear timers when component unmounts or task updates
    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [tasks, enable]);
}
