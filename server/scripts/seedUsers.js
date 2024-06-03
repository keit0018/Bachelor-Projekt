const mongoose = require('mongoose');
const User = require('../models/user');
const config = require('../config'); // Adjust the path as needed

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
      const newUser = new User(user);
      await newUser.save();
      console.log(`User ${user.username} created with hashed password: ${newUser.password}`);
    }
    console.log('Users seeded successfully');
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedUsers();