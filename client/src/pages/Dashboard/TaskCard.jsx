import { useNavigate } from "react-router-dom";
import { getTagColor } from "../../hooks/getTagColor";
import { getNextDueDate } from "../../hooks/recurrence";
import classes from "../../style/TaskCard.module.css";

// Utility function to check if a given due date is overdue.
const isOverDue = (dueDate) => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
};

export default function TaskCard ({task, onDelete}){
  const navigate = useNavigate();

  // Show either the next recurrence due date or the original due date
  const displayDate =
    task.recurrence?.frequency !== "None"
      ? getNextDueDate(task.dueDate, task.recurrence) || task.dueDate
      : task.dueDate; 

  return (
    <div
      className={classes.taskCard}
      style={{
        backgroundColor: getTagColor(task.tag),
        cursor: "pointer",
      }}
      onClick={() => navigate(`/task/view/${task._id}`)}
    >
      <h3 className={classes.title}>{task.title}</h3>

      <div className={classes.tasks}>
        <span>
          Due: 
          {displayDate
            ? new Date(displayDate).toLocaleDateString() 
            : 'N/A'}
        </span>
        
        {isOverDue(displayDate) && (
          <span style={{ color: "red", fontWeight: "bold" }}>
            (Overdue)
          </span>
        )}
        {task.recurrence &&
          task.recurrence.frequency !== "None" && (
            <span>{task.recurrence.frequency}</span>
          )}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation(); 
          onDelete(task._id);
        }}
        className={classes.button}
      >
        X
      </button>
    </div>
  );
}