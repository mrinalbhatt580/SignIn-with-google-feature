const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { OAuth2Client } = require('google-auth-library');

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:5173', // your frontend URL (Vite default)
    credentials: true,
  })
);

// ✅ Google OAuth client
const client = new OAuth2Client(process.env.CLIENT_ID);

// ✅ Route
app.post('/auth/google', async (req, res) => {
  const { token } = req.body;

  // 🔒 Basic validation
  if (!token) {
    return res.status(400).json({ error: 'Token missing' });
  }

  try {
    // ✅ Verify ID token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    // 🔒 Extra security check
    if (payload.aud !== process.env.CLIENT_ID) {
      return res.status(403).json({ error: 'Invalid audience' });
    }

    // ✅ Extract user data
    const user = {
      googleId: payload.sub,
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
    };

    // 🔥 (Future) Save user to DB here

    res.status(200).json({
      message: 'Login successful',
      user,
    });

  } catch (error) {
    console.error('Auth Error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// ✅ Health check route (optional but useful)
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ✅ Server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});