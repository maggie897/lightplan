import { useMemo } from "react";
import { ViewMode, Gantt } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import {getNextDueDate} from '../../hooks/recurrence'; 

export default function GanttChart({ tasks, onClick }) {
  const ganttData = useMemo(() => tasks
    .filter(t => t.dueDate)
    .map(t => {
      const nextDue = getNextDueDate(t.dueDate, t.recurrence);
      const safeDate = nextDue && !isNaN(nextDue)
        ? nextDue
        : (!isNaN(new Date(t.dueDate)) ? new Date(t.dueDate) : null);

      if (!safeDate) return null;

      return {
        id: t._id,
        name: t.title,
        start: safeDate,
        end: safeDate,
        progress: t.completed ? 100 : 0,
      };
    })
    .filter(Boolean) 
  , [tasks]);

  if (!ganttData.length) {
    return <p>No tasks with due dates to display on timeline.</p>;
  }

  return(
    <div>
      <h2>Task Timeline</h2>
      <Gantt
        tasks = {ganttData}
        viewMode = {ViewMode.Day}
        onClick = {task => onClick?.(task.id)} 
        listCellWidth=""
      />
    </div>
  )

}; 