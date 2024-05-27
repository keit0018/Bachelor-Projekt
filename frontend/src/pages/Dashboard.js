import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/styles/Dashboard.css';

const Dashboard = () => {
  const [nextMeeting, setNextMeeting] = useState(null);
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);

  useEffect(() => {
    // Mock data fetching for the next meeting and upcoming meetings
    const fetchMeetings = async () => {
        const nextMeetingMock = {
            id: '1',
            title: 'Project Kickoff',
            time: new Date().toISOString(),
            description: 'Discuss project kickoff details.',
          };
      
          const upcomingMeetingsMock = [
            {
              id: '2',
              title: 'Team Sync',
              time: new Date(new Date().getTime() + 3600000).toISOString(),
            },
            {
              id: '3',
              title: 'Client Meeting',
              time: new Date(new Date().getTime() + 7200000).toISOString(),
            },
          ];

        setNextMeeting(nextMeetingMock);
        setUpcomingMeetings(upcomingMeetingsMock);
    };

    fetchMeetings();
  }, []);

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      <div className="next-meeting">
        <h3>Next Meeting</h3>
        {nextMeeting ? (
          <div className="meeting-details">
            <p>Title: {nextMeeting.title}</p>
            <p>Time: {new Date(nextMeeting.time).toLocaleString()}</p>
            <p>Description: {nextMeeting.description}</p>
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
              <li key={meeting.id}>
                {meeting.title} - {new Date(meeting.time).toLocaleString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No upcoming meetings.</p>
        )}
      </div>
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <button onClick={() => alert('Schedule a New Meeting')}>Schedule a New Meeting</button>
        <button onClick={() => alert('View Meeting Recordings')}>View Meeting Recordings</button>
      </div>
    </div>
  );
};

export default Dashboard;