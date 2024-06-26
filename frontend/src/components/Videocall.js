import React, { useState, useEffect,useRef , useCallback } from 'react';
import '../assets/styles/VideoCall.css';
import axios from 'axios';
import { FluentThemeProvider, DEFAULT_COMPONENT_ICONS, CallComposite } from '@azure/communication-react';
import { initializeIcons, registerIcons } from '@fluentui/react';
import { createAzureCommunicationCallAdapter } from '@azure/communication-react';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import '../assets/styles/VideoCall.css';
import { Oval } from 'react-loader-spinner';

initializeIcons();
registerIcons({ icons: DEFAULT_COMPONENT_ICONS });

const VideoCall = ({ meetingId }) => {
  const [adapter, setAdapter] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(true);
  const communicationUserId = localStorage.getItem('communicationUserId');
  const displayName = localStorage.getItem('username');
  const [callDetails, setCallDetails] = useState(null);
  const initializationCounter = useRef(0);
  const endedcall = useRef(false);

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

  const leaveCall = useCallback(async (callAdapter) => {
    console.log("leaving call...", callAdapter);
    if (callAdapter) {
      await callAdapter.dispose();
      setAdapter(null);
      endedcall.current=true;
    }
  }, []);

  const initCallAdapter = useCallback(async () => {
    try {
      if(initializationCounter.current<1){
        console.log("initializing",initializationCounter.current," ", adapter);
        initializationCounter.current += 1;
        const { participants, groupId } = await fetchParticipants();
        const token = await fetchToken();
        const credential = new AzureCommunicationTokenCredential(token);

        const callAdapter = await createAzureCommunicationCallAdapter({
          userId: { communicationUserId },
          displayName: displayName || 'User',
          credential,
          locator: { groupId },
        });
        setAdapter(callAdapter);
        setIsFullscreen(true);

        callAdapter.on('callEnded', async () => {
          console.log('Call ended. Cleaning up...');
          const endTime = new Date().toLocaleTimeString();
          const participantNames = participants.map(p => p.username).join(', ');
          console.log(endTime, participantNames);
          setCallDetails({
            participantNames,
            endTime,
          });
          await leaveCall(callAdapter);
        });
      }
    } catch (error) {
      console.error('Failed to initialize call adapter:', error.message);
    }
  }, [fetchParticipants, fetchToken, communicationUserId, displayName, adapter, leaveCall]);



  useEffect(() => {
    initCallAdapter();

  
  }, [initCallAdapter]);

  if (!adapter && !endedcall.current) {
    return ( 
      <div className="spinner-overlay">
        <Oval
      visible={true}
      height="60"
      width="60"
      color="#2b242e"
      ariaLabel="oval-loading"
      />
      </div>   
    );
  }

  if (!adapter && endedcall.current) {
    return (
      <div className="call-details">
        <h3>Call with {callDetails?.participantNames} is exited at {callDetails?.endTime}.</h3>
      </div>
    );
  }

  const closeFullscreen = () => {
    leaveCall(adapter);
    setIsFullscreen(false);
  };

  return (
    <>
      {isFullscreen && (
        <div className="fullscreen-overlay">
          <FluentThemeProvider>
            <div style={{ height: '100vh', display: 'flex' }}>
              <CallComposite adapter={adapter} />
              <button className="close-button" onClick={closeFullscreen}>X</button>
            </div>
          </FluentThemeProvider>
        </div>
      )}    
    </>
  );
};

export default VideoCall;