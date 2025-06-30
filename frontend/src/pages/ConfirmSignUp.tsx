// src/pages/ConfirmSignup.tsx
import React, { useState, useEffect, FC } from 'react';
import { CognitoUser } from 'amazon-cognito-identity-js';
import UserPool from '../cognito/UserPool';
import StockTicker from '/Users/manassingh/LeanFoundr/frontend/src/components/StockTicket.tsx';
import Footer from '../components/Footer';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { FaRocket } from 'react-icons/fa';
import '../styles/login.css';

const ConfirmSignup: FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialEmail = searchParams.get('email') || '';
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const primary = '#4f46e5';

  useEffect(() => {
    if (initialEmail) setEmail(initialEmail);
  }, [initialEmail]);

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const user = new CognitoUser({ Username: email, Pool: UserPool });
    user.confirmRegistration(code, true, (err, result) => {
      if (err) setMessage(err.message || 'Confirmation failed');
      else {
        setMessage('Confirmation successful! Redirecting to login…');
        setTimeout(() => navigate('/login'), 2000);
      }
    });
  };

  return (
    <div className="login-wrapper">
      <StockTicker />
      <div className="login-page">
        <div className="login-card">
          <div className="sidebar-header" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
            <FaRocket className="sidebar-logo-icon" style={{ color: primary }} />
            <span className="sidebar-logo-text" style={{ color: primary }}>Foundr</span>
          </div>

          <h2 className="login-heading">Confirm Your Account</h2>
          <p className="login-subtext">
            Enter the code sent to your email.&nbsp;
            <Link to="/signup">Resend signup</Link>
          </p>

          <form className="login-form" onSubmit={handleConfirm} noValidate>
            <input
              type="email"
              placeholder="Email address"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ color: '#fff' }}
            />
            <input
              type="text"
              placeholder="Confirmation Code"
              required
              value={code}
              onChange={e => setCode(e.target.value)}
              style={{ color: '#fff' }}
            />
            <button
              type="submit"
              style={{ backgroundColor: primary, color: '#fff', border: 'none' }}
            >
              Confirm
            </button>
            {message && <p className="login-error">{message}</p>}
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ConfirmSignup;
