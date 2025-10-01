import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import AddTaskForm from "./AddTaskForm";
import SearchBar from "./SearchBar";
import TaskGrid from "./TaskGrid";
import Calendar from "./Calendar";

import useTasks from "../../hooks/useTasks";
import useReminder from "../../hooks/useReminder";
import { getTagColor } from "../../hooks/getTagColor";

import classes from "../../style/Dashboard.module.css";

function Dashboard() {
  const navigate = useNavigate();

  const [tasks, fetchTasks, addTask, deleteTask] = useTasks();
  const [search, setSearch] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);

  // Fetch tasks after login check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchTasks();
    }
  }, [navigate, fetchTasks]);

  // Setup reminders
  useReminder(tasks, true); 

  // Filter tasks by search input
  const filtered = tasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  ); 

  return (
    <>
      <header className={classes.header}>
        <h1 className={classes.headerTitle}>My LightPlan</h1>
        <SearchBar value={search} onChange={setSearch} />
      </header>

      <div className={classes.container}>
        <div className={classes.mainContent}>
          <div className={classes.leftPanel}>
            <AddTaskForm onSubmit={addTask} />
          </div>

          <div className={classes.rightPanel}>
            <div className={classes.toggle}>
              <button
                className={!showCalendar ? classes.activeTab : ""}
                onClick={() => setShowCalendar(false)}
              >
                My Tasks
              </button>
              <button
                className={showCalendar ? classes.activeTab : ""}
                onClick={() => setShowCalendar(true)}
              >
                My Calendar
              </button>
            </div>

            {!showCalendar ? (
              <>
                <div className={classes.legend}>
                  {["Routine", "Event", "Deadline", "Other"].map((type) => (
                    <div key={type} className={classes.legendItem}>
                      <span
                        className={classes.legendColor}
                        style={{ backgroundColor: getTagColor(type) }}
                      />
                      {type}
                    </div>
                  ))}
                </div>
                <TaskGrid tasks={filtered} onDelete={deleteTask} />
              </>
            ) : (
              <Calendar tasks={tasks} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;