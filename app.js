// ------------ REQUIREMENTS
const express = require('express');
const cookieParser = require('cookie-parser');

const urlDatabase = {
  q2w3e4: 'https://www.lighthouselabs.ca',
  a1s2d3: 'https://www.google.com',
};

const usersDatabase = {
  o9i8u7: {
    email: 'user1@example.com',
    password: '123',
  },
  g5h6j7: {
    email: 'user2@example.com',
    password: '123',
  },
};

const generateNewId = (length = 6) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const getUserByEmail = (email) => {
  let user = null;
  for (const id in usersDatabase) {
    const usr = usersDatabase[id];
    if (usr.email === email) {
      user = usersDatabase[id];
    }
  }
  return user;
};

// ------------ SETUP AND MIDDLEWARES
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ------------ ROUTES/ENDPOINTS
// Rendering routes
// GET Homepage
app.get('/', (req, res) => {
  res.render('index');
});

// GET My URLs
app.get('/urls', (req, res) => {
  const { user } = req.cookies;
  const urls = urlDatabase;
  const templateVars = { urls, user };
  res.render('urls/index', templateVars);
});

// GET New URL
app.get('/urls/new', (req, res) => {
  const { user } = req.cookies;
  const templateVars = { user };
  res.render('urls/new', templateVars);
});

// GET Show URL
app.get('/urls/:id', (req, res) => {
  const { id } = req.params;
  const longURL = urlDatabase[id];
  const { user } = req.cookies;
  const templateVars = { id, longURL, user };
  res.render('urls/show', templateVars);
});

// GET Register
app.get('/register', (req, res) => {
  const templateVars = { user: null };
  res.render('auth/register', templateVars);
});

// GET Login
app.get('/login', (req, res) => {
  const templateVars = { user: null };
  res.render('auth/login', templateVars);
});

// URLs CRUD API routes
// Create - POST
app.post('/urls', (req, res) => {
  const { longURL } = req.body;
  const id = generateNewId();
  urlDatabase[id] = longURL;
  res.redirect('/urls');
});

// Read all - GET
app.get('/urls.json', (req, res) => {
  res.send(urlDatabase);
});

// Read one - GET
app.get('/u/:id', (req, res) => {
  const { id } = req.params;
  const longURL = urlDatabase[id];
  res.redirect(longURL);
});

// Update - POST
app.post('/urls/:id/edit', (req, res) => {
  const { longURL } = req.body;
  const { id } = req.params;
  urlDatabase[id] = longURL;
  res.redirect('/urls');
});

// Delete - POST
app.post('/urls/:id/delete', (req, res) => {
  const { id } = req.params;
  delete urlDatabase[id];
  res.redirect('/urls');
});

// Auth API routes
// Register
app.post('/register', (req, res) => {
  const { email, password } = req.body;

  let user = getUserByEmail(email);
  if (user) {
    return res.send('User already exists!');
  }

  const id = generateNewId();
  usersDatabase[id] = { email, password };
  res.redirect('/login');
});

// Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = getUserByEmail(email);
  if (!user) {
    return res.send('User not found!');
  }

  if (user.password !== password) {
    return res.send('Incorrect password');
  }

  res.cookie('user', user.email);
  res.redirect('/urls');
});

// Logout
app.post('/logout', (req, res) => {
  res.clearCookie('user');
  res.redirect('/urls');
});

// ------------ LISTENER
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
