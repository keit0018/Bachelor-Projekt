import React, { useState, useEffect } from 'react';
import useVideoCall from '../hooks/UseVideoCall';
import '../assets/styles/VideoCall.css';
import axios from 'axios';
import { CallComposite, createAzureCommunicationCallAdapter } from '@azure/communication-react';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import Chat from './Chat';

const VideoCall = ({ meetingId }) => {
  const {
    initCallClient,
    fetchParticipants,
  } = useVideoCall(meetingId);

  const [isChatVisible, setIsChatVisible] = useState(false);
  const [adapter, setAdapter] = useState(null);

  useEffect(() => {
    const communicationUserId = localStorage.getItem('communicationUserId');
    const displayName = localStorage.getItem('username'); // Assuming you store the username in local storage

    if (!communicationUserId) {
      console.error('Communication user ID is missing');
      return;
    }

    const fetchTokenAndInitialize = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/communication/getToken', { communicationUserId });
        console.log(response.data);
        const { token } = response.data;
        const callClient = await initCallClient(token);
        
        console.log(callClient);
        // Fetch participants
        const meetingResponse = await fetchParticipants();
        const allParticipants = [...meetingResponse.participants, meetingResponse.createdBy];

        console.log(meetingResponse);

        // Create call adapter
        const callAdapter = await createAzureCommunicationCallAdapter({
          userId: { communicationUserId },
          displayName: displayName || 'User',
          credential: new AzureCommunicationTokenCredential(token),
          locator: { groupId: meetingId },
        });

        // Add participant display names
        callAdapter.on('participantsJoined', (e) => {
          e.addedParticipants.forEach(participant => {
            const matchingParticipant = allParticipants.find(p => p.communicationUserId === participant.id);
            if (matchingParticipant) {
              callAdapter.updateDisplayName(participant.id, matchingParticipant.username);
            }
          });
        });

        setAdapter(callAdapter);
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

    fetchTokenAndInitialize();
  }, [meetingId, initCallClient, fetchParticipants]);

  const handleChatToggle = () => {
    setIsChatVisible(!isChatVisible);
  };

  return (
    <div className="video-call-container">
      {adapter && <CallComposite adapter={adapter} />}
      <div className="controls">
        <button className="control-button" onClick={handleChatToggle}>
          Chat
        </button>
      </div>
      {isChatVisible && <Chat isVisible={isChatVisible} onClose={handleChatToggle} />}
    </div>
  );
};


export default VideoCall;