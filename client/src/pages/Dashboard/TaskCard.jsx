import { useNavigate } from "react-router-dom";
import { getTagColor } from "../../../../server/utils/getTagColor";
import classes from '../../style/TaskCard.module.css'; 

const isOverDue = (dueDate) =>{
  if(!dueDate) return false;
  return new Date(dueDate) < new Date(); 
}

export default function TaskCard ({task, onDelete}){
  const navigate = useNavigate();
  return (
    <div 
    className={classes.taskCard}
    style={{backgroundColor: getTagColor(task.tag), cursor: "pointer"}}
    onClick={()=>navigate(`/task/view/${task._id}`)}
  >
    <h3 className={classes.title}>{task.title}</h3>
    <div className={classes.tasks}>
      <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</span>
      {isOverDue(task.dueDate) && <span style={{color: 'red', fontWeight: 'bold'}}>(Overdue)</span>}
      {task.recurrence && task.recurrence.frequency !== 'None' && <span>{task.recurrence.frequency}</span>}
    </div>

    <button 
      onClick={(e)=> {e.stopPropagation();
      onDelete(task._id)}}
      className={classes.button}
    >X</button>
  </div>
  )
}