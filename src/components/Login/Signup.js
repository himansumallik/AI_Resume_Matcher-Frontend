import React, { useState } from 'react';
import axios from 'axios';
import { FaUserAlt, FaLock, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';
import './Login.css';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await axios.post('http://localhost:3000/signup', {
        name,
        email,
        password,
      });
      setMessage(response.data.message);
      setIsSuccess(true); // Success
    } catch (err) {
      setMessage(err.response?.data?.message || 'Signup failed. Please try again.');
      setIsSuccess(false); // Error
    }
  };

  return (
    <div className="login-container">
      <div className="signup-box">
        <h2>Create Account</h2>
        <form onSubmit={handleSignup}>
          <div className="input-group">
            <FaUserAlt className="icon" />
            <input
              type="text"
              placeholder="Username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <FaEnvelope className="icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <FaLock className="icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="eye-icon" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit">Sign Up</button>
        </form>
        <p>
          <br></br>
          Already have an account?{' '}
          <span
            className="toggle-link"
            onClick={() => navigate('/login')}
          >
            Log in
          </span>
        </p>
        {message && (
          <p
            className={`feedback-message ${
              isSuccess ? 'success-message' : 'error-message'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default Signup;
