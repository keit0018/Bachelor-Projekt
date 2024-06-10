const express = require('express');
const { createUserAndToken } = require('./acs');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const config = require('./config/config');
const bodyParser = require('body-parser');
const meetingRoutes = require('./routes/meetingRoutes');
const communicationRoutes = require('./routes/communicationRoutes');
require('dotenv').config();

//creating express server
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

//middleware 
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL
  credentials: true, // Allow cookies to be sent with the requests
}));

app.use(bodyParser.json());


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

//after connecting use this. 
app.use('/api/users', userRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/communication', communicationRoutes);


//confirmation that server is running
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});