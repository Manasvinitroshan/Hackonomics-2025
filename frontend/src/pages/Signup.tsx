import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import UserPool from '../cognito/UserPool';
import '../styles/login.css';
import Footer from '../components/Footer';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    UserPool.signUp(email, password, [], null, (err, data) => {
      if (err) {
        setMessage(err.message || 'Signup failed');
      } else {
        setMessage('Signup successful! Check your email for verification.');
        navigate(`/confirm?email=${encodeURIComponent(email)}`);
      }
    });
  };

  return (
    <div><div className="login-page">
    <div className="login-card">
      <div className="login-logo">
        <svg viewBox="0 0 36 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0s6 0 9 3c3 3 9 3 9 3s-6 0-9 3C6 12 0 12 0 12V0z" />
          <path d="M18 0s6 0 9 3c3 3 9 3 9 3s-6 0-9 3c-3 3-9 3-9 3V0z" />
        </svg>
      </div>

      <h2 className="login-heading">Create your account</h2>
      <p className="login-subtext">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>

      <form className="login-form" onSubmit={handleSubmit}>
        <input
          id="email-address"
          name="email"
          type="email"
          placeholder="Email address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          id="confirm-password"
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button type="submit">Sign up</button>
        {message && <p className="login-error">{message}</p>}

        <div className="login-divider">
          <span>Or sign up with</span>
        </div>

        <div className="login-social-buttons">
          <button type="button">
            <FcGoogle size={20} /> Google
          </button>
          <button type="button">
            <FaGithub size={20} /> GitHub
          </button>
        </div>
      </form>
    </div>
  </div><Footer/></div>
  );
}
