import {Link} from 'react-router-dom';
import '../Home.css';

function Home(){
  return(
    <div className='home-container'>
      <h1>Welcome to LightPlan</h1>
      <div>
        <Link to='/register'>
          <button>Register</button>
        </Link>
        <Link to='/login'>
          <button>Login</button>
        </Link>
      </div>
    </div>
  )
}

export default Home;