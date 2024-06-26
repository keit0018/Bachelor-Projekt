const Attendance = require('../models/attendence');

const markAttendance = async (req, res) => {
  const { meetingId } = req.body;
  const userId = req.user.userId;
  try {

    const attendanceRecord = await Attendance.findOne({ meetingId, userId });

    if (!attendanceRecord) {
      return res.status(404).json({ message: 'Attendance record not found.' });
    }

    attendanceRecord.attended = true;
    await attendanceRecord.save();

    res.status(200).json({ message: 'Attendance marked successfully.' });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ message: 'Failed to mark attendance.', error });
  }
};

module.exports = {
  markAttendance,
};

