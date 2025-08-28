import { useNavigate } from "react-router-dom";

const getTagColor = (tag) =>{
  switch(tag){
    case 'Routine': return 'lightskyblue';
    case 'Event': return 'orange';
    case 'Deadline': return 'limegreen';
    case 'Other': return 'lightgray'; 
    default: return 'black'; 
  }
}; 

const isOverDue = (dueDate) =>{
  if(!dueDate) return false;
  return new Date(dueDate) < new Date(); 
}

export default function TaskCard ({task, onDelete}){
  const navigate = useNavigate();
  return (
    <div 
    className="task-card"
    style={{backgroundColor: getTagColor(task.tag), cursor: "pointer"}}
    onClick={()=>navigate(`/task/view/${task._id}`)}
  >
    <h3>{task.title}</h3>
    <p>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</p>
      {isOverDue(task.dueDate) && <span style={{color: 'red', fontWeight: 'bold'}}>(Overdue)</span>}
      {task.recurrence && task.recurrence.frequency !== 'None' && <span>{task.recurrence.frequency}</span>}
      <br />
    
    <button onClick={(e)=> {
      e.stopPropagation();
      onDelete(task._id)
    }}>Delete</button>
  </div>
  )
}