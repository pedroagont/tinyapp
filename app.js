// ------------ REQUIREMENTS
const express = require('express');

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
  const id = Math.ceil(Math.random() * 100);
  urlDatabase[id] = longURL;
  console.log(urlDatabase);
  res.redirect('/urls');
});

// Read all - GET
app.get('/urls.json', (req, res) => {
  res.send(urlDatabase);
});

// ------------ LISTENER
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
