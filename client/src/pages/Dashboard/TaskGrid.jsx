import TaskCard from "./TaskCard";
import classes from "../../style/Dashboard.module.css";

export default function TaskGrid({ tasks, onDelete }) {
  return (
    <div className={classes.taskGrid}>
      {tasks.map((t) => (
        <TaskCard 
          key={t._id} 
          task={t} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
}