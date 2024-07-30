import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/Dashboard.css';
import ConsentModal from '../components/ConsentModal';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nextMeeting, setNextMeeting] = useState(null);
  const currentMeeting = useRef(null);
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const navigate = useNavigate();
  const baseURL = process.env.REACT_APP_BACKEND_API_URL;

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${baseURL}/api/meetings/unattended`, {
          headers: {
              Authorization: `Bearer ${token}`
          }
        });
        
        const meetingsWithDateTime = response.data.map(meeting => {
          return { ...meeting, dateTime: new Date(meeting.dateTime) };
        });
  
        const sortedMeetings = meetingsWithDateTime.sort((a, b) => a.dateTime - b.dateTime);
  
        setNextMeeting(sortedMeetings[0]);
        setUpcomingMeetings(sortedMeetings.slice(1, 6));
      } catch (error) {
        console.error('Error fetching meetings:', error);
      }
    };

    fetchMeetings();
  }, []);

  const handleJoinMeeting = async (meetingId) => {
    setIsModalOpen(true);
    currentMeeting.current = meetingId;

  };

  const handleProceed = async () => {
    try {
      const token = localStorage.getItem('token');
      const meetingId = currentMeeting.current;
      console.log(meetingId)
      const response = await axios.get(`${baseURL}/api/meetings/${meetingId}/join`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log(response);

      if (response.status === 200) {
        // Redirect to the video call component or open it
        console.log('User can join the meeting');
        navigate(`/video-call/${meetingId}`);
      } else {
        console.error('User is not authorized to join the meeting');
      }
    } catch (error) {
      console.error('Error joining meeting:', error);
    }
  }

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      <div className="next-meeting">
        <h3>Next Meeting</h3>
        {nextMeeting ? (
          <div className="meeting-details">
            <p>Title: {nextMeeting.title}</p>
            <p>Time: {nextMeeting.dateTime.toLocaleString()}</p>
            <button onClick={() => handleJoinMeeting(nextMeeting._id)}>Join Meeting</button>
          </div>
        ) : (
          <p>No upcoming meetings.</p>
        )}
      </div>
      <div className="upcoming-meetings">
        <h3>Upcoming Meetings</h3>
        {upcomingMeetings.length > 0 ? (
          <ul>
            {upcomingMeetings.map(meeting => (
              <li key={meeting._id}>
                {meeting.title} - {meeting.dateTime.toLocaleString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No upcoming meetings.</p>
        )}
      </div>
      <ConsentModal
        isOpen={isModalOpen}
        onRequestClose={handleClose}
        onProceed={handleProceed}
      />
    </div>
  );
};

export default Dashboard;