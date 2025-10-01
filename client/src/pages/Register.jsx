import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import classes from "../style/RegisterLogin.module.css";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); 

    try {
      const res = await api.post("/auth/register", {
        username,
        email,
        password,
      });

      alert(res.data.message); 
      
      setUsername("");
      setEmail("");
      setPassword("");

      // Redirect to verify page
      navigate(`/verify?email=${encodeURIComponent(email)}`);
    } catch (err) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <div className={classes.container}>
      <h2 className={classes.heading}>Sign Up</h2>
      <form onSubmit={handleRegister} className={classes.form}>
        <label className={classes.label}>
          Username: 
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={classes.input}
          />
        </label>
        <br />
        <label className={classes.label}>
          Email: 
          <input
            type="email"  
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={classes.input}
          />
        </label>
        <br />
        <label className={classes.label}>
          Password: 
          <input
            type="password"   
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={classes.input}
          />
        </label>
        <br />
        <button type="submit" className={classes.button}>
          Submit
        </button>
      </form>
      {error && <p className={classes.error}>{error}</p>}
    </div>
  );
}