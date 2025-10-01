import classes from "../../style/Dashboard.module.css"; 

export default function SearchBar({ value, onChange }) {
  return (
    <label className={classes.SearchBar}>
      Search Task by Title
      <img 
        src="/icon-sousuo.svg" 
        alt="search" 
        className={classes.img} 
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={classes.input}
      />
    </label>
  );
}