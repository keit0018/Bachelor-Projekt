import React, { useState, useEffect } from 'react';
import '../assets/styles/ManageMeetingsPage.css';
import axios from 'axios';
import EditMeetingForm from '../components/EditMeetingsForm';

const ManageMeetingsPage = () => {
  const [createdMeetings, setCreatedMeetings] = useState([]);
  const [participatingMeetings, setParticipatingMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  useEffect(() => {
    fetchCreatedMeetings();
    fetchParticipatingMeetings();
  }, []);

  const fetchCreatedMeetings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/meetings/created', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCreatedMeetings(response.data);
    } catch (error) {
      console.error('Error fetching created meetings:', error);
    }
  };

  const fetchParticipatingMeetings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/meetings/participating', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setParticipatingMeetings(response.data);
    } catch (error) {
      console.error('Error fetching participating meetings:', error);
    }
  };

  const handleEdit = (meeting) => {
    console.log(meeting);
    setSelectedMeeting(meeting);
  };

  const handleDelete = async (meetingId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/meetings/${meetingId}`, {
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
    <div className="manage-meetings-container">
      <h2>Manage Meetings</h2>
      <table className="meetings-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Time</th>
            <th>Participants</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {createdMeetings.map(meeting => (
            <tr key={meeting._id}>
              <td>{meeting.title}</td>
              <td>{new Date(meeting.date).toLocaleDateString()}</td>
              <td>{meeting.time}</td>
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
    </div>
  );
};

// Dummy API call function
const fakeApiCall = async () => {
  return [
    {
      id: 1,
      title: 'Team Sync',
      date: '2024-05-30',
      time: '10:00 AM',
      participants: ['Alice', 'Bob', 'Charlie'],
    },
    {
      id: 2,
      title: 'Client Meeting',
      date: '2024-06-01',
      time: '02:00 PM',
      participants: ['Alice', 'Client A'],
    },
    {
      id: 3,
      title: 'Client Meeting',
      date: '2024-06-01',
      time: '02:00 PM',
      participants: ['Alice', 'Client A'],
    },
    {
      id: 4,
      title: 'Client Meeting',
      date: '2024-06-01',
      time: '02:00 PM',
      participants: ['Alice', 'Client A'],
    },
    {
      id: 5,
      title: 'Client Meeting',
      date: '2024-06-01',
      time: '02:00 PM',
      participants: ['Alice', 'Client A'],
    },
    {
      id: 6,
      title: 'Client Meeting',
      date: '2024-06-01',
      time: '02:00 PM',
      participants: ['Alice', 'Client A'],
    }
  ];
};

export default ManageMeetingsPage;