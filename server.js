const express = require('express');
const path = require('path');
const fs = require('fs');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Create static directory for HTML files
const staticDir = path.join(__dirname, 'static');
if (!fs.existsSync(staticDir)) {
  fs.mkdirSync(staticDir, { recursive: true });
}

// Set up static files serving
app.use(express.static(staticDir));

// Routes for HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(staticDir, 'login.html'));
});

app.get('/result', (req, res) => {
  res.sendFile(path.join(staticDir, 'direct-result.html'));
});

// API endpoint for login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  console.log('Received login request:', { username, password: '********' });

  // Validate form data
  if (!username || !password) {
    console.log('Login validation failed: missing username or password');
    return res.status(400).json({
      success: false,
      message: 'Username and password are required',
    });
  }

  // In a real app, check credentials against a database
  console.log('Login successful for user:', username);
  res.status(200).json({
    success: true,
    user: {
      username,
      passwordLength: password.length,
    },
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});