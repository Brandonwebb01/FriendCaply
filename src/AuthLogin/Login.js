import React, { useState } from 'react';
import './Login.css';

function Login({ isOpen, onClose }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        }),
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        onClose();
        window.location.reload();
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        // Auto login after successful signup
        handleLogin(e);
      } else {
        alert(data.error || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="login-overlay">
      <div className="login-modal">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>{isLoginMode ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={isLoginMode ? handleLogin : handleSignup}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
          
          {!isLoginMode && (
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          )}
          
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          
          <button type="submit">
            {isLoginMode ? 'Log In' : 'Sign Up'}
          </button>
        </form>
        
        <button 
          className="toggle-mode" 
          onClick={() => setIsLoginMode(!isLoginMode)}
        >
          {isLoginMode ? 'Need an account? Sign Up' : 'Already have an account? Log In'}
        </button>
      </div>
    </div>
  );
}

export default Login;