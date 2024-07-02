
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Login.scss';
import loginImage from '../../assets/lendsqr.jpeg';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    console.log('Login attempt with:', { email, password });
    try {
      await login(email, password);
      console.log('Login successful, redirecting to dashboard');
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-container">
       <div className="login-image">
        <img src={loginImage} alt="Login" />
      </div>
      <div className="login-form">
        <div className="logo">lendsqr</div>
        <h1>Welcome!</h1>
        <p>Enter details to login.</p>
        <form onSubmit={handleSubmit}>
          <div className="input-field">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div className="input-field password-field">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <button
              type="button"
              className="show-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "HIDE" : "SHOW"}
            </button>
          </div>
          {error && <p className="error">{error}</p>}
          <div className="forgot-password">
            <a href="/forgot-password">FORGOT PASSWORD?</a>
          </div>
          <button type="submit" className="login-button">LOG IN</button>
        </form>
      </div>
    </div>
  );
};

export default Login;