import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Register(){
  const [username, setUsername] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate=useNavigate();

  const handleRegister = async (e) =>{
    e.preventDefault();
    setError(''); 

    try{
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        username, email, password
      }); 
      alert(res.data.message);  
      
      setUsername('');
      setEmail('');
      setPassword('');

      navigate('/login');
    }catch(err){
      if(err.response && err.response.data.message){
        setError(err.response.data.message)
      }else{
        setError('something went wrong'); 
      }      
    }
  }; 

  return(
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <p>Username: </p>
        <input type="text" 
          placeholder="Username"
          required
          value = {username}
          onChange={e=>setUsername(e.target.value)}
          /><br/>
        <input type="text" 
          placeholder="Email"
          required
          value={email}
          onChange={e=>setEmail(e.target.value)}
        /><br/>
        <input type="text" 
          placeholder="Password"
          required
          value={password}
          onChange={e=>setPassword(e.target.value)}
        /><br/>
        <button type="submit">Submit</button>
      </form>
      {error && <p style={{color:'red'}}>{error}</p> }
    </div>
  )
}

export default Register; 