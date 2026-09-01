import React,  { useState } from 'react';
import  { useAuth } from './AuthContext';

const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;

function App() {
  const { login, logout, isLoggedIn } = useAuth();

  const [isLogin, setIsLogin] = useState(true);

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

        // Store token in Context
        login(data.idToken);

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

  const handleLogout = () => {
    logout();
    setEmail('');
    setPassword('');
    setError('');

    alert('Logged out successfully');
  };

  return (
    <div className="page">

      {/* NAVBAR */}
      <nav className="navbar">

        <div className="brand">
          React Auth
        </div>

        <div className="nav-links">

          {!isLoggedIn && (
            <button
              className="nav-button"
              onClick={() => {
                setIsLogin(true);
                setError('');
              }}
            >
              Login
            </button>
          )}

          {isLoggedIn && (
            <>
              <button className="nav-button">
                Profile
              </button>

              <button
                className="logout-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}

        </div>

      </nav>

      {/* MAIN CONTENT */}

      {!isLoggedIn ? (
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
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
            >
              {isLogin
                ? 'Create a new account'
                : 'Login with existing account'}
            </button>

          </form>

        </section>
      ) : (
        <section className="profile-card">

          <h1>Welcome!</h1>

          <p>
            You are successfully logged in.
          </p>

          <p className="logged-message">
            Your authentication token is stored
            securely in the Auth Context.
          </p>

          <button
            className="logout-main-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </section>
      )}

    </div>
  );
}

export default App;