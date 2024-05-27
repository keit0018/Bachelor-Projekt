import React, { useState } from 'react';
import '../assets/styles/EditMeetingsForm.css';

const EditMeetingForm = ({ meeting, onSave, onCancel }) => {
  const [title, setTitle] = useState(meeting.title);
  const [date, setDate] = useState(meeting.date);
  const [time, setTime] = useState(meeting.time);
  const [participants, setParticipants] = useState(meeting.participants.join(', '));

  const handleSave = async (e) => {
    e.preventDefault();
    const updatedMeeting = {
      ...meeting,
      title,
      date,
      time,
      participants: participants.split(',').map(participant => participant.trim()),
    };
    
    // Call the API to save the updated meeting details
    await fakeApiUpdateCall(updatedMeeting);
    
    onSave();
  };

  return (
    <div className="edit-meeting-form">
      <h3>Edit Meeting</h3>
      <form onSubmit={handleSave}>
        <div className="form-group">
          <label htmlFor="title">Meeting Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="time">Time</label>
          <input
            type="time"
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="participants">Participants</label>
          <input
            type="text"
            id="participants"
            value={participants}
            onChange={(e) => setParticipants(e.target.value)}
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit">Save</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

// Dummy API call function
const fakeApiUpdateCall = async (updatedMeeting) => {
  // Simulate an API call
  return new Promise(resolve => setTimeout(() => resolve(updatedMeeting), 1000));
};

export default EditMeetingForm;