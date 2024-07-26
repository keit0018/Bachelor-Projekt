import React, { useState, useEffect } from 'react';
import '../assets/styles/ManageMeetingsPage.css';
import axios from 'axios';
import EditMeetingForm from '../components/EditMeetingsForm';

const ManageMeetingsPage = () => {
  const [createdMeetings, setCreatedMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  useEffect(() => {
    fetchCreatedMeetings();
  }, []);

  const fetchCreatedMeetings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://localhost:5000/api/meetings/unattended', {
        headers: {
            Authorization: `Bearer ${token}`
        }
      });
      console.log(createdMeetings);
      setCreatedMeetings(response.data);
    } catch (error) {
      console.error('Error fetching created meetings:', error);
    }
  };

  const handleEdit = (meeting) => {
    console.log(meeting);
    setSelectedMeeting(meeting);
  };

  const handleDelete = async (meetingId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://localhost:5000/api/meetings/${meetingId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCreatedMeetings(createdMeetings.filter(meeting => meeting._id !== meetingId));
    } catch (error) {
      console.error('Error deleting meeting:', error);
    }
  };

  const handleSave = () => {
    setSelectedMeeting(null);
    fetchCreatedMeetings();
  };

  const handleCancel = () => {
    setSelectedMeeting(null);
  };

  return (
    <div>
    {createdMeetings.length >0 ? (<div className="manage-meetings-container">
      <h2>Manage Meetings</h2>
      <table className="meetings-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Participants</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {createdMeetings.map(meeting => (
            <tr key={meeting._id}>
              <td>{meeting.title}</td>
              <td>{new Date(meeting.dateTime).toLocaleString()}</td>
              <td>{meeting.participants.map(p => p.username).join(', ')}</td>
              <td>
                <button onClick={() => handleEdit(meeting)}>Edit</button>
                <button onClick={() => handleDelete(meeting._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {selectedMeeting && (
        <EditMeetingForm
          meeting={selectedMeeting}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>):(<p>No meetings scheduled for the future.</p>)}
    </div>
  );
};

export default ManageMeetingsPage;