import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import '../assets/styles/VideoCall.css';
import axios from 'axios';
import {
  FluentThemeProvider,
  DEFAULT_COMPONENT_ICONS,
  CallClientProvider,
  CallAgentProvider,
  CallProvider,
  createStatefulCallClient,
  createAzureCommunicationCallAdapter,
} from '@azure/communication-react';
import { initializeIcons, registerIcons } from '@fluentui/react';
import { CallClient } from '@azure/communication-calling';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import Chat from './Chat';
import CallingComponents from './CallingComponentsStateful';

initializeIcons();
registerIcons({ icons: DEFAULT_COMPONENT_ICONS });

const VideoCall = ({ meetingId }) => {
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [statefulCallClient, setStatefulCallClient] = useState(null);
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
      setParticipants([...meetingResponse.data.participants, meetingResponse.data.createdBy]);
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

  const initializeCallClient = async () => {
    try {
      if (!statefulCallClient) {
        const client = createStatefulCallClient({ userId: { communicationUserId } });
        console.log("create new call client: ", client);
        setStatefulCallClient(client);
      }
    } catch (error) {
      console.error('Failed to create stateful call client:', error);
    }
  };

  const tokenCredential = useMemo(async () => {
    try {
      const token = await fetchToken();
      return new AzureCommunicationTokenCredential(token);
    } catch (error) {
      console.error('Failed to create token credential:', error);
      throw error;
    }
  }, [fetchToken]);

  const initializeCallAgent = async () => {
    try {
      if (callAgentRef.current) {
        console.log('Disposing existing call agent');
        await callAgentRef.current.dispose();
        callAgentRef.current = null;
        setCallAgent(null);
      }

      const credential = await tokenCredential;
      console.log("new token: ", credential);
      const callClient = new CallClient();
      console.log("new call client: ", callClient);
      const agent = await callClient.createCallAgent(credential, { displayName: displayName });
      callAgentRef.current = agent;
      setCallAgent(agent);
    } catch (error) {
      console.error('Failed to create call agent:', error.message);
      throw error;
    }
  };

  const joinCall = async () => {
    try {
      await initializeCallAgent();
      console.log("call agent now: ", callAgent);
      const agent = callAgentRef.current;
      if (agent) {
        const call = agent.join({ groupId: meetingId });
        setCall(call);

        call.on('remoteParticipantsUpdated', (e) => {
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
      console.error('Failed to join call:', error.message);
      throw error;
    }
  };

  const leaveCall = async () => {
    if (call) {
      await call.hangUp();
      setCall(null);
      setAdapter(null);
      if (callAgentRef.current) {
        await callAgentRef.current.dispose();
        callAgentRef.current = null;
        setCallAgent(null);
      }
    }
  };

  useEffect(() => {
    initializeCallClient();
  }, [communicationUserId]);

  useEffect(() => {
    if (callAgentRef.current) {
      fetchParticipants().then(() => joinCall());
    }
  }, [meetingId]);

  useEffect(() => {
    return () => {
      if (callAgentRef.current) {
        callAgentRef.current.dispose();
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
        <CallClientProvider callClient={statefulCallClient}>
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