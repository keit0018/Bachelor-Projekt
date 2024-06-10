const mongoose = require('mongoose');
const User = require('../models/user');
const config = require('../config/config'); // Adjust the path as needed
const { CommunicationIdentityClient } = require('@azure/communication-identity');

const connectionString = config.acsConnectionString;
console.log(connectionString);
const identityClient = new CommunicationIdentityClient(connectionString);


const users = [
  { username: 'admin', password: 'password1', role: 'worker' },
  { username: 'user2', password: 'password2', role: 'patient' },
  { username: 'user3', password: 'password3', role: 'patient' }
];

const seedUsers = async () => {
  await mongoose.connect(config.mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  try {
    await User.deleteMany({});
    console.log('Existing users removed');

    for (let user of users) {
      const communicationUser = await identityClient.createUser();
      const communicationUserId = communicationUser.communicationUserId;

      // Create a new user with the communication user ID
      const newUser = new User({
        ...user,
        communicationUserId: communicationUserId
      });

      await newUser.save();
      console.log(`User ${user.username} created with communicationUserId: ${newUser.communicationUserId}`);
    }
    console.log('Users seeded successfully');
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedUsers();