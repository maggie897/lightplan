function addDays(date, days){
  const d = new Date(date); 
  d.setDate(d.getDate()+ days);
  return d; 
}

function addWeeks(date, interval=1){
  const dueDate = new Date(date);
  const next = new Date(dueDate);
  next.setDate(dueDate.getDate() + 7 * interval); 
  return next; 
}

function addMonths(date, months){
  const d = new Date(date); 
  const day = d.getDate(); 
// setMonth() will auto-adjust when values exceed the normal range
  d.setMonth(d.getMonth()+ months); 

  if(d.getDate() < day) d.setDate(0); 
  return d; 
}

 function getNextDueDate(dueDate, recurrence){
  const {frequency, interval=1, endDate} = recurrence || {}; 

  if(!frequency || frequency==='None') return null; 
  const due = new Date(dueDate); 

  let next = null;
  if(frequency === 'Daily'){
    next = addDays(due, interval); 
  }else if(frequency === 'Weekly'){
    next = addWeeks(due, interval); 
  }else if(frequency === 'Monthly'){
    next = addMonths(due, interval); 
  }
  if(endDate && next && next > new Date(endDate)) return null; 
  return next; 
}

module.exports = {getNextDueDate}; 


