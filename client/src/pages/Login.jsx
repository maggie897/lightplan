import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import classes from "../style/RegisterLogin.module.css";

export default function Login() {
  const [loginInput, setLoginInput] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); 

    try {
      const res = await api.post("/auth/login", {
        loginInput,
        password,
      });

      // Save auth details locally
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert(`Welcome, ${res.data.user.username}`);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err.response);

      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <div className={classes.container}>
      <h2 className={classes.heading}>Login</h2>
      <form onSubmit={handleLogin} className={classes.form}>
        <label className={classes.label}>
          Username / Email: 
          <input
            type="text"
            required
            value={loginInput}
            onChange={(e) => setLoginInput(e.target.value)}
            className={classes.input}
          />
        </label>
        <br />
        <label className={classes.label}>
          Password:
          <br />
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
          Login
        </button>
      </form>
      {error && <p className={classes.error}>{error}</p>}
      <p>
        <a href="/forgot-password">Forgot Password?</a>
      </p>
    </div>
  );
}