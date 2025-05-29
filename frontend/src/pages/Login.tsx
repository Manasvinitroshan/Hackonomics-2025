
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import UserPool from '../cognito/UserPool';    // <— see step 4
import '../styles/login.css';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage]   = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = new CognitoUser({
      Username: email,
      Pool: UserPool,
    });

    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    user.authenticateUser(authDetails, {
      onSuccess: (result) => {
        console.log('✅ Login success', result);
        // e.g. store token
        localStorage.setItem('idToken', result.getIdToken().getJwtToken());
        setMessage('Login successful! Redirecting...');
        navigate('/');
        
      },
      onFailure: (err) => {
        console.error('❌ Login failed', err);
        setMessage(err.message || 'Login failed');
      }
    });
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          {/* your SVG */}
        </div>
        <h2 className="login-heading">Sign in to your account</h2>
        <p className="login-subtext">
          Not a member? <Link to="/signup">Create an Account</Link>
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email address"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button type="submit">Sign in</button>
          {message && <p className="login-error">{message}</p>}

          <div className="login-divider"><span>Or continue with</span></div>
          <div className="login-social-buttons">
            <button type="button"><FcGoogle size={20}/> Google</button>
            <button type="button"><FaGithub size={20}/> GitHub</button>
          </div>
        </form>
      </div>
    </div>
  );
}
