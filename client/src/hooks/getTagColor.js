export const getTagColor = (tag) =>{
  switch(tag){
    case 'Routine': return 'lightskyblue';
    case 'Event': return 'orange';
    case 'Deadline': return 'limegreen';
    case 'Other': return 'lightgray'; 
    default: return 'black'; 
  }
}; 