import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import { useAuth } from '../contexts/AuthContext';

initializeIcons();
registerIcons({ icons: DEFAULT_COMPONENT_ICONS });

const VideoCall = ({ meetingId }) => {
  const { isLoggedIn } = useAuth();
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [callClient, setCallClient] = useState(null);
  const [callAgent, setCallAgent] = useState(null);
  const [call, setCall] = useState(null);
  const [adapter, setAdapter] = useState(null);
  const [participants, setParticipants] = useState([]);
  const callAgentRef = useRef(null);
  const callRef = useRef(null);
  const isLeavingRef = useRef(false);
  const isInitializedRef = useRef(false);
  const initializationCounter = useRef(0);
  const communicationUserId = localStorage.getItem('communicationUserId');
  const displayName = localStorage.getItem('username');

  const fetchParticipants = useCallback(async () => {
    try {
      const meetingResponse = await axios.get(`http://localhost:5000/api/meetings/${meetingId}`);
      return {
        participants: [...meetingResponse.data.participants, meetingResponse.data.createdBy],
        groupId: meetingResponse.data.groupId,
      };
    } catch (error) {
      console.error('Failed to get meeting:', error);
      throw error;
    }
  }, [meetingId]);

  const fetchToken = useCallback(async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/communication/getToken', { communicationUserId });
      return response.data.token;
    } catch (error) {
      console.error('Failed to fetch token:', error);
      throw error;
    }
  }, [communicationUserId]);

  const initializeCallClientAndAgent = useCallback(async () => {
    try {
      if(initializationCounter.current<1){
        console.log("current agent; ",isInitializedRef,callAgentRef);
        isInitializedRef.current = true;
        const token = await fetchToken();
        const { callAgentInstance, callClientInstance } = await getCallAgentInstance(token, displayName);
        callAgentRef.current = callAgentInstance;
        setCallAgent(callAgentInstance);
        setCallClient(callClientInstance);
        initializationCounter.current += 1;
        console.log(`Initialization count: ${initializationCounter.current}`);

      } else {
        console.log('CallClient and CallAgent already initialized');
        return;
      }
    } catch (error) {
      console.error('Failed to create call agent:', error.message);
    }
  }, [fetchToken, displayName]);

  const joinCall = useCallback(async () => {
    if (!callAgentRef.current) {
      console.log('CallAgent not initialized');
      return;
    }

    try {
      const { participants: allParticipants, groupId } = await fetchParticipants();
      setParticipants(allParticipants);
      const agent = callAgentRef.current;
      console.log("call agent on call: ", agent);
      if(agent != null ){
        const newCall = agent.join({ groupId });
        callRef.current = newCall;
        setCall(newCall);

        newCall.on('remoteParticipantsUpdated', (e) => {
          e.added.forEach(participant => {
            const matchingParticipant = allParticipants.find(p => p.communicationUserId === participant.identifier.communicationUserId);
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
          locator: { groupId },
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
  }, [fetchParticipants, fetchToken, participants, communicationUserId, displayName]);

  const leaveCall = useCallback(async (isLogout) => {
    console.log("leaving call...");
    if (isLeavingRef.current) {
      console.log("Already leaving, skipping...");
      return;
    }

    isLeavingRef.current = true;

    if (callRef.current) {
      console.log("waiting on hangup... ");
      await callRef.current.hangUp();
      console.log("user hung up... ");
      callRef.current = null;
      setCall(null);
      setAdapter(null);
    }

    if (callAgentRef.current) {
      console.log("awaiting to dispose call agent...");
      await disposeCallAgentInstance();
      callAgentRef.current = null;
      setCallAgent(null);
      isInitializedRef.current = false;
    }

    if (isLogout) {
      localStorage.removeItem('communicationUserId');
      localStorage.removeItem('username');
    }

    isLeavingRef.current = false;
  }, []);

  useEffect(() => {
    console.log("islogged in: ", isLoggedIn);
    const init = async () => {
      if(!isInitializedRef.current){
        await initializeCallClientAndAgent();
      }

      if (callAgentRef.current) {
        await joinCall();
      }
    };

    init();

    return () => {
      if (!isLoggedIn) {
        leaveCall(true); // Pass true to indicate logout
      } else {
        leaveCall(false);
      }
    };
  }, [initializeCallClientAndAgent, joinCall, leaveCall, isLoggedIn, communicationUserId, displayName, meetingId]);

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
        <button className="control-button" onClick={handleChatToggle}>
          Chat
        </button>
      </div>
      {isChatVisible && <Chat isVisible={isChatVisible} onClose={handleChatToggle} />}
    </FluentThemeProvider>
  );
};

export default VideoCall;