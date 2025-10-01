import { useState } from "react";
import api from "../api";
import classes from "../style/RegisterLogin.module.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await api.post("/auth/forgot-password", { email });
      setMsg("If the email exists, a reset link has been sent.");
    } catch {
      setMsg("Request failed");
    }
  };

  return (
    <div className={classes.container}>
      <h2 className={classes.heading}>Forgot Password</h2>
      <form onSubmit={submit} className={classes.form}>
        <label className={classes.label}>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={classes.input}
            required
          />
        </label>
        <br />
        <button type="submit" className={classes.button}>
          Send Reset Link
        </button>
      </form>

      {msg && <p className={classes.error}>{msg}</p>}
    </div>
  );
}