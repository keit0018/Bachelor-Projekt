import React, { useState, useEffect  } from 'react';
import axios from 'axios';
import '../assets/styles/Meetingschedule.css';

const MeetingSchedulePage = () => {
  const [meetingData, setMeetingData] = useState({
    title: '',
    date: '',
    time: '',
    participants: [],
  });

  const [participantSearch, setParticipantSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (participantSearch.length > 0) {
      const fetchSearchResults = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:5000/api/users/search?query=${participantSearch}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setSearchResults(response.data);
        } catch (error) {
          console.error('Error searching participants:', error);
        }
      };

      fetchSearchResults();
    } else {
      setSearchResults([]);
    }
  }, [participantSearch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMeetingData({
      ...meetingData,
      [name]: value,
    });
  };

  const handleParticipantSearchChange = (e) => {
    setParticipantSearch(e.target.value);
  };

  const addParticipant = (participant) => {
    setMeetingData((prevMeetingData) => ({
      ...prevMeetingData,
      participants: [...prevMeetingData.participants, participant],
    }));
    setParticipantSearch('');
    setSearchResults([]);
  };

  const removeParticipant = (participant) => {
    setMeetingData((prevMeetingData) => ({
      ...prevMeetingData,
      participants: prevMeetingData.participants.filter(p => p._id !== participant._id),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const userId = JSON.parse(atob(token.split('.')[1]))._id; // Decode the token to get the user ID

      await axios.post('http://localhost:5000/api/meetings', {
        ...meetingData,
        createdBy: userId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert('Meeting scheduled successfully');
      setMeetingData({
        title: '',
        date: '',
        time: '',
        participants: [],
      });
    } catch (error) {
      console.error('Error scheduling meeting:', error);
    }
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
          <label>Participants</label>
          <ul>
            {meetingData.participants.map((participant) => (
              <li key={participant._id} onDoubleClick={() => removeParticipant(participant)}>
                {participant.username}
              </li>
            ))}
          </ul>
          <input
            type="text"
            id="participantSearch"
            value={participantSearch}
            onChange={handleParticipantSearchChange}
            placeholder="Search for participants"
          />
          {searchResults.length > 0 && (
            <ul>
              {searchResults.map((participant) => (
                <li key={participant._id} onClick={() => addParticipant(participant)}>
                  {participant.username}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button type="submit">Schedule Meeting</button>
      </form>
    </div>
  );
};
  
export default MeetingSchedulePage;