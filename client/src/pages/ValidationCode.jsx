import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from '../api';
import classes from '../style/RegisterLogin.module.css'; 

// Component for email verification via validation code
function ValidationCode(){
  const [searchParams] = useSearchParams();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const email = searchParams.get('email');

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await api.post('/auth/verify-email', { email, code });
      setSuccess(res.data.message);

      // Redirect to login after success
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong');
      }
    }
  };

  // Resend the verification code
  const handleResend = async () => {
    try {
      const res = await api.post('/auth/resend-code', { email });
      alert(res.data.message);
    } catch (err) {
      alert('Failed to resend code');
    }
  };

  return (
    <div className={classes.container}>
      <h2 className={classes.heading}>Email Verification</h2>

      <p>
        Please enter the 6-digit code sent to <b>{email}</b>
      </p>

      <form onSubmit={handleVerify} className={classes.form}>
        <input
          type="text"
          placeholder="Enter verification code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className={classes.input}
          required
        />

        <br />

        <button type="submit" className={classes.button}>
          Verify
        </button>
      </form>

      <br />

      <button onClick={handleResend} className={classes.button}>
        Resend Code
      </button>

      {error && (
        <p style={{ color: 'red' }}>{error}</p>
      )}

      {success && (
        <p style={{ color: 'green' }}>{success}</p>
      )}
    </div>
  );
}

export default ValidationCode;