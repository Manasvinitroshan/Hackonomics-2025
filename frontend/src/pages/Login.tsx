// src/pages/Login.tsx
import React, { FC, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub, FaRocket } from 'react-icons/fa';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import UserPool from '../cognito/UserPool';
import StockTicker from '../components/StockTicket';
import Footer from '../components/Footer';
import '../styles/login.css';

const Login: FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage]   = useState<string>('');
  const navigate                = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = new CognitoUser({ Username: username, Pool: UserPool });
    const authDetails = new AuthenticationDetails({ Username: username, Password: password });

    user.authenticateUser(authDetails, {
      onSuccess: (result) => {
        localStorage.setItem('idToken', result.getIdToken().getJwtToken());
        localStorage.setItem('userEmail', username);
        setMessage('Login successful! Redirecting...');
        navigate('/');
      },
      onFailure: (err) => {
        setMessage(err.message || 'Login failed');
      },
    });
  };

  const primary = '#4f46e5';

  return (
    <div className="login-wrapper">
      <StockTicker />
      <div className="login-page">
        <div className="login-card">
          <div className="sidebar-header" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
            <FaRocket className="sidebar-logo-icon" style={{ color: primary }} />
            <span className="sidebar-logo-text" style={{ color: primary }}>Foundr</span>
          </div>

          <h2 className="login-heading">Sign in to your account</h2>
          <p className="login-subtext">
            Not a member? <Link to="/signup">Create an Account</Link>
          </p>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <input
              type="text"
              placeholder="Username"
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{ color: '#fff' }}
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ color: '#fff' }}
            />
            <button
              type="submit"
              style={{ backgroundColor: primary, color: '#fff', border: 'none' }}
            >
              Sign in
            </button>
            {message && <p className="login-error">{message}</p>}

            <div className="login-divider"><span>Or continue with</span></div>
            <div className="login-social-buttons">
              <button
                type="button"
                style={{ backgroundColor: primary, color: '#fff', border: 'none' }}
              >
                <FcGoogle size={20} style={{ marginRight: 8 }} /> Google
              </button>
              <button
                type="button"
                style={{ backgroundColor: primary, color: '#fff', border: 'none' }}
              >
                <FaGithub size={20} style={{ marginRight: 8 }} /> GitHub
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
