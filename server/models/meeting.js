const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  groupId: { type: String, required: true, unique: true},
});

const Meeting = mongoose.model('Meeting', meetingSchema);

module.exports = Meeting;