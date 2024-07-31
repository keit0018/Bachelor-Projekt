const Meeting = require('../models/meeting');
const { v4: uuidv4 } = require('uuid');
const Attendance = require('../models/attendence');

exports.createMeeting = async (req, res) => {
    try {
        const { title, dateTime, participants } = req.body;
        const createdBy = req.user.userId;
        const groupId = uuidv4();
        const meeting = new Meeting({
        title,
        dateTime,
        participants,
        groupId,
        createdBy
        });

        const savedMeeting = await meeting.save();

        const attendanceRecord = new Attendance({
            meetingId: savedMeeting._id,
            userId: createdBy,
            attended: false,
        });
      
        await attendanceRecord.save();

        res.status(201).json(savedMeeting);
    } catch (error) {
    res.status(500).json({ message: 'Server error', error });
    }
};

exports.getCreatedMeetings = async (req, res) => {
    try {
        const meetings = await Meeting.find({ createdBy: req.user.userId }).populate('participants', 'username');
        res.status(200).json(meetings);
    } catch (error) {
    res.status(500).json({ message: 'Server error', error });
    }
};
  
  // Get meetings the authenticated user is participating in
exports.getParticipatingMeetings = async (req, res) => {
try {
    const userId = req.user.userId;
    const meetings = await Meeting.find({
        $or: [
          { createdBy: userId },
          { participants: userId }
        ]
    }).populate('participants', 'username').populate('createdBy', 'username');
    res.status(200).json(meetings);
} catch (error) {
    res.status(500).json({ error: error.message });
}
};

exports.getUnattendedMeetings = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Find all meetings where the user is a participant or the creator
        const meetings = await Meeting.find({
            $or: [
                { createdBy: userId },
                { participants: userId }
            ]
        });

        // Prepare an array to store meetings that are unattended by the creator
        let unattendedMeetings = [];

        for (const meeting of meetings) {
            // Check if the user is the creator or a participant
            const creatorId = meeting.createdBy.toString();

            // Check attendance for the creator
            const attendance = await Attendance.findOne({
                meetingId: meeting._id,
                userId: creatorId,
                attended: false
            });

            // If the attendance record exists and is unattended, add to unattendedMeetings
            if (attendance) {
                unattendedMeetings.push(meeting);
            }
        }

        // Populate the unattended meetings with participants and createdBy
        const populatedMeetings = await Meeting.populate(unattendedMeetings, [
            { path: 'participants', select: 'username' },
            { path: 'createdBy', select: 'username' }
        ]);

        res.status(200).json(populatedMeetings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.updateMeeting = async (req, res) => {
    try {
        const { title, dateTime, participants } = req.body;
        const meetingId = req.params.id;
        const meeting = await Meeting.findById(meetingId);
        
        if (!meeting) {
        return res.status(404).json({ message: 'Meeting not found' });
        }

        // Check if the user is allowed to update this meeting
        if (meeting.createdBy.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'User not authorized to update this meeting' });
        }

        const updatedMeeting = await Meeting.findByIdAndUpdate(meetingId, {
            title,
            dateTime,
            participants
        }, { new: true });

        if (!updatedMeeting) {
        return res.status(404).json({ message: 'Meeting not found' });
        }

        res.status(200).json(updatedMeeting);
      } catch (error) {
        res.status(500).json({ message: 'Server error', error });
      }
};

exports.deleteMeeting = async (req, res) => {
    try {
        await Meeting.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Meeting deleted successfully' });
    } catch (error) {
    res.status(500).json({ message: 'Server error', error });
    }
};

exports.getMeetingById = async (req, res) => {
    try {
        const meetingId = req.params.id;

        if (!meetingId) {
            return res.status(400).json({ message: 'Meeting ID is required' });
        }

        const meeting = await Meeting.findById(meetingId).populate('participants').populate('createdBy');

        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found' });
        }

        res.json(meeting);
    } catch (error) {
      console.error('Error fetching meeting:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
};