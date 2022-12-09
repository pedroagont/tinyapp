const express = require('express');
const app = express();
const port = 3000;

const urlDatabase = {
  q2w3e4: 'https://www.lighthouselabs.ca',
  a1s2d3: 'https://www.google.com',
};

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/hello', (req, res) => {
  res.send('<h1>Hello from /hello !</h1>');
});

app.get('/urls.json', (req, res) => {
  res.send(urlDatabase);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
