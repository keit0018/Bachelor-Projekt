import React, { useState} from 'react';
import { useParams } from 'react-router-dom';
import VideoCall from '../components/Videocall';
import '../assets/styles/VideoCallPage.css';

const VideoCallPage = () => {
  const { meetingId } = useParams();
  return (
    <div className="video-call-page">
      <VideoCall meetingId={meetingId}/>
    </div>
  );
};

export default VideoCallPage;