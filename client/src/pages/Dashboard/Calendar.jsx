import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { enUS } from "date-fns/locale";
import "../../style/calendar.css";
import classes from '../../style/Calendar.module.css';
import { addDays, addWeeks, addMonths } from "date-fns";

const locales = {"en-US": enUS,};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { weekStartsOn: 0 }),
  getDay,
  locales,
});

const CustomToolbar = ({label, onNavigate}) => (
  <div className={classes.container}>
  <span className={classes.label}>{label}</span>
  <div className={classes.button}>
    <button onClick={() => onNavigate("TODAY")}>Today</button>
    <button onClick={() => onNavigate("PREV")}>Back</button>
    <button onClick={() => onNavigate("NEXT")}>Next</button>
  </div>
</div>
);

export default function CalendarView({tasks}) {
  const events = [];

  tasks.forEach(t=>{
    if(!t.dueDate) return;
    const startDate = new Date(t.dueDate);

    if (!t.recurrence || t.recurrence.frequency === "None") {
      events.push({
        title: t.title,
        start: startDate,
        end: startDate,
        allDay: true,
      });
      return;
    }

    const { frequency, interval = 1, endDate } = t.recurrence;
    let current = new Date(startDate);
    const until = endDate ? new Date(endDate) : addMonths(new Date(), 3); 
  
    while (current <= until) {
      events.push({
        title: t.title,
        start: new Date(current),
        end: new Date(current),
        allDay: true,
      });
  
      if (frequency === "Daily") {
        current = addDays(current, interval);
      } else if (frequency === "Weekly") {
        current = addWeeks(current, interval);
      } else if (frequency === "Monthly") {
        current = addMonths(current, interval);
      } else {
        break;
      }
    }
  })

  return (
    <div style={{ height: "500px", marginTop: "20px" }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="month"
        components={{toolbar: CustomToolbar}}
      />
    </div>
  );
}