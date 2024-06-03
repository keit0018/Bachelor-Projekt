const Meeting = require('../models/meeting');

exports.createMeeting = async (req, res) => {
  try {
    const { title, date, time, participants } = req.body;
    const createdBy = req.userId; // Assuming userId is available in the request

    const newMeeting = new Meeting({ title, date, time, participants, createdBy });
    await newMeeting.save();

    res.status(201).json({ message: 'Meeting created', meeting: newMeeting });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find().populate('createdBy', 'username');
    res.status(200).json(meetings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};