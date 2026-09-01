import React, { useState } from 'react';
import { useAuth } from './AuthContext';

const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;

function App() {
  const {
    token,
    login,
    logout,
    isLoggedIn,
  } = useAuth();

  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [newPassword, setNewPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] =
    useState(false);

  const [error, setError] = useState('');
  const [passwordError, setPasswordError] =
    useState('');

  const handleAuthSubmit = async (event) => {
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
          data?.error?.message ||
            'Authentication failed'
        );
      }

      if (isLogin) {
        console.log(
          'JWT / idToken:',
          data.idToken
        );

        login(data.idToken);

        alert('Login successful');
      } else {
        alert('Account created successfully');

        setIsLogin(true);
      }

      setEmail('');
      setPassword('');
      setError('');
    } catch (error) {
      console.error(
        'Authentication Error:',
        error
      );

      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();

    setPasswordError('');

    if (newPassword.length < 6) {
      setPasswordError(
        'Password must be at least 6 characters'
      );

      return;
    }

    setIsPasswordLoading(true);

    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${API_KEY}`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            idToken: token,
            password: newPassword,
            returnSecureToken: true,
          }),
        }
      );

      const data = await response.json();

      console.log(
        'Password Update Response:',
        data
      );

      if (!response.ok) {
        throw new Error(
          data?.error?.message ||
            'Unable to change password'
        );
      }

      // Firebase gives us a new idToken
      // after changing the password.
      login(data.idToken);

      setNewPassword('');

      alert('Password changed successfully');
    } catch (error) {
      console.error(
        'Password Update Error:',
        error
      );

      setPasswordError(error.message);
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleLogout = () => {
    logout();

    setEmail('');
    setPassword('');
    setNewPassword('');
    setError('');
    setPasswordError('');

    alert('Logged out successfully');
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

      {/* NAVBAR */}

      <nav className="navbar">

        <div className="brand">
          React Auth
        </div>

        <div className="nav-links">

          {!isLoggedIn && (
            <button
              className="nav-button"
              onClick={switchToLogin}
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

      {/* LOGGED OUT */}

      {!isLoggedIn ? (

        <section className="auth-card">

          <h1>
            {isLogin ? 'Login' : 'Sign Up'}
          </h1>

          <form onSubmit={handleAuthSubmit}>

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

      ) : (

        /* PROFILE / CHANGE PASSWORD */

        <section className="profile-card">

          <h1>Your User Profile</h1>

          <form
            onSubmit={handleChangePassword}
            className="password-form"
          >

            <label htmlFor="newPassword">
              New Password
            </label>

            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(event) =>
                setNewPassword(
                  event.target.value
                )
              }
              placeholder="Enter new password"
              minLength="6"
              required
            />

            {passwordError && (
              <div className="error-box">
                {passwordError}
              </div>
            )}

            {isPasswordLoading ? (

              <button
                type="button"
                className="change-password-button"
                disabled
              >
                <span className="spinner"></span>
                Updating...
              </button>

            ) : (

              <button
                type="submit"
                className="change-password-button"
              >
                Change Password
              </button>

            )}

          </form>

        </section>

      )}

    </div>
  );
}

export default App;