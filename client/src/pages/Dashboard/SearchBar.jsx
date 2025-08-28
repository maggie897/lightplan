export default function SearchBar({value, onChange}){
  return(
    <input
      type="text"
      placeholder="search task by title"
      value={value}
      onChange= {e => onChange(e.target.value)}
    />  
  )
}