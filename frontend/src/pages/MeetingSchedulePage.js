import React, { useState } from 'react';

import '../assets/styles/Meetingschedule.css';



const MeetingSchedulePage = () => {
    const [meetingData, setMeetingData] = useState({
      title: '',
      date: '',
      time: '',
      participants: '',
    });
  
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setMeetingData({
        ...meetingData,
        [name]: type === 'checkbox' ? checked : value
      });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      // Handle form submission logic here, e.g., call backend API
      console.log(meetingData);
    };
  
    return (
      <div className="meeting-schedule-container">
        <h2>Schedule a Meeting</h2>
        <form className="meeting-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Meeting Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={meetingData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={meetingData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="time">Time</label>
            <input
              type="time"
              id="time"
              name="time"
              value={meetingData.time}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="participants">Participants</label>
            <input
              type="text"
              id="participants"
              name="participants"
              value={meetingData.participants}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Schedule Meeting</button>
        </form>
      </div>
    );
  };
  
  export default MeetingSchedulePage;