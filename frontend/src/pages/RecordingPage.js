import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/styles/RecordingPage.css';

const RecordingPage = () => {
  const [recordings, setRecordings] = useState([]);
  const [selectedRecording, setSelectedRecording] = useState(null);
  const [currentRecordingId, setCurrentRecordingId] = useState(null);
  const baseURL = process.env.REACT_APP_BACKEND_API_URL;

  useEffect(() => {
    async function fetchRecordings() {
      try {
        const userId = localStorage.getItem('userId');
        const response = await axios.get(`${baseURL}/api/recordings/getRecordings`, {
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
      if (currentRecordingId === recordingId) {
        setSelectedRecording(null);
        setCurrentRecordingId(null);
        return;
      }
      const response = await axios.get(`${baseURL}/api/recordings/getSecureVideoLink`, {
        params: { recordingId },
        headers: {
          'user-id': localStorage.getItem('userId')
        }
      });
      setSelectedRecording(response.data.sasUrl);
      setCurrentRecordingId(recordingId);
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
            <span>{recording.endTime || 'Loading recording...'}</span>
            <button onClick={() => handlePlayRecording(recording.recordingId)}>
            {currentRecordingId === recording.recordingId ? 'Close' : 'Play'}
              </button>
          </div>
        ))}
      </div>
      {selectedRecording && (
        <div className="video-player">
          <video controls src={selectedRecording} />
        </div>
      )}
    </div>
  );
};

export default RecordingPage;