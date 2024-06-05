const Meeting = require('../models/meeting');

exports.createMeeting = async (req, res) => {
    try {
        if (req.user.role === 'patient') {
          return res.status(403).json({ message: 'Forbidden: Insufficient role' });
        }
        const meeting = new Meeting({
          ...req.body,
          createdBy: req.user._id
        });
        await meeting.save();
        res.status(201).json(meeting);
    } catch (error) {
    res.status(500).json({ message: 'Server error', error });
    }
};

exports.getCreatedMeetings = async (req, res) => {
    try {
        if (req.user.role === 'patient') {
          return res.status(403).json({ message: 'Forbidden: Insufficient role' });
        }
        const meetings = await Meeting.find({ createdBy: req.user._id }).populate('participants', 'username');
        res.status(200).json(meetings);
    } catch (error) {
    res.status(500).json({ message: 'Server error', error });
    }
};
  
  // Get meetings the authenticated user is participating in
exports.getParticipatingMeetings = async (req, res) => {
try {
    const userId = req.user._id;
    const meetings = await Meeting.find({ participants: userId }).populate('participants', 'username');
    res.status(200).json(meetings);
} catch (error) {
    res.status(500).json({ error: error.message });
}
};


exports.updateMeeting = async (req, res) => {
    try {
        if (req.user.role === 'patient') {
          return res.status(403).json({ message: 'Forbidden: Insufficient role' });
        }
        const updatedMeeting = await Meeting.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedMeeting);
      } catch (error) {
        res.status(500).json({ message: 'Server error', error });
      }
};

exports.deleteMeeting = async (req, res) => {
    try {
        if (req.user.role === 'patient') {
          return res.status(403).json({ message: 'Forbidden: Insufficient role' });
        }
        await Meeting.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Meeting deleted successfully' });
    } catch (error) {
    res.status(500).json({ message: 'Server error', error });
    }
};