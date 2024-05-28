const express = require('express');
const { queryDatabase } = require('./db');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/query', async (req, res) => {
  try {
    const result = await queryDatabase();
    res.json(result);
  } catch (err) {
    console.error('Error querying database:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});