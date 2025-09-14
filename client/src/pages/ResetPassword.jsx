import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from '../api';
import classes from '../style/RegisterLogin.module.css'; 

export default function ResetPassword(){
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const email = params.get('email') || '';
  const [pwd, setPwd] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setMsg(''); 
    try{
      await api.post('/auth/reset-password', {email, token, newPassword: pwd});
      alert('Password Reset. Please log in.');
      navigate('/login'); 
    }catch(err){
      setMsg(err?.response?.data?.message || 'Reset Failed')
    }
  }

  return(
    <div className={classes.container}>
      <h2 className={classes.heading}>Reset Password</h2>
      <form onSubmit={submit} className={classes.form}>
        <label className={classes.label}> New Password: 
        <input 
          type="password" 
          value={pwd} 
          onChange={e=>setPwd(e.target.value)} 
          className={classes.input}
        />
        </label>
        <br />
        <button type="submit" className={classes.button}>Update</button>
      </form>
      {msg && <p>{msg}</p> }
    </div>
  )
}