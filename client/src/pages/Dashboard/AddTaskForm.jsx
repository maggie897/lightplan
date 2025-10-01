import { useRef, useState } from "react";
import classes from "../../style/AddTaskForm.module.css";

export default function AddTaskForm({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("Other");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [details, setDetails] = useState("");
  const [file, setFile] = useState(null);
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState("None");
  const [interval, setInterval_] = useState(1);
  const [endDate, setEndDate] = useState("");
  const [reminder, setReminder] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  // Helpers for validating date/time
  const today = new Date().toISOString().split("T")[0];
  const isToday = dueDate === today;
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}`;
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await requestReminder();

    if (submitting) return;
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("tag", tag);
      formData.append("dueDate", dueDate);
      formData.append("dueTime", dueTime);
      formData.append("details", details);
      if (file) formData.append("image", file);
      formData.append("isRecurring", isRecurring);
      formData.append(
        "recurrence",
        JSON.stringify({
          frequency,
          interval: Number(interval) || 1,
          endDate: endDate || null,
        })
      );
      formData.append("reminder", reminder);

      await onSubmit(formData);

      // Reset form fields after submission
      setTitle("");
      setTag("Other");
      setDueDate("");
      setDueTime("");
      setDetails("");
      setFile(null);
      setIsRecurring(false);
      setFrequency("None");
      setInterval_(1);
      setEndDate("");
      setReminder(0);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };
  
  const requestReminder = async () => {
    if (!("Notification" in window)) return;
    if (Notification.permission === "default") {
      await Notification.requestPermission();
    }
  }; 

  return (
    <div className={classes.container}>
      <p className={classes.title}>Let's Add Task 😊</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Task Title:
            <br />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={classes.input}
              required
            />
          </label>
        </div>

        <div>
          <label>
            Category:
            <br />
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className={classes.input}
            >
              <option value="Routine">Routine</option>
              <option value="Event">Event</option>
              <option value="Deadline">Deadline</option>
              <option value="Other">Other</option>
            </select>
          </label>
        </div>

        <div>
          <label>
            Due Date:
            <br />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={today}
              className={classes.input}
            />
          </label>
        </div>

        <div>
          <label>
            Due Time:
            <br />
            <input
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              min={isToday ? currentTime : undefined}
              className={classes.input}
            />
          </label>
        </div>

        <div>
          <label>
            Repeat:
            <br />
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              disabled={!dueDate}
              className={classes.input}
            >
              <option>None</option>
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </label>
        </div>

        <div>
          {frequency !== "None" && (
            <>
              {frequency === "Weekly" && (
                <div>
                  <select
                    value={interval}
                    onChange={(e) => setInterval_(Number(e.target.value))}
                    className={classes.input}
                  >
                    <option value={1}>Every 1 Week</option>
                    <option value={2}>Every 2 Weeks</option>
                  </select>
                </div>
              )}

              <label>
                End Date (optional):
                <br />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={dueDate}
                  className={classes.input}
                />
              </label>
            </>
          )}
        </div>

        <div>
          <label>
            Reminder:
            <br />
            <select
              value={reminder}
              onChange={(e) => setReminder(e.target.value)}
              className={classes.input}
            >
              <option value={0}>No Reminder</option>
              <option value={60}>60 minutes before</option>
              <option value={1440}>1 day before</option>
            </select>
          </label>
        </div>

        <div>
          <label>
            Details:
            <br />
            <input
              type="text"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className={classes.input}
            />
          </label>
        </div>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          ref={fileInputRef}
          className={classes.input}
        />
        <br />

        <button
          type="submit"
          className={classes.button}
          disabled={submitting}
        >
          {submitting ? "Adding..." : "Add"}
        </button>
      </form>
    </div>
  );
}