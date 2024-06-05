const Meeting = require('../models/meeting');

exports.createMeeting = async (req, res) => {
    try {
        const { title, date, time, participants } = req.body;
        const createdBy = req.user.userId;
        const meeting = new Meeting({
        title,
        date,
        time,
        participants,
        createdBy
        });

        await meeting.save();
        res.status(201).json(meeting);
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
    console.log(meetings);
    res.status(200).json(meetings);
} catch (error) {
    res.status(500).json({ error: error.message });
}
};


exports.updateMeeting = async (req, res) => {
    try {
        const { title, date, time, participants } = req.body;
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
            date,
            time,
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