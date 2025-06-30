import React, { FC, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub, FaRocket } from 'react-icons/fa';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import UserPool from '../cognito/UserPool';
import StockTicker from '/Users/manassingh/LeanFoundr/frontend/src/components/StockTicket.tsx';
import Footer from '../components/Footer';
import '../styles/login.css';

type Attribute = { Name: string; Value: string };

const Signup: FC = () => {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // primary theme color
  const primary = '#4f46e5';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    const attributeList: CognitoUserAttribute[] = [];

    // Add first and last name attributes
    const dataFirst: Attribute = { Name: 'given_name', Value: firstName };
    const dataLast: Attribute = { Name: 'family_name', Value: lastName };
    attributeList.push(new CognitoUserAttribute(dataFirst));
    attributeList.push(new CognitoUserAttribute(dataLast));

    // Existing attributes
    const dataEmail: Attribute = { Name: 'email', Value: email };
    const dataPhone: Attribute = { Name: 'phone_number', Value: phoneNumber };
    attributeList.push(new CognitoUserAttribute(dataEmail));
    attributeList.push(new CognitoUserAttribute(dataPhone));

    UserPool.signUp(
      username,
      password,
      attributeList,
      null,
      (err, data) => {
        if (err) {
          setMessage(err.message || 'Signup failed');
        } else {
          localStorage.setItem('userEmail', email);
          setMessage('Signup successful! Check your email for verification.');
          navigate(`/confirm?username=${encodeURIComponent(username)}`);
        }
      }
    );
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

          <h2 className="login-heading">Create your account</h2>
          <p className="login-subtext">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {/* Username */}
            <input
              name="username"
              type="text"
              placeholder="Username"
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{ color: '#fff' }}
            />

            {/* First & Last Name */}
            <input
              name="firstName"
              type="text"
              placeholder="First name"
              required
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              style={{ color: '#fff' }}
            />
            <input
              name="lastName"
              type="text"
              placeholder="Last name"
              required
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              style={{ color: '#fff' }}
            />

            {/* Email & Phone */}
            <input
              name="email"
              type="email"
              placeholder="Email address"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ color: '#fff' }}
            />
            <input
              name="phoneNumber"
              type="text"
              inputMode="tel"
              placeholder="Phone number (e.g. +11234567890)"
              required
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              style={{ color: '#fff' }}
            />

            {/* Passwords */}
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ color: '#fff' }}
            />
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              style={{ color: '#fff' }}
            />

            <button
              type="submit"
              style={{ backgroundColor: primary, color: '#fff', border: 'none' }}
            >
              Sign up
            </button>
            {message && <p className="login-error">{message}</p>}

            <div className="login-divider"><span>Or sign up with</span></div>
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

export default Signup;
