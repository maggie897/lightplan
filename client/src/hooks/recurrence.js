// Add a number of days to a given date.
function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

// Add weeks to a given date.
function addWeeks(date, interval = 1) {
  const dueDate = new Date(date);
  const next = new Date(dueDate);
  next.setDate(dueDate.getDate() + 7 * interval);
  return next;
}

// Add months to a given date.
function addMonths(date, months) {
  const d = new Date(date);
  const day = d.getDate();

// setMonth() will auto-adjust when values exceed the normal range
  d.setMonth(d.getMonth() + months); 

// Fix cases like Jan 31 → Mar 3 (instead of Feb 28)
  if (d.getDate() < day) d.setDate(0);
  return d;
}

// Get the next due date for a recurring task.
export function getNextDueDate(dueDate, recurrence) {
  const { frequency, interval = 1, endDate } = recurrence || {};

  if (!frequency || frequency === 'None') return null;

  const due = new Date(dueDate);
  const today = new Date();

  if (today < due) return due;

  let next = null;
  if (frequency === 'Daily') {
    next = addDays(due, interval);
  } else if (frequency === 'Weekly') {
    next = addWeeks(due, interval);
  } else if (frequency === 'Monthly') {
    next = addMonths(due, interval);
  }

  if (endDate && next && next > new Date(endDate)) return null;

  return next;
}






