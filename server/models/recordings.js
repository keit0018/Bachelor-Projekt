const mongoose = require('mongoose');

const recordingSchema = new mongoose.Schema({
  meetingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Meeting'},
  recordingurl: { type: String},
  recordingId:{type: String},
  createdby:{ type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  endTime: {type: String},
});

const Recording = mongoose.model('Recording', recordingSchema);

module.exports = Recording;