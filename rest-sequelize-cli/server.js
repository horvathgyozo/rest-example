const express = require('express');
const app = express();

app.use(express.json());

async function start() {
  app.listen(3000, () => console.log('Example app listening on port 3000!'));
}

start();