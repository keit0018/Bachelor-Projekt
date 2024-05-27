import React, { useState, useEffect } from 'react';
import '../assets/styles/ManageMeetingsPage.css';
import EditMeetingForm from '../components/EditMeetingsForm';

const ManageMeetingsPage = () => {
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  useEffect(() => {
    // Fetch meetings from backend API
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    // Replace with actual API call
    const fetchedMeetings = await fakeApiCall();
    setMeetings(fetchedMeetings);
  };

  const handleEdit = (meeting) => {
    setSelectedMeeting(meeting);
  };

  const handleDelete = (meetingId) => {
    // Call API to delete the meeting
    // Update state to remove the deleted meeting
    setMeetings(meetings.filter(meeting => meeting.id !== meetingId));
  };

  const handleSave = () => {
    setSelectedMeeting(null);
    fetchMeetings();
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
          {meetings.map(meeting => (
            <tr key={meeting.id}>
              <td>{meeting.title}</td>
              <td>{meeting.date}</td>
              <td>{meeting.time}</td>
              <td>{meeting.participants.join(', ')}</td>
              <td>
                <button onClick={() => handleEdit(meeting)}>Edit</button>
                <button onClick={() => handleDelete(meeting.id)}>Delete</button>
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
  ];
};

export default ManageMeetingsPage;