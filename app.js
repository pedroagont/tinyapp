// ------------ REQUIREMENTS
const express = require('express');

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

const urlDatabase = {
  q2w3e4: 'https://www.lighthouselabs.ca',
  a1s2d3: 'https://www.google.com',
};

// ------------ SETUP AND MIDDLEWARES
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// ------------ ROUTES/ENDPOINTS
// Rendering routes
// GET Homepage
app.get('/', (req, res) => {
  res.render('index');
});

// GET My URLs
app.get('/urls', (req, res) => {
  const templateVars = {
    urls: urlDatabase,
  };
  res.render('urls/index', templateVars);
});

// GET New URL
app.get('/urls/new', (req, res) => {
  res.render('urls/new');
});

// GET Show URL
app.get('/urls/:id', (req, res) => {
  const { id } = req.params;
  const longURL = urlDatabase[id];
  const templateVars = { id, longURL };
  res.render('urls/show', templateVars);
});

// URLs CRUD API routes
// Create - POST
app.post('/urls', (req, res) => {
  const { longURL } = req.body;
  const id = generateNewId();
  urlDatabase[id] = longURL;
  console.log(urlDatabase);
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
  console.log(urlDatabase);
  res.redirect('/urls');
});

// Delete - POST
app.post('/urls/:id/delete', (req, res) => {
  const { id } = req.params;
  delete urlDatabase[id];
  console.log(urlDatabase);
  res.redirect('/urls');
});

// ------------ LISTENER
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
