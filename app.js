// ------------ REQUIREMENTS
const express = require('express');
const bcrypt = require('bcryptjs');
const cookieSession = require('cookie-session');
const morgan = require('morgan');

const { generateNewId, getUserByEmail, getUrlsByUserId } = require('./utils');
const db = require('./db');

// ------------ SETUP AND MIDDLEWARES
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: 'session',
    keys: ['mySecretKey1', 'mySuperSecretKey2'],

    // Cookie Options
    // maxAge: 24 * 60 * 60 * 1000 // 24 hours
    maxAge: 10 * 60 * 1000, // 10 min
  })
);
app.use(morgan('dev'));

// ------------ ROUTES/ENDPOINTS
// Rendering routes
// GET Homepage
app.get('/', (req, res) => {
  res.render('index');
});

// GET My URLs
app.get('/urls', (req, res) => {
  const { userId } = req.session;
  if (!userId) {
    const templateVars = {
      error: 'User is not logged in!',
      user: null,
    };
    return res.render('error', templateVars);
  }

  const user = db['users'][userId];
  if (!user) {
    const templateVars = {
      error: 'Invalid user!',
      user: null,
    };
    req.session = null;
    return res.render('error', templateVars);
  }

  const urls = getUrlsByUserId(user.id, db['urls']);
  const templateVars = { urls, user };
  res.render('urls/index', templateVars);
});

// GET New URL
app.get('/urls/new', (req, res) => {
  const { userId } = req.session;
  if (!userId) {
    const templateVars = {
      error: 'User is not logged in!',
      user: null,
    };
    return res.render('error', templateVars);
  }

  const user = db['users'][userId];
  if (!user) {
    const templateVars = {
      error: 'Invalid user!',
      user: null,
    };
    req.session = null;
    return res.render('error', templateVars);
  }

  const templateVars = { user };
  res.render('urls/new', templateVars);
});

// GET Show URL
app.get('/urls/:id', (req, res) => {
  const { userId } = req.session;
  if (!userId) {
    const templateVars = {
      error: 'User is not logged in!',
      user: null,
    };
    return res.render('error', templateVars);
  }

  const user = db['users'][userId];
  if (!user) {
    const templateVars = {
      error: 'Invalid user!',
      user: null,
    };
    req.session = null;
    return res.render('error', templateVars);
  }

  const url = db['urls'][req.params.id];
  if (!url) {
    const templateVars = {
      error: 'This URL does not exist!',
      user: user,
    };
    return res.render('error', templateVars);
  }

  const urlBelongsToUser = url.userId === userId;
  if (!urlBelongsToUser) {
    const templateVars = {
      error: 'This URL does not belong to the current user!',
      user,
    };
    return res.render('error', templateVars);
  }

  const templateVars = { url, user };
  res.render('urls/show', templateVars);
});

// GET Register
app.get('/register', (req, res) => {
  const { userId } = req.session;
  if (userId) {
    return res.redirect('/urls');
  }

  const templateVars = { user: null };
  res.render('auth/register', templateVars);
});

// GET Login
app.get('/login', (req, res) => {
  const { userId } = req.session;
  if (userId) {
    return res.redirect('/urls');
  }

  const templateVars = { user: null };
  res.render('auth/login', templateVars);
});

// URLs CRUD API routes
// Create - POST
app.post('/urls', (req, res) => {
  const { userId } = req.session;
  if (!userId) {
    const templateVars = {
      error: 'User is not logged in!',
      user: null,
    };
    return res.render('error', templateVars);
  }

  const user = db['users'][userId];
  if (!user) {
    const templateVars = {
      error: 'Invalid user!',
      user: null,
    };
    req.session = null;
    return res.render('error', templateVars);
  }

  const { longURL } = req.body;
  if (!longURL) {
    const templateVars = {
      error: 'Please provide longURL!',
      user,
    };
    return res.render('error', templateVars);
  }

  const validLongURL = longURL.startsWith('http');
  if (!validLongURL) {
    const templateVars = {
      error: 'URL should start with "http"!',
      user,
    };
    return res.render('error', templateVars);
  }

  const id = generateNewId();
  db['urls'][id] = { id, longURL, userId };
  res.redirect('/urls');
});

// Read all - GET
app.get('/urls.json', (req, res) => {
  res.send(db['urls']);
});

// Read one - GET
app.get('/u/:id', (req, res) => {
  const url = db['urls'][req.params.id];
  if (!url) {
    const templateVars = {
      error: 'This URL does not exist!',
      user: null,
    };
    return res.render('error', templateVars);
  }

  res.redirect(url.longURL);
});

// Update - POST
app.post('/urls/:id/edit', (req, res) => {
  const { userId } = req.session;
  if (!userId) {
    const templateVars = {
      error: 'User is not logged in!',
      user: null,
    };
    return res.render('error', templateVars);
  }

  const user = db['users'][userId];
  if (!user) {
    const templateVars = {
      error: 'Invalid user!',
      user: null,
    };
    req.session = null;
    return res.render('error', templateVars);
  }

  const url = db['urls'][req.params.id];
  if (!url) {
    const templateVars = {
      error: 'This URL does not exist!',
      user,
    };
    return res.render('error', templateVars);
  }

  const urlBelongsToUser = url.userId === userId;
  if (!urlBelongsToUser) {
    const templateVars = {
      error: 'This URL does not belong to the current user!',
      user,
    };
    return res.render('error', templateVars);
  }

  const { longURL } = req.body;
  if (!longURL) {
    const templateVars = {
      error: 'Please provide longURL!',
      user,
    };
    return res.render('error', templateVars);
  }

  const validLongURL = longURL.startsWith('http');
  if (!validLongURL) {
    const templateVars = {
      error: 'URL should start with "http"!',
      user,
    };
    return res.render('error', templateVars);
  }

  db['urls'][req.params.id].longURL = longURL;
  res.redirect('/urls');
});

// Delete - POST
app.post('/urls/:id/delete', (req, res) => {
  const { userId } = req.session;
  if (!userId) {
    const templateVars = {
      error: 'User is not logged in!',
      user: null,
    };
    return res.render('error', templateVars);
  }

  const user = db['users'][userId];
  if (!user) {
    const templateVars = {
      error: 'Invalid user!',
      user: null,
    };
    req.session = null;
    return res.render('error', templateVars);
  }

  const url = db['urls'][req.params.id];
  if (!url) {
    const templateVars = {
      error: 'This URL does not exist!',
      user,
    };
    return res.render('error', templateVars);
  }

  const urlBelongsToUser = url.userId === userId;
  if (!urlBelongsToUser) {
    const templateVars = {
      error: 'This URL does not belong to the current user!',
      user,
    };
    return res.render('error', templateVars);
  }

  delete db['urls'][req.params.id];
  res.redirect('/urls');
});

// Auth API routes
// Register
app.post('/register', (req, res) => {
  const { userId } = req.session;
  if (userId) {
    const templateVars = {
      error: 'User is already logged in!',
      user: db['users'][userId],
    };
    return res.render('error', templateVars);
  }

  let { email, password } = req.body;
  if (!email || !password) {
    const templateVars = {
      error: 'Please provide email and password!',
      user: null,
    };
    return res.render('error', templateVars);
  }

  const emailExists = getUserByEmail(email, db['users']);
  if (emailExists) {
    const templateVars = {
      error: 'This email is already registered!',
      user: null,
    };
    return res.render('error', templateVars);
  }

  const id = generateNewId();
  password = bcrypt.hashSync(password, 10);
  db['users'][id] = { id, email, password };

  req.session.userId = db['users'][id].id;
  res.redirect('/');
});

// Login
app.post('/login', (req, res) => {
  const { userId } = req.session;
  if (userId) {
    const templateVars = {
      error: 'User is already logged in!',
      user: db['users'][userId],
    };
    return res.render('error', templateVars);
  }

  const { email, password } = req.body;
  if (!email || !password) {
    const templateVars = {
      error: 'Please provide email and password!',
      user: null,
    };
    return res.render('error', templateVars);
  }

  const user = getUserByEmail(email, db['users']);
  if (!user) {
    const templateVars = {
      error: 'This user does not exist!',
      user: null,
    };
    return res.render('error', templateVars);
  }

  const passwordsMatch = bcrypt.compareSync(password, user.password);
  if (!passwordsMatch) {
    const templateVars = {
      error: 'Incorrect password!',
      user: null,
    };
    return res.render('error', templateVars);
  }

  req.session.userId = user.id;
  res.redirect('/');
});

// Logout
app.post('/logout', (req, res) => {
  const { userId } = req.session;
  if (!userId) {
    const templateVars = {
      error: 'User is not logged in!',
      user: null,
    };
    return res.render('error', templateVars);
  }

  req.session = null;
  res.redirect('/login');
});

// ------------ LISTENER
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
