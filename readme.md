# 🔐 Google Login App (Full Stack)

## 📌 Overview

This project demonstrates how to implement **"Login with Google" authentication** using a full-stack approach.

It uses:

* **Frontend:** React (Vite)
* **Backend:** Node.js (Express)
* **Authentication:** Google OAuth 2.0

The app allows users to securely log in using their Google account without needing to create a separate username and password.

---

## 🚀 Features

* ✅ Google Sign-In integration
* ✅ Secure token verification on backend
* ✅ User profile data retrieval (name, email, picture)
* ✅ Simple and clean UI
* ✅ Full-stack authentication flow

---

## 🧠 How It Works

1. User clicks **Login with Google**
2. Google authentication popup appears
3. User selects account and logs in
4. Google returns an **ID Token**
5. Frontend sends token to backend
6. Backend verifies token using Google API
7. User data is returned and login is successful

---

## 🏗️ Project Structure

```
google-login-app/
│
├── backend/
│   ├── server.js
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── assets/
│   ├── index.html
│   └── package.json
```

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the Repository

```bash
git clone <your-repo-url>
cd google-login-app
```

---

### 2️⃣ Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```
CLIENT_ID=your_google_client_id
```

Start backend:

```bash
node server.js
```

---

### 3️⃣ Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Google OAuth Setup

1. Go to: https://console.cloud.google.com
2. Create a new project
3. Configure OAuth consent screen
4. Create OAuth Client ID
5. Add authorized origin:

   ```
   http://localhost:5173
   ```
6. Copy your **Client ID**

---

## 💻 Implementation Details

### 🔹 Frontend

* Uses `@react-oauth/google`
* Displays Google login button
* Sends token to backend

```javascript
<GoogleLogin
  onSuccess={(credentialResponse) => {
    // send token to backend
  }}
/>
```

---

### 🔹 Backend

* Uses `google-auth-library`
* Verifies Google ID token
* Extracts user data

```javascript
const ticket = await client.verifyIdToken({
  idToken: token,
  audience: CLIENT_ID,
});
```

---

## 🔐 Security Considerations

* Always verify token on backend
* Never trust frontend authentication alone
* Use HTTPS in production
* Store minimal user data
* Implement proper session management (JWT/cookies)

---

## 📊 Sample Response

```json
{
  "user": {
    "name": "John Doe",
    "email": "john@gmail.com",
    "picture": "https://..."
  }
}
```

---

## 🚀 Future Improvements

* 🔑 JWT-based authentication
* 🗄️ Database integration (MongoDB)
* 🔒 Protected routes
* 🚪 Logout functionality
* 🌐 Deployment (Vercel + Render)

---

## 📚 Technologies Used

* React (Vite)
* Node.js
* Express
* Google OAuth 2.0
* Axios

---

## 🎯 Conclusion

This project demonstrates a secure and scalable way to implement **Google authentication** in modern web applications using a full-stack approach.

---

## 👨‍💻 Author

Mrinal Bhatt

---
