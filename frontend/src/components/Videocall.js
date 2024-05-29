import React, { useState, useEffect } from 'react';
import { CallClient, LocalVideoStream } from '@azure/communication-calling';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import axios from 'axios';
import '../assets/styles/VideoCall.css';

const VideoCall = () => {
  const [callAgents, setCallAgents] = useState([]);
  const [deviceManager, setDeviceManager] = useState(null);
  const [call, setCall] = useState(null);
  const [localVideoStream, setLocalVideoStream] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  const token = '<YOUR_ACS_TOKEN>'; // Replace with your ACS token

  useEffect(() => {
    const init = async () => {
      const callClient = new CallClient();
      const tokenCredential = new AzureCommunicationTokenCredential(token);
      const callAgent = await callClient.createCallAgent(tokenCredential);
      setCallAgents((prevAgents) => [...prevAgents, callAgent]);
      const devices = await callAgent.getDeviceManager();
      setDeviceManager(devices);
    };

    init();
  }, []);

  const handleStartCall = async () => {
    if (callAgents.length > 0) {
      const callAgent = callAgents[0]; // Use the first call agent
      const callOptions = {
        videoOptions: {
          localVideoStreams: localVideoStream ? [localVideoStream] : undefined,
        },
      };
      const call = callAgent.startCall([{ communicationUserId: '<REMOTE_USER_ID>' }], callOptions);
      setCall(call);
    }
  };

  const handleToggleCamera = async () => {
    if (isCameraOn) {
      await call.stopVideo(localVideoStream);
      setIsCameraOn(false);
    } else {
      const cameras = await deviceManager.getCameras();
      const localStream = new LocalVideoStream(cameras[0]);
      setLocalVideoStream(localStream);
      await call.startVideo(localStream);
      setIsCameraOn(true);
    }
  };

  const handleToggleMute = async () => {
    if (isMicMuted) {
      await call.unmute();
      setIsMicMuted(false);
    } else {
      await call.mute();
      setIsMicMuted(true);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      setMessages([...messages, message]);
      setMessage('');
    }
  };

  const handleStartRecording = async () => {
    try {
      const response = await axios.post('http://localhost:3000/startRecording', {
        meetingId: call.id,
        streamingUrl: call.remoteParticipants[0].videoStreams[0].mediaStreamType.url, // Use appropriate URL
      });
      console.log('Recording started:', response.data);
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const handleStopRecording = async () => {
    try {
      const response = await axios.post('http://localhost:3000/stopRecording', {
        jobName: '<JOB_NAME>', // Use the job name returned from startRecording API
      });
      console.log('Recording stopped:', response.data);
      setIsRecording(false);
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  return (
    <div className="video-call-container">
      <div className="video-section">
        <div id="remoteVideoContainer" style={{ width: '100%', height: '400px' }}></div>
        <div className="controls">
          <button onClick={handleStartCall}>Start Call</button>
          <button onClick={handleToggleCamera}>
            {isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
          </button>
          <button onClick={handleToggleMute}>
            {isMicMuted ? 'Unmute' : 'Mute'}
          </button>
          <button onClick={isRecording ? handleStopRecording : handleStartRecording}>
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>
        </div>
      </div>
      <div className="chat-section">
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className="message">
              {msg}
            </div>
          ))}
        </div>
        <form onSubmit={handleSendMessage} className="chat-form">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default VideoCall;