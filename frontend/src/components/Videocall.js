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
import AsyncLock from 'async-lock';

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
  const callRef = useRef(null);
  const isLeavingRef = useRef(false);
  const isInitializedRef = useRef(false);
  const lockRef = useRef(new AsyncLock());

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
    if (isInitializedRef.current) {
      console.log('CallClient and CallAgent already initialized');
      return;
    }

    if (callAgentRef.current) {
      console.log('CallAgent already initialized:', callAgentRef.current);
      return;
    }

    try {
      const token = await fetchToken();
      const { callAgentInstance, callClientInstance } = await getCallAgentInstance(token, displayName);
      callAgentRef.current = callAgentInstance;
      setCallAgent(callAgentInstance);
      setCallClient(callClientInstance);
      isInitializedRef.current = true;
    } catch (error) {
      console.error('Failed to create call agent:', error.message);
    }
  }, [fetchToken, displayName]);

  const joinCall = useCallback(async () => {
    try {
      const agent = callAgentRef.current;
      console.log("agent at join call: ", agent);
      if (agent) {
        const { participants: allParticipants, groupId } = await fetchParticipants();
        setParticipants(allParticipants);
        console.log("participants: ", allParticipants);
        console.log("groupID: ", groupId);
        const newCall = agent.join({ groupId: groupId });
        callRef.current = newCall;
        setCall(newCall);

        newCall.on('remoteParticipantsUpdated', (e) => {
          console.log('Remote participants updated:', e);

          e.added.forEach(participant => {
            console.log('Added participant:', participant);
            const matchingParticipant = allParticipants.find(p => p.communicationUserId === participant.identifier.communicationUserId);

            if (matchingParticipant) {
              console.log(`Matching participant found: ${matchingParticipant.username}`);
              participant.updateDisplayName(matchingParticipant.username);
            } else {
              console.log('No matching participant found');
            }
          });

          e.removed.forEach(participant => {
            console.log('Removed participant:', participant);
          });
        });

        const token = await fetchToken();
        const callAdapter = await createAzureCommunicationCallAdapter({
          userId: { communicationUserId },
          displayName: displayName || 'User',
          credential: new AzureCommunicationTokenCredential(token),
          locator: { groupId: groupId },
        });

        callAdapter.on('participantsJoined', (e) => {
          console.log('Participants joined:', e);
          e.addedParticipants.forEach(participant => {
            const matchingParticipant = participants.find(p => p.communicationUserId === participant.communicationUserId);
            if (matchingParticipant) {
              console.log(`Matching participant found for joined: ${matchingParticipant.username}`);
              callAdapter.updateDisplayName(participant.communicationUserId, matchingParticipant.username);
            } else {
              console.log('No matching participant found for joined');
            }
          });
        });

        setAdapter(callAdapter);
      }
    } catch (error) {
      console.error('Failed to join call:', error);
      throw error;
    }
  }, [fetchParticipants, fetchToken, participants, communicationUserId, displayName]);

  const leaveCall = useCallback(async () => {
    console.log("leaving call...");
    if (isLeavingRef.current) {
      console.log("Already leaving, skipping...");
      return;
    }

    isLeavingRef.current = true;

    if (callRef.current) {
      await callRef.current.hangUp();
      callRef.current = null;
      setCall(null);
      setAdapter(null);
    }
    if (callAgentRef.current) {
      await disposeCallAgentInstance();
      callAgentRef.current = null;
      setCallAgent(null);
      isInitializedRef.current = false;
    }

    isLeavingRef.current = false;
  }, []);

  useEffect(() => {
    let didCancel = false;

    const init = async () => {
      await lockRef.current.acquire('init', async (done) => {
        try {
          if (!didCancel) {
            await initializeCallClientAndAgent();
            if (callAgentRef.current && !didCancel) {
              await joinCall();
            }
          }
        } finally {
          done();
        }
      });
    };

    init();

    return () => {
      didCancel = true;
      lockRef.current.acquire('cleanup', async (done) => {
        try {
          await leaveCall();
        } finally {
          done();
        }
      });
    };
  }, [initializeCallClientAndAgent, joinCall, leaveCall, communicationUserId, displayName, meetingId]);

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