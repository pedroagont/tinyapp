// ------------ REQUIREMENTS
const express = require('express');
const cookieParser = require('cookie-parser');

const urlDatabase = {
  q2w3e4: {
    id: 'q2w3e4',
    longURL: 'https://www.lighthouselabs.ca',
    userId: 'o9i8u7',
  },
  a1s2d3: {
    id: 'a1s2d3',
    longURL: 'https://www.google.com',
    userId: 'g5h6j7',
  },
};

const usersDatabase = {
  o9i8u7: {
    id: 'o9i8u7',
    email: 'user1@example.com',
    password: '123',
  },
  g5h6j7: {
    id: 'g5h6j7',
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

const getUrlsByUserId = (userId) => {
  const urls = {};
  for (const id in urlDatabase) {
    const u = urlDatabase[id];
    if (u.userId === userId) {
      urls[id] = urlDatabase[id];
    }
  }
  return urls;
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
  const { userId } = req.cookies;
  if (!userId) {
    return res.redirect('/login');
  }

  const user = usersDatabase[userId];
  if (!user) {
    return res.send('Invalid user');
  }

  const urls = getUrlsByUserId(user.id);
  const templateVars = { urls, user };
  res.render('urls/index', templateVars);
});

// GET New URL
app.get('/urls/new', (req, res) => {
  const { userId } = req.cookies;
  if (!userId) {
    return res.redirect('/login');
  }

  const user = usersDatabase[userId];
  if (!user) {
    return res.send('Invalid user');
  }

  const templateVars = { user };
  res.render('urls/new', templateVars);
});

// GET Show URL
app.get('/urls/:id', (req, res) => {
  const { userId } = req.cookies;
  if (!userId) {
    return res.redirect('/login');
  }

  const user = usersDatabase[userId];
  if (!user) {
    return res.send('Invalid user');
  }

  const { id } = req.params;
  const url = urlDatabase[id];

  const templateVars = { id, url, user };
  res.render('urls/show', templateVars);
});

// GET Register
app.get('/register', (req, res) => {
  const { userId } = req.cookies;
  if (userId) {
    return res.redirect('/urls');
  }

  const templateVars = { user: null };
  res.render('auth/register', templateVars);
});

// GET Login
app.get('/login', (req, res) => {
  const { userId } = req.cookies;
  if (userId) {
    return res.redirect('/urls');
  }

  const templateVars = { user: null };
  res.render('auth/login', templateVars);
});

// URLs CRUD API routes
// Create - POST
app.post('/urls', (req, res) => {
  const { userId } = req.cookies;
  if (!userId) {
    return res.send('User is not logged in!');
  }

  const user = usersDatabase[userId];
  if (!user) {
    return res.send('Invalid user');
  }

  const { longURL } = req.body;
  const id = generateNewId();
  urlDatabase[id] = { id, longURL, userId };
  res.redirect('/urls');
});

// Read all - GET
app.get('/urls.json', (req, res) => {
  res.send(urlDatabase);
});

// Read one - GET
app.get('/u/:id', (req, res) => {
  const { id } = req.params;
  const url = urlDatabase[id];
  if (!url) {
    return;
  }
  res.redirect(url.longURL);
});

// Update - POST
app.post('/urls/:id/edit', (req, res) => {
  const { userId } = req.cookies;
  if (!userId) {
    return res.send('User is not logged in!');
  }

  const user = usersDatabase[userId];
  if (!user) {
    return res.send('Invalid user');
  }

  const { longURL } = req.body;
  const { id } = req.params;
  urlDatabase[id].longURL = longURL;
  res.redirect('/urls');
});

// Delete - POST
app.post('/urls/:id/delete', (req, res) => {
  const { userId } = req.cookies;
  if (!userId) {
    return res.send('User is not logged in!');
  }

  const user = usersDatabase[userId];
  if (!user) {
    return res.send('Invalid user');
  }

  const { id } = req.params;
  delete urlDatabase[id];
  res.redirect('/urls');
});

// Auth API routes
// Register
app.post('/register', (req, res) => {
  const { userId } = req.cookies;
  if (userId) {
    return res.send('User is already logged in!');
  }

  const { email, password } = req.body;

  let emailExists = getUserByEmail(email);
  if (emailExists) {
    return res.send('User already exists!');
  }

  const id = generateNewId();
  usersDatabase[id] = { id, email, password };
  res.redirect('/login');
});

// Login
app.post('/login', (req, res) => {
  const { userId } = req.cookies;
  if (userId) {
    return res.send('User is already logged in!');
  }

  const { email, password } = req.body;

  const user = getUserByEmail(email);
  if (!user) {
    return res.send('User not found!');
  }

  if (user.password !== password) {
    return res.send('Incorrect password');
  }

  res.cookie('userId', user.id);
  res.redirect('/urls');
});

// Logout
app.post('/logout', (req, res) => {
  const { userId } = req.cookies;
  if (!userId) {
    return res.send('User is not logged in!');
  }

  res.clearCookie('userId');
  res.redirect('/urls');
});

// ------------ LISTENER
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
