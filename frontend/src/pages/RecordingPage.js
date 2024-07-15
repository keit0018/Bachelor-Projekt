import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/styles/RecordingPage.css';

/*const mockRecordings = [
  {
    id: 1,
    title: 'Team Meeting',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  {
    id: 2,
    title: 'Project Update',
    url: 'https://www.w3schools.com/html/movie.mp4',
  },
  // Add more mock recordings as needed
];*/

const RecordingPage = () => {
  const [recordings, setRecordings] = useState([]);
  const [selectedRecording, setSelectedRecording] = useState(null);

  useEffect(() => {
    async function fetchRecordings() {
      try {
        const userId = localStorage.getItem('userId');
        console.log(userId);
        const response = await axios.get('https://localhost:5000/api/recordings/getRecordings', {
          headers: {
            'userId': userId
          }
        });
        setRecordings(response.data);
      } catch (error) {
        console.error('Failed to fetch recordings:', error);
      }
    }

    fetchRecordings();
  }, []);

  const handlePlayRecording = async (recordingId) => {
    try {
      console.log(recordingId);
      const response = await axios.get('https://localhost:5000/api/recordings/getSecureVideoLink', {
        params: { recordingId },
        headers: {
          'user-id': localStorage.getItem('userId')
        }
      });
      console.log(response.data.sasUrl);
      setSelectedRecording(response.data.sasUrl);
    } catch (error) {
      console.error('Failed to fetch SAS URL:', error);
    }
  };

  return (
    <div className="recording-page">
      <h2>Recorded Meetings</h2>
      <div className="recording-list">
        {recordings.map((recording) => (
          <div key={recording._id} className="recording-item">
            <span>{recording.endTime || 'Untitled Meeting'}</span>
            <button onClick={() => handlePlayRecording(recording.recordingId)}>Play</button>
          </div>
        ))}
      </div>
      {selectedRecording && (
        <div className="video-player">
          <h3>Playback</h3>
          <video controls src={selectedRecording} />
        </div>
      )}
    </div>
  );
};

export default RecordingPage;