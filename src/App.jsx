import React, { useState } from 'react';

const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;

function App() {
  const [isLogin, setIsLogin] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);
    setError('');

    const url = isLogin
      ? `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`
      : `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      });

      const data = await response.json();

      console.log('Firebase Response:', data);

      if (!response.ok) {
        throw new Error(
          data?.error?.message || 'Authentication failed'
        );
      }

      if (isLogin) {
        console.log('JWT / idToken:', data.idToken);

        localStorage.setItem('idToken', data.idToken);

        alert('Login successful');
      } else {
        alert('Account created successfully');
      }

      setEmail('');
      setPassword('');
      setError('');
    } catch (error) {
      console.error('Authentication Error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const switchToLogin = () => {
    setIsLogin(true);
    setError('');
    setEmail('');
    setPassword('');
  };

  const switchToSignup = () => {
    setIsLogin(false);
    setError('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="page">
      <nav className="navbar">
        <div className="brand">
          React Auth
        </div>

        <div className="nav-links">
          <button
            className="nav-button"
            onClick={switchToLogin}
          >
            Login
          </button>

          <button
            className="nav-button"
            onClick={switchToSignup}
          >
            Sign Up
          </button>

          <button
            className="logout-button"
            onClick={() => {
              localStorage.removeItem('idToken');
              alert('Logged out');
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      <section className="auth-card">
        <h1>
          {isLogin ? 'Login' : 'Sign Up'}
        </h1>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">
            Your Email
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
          />

          <label htmlFor="password">
            Your Password
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            minLength="6"
            required
          />

          {error && (
            <div className="error-box">
              {error}
            </div>
          )}

          {isLoading ? (
            <button
              type="button"
              className="submit-button"
              disabled
            >
              <span className="spinner"></span>
              Sending request...
            </button>
          ) : (
            <button
              type="submit"
              className="submit-button"
            >
              {isLogin
                ? 'Login'
                : 'Create Account'}
            </button>
          )}

          <button
            type="button"
            className="existing-account"
            onClick={
              isLogin
                ? switchToSignup
                : switchToLogin
            }
          >
            {isLogin
              ? 'Create a new account'
              : 'Login with existing account'}
          </button>
        </form>
      </section>
    </div>
  );
}

export default App;