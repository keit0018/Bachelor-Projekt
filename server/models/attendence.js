const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  meetingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Meeting', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  attended: { type: Boolean, default: false },
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;