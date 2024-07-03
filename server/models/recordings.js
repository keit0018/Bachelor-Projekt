const mongoose = require('mongoose');

const recordingSchema = new mongoose.Schema({
  meetingId: String,
  recordingUrl: String,
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startTime: Date,
  endTime: Date
});

const Recording = mongoose.model('Recording', recordingSchema);

module.exports = Recording;