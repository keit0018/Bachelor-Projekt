import React, { useState, useEffect } from 'react';
import '../assets/styles/RecordingPage.css';

const mockRecordings = [
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
];

const RecordingPage = () => {
  const [recordings, setRecordings] = useState([]);
  const [selectedRecording, setSelectedRecording] = useState(null);

  useEffect(() => {
    // Mocking the API call to fetch recordings
    setTimeout(() => {
      setRecordings(mockRecordings);
    }, 1000); // Simulate a network delay
  }, []);

  const handlePlayRecording = (recordingUrl) => {
    setSelectedRecording(recordingUrl);
  };

  const handleDownloadRecording = (recordingUrl) => {
    const link = document.createElement('a');
    link.href = recordingUrl;
    link.download = 'recording.mp4';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteRecording = (recordingId) => {
    setRecordings(recordings.filter(recording => recording.id !== recordingId));
  };

  return (
    <div className="recording-page">
      <h2>Recorded Meetings</h2>
      <div className="recording-list">
        {recordings.map((recording) => (
          <div key={recording.id} className="recording-item">
            <span>{recording.title}</span>
            <button onClick={() => handlePlayRecording(recording.url)}>Play</button>
            <button onClick={() => handleDownloadRecording(recording.url)}>Download</button>
            <button onClick={() => handleDeleteRecording(recording.id)}>Delete</button>
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