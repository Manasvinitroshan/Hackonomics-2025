import React, { useState, useEffect } from 'react';
import { CognitoUser } from 'amazon-cognito-identity-js';
import UserPool from '/Users/manassingh/LeanFoundr/frontend/src/cognito/UserPool.js';
import '../styles/login.css';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

export default function ConfirmSignup() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialEmail = searchParams.get('email') || '';
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const user = new CognitoUser({ Username: email, Pool: UserPool });
    user.confirmRegistration(code, true, (err, result) => {
      if (err) {
        setMessage(err.message || 'Confirmation failed');
      } else {
        setMessage('Confirmation successful! Redirecting to login…');
        setTimeout(() => navigate('/login'), 2000);
      }
    });
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <svg viewBox="0 0 36 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0s6 0 9 3c3 3 9 3 9 3s-6 0-9 3C6 12 0 12 0 12V0z" />
            <path d="M18 0s6 0 9 3c3 3 9 3 9 3s-6 0-9 3c-3 3-9 3-9 3V0z" />
          </svg>
        </div>
        <h2 className="login-heading">Confirm Your Account</h2>
        <p className="login-subtext">
          Enter the code sent to your email.&nbsp;
          <Link to="/signup">Resend signup</Link>
        </p>

        <form className="login-form" onSubmit={handleConfirm}>
          <input
            type="email"
            placeholder="Email address"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Confirmation Code"
            required
            value={code}
            onChange={e => setCode(e.target.value)}
          />
          <button type="submit">Confirm</button>
          {message && <p className="login-error">{message}</p>}
        </form>
      </div>
    </div>
  );
}
