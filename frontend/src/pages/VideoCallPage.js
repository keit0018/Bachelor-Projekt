import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import VideoCall from '../components/Videocall';
import '../assets/styles/VideoCallPage.css';

const VideoCallPage = () => {
  const { meetingId } = useParams(); // Extracting meetingId from the URL
  const [participants, setParticipants] = useState([]);


  return (
    <div className="video-call-page">
      <VideoCall meetingId={meetingId}/>
    </div>
  );
};

export default VideoCallPage;