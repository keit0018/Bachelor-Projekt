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
  const baseURL = process.env.REACT_APP_BACKEND_API_URL;
  const [adapter, setAdapter] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(true);
  const communicationUserId = localStorage.getItem('communicationUserId');
  const displayName = localStorage.getItem('username');
  const [callDetails, setCallDetails] = useState(null); 
  const initializationCounter = useRef(0);
  const initializationRecordingCounter = useRef(0);
  const endedcall = useRef(false);
  const endRecording = useRef(0);
  const isCreator = useRef(false);


  const fetchParticipants = useCallback(async () => {
    try {
      const meetingResponse = await axios.get(`${baseURL}/api/meetings/${meetingId}`);
      const createdBycsid = meetingResponse.data.createdBy.communicationUserId;
      isCreator.current = createdBycsid === communicationUserId;
      return {
        participants: [...meetingResponse.data.participants, meetingResponse.data.createdBy],
        groupId: meetingResponse.data.groupId,
        createdBy: meetingResponse.data.createdBy
      };
    } catch (error) {
      console.error('Failed to get meeting:', error);
      throw error;
    }
  }, [meetingId]);

  const fetchToken = useCallback(async () => {
    try {
      const response = await axios.post(`${baseURL}/api/communication/getToken`, { communicationUserId });
      return response.data.token;
    } catch (error) {
      console.error('Failed to fetch token:', error);
      throw error;
    }
  }, [communicationUserId]);

  const markattendence = useCallback(async() => {
    try {
      const token = localStorage.getItem('token');
      console.log('marking Attendence', token);
      const response = await axios.post(`${baseURL}/api/attendance/mark`,{meetingId},
        {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });  
      return response;
    } catch (error) {
      console.error('failed to mark attendence')
    }
  },[meetingId])

  const leaveCall = useCallback(async (callAdapter) => {
    console.log("leaving call...", callAdapter);
    if (callAdapter) {
      await callAdapter.dispose();
      setAdapter(null);
      endedcall.current = true;
    }
  }, [ ]);

  const startRecording = async (serverCallId, createdBy) => {
    try {
      console.log(isCreator.current);
      if(initializationRecordingCounter.current<1){
        initializationRecordingCounter.current+=1;
        await axios.post(`${baseURL}/api/recordings/startRecording`, {
          serverCallId,
          meetingId,
          createdBy
        });
      }
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = async (callId) => {
    try {
      console.log(isCreator.current);
      console.log("call recording ending", endRecording.current)
      if(endRecording.current<1){
        endRecording.current+=1;
        console.log("before stoping call: ", callId)
        await axios.post(`${baseURL}/api/recordings/stopRecording`, { meetingId, callId }); 
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  const initCallAdapter = useCallback(async () => {
    try {
      if(initializationCounter.current<1){
        initializationCounter.current += 1;
        const { createdBy, participants, groupId } = await fetchParticipants();
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

        console.log(isCreator.current);
        if(isCreator.current){
          await markattendence(); 
          callAdapter.onStateChange(async () => {
              const call = callAdapter.getState().call;
              if (call && call.state === 'Connected') {
                call.info.getServerCallId().then(async (serverCallId) => {
                    console.log('Server Call ID:', serverCallId);
                    await startRecording(serverCallId, createdBy);
                  }).catch(err => {
                    console.log('Failed to get Server Call ID:', err);
                  });
                } else if (call && call.state ==='Disconnecting'){
                  await stopRecording(call.id);
                }
              });
        }

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
        <h3>Call {callDetails?.participantNames} is exited {callDetails?.endTime}.</h3>
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
            <div className="call-composite-container">
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