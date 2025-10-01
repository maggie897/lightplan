import { Link } from "react-router-dom";
import classes from "../style/HomePage.module.css";

export default function Home() {
  return (
    <div className={classes.container}>
      <h1 className={classes.heading}>Welcome to LightPlan</h1>
      <div>
        <Link to="/register">
          <button className={classes.button}>Sign Up</button>
        </Link>
        <Link to="/login">
          <button className={classes.button}>Login</button>
        </Link>
      </div>
    </div>
  );
}