# Google Login App — Full Documentation

## 1) Purpose and Scope

This repository is a minimal full-stack example of **Google Sign-In using OAuth 2.0 ID tokens**.

The app demonstrates:
- A React frontend that renders a Google login button.
- A Node/Express backend that verifies Google-issued ID tokens.
- Returning normalized user profile fields (`name`, `email`, `picture`) after token verification.

It is intentionally lightweight and focuses on authentication flow basics rather than production-grade session management.

---

## 2) High-Level Architecture

### Components

- **Frontend (`/frontend`)**
  - Built with React + Vite.
  - Uses `@react-oauth/google` to launch Google Sign-In.
  - Sends Google credential token to backend.

- **Backend (`/backend`)**
  - Built with Express.
  - Uses `google-auth-library` to validate Google ID token signatures and audience.
  - Returns user payload data to frontend.

### Data Flow

1. User opens frontend in browser.
2. User clicks **Login with Google**.
3. Google popup authenticates the user and returns a credential (ID token).
4. Frontend sends token to backend endpoint `POST /auth/google`.
5. Backend validates token against configured Google `CLIENT_ID`.
6. Backend extracts profile data and returns JSON response.

---

## 3) Repository Structure

```text
.
├── README.md
├── backend/
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
└── frontend/
    ├── package.json
    ├── package-lock.json
    ├── index.html
    ├── vite.config.js
    ├── eslint.config.js
    ├── public/
    │   ├── favicon.svg
    │   └── icons.svg
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── App.css
        ├── index.css
        └── assets/
            ├── hero.png
            ├── react.svg
            └── vite.svg
```

---

## 4) Frontend Documentation

## 4.1 Entry Point (`frontend/src/main.jsx`)

Responsibilities:
- Bootstraps React app.
- Wraps app in `GoogleOAuthProvider`.
- Supplies Google OAuth client ID to SDK provider.

Key behavior:
- The Google OAuth provider must be present for `GoogleLogin` to work.
- Currently, the client ID is hardcoded in source.

## 4.2 App Component (`frontend/src/App.jsx`)

Responsibilities:
- Renders a centered heading + Google Login button.
- Handles login success callback.
- Sends credential token to backend.

Key functions:
- `handleSuccess(credentialResponse)`:
  - Reads `credentialResponse.credential`.
  - Sends `POST` request to `http://localhost:5000/auth/google`.
  - Logs backend response in browser console.

Error paths:
- If HTTP request fails, logs error to console.
- If Google button fails, logs `Login Failed`.

## 4.3 Frontend Dependencies

Runtime:
- `react`, `react-dom`
- `@react-oauth/google`
- `axios`

Tooling:
- Vite
- ESLint + React plugins

---

## 5) Backend Documentation

## 5.1 Server (`backend/server.js`)

Responsibilities:
- Initializes Express app.
- Enables CORS and JSON body parsing.
- Verifies Google ID token on `/auth/google` route.

Route details:

### `POST /auth/google`

Request body:

```json
{
  "token": "<google_id_token>"
}
```

Processing steps:
1. Read `token` from request body.
2. Call `client.verifyIdToken({ idToken: token, audience: process.env.CLIENT_ID })`.
3. Read payload from verified ticket.
4. Construct user object:
   - `name`
   - `email`
   - `picture`
5. Return `200` with `{ user }`.

Error behavior:
- If verification fails, return `401` with:

```json
{
  "error": "Invalid token"
}
```

Port:
- Server listens on port **5000**.

## 5.2 Backend Dependencies

- `express`
- `cors`
- `dotenv`
- `google-auth-library`
- `jsonwebtoken` (installed but not used in current implementation)

---

## 6) Environment Variables and Configuration

Backend expects:

- `CLIENT_ID`
  - Google OAuth Web Client ID.
  - Used as `audience` while verifying incoming ID token.

Suggested `.env` file in `/backend`:

```env
CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

Important:
- Frontend and backend should use matching client IDs.
- In production, avoid hardcoding secrets/config values in source files.

---

## 7) Local Development Setup

## 7.1 Backend

```bash
cd backend
npm install
node server.js
```

Server starts on `http://localhost:5000`.

## 7.2 Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend starts on Vite dev server (commonly `http://localhost:5173`).

## 7.3 End-to-End Manual Verification

1. Start backend.
2. Start frontend.
3. Open frontend URL.
4. Click **Login with Google**.
5. Authenticate with Google.
6. Confirm backend response appears in browser console.

---

## 8) API Contract

## Endpoint

`POST /auth/google`

## Request

Headers:
- `Content-Type: application/json`

Body:

```json
{
  "token": "string"
}
```

## Success Response (`200`)

```json
{
  "user": {
    "name": "string",
    "email": "string",
    "picture": "string"
  }
}
```

## Error Response (`401`)

```json
{
  "error": "Invalid token"
}
```

---

## 9) Security Notes

Current security strengths:
- Token is verified server-side using Google library.
- Audience check is enforced via configured `CLIENT_ID`.

Current limitations:
- No server-issued session or JWT after login.
- No refresh/session persistence design.
- CORS is open by default.
- No rate limiting, CSRF strategy, or structured request validation.
- Minimal error reporting (single generic token error path).

For production hardening, prioritize:
1. Restrictive CORS policy by allowed origins.
2. Issue app session (HTTP-only secure cookie or short-lived JWT + refresh strategy).
3. Add logging and monitoring for auth failures.
4. Validate request schema before verification.
5. Use HTTPS end-to-end.

---

## 10) Known Gaps and Suggested Improvements

1. **Configuration consistency**
   - Move frontend client ID to environment variable (`VITE_GOOGLE_CLIENT_ID`).
   - Ensure same client ID value is used across frontend and backend.

2. **User experience**
   - Replace console logging with visible authenticated user UI.
   - Add loading state and readable error messages.

3. **Authentication lifecycle**
   - Add logout.
   - Add protected routes.
   - Add backend-issued session token.

4. **Data layer**
   - Persist user records (MongoDB/PostgreSQL).

5. **Testing**
   - Add backend route tests and frontend integration checks.

6. **Deployment**
   - Add environment-specific configs for dev/staging/prod.

---

## 11) Troubleshooting Guide

## Symptom: Google button renders but login fails

Checks:
- Verify frontend client ID is valid.
- Verify authorized JavaScript origin includes frontend URL.
- Verify OAuth consent/app publishing settings in Google Cloud Console.

## Symptom: Backend returns 401 Invalid token

Checks:
- Ensure frontend is sending `credentialResponse.credential`.
- Ensure backend `CLIENT_ID` matches token audience.
- Ensure token is not expired and from expected Google project.

## Symptom: CORS/network errors in browser

Checks:
- Confirm backend running on port `5000`.
- Confirm frontend calls correct backend URL.
- Configure CORS explicitly if running from non-default origins.

---

## 12) Glossary

- **OAuth 2.0**: Delegated authorization framework used by providers like Google.
- **ID Token**: Signed JWT from Google containing authenticated user identity claims.
- **Audience (`aud`)**: Token claim indicating intended recipient (must match app’s client ID).
- **CORS**: Browser policy controlling cross-origin HTTP calls.

---

## 13) Quick Reference

- Frontend login UI: `frontend/src/App.jsx`
- Frontend provider setup: `frontend/src/main.jsx`
- Backend auth endpoint: `backend/server.js`
- Root setup instructions: `README.md`

