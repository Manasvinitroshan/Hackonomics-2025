import React from 'react';
import { Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import '/Users/manassingh/LeanFoundr/frontend/src/styles/login.css';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();

  return (
    <div className="login-page">
      <div className="login-card">
        {/* logo + heading */}
        <div className="login-logo">
          <svg
            viewBox="0 0 36 20"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 0s6 0 9 3c3 3 9 3 9 3s-6 0-9 3C6 12 0 12 0 12V0z" />
            <path d="M18 0s6 0 9 3c3 3 9 3 9 3s-6 0-9 3c-3 3-9 3-9 3V0z" />
          </svg>
        </div>
        <h2 className="login-heading">Sign in to your account</h2>
        <p className="login-subtext">
          Not a member?{' '}
          <Link to="/signup">Create an Account</Link>
        </p>

        {/* form */}
        <form className="login-form" action="#" method="POST">
          <input type="hidden" name="remember" value="true" />

          <input
            id="email-address"
            name="email"
            type="email"
            placeholder="Email address"
            required
          />
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            required
          />

          <div className="actions">
            <label>
              <input type="checkbox" name="remember-me" />
              <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem', color: '#374151' }}>Remember me</span>
            </label>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <button type="submit" onClick={() => navigate('/')}>Sign in</button>

          <div className="login-divider">
            <span>Or continue with</span>
          </div>

          <div className="login-social-buttons">
            <button type="button">
              <FcGoogle size={20} />
              Google
            </button>
            <button type="button">
              <FaGithub size={20} />
              GitHub
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}