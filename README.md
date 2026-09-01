# React Auth - Signup Loader & Error Feedback

This project implements the Signup task from the assignment.

## Included

- React signup form
- Firebase Authentication REST API
- Loading state: `Sending request...`
- Server error feedback
- `try/catch` error handling
- Existing screenshot-inspired purple UI

## Setup

1. Extract the ZIP.
2. Open the project folder in VS Code.
3. Run:

```bash
npm install
```

4. Create a `.env` file in the project root.

5. Add your Firebase Web API key:

```env
VITE_FIREBASE_API_KEY=YOUR_FIREBASE_WEB_API_KEY
```

6. Run:

```bash
npm run dev
```

7. Open the local URL shown by Vite.

## Testing the assignment

### Successful signup
Enter a valid email and a password accepted by Firebase. Click **Create Account**. The button changes to **Sending request...** while the request is in progress.

### Failed signup
Use an invalid/weak password or an email that already exists. Firebase's server response is displayed in the red error box.

Examples of Firebase errors include `WEAK_PASSWORD`, `EMAIL_EXISTS`, and other server-provided messages.

## Firebase setup

In Firebase Console, enable:

Authentication → Sign-in method → Email/Password

The Firebase Web API key is safe to use in a frontend application, but authentication and database security rules must still be configured correctly.
