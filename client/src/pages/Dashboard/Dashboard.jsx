import { useNavigate} from "react-router-dom";
import { useEffect, useState} from "react";
import AddTaskForm from './AddTaskForm';
import useTasks from '../../hooks/useTasks';
import SearchBar from "./SearchBar";
import TaskGrid from "./TaskGrid";
import useReminder from "../../hooks/useReminder";
import GanttChart from "./GanttChart";
import classes from '../../style/Dashboard.module.css'; 

function Dashboard(){
  const navigate = useNavigate();
  const [tasks, fetchTasks, addTask, deleteTask] = useTasks(); 
  const [search, setSearch] = useState('');

  useEffect(()=>{
    const token = localStorage.getItem('token');
    if(!token){
      navigate('/login');
    }else{
      fetchTasks();};
    },[navigate, fetchTasks]);

    useReminder(tasks, true); 

  const filtered = tasks.filter(t=>t.title.toLowerCase().includes(search.toLowerCase())); 

  const taskTypeColors = {
    Routine: "lightskyblue",
    Event: "orange",
    Deadline: "limegreen",
    Other: "lightgray",
  };

  return(
    <div className={classes.container}>
      <h1 className={classes.heading}>My LightPlan</h1>
      <div className={classes.mainContent}>
        <div className={classes.leftPanel}>
          <SearchBar value={search} onChange={setSearch}/>
          <AddTaskForm onSubmit = {addTask}/>
        </div>
        <div className={classes.rightPanel}>
          <div>
            <h2>My Tasks</h2>
            <div className={classes.legend}>
              {Object.entries(taskTypeColors).map(([type,color])=>(
                <div key={type} className={classes.legendItem}>
                  <span className={classes.legendColor} style={{backgroundColor: color}}>
                  </span>
                  {type}
                </div>
              ))}
            </div>
            <TaskGrid tasks= {filtered} onDelete={deleteTask}/>
          </div>
            <div className={classes.chart}>
              <GanttChart
                tasks={tasks}
                onClick={(taskId)=>navigate(`/task/view/${taskId}`)} />
            </div>
        </div>
      </div>     
    </div>
  )
}

export default Dashboard;