import TaskCard from "./TaskCard";

export default function TaskGrid({tasks, onDelete}){
  return(
    <div className="task-grid">
      {tasks.map(t=>(
        <TaskCard key={t._id} task={t} onDelete={onDelete} />
      ))}
    </div>
  )
}