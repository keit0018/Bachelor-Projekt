import React, { useState, useEffect, useRef } from 'react';
import { CallClient, CallAgent, DeviceManager, LocalVideoStream, Renderer, VideoStreamRenderer } from '@azure/communication-calling';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import '../assets/styles/VideoCall.css';

const VideoCall = () => {
  const [callAgent, setCallAgent] = useState(null);
  const [deviceManager, setDeviceManager] = useState(null);
  const [call, setCall] = useState(null);
  const [localVideoStream, setLocalVideoStream] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  const token = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjYwNUVCMzFEMzBBMjBEQkRBNTMxODU2MkM4QTM2RDFCMzIyMkE2MTkiLCJ4NXQiOiJZRjZ6SFRDaURiMmxNWVZpeUtOdEd6SWlwaGsiLCJ0eXAiOiJKV1QifQ.eyJza3lwZWlkIjoiYWNzOjE1ZmJkYjY5LTBmMWUtNGU4MS1iZjY2LTk1Y2Q4MDlmMTU0NF8wMDAwMDAyMC01OWM5LWExOTgtOTE4ZS1hZjNhMGQwMDMzYjAiLCJzY3AiOjE3OTIsImNzaSI6IjE3MTY4MTA5MzkiLCJleHAiOjE3MTY4OTczMzksInJnbiI6ImVtZWEiLCJhY3NTY29wZSI6ImNoYXQsdm9pcCIsInJlc291cmNlSWQiOiIxNWZiZGI2OS0wZjFlLTRlODEtYmY2Ni05NWNkODA5ZjE1NDQiLCJyZXNvdXJjZUxvY2F0aW9uIjoiZXVyb3BlIiwiaWF0IjoxNzE2ODEwOTM5fQ.VbQ1hetZAiU-7_FHOv5adK9kCM6-n89J-_rKejtJFBFw6uVI0Y-fnGE7n7gJwy7tnhTzAxlHVMa4RYxq1pM3myZN6Z5O-UV0u9gdWJ2c5wbudCvncIQUs47yUG_We1VsgdkJht2lwgQGr0ker2p8ZvDC8Q3WYcM9A0EiovXXtRzNzvIx6SCELJ0QB79FCSZZTmrG7r1_5HUwBmwr0_2mNWXy8I30YKPZp4jWzU7es1jkGKS329lpDFQflOzrgwOAj87C2wtQp0hh-Yz9JaUjXst0qTvFjWK_CCkx26d4hkeICN6NEUMgVqBh7_gqiCx7aUkqDhS-YwJrC07IdjfMSQ'; // Replace with your ACS token
  const callClient = new CallClient();
  const tokenCredential = new AzureCommunicationTokenCredential(token);

  useEffect(() => {
    const init = async () => {
      const agent = await callClient.createCallAgent(tokenCredential);
      setCallAgent(agent);
      const devices = await agent.getDeviceManager();
      setDeviceManager(devices);
    };

    init();
  }, []);

  const handleStartCall = async () => {
    const callOptions = {
      videoOptions: {
        localVideoStreams: localVideoStream ? [localVideoStream] : undefined,
      },
    };
    const call = callAgent.startCall([{ communicationUserId: '<REMOTE_USER_ID>' }], callOptions);
    setCall(call);
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