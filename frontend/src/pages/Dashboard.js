import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/Dashboard.css';

const Dashboard = () => {
  const [nextMeeting, setNextMeeting] = useState(null);
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/meetings/participating', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const meetingsWithDateTime = response.data.map(meeting => {
          const combinedDateTime = new Date(meeting.date);
          const [hours, minutes] = meeting.time.split(':');
          combinedDateTime.setHours(hours, minutes);
          return { ...meeting, dateTime: combinedDateTime };
        });
        // Sort meetings by time
        const sortedMeetings = meetingsWithDateTime.sort((a, b) => a.dateTime - b.dateTime);

        // Set the next meeting
        setNextMeeting(sortedMeetings[0]);

        // Set upcoming meetings, limited to the next 5 meetings
        setUpcomingMeetings(sortedMeetings.slice(1, 6));
      } catch (error) {
        console.error('Error fetching meetings:', error);
      }
    };

    fetchMeetings();
  }, []);

  const handleJoinMeeting = async (meetingId) => {
    // Implement the logic to join the meeting
    

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/meetings/${meetingId}/join`, {
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
    </div>
  );
};

export default Dashboard;