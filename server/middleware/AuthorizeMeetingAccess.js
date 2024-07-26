const Meeting = require('../models/meeting');

const authorizeMeetingAccess = async (req, res, next) => {
    const meetingId = req.params.id;
    const userId = req.user.userId;

    try {
      const meeting = await Meeting.findById(meetingId).populate('participants').populate('createdBy');
      if (!meeting) {
        return res.status(404).json({ message: 'Meeting not found' });
      }
  
      const currentTime = new Date();

      const combinedDateTime = new Date(meeting.dateTime);

      if (currentTime < combinedDateTime ) {
        return res.status(403).json({ message: 'Meeting is not active' });
      }
  
      const isParticipant = meeting.participants.some(participant => participant._id.toString() === userId);

      console.log(isParticipant);
      console.log(meeting.createdBy._id.toString());
      if (meeting.createdBy._id.toString() === userId || isParticipant) {
        next();
      } else {
        res.status(403).json({ message: 'User is not authorized to join this meeting' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };

module.exports = authorizeMeetingAccess;