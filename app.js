const express = require('express');
const app = express();
const port = 3000;

const urlDatabase = {
  q2w3e4: 'https://www.lighthouselabs.ca',
  a1s2d3: 'https://www.google.com',
};

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/urls.json', (req, res) => {
  res.send(urlDatabase);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
