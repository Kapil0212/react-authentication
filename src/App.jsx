import React, { useState } from 'react';

const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;

function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);
    setError('');

    try {
      if (!API_KEY || API_KEY === 'YOUR_FIREBASE_WEB_API_KEY') {
        throw new Error('Please add your Firebase Web API Key in the .env file.');
      }

      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error?.message || 'Unable to create account.'
        );
      }

      setEmail('');
      setPassword('');
      alert('Account created successfully!');
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="page">
      <nav className="navbar">
        <div className="brand">React Auth</div>
        <div className="nav-links">
          <button type="button" className="nav-button">Login</button>
          <button type="button" className="nav-button">Profile</button>
          <button type="button" className="logout-button">Logout</button>
        </div>
      </nav>

      <section className="auth-card">
        <h1>Sign Up</h1>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Your Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
            required
          />

          <label htmlFor="password">Your Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            minLength="6"
            required
          />

          {isLoading ? (
            <button type="button" className="submit-button" disabled>
              <span className="spinner" aria-hidden="true"></span>
              Sending request...
            </button>
          ) : (
            <button type="submit" className="submit-button">
              Create Account
            </button>
          )}

          {error && (
            <div className="error-box" role="alert">
              {error}
            </div>
          )}

          <button type="button" className="existing-account">
            Login with existing account
          </button>
        </form>
      </section>
    </main>
  );
}

function App() {
  return <AuthForm />;
}

export default App;