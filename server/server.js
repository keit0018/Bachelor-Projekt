const express = require('express');
const { createUserAndToken } = require('./acs');
const mongoose = require('mongoose');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const config = require('./config/config');
const bodyParser = require('body-parser');
const meetingRoutes = require('./routes/meetingRoutes');
const communicationRoutes = require('./routes/communicationRoutes');
const attendenceRoutes = require('./routes/attendenceRoutes');
const recordingRoutes = require('./routes/recordingRoutes');
const logAction = require('./middleware/logAction');
require('dotenv').config();

//creating express server
const app = express();
const port = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL;
app.use(express.json());

//middleware 
app.use(cors({
  origin: `${FRONTEND_URL}`, 
  credentials: true, 
}));

app.use(bodyParser.json());
app.use(logAction);

app.get('/set-cookie', (req, res) => {
  res.cookie('myCookie', 'cookieValue', {
    sameSite: 'None',   
    secure: true,
    httpOnly: true,
  });
  res.send('Cookie is set');
});

//connecting to database
mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

//Routes. 
app.use('/api/users', userRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/communication', communicationRoutes);
app.use('/api/attendance', attendenceRoutes);
app.use('/api/recordings', recordingRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});