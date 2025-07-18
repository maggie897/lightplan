import { useState } from "react";
import axios from 'axios'; 
import { useNavigate } from "react-router-dom";

function Login(){
  const [loginInput, setLoginIput] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); 
  const navigate = useNavigate();

  const handleLogin= async(e)=>{
    e.preventDefault();
    setError(''); 

    try{
      const res= await axios.post('http://localhost:5000/api/auth/login',{
        loginInput,password
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user',JSON.stringify(res.data.user));

      alert(`Welcome, ${res.data.user.username}`);  
      navigate('/dashboard');       
    }catch(err){
      console.log('Login error:', err.response);

      if(err.response && err.response.data.message){
        setError(err.response.data.message);
      }else{
        setError('Something went wrong'); 
      }
    }
  };

  return(
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <p>Username/Email: </p>
        <input type="text"
          placeholder="Username or Email"
          required
          value={loginInput}
          onChange={(e)=>setLoginIput(e.target.value)}
        /><br/>
        <input type="text" 
          placeholder="password"
          required
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        /><br/>
        <button type="submit">Login</button>
      </form>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  )
}

export default Login;
