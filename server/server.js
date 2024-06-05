const express = require('express');
const { createUserAndToken } = require('./acs');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const config = require('./config');
const bodyParser = require('body-parser');
const meetingRoutes = require('./routes/meetingRoutes');
require('dotenv').config();

//creating express server
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

//middleware 
app.use(bodyParser.json());
app.use(cors());

//connecting to azure communication services video
app.get('/acs/token', async (req, res) => {
  try {
    const tokenData = await createUserAndToken();
    res.json(tokenData);
  } catch (err) {
    console.error('Error creating ACS token:', err);
    res.status(500).send('Internal Server Error');
  }
});

//connecting to database
mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

//after connecting use this. 
app.use('/api/users', userRoutes);
app.use('/api/meetings', meetingRoutes);


//confirmation that server is running
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});