import { useState, useCallback, useRef } from 'react';
import { CallClient, LocalVideoStream } from '@azure/communication-calling';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import axios from 'axios';

const useVideoCall = (meetingId) => {
  const [callAgent, setCallAgent] = useState(null);
  const callAgentRef = useRef(null);

  const fetchParticipants = useCallback(async () => {
    try {
      const meetingResponse = await axios.get(`http://localhost:5000/api/meetings/${meetingId}`);
      return {
        participants: meetingResponse.data.participants,
        createdBy: meetingResponse.data.createdBy,
      };
    } catch (error) {
      console.error('Failed to get meeting:', error);
    }
  }, [meetingId]);

  const initCallClient = useCallback(async (token) => {
    try {
      if (!callAgentRef.current) {
        const callClient = new CallClient();
        console.log(callClient);
        const tokenCredential = new AzureCommunicationTokenCredential(token);
        console.log(tokenCredential)
        const agent = await callClient.createCallAgent(tokenCredential);
        callAgentRef.current = agent;
        setCallAgent(agent);
      } else {
        setCallAgent(callAgentRef.current);
      }
    } catch (error) {
      console.error('Failed to initialize call client:', error);
    }
  }, []);

  return {
    callAgent,
    initCallClient,
    fetchParticipants,
  };
};

export default useVideoCall;