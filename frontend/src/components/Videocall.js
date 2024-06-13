import React, { useState, useEffect, useRef } from 'react';
import '../assets/styles/VideoCall.css';
import axios from 'axios';
import {
  FluentThemeProvider,
  DEFAULT_COMPONENT_ICONS,
  CallClientProvider,
  CallAgentProvider,
  CallProvider,
  createAzureCommunicationCallAdapter,
} from '@azure/communication-react';
import { initializeIcons, registerIcons } from '@fluentui/react';
import Chat from './Chat';
import CallingComponents from './CallingComponentsStateful';
import { getCallAgentInstance, disposeCallAgentInstance } from '../services/callAgentSingleton';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';

initializeIcons();
registerIcons({ icons: DEFAULT_COMPONENT_ICONS });

const VideoCall = ({ meetingId }) => {
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [callClient, setCallClient] = useState(null);
  const [callAgent, setCallAgent] = useState(null);
  const [call, setCall] = useState(null);
  const [adapter, setAdapter] = useState(null);
  const [participants, setParticipants] = useState([]);
  const callAgentRef = useRef(null);

  const communicationUserId = localStorage.getItem('communicationUserId');
  const displayName = localStorage.getItem('username');

  const fetchParticipants = async () => {
    try {
      const meetingResponse = await axios.get(`http://localhost:5000/api/meetings/${meetingId}`);
      
      return{ 
        participants: [...meetingResponse.data.participants, meetingResponse.data.createdBy],
        groupId: meetingResponse.data.groupId,
      };
    } catch (error) {
      console.error('Failed to get meeting:', error);
      throw error;
    }
  };

  const fetchToken = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/communication/getToken', { communicationUserId });
      return response.data.token;
    } catch (error) {
      console.error('Failed to fetch token:', error);
      throw error;
    }
  };

  const initializeCallClientAndAgent = async () => {
    try {
      const token = await fetchToken();
      const { callAgentInstance, callClientInstance } = await getCallAgentInstance(token, displayName);
      console.log("call agent: ", callAgentInstance, "call client:", callClientInstance);
      callAgentRef.current = callAgentInstance; // Ensure ref is set
      setCallAgent(callAgentInstance);
      setCallClient(callClientInstance);
    } catch (error) {
      console.error('Failed to create call agent:', error.message);
    }
  };

  const joinCall = async () => {
    try {
      const agent = callAgentRef.current;
      console.log("agent at join call: ", agent);
      if (agent) {
        const { participants: allParticipants, groupId } = await fetchParticipants();
        setParticipants(allParticipants);
        console.log("participants: ", allParticipants);
        console.log("meetingID: ", groupId);
        console.log("joining...", agent.join({ groupId: groupId }));
        const newCall = agent.join({ groupId: groupId });
        setCall(newCall);

        newCall.on('remoteParticipantsUpdated', (e) => {
          e.added.forEach(participant => {
            const matchingParticipant = participants.find(p => p.communicationUserId === participant.identifier.communicationUserId);
            if (matchingParticipant) {
              participant.updateDisplayName(matchingParticipant.username);
            }
          });
        });

        const token = await fetchToken();
        const callAdapter = await createAzureCommunicationCallAdapter({
          userId: { communicationUserId },
          displayName: displayName || 'User',
          credential: new AzureCommunicationTokenCredential(token),
          locator: { groupId: meetingId },
        });

        callAdapter.on('participantsJoined', (e) => {
          e.addedParticipants.forEach(participant => {
            const matchingParticipant = participants.find(p => p.communicationUserId === participant.communicationUserId);
            if (matchingParticipant) {
              callAdapter.updateDisplayName(participant.communicationUserId, matchingParticipant.username);
            }
          });
        });

        setAdapter(callAdapter);
      }
    } catch (error) {
      console.error('Failed to join call:', error);
      throw error;
    }
  };

  const leaveCall = async () => {
    if (call) {
      await call.hangUp();
      setCall(null);
      setAdapter(null);
    }
    if (callAgentRef.current) {
      await disposeCallAgentInstance();
      callAgentRef.current = null;
      setCallAgent(null);
    }
  };

  useEffect(() => {
    initializeCallClientAndAgent();
  }, [communicationUserId, displayName]);

  useEffect(() => {
    console.log("do we join call? ", callAgentRef.current);
    if (callAgentRef.current) {
      joinCall();
    }
  }, [meetingId, callAgentRef.current]);

  useEffect(() => {
    return () => {
      if (callAgentRef.current) {
        disposeCallAgentInstance();
        callAgentRef.current = null;
        setCallAgent(null);
      }
    };
  }, []);

  const handleChatToggle = () => {
    setIsChatVisible(!isChatVisible);
  };

  return (
    <FluentThemeProvider>
      {adapter && (
        <CallClientProvider callClient={callClient}>
          <CallAgentProvider callAgent={callAgent}>
            <CallProvider call={call}>
              <CallingComponents adapter={adapter} />
            </CallProvider>
          </CallAgentProvider>
        </CallClientProvider>
      )}
      <div className="controls">
        <button className="control-button" onClick={joinCall}>
          Join Call
        </button>
        <button className="control-button" onClick={leaveCall}>
          Leave Call
        </button>
        <button className="control-button" onClick={handleChatToggle}>
          Chat
        </button>
      </div>
      {isChatVisible && <Chat isVisible={isChatVisible} onClose={handleChatToggle} />}
    </FluentThemeProvider>
  );
};

export default VideoCall;