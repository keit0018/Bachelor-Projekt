import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/styles/EditMeetingsForm.css';

const EditMeetingForm = ({ meeting, onSave, onCancel }) => {
  const [title, setTitle] = useState(meeting.title);
  const [dateTime, setDateTime] = useState(meeting.dateTime);
  const [participants, setParticipants] = useState(meeting.participants);
  const [participantSearch, setParticipantSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (participantSearch.length > 0) {
      const fetchSearchResults = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`https://localhost:5000/api/users/search?query=${participantSearch}`, {
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

  const addParticipant = (participant) => {
    setParticipants((prevParticipants) => [
      ...prevParticipants,
      participant,
    ]);
    setParticipantSearch('');
    setSearchResults([]);
  };

  const removeParticipant = (participantId) => {
    setParticipants((prevParticipants) =>
      prevParticipants.filter((p) => p._id !== participantId)
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
  
    // Log the participants array for debugging
    console.log('Participants:', participants);
  
    // Check if participants array is in the correct format
    if (!Array.isArray(participants) || participants.some(participant => !participant._id)) {
      console.error('Invalid participants array');
      return;
    }
  
    const updatedMeeting = {
      ...meeting,
      title,
      dateTime,
      participants: participants.map(participant => participant._id),
    };
  
    // Log the updatedMeeting object for debugging
    console.log('Updated Meeting:', updatedMeeting);
  
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`https://localhost:5000/api/meetings/${meeting._id}`, updatedMeeting, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      onSave();
      // Log the response from the server for debugging
    } catch (error) {
      // Capture detailed error information
      console.error('Error updating meeting:', error.response ? error.response.data : error.message);
    }
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
          <label htmlFor="dateTime">Date</label>
          <input
            type="datetime-local"
            id="dateTime"
            name="dateTime"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Participants</label>
          <ul>
            {participants.map((participant) => (
              <li key={participant._id} onDoubleClick={() => removeParticipant(participant._id)}>
                {participant.username}
              </li>
            ))}
          </ul>
          <input
            type="text"
            id="participantSearch"
            value={participantSearch}
            onChange={(e) => setParticipantSearch(e.target.value)}
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
        <div className="form-actions">
          <button type="submit">Save</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};


export default EditMeetingForm;