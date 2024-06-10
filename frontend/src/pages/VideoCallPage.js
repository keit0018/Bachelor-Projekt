import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import VideoCall from '../components/Videocall';
import Chat from '../components/Chat';
import '../assets/styles/VideoCallPage.css';

const VideoCallPage = () => {
  const { meetingId } = useParams(); // Extracting meetingId from the URL
  const [participants, setParticipants] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="video-call-page">
      <VideoCall meetingId={meetingId} onChatToggle={toggleChat} />
    </div>
  );
};

export default VideoCallPage;