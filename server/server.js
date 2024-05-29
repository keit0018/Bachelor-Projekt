const express = require('express');
const connectToDatabase = require('./db');
const { createUserAndToken } = require('./acs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/acs/token', async (req, res) => {
  try {
    const tokenData = await createUserAndToken();
    res.json(tokenData);
  } catch (err) {
    console.error('Error creating ACS token:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/data', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('your_collection');
    const data = await collection.find({}).toArray();
    res.json(data);
  } catch (err) {
    console.error('Error querying database:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});